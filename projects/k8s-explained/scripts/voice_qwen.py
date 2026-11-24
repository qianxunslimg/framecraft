"""Natural human-like bilingual Mandarin+English narration via local Qwen3-TTS.

Uses locally cached Qwen3-TTS models in ~/.cache/framecraft/models/:
- Qwen3-TTS-12Hz-0.6B-CustomVoice (fast expressive speakers with instruct control:
  Vivian, Serena, Dylan, Eric, Uncle_Fu)
- Qwen3-TTS-12Hz-1.7B-VoiceDesign + 0.6B-Base (custom designed persona cloned consistently)

Usage:
  /tmp/qwen-tts-venv/bin/python scripts/voice_qwen.py audition
  /tmp/qwen-tts-venv/bin/python scripts/voice_qwen.py build --speaker Vivian --instruct "..."
"""
import argparse
import gc
import json
import math
import multiprocessing
import re
import time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from scipy.signal import resample_poly
from qwen_tts import Qwen3TTSModel

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parents[1]
MODELS = Path.home() / ".cache/framecraft/models"
CUSTOM_MODEL = MODELS / "Qwen3-TTS-12Hz-0.6B-CustomVoice"
DESIGN_MODEL = MODELS / "Qwen3-TTS-12Hz-1.7B-VoiceDesign"
BASE_MODEL = MODELS / "Qwen3-TTS-12Hz-0.6B-Base"

SR_IN = 24000
SR_OUT = 48000
FPS = 30

AUDITION_TEXT = (
    "凌晨三点，线上告警又响了。"
    "如果你还在顶着黑眼圈爬起来重启服务器，说明该让 Kubernetes，也就是 K8s，来替你值班了。"
    "记住一个关键前提：Pod 天生是临时性的，随时可能被销毁和重建。"
)

CUSTOM_CANDIDATES = [
    {
        "id": "q1-vivian-lively",
        "label": "元气活力科技小姐姐（Vivian · 自然呼吸感，轻快不生硬）",
        "speaker": "Vivian",
        "instruct": "年轻活泼的中文女声，像B站科技科普UP主跟朋友聊天一样自然，语速适中略轻快，断句自然有真实呼吸感，不要播音腔，不要机械朗读。",
    },
    {
        "id": "q2-dylan-beijing",
        "label": "风趣京腔程序员小哥（Dylan · 接地气聊天感，幽默自然）",
        "speaker": "Dylan",
        "instruct": "幽默风趣的年轻中文男声，像和朋友面对面聊技术一样轻松自然，断句和重音随语境变化，有真实停顿和笑意，不端着。",
    },
    {
        "id": "q3-eric-sichuan",
        "label": "幽默川味运维老哥（Eric · 俏皮好听，辨识度超高）",
        "speaker": "Eric",
        "instruct": "轻松幽默的中文男声，像程序员朋友唠嗑讲技术，节奏明快自然，不生硬。",
    },
    {
        "id": "q4-serena-warm",
        "label": "温柔清脆科普女声（Serena · 吐字清晰，听着最舒服）",
        "speaker": "Serena",
        "instruct": "自然亲切的年轻中文女声，吐字清晰、语调生动有起伏，像有趣的知识科普主播娓娓道来，有真实呼吸和停顿，绝不机械。",
    },
]


def load_model(path: Path, threads: int = 4):
    torch.set_num_threads(threads)
    return Qwen3TTSModel.from_pretrained(
        str(path), device_map="cpu", dtype=torch.float32, attn_implementation="sdpa"
    )


def clean_audio(audio: np.ndarray) -> np.ndarray:
    audio = np.asarray(audio, dtype=np.float32).reshape(-1)
    active = np.flatnonzero(np.abs(audio) > 0.006)
    if len(active):
        audio = audio[max(0, active[0] - 900) : min(len(audio), active[-1] + 1800)]
    if not len(audio) or not np.isfinite(audio).all():
        raise ValueError("TTS returned invalid audio")
    fade = min(200, len(audio) // 4)
    if fade:
        audio[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
        audio[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    peak = float(np.max(np.abs(audio)))
    if peak > 0.88:
        audio *= 0.88 / peak
    return audio


def run_audition():
    out_dir = ROOT / "out/k8s-explained/qwen-voice-candidates"
    out_dir.mkdir(parents=True, exist_ok=True)
    tts = load_model(CUSTOM_MODEL, threads=8)
    for c in CUSTOM_CANDIDATES:
        wav_path = out_dir / f"{c['id']}.wav"
        t0 = time.monotonic()
        wavs, sr = tts.generate_custom_voice(
            text=AUDITION_TEXT,
            language="Chinese",
            speaker=c["speaker"],
            instruct=c["instruct"],
            max_new_tokens=1024,
        )
        audio = clean_audio(wavs[0])
        sf.write(wav_path, audio, sr)
        print(f"OK {c['id']}: {len(audio)/sr:.2f}s (took {time.monotonic()-t0:.1f}s) -> {wav_path}", flush=True)
    del tts
    gc.collect()


_w_tts = None
_w_speaker = None
_w_instruct = None


def _init_custom_worker(speaker: str, instruct: str):
    global _w_tts, _w_speaker, _w_instruct
    _w_tts = load_model(CUSTOM_MODEL, threads=4)
    _w_speaker = speaker
    _w_instruct = instruct


def _gen_custom_task(task):
    scene_id, idx, text, out_path_str = task
    out_path = Path(out_path_str)
    if out_path.exists():
        audio, sr = sf.read(out_path, dtype="float32")
        if sr == SR_IN and len(audio) > SR_IN // 4:
            return scene_id, idx, len(audio) / sr
    t0 = time.monotonic()
    wavs, sr = _w_tts.generate_custom_voice(
        text=text,
        language="Chinese",
        speaker=_w_speaker,
        instruct=_w_instruct,
        max_new_tokens=1536,
    )
    audio = clean_audio(wavs[0])
    sf.write(out_path, audio, sr)
    print(f"{scene_id}-{idx:02d}: {len(audio)/sr:.2f}s (gen {time.monotonic()-t0:.1f}s)", flush=True)
    return scene_id, idx, len(audio) / sr


def split_live_captions(text: str, highlight: str, abs_start: int, total_frames: int):
    """Split spoken sentence cleanly at Chinese punctuation so bottom captions follow speech live."""
    phrases = [p.strip() for p in re.split(r"(?<=[，。？！；：])", text) if p.strip()]
    merged = []
    for p in phrases:
        if merged and len(merged[-1]) + len(p) <= 24:
            merged[-1] += p
        else:
            merged.append(p)
    if not merged:
        return [{"from": abs_start, "duration": total_frames, "text": text, "highlight": highlight}]
    total_chars = sum(len(p) for p in merged)
    out = []
    at = 0
    for k, p in enumerate(merged):
        dur = total_frames - at if k == len(merged) - 1 else max(10, round(total_frames * len(p) / total_chars))
        out.append({"from": abs_start + at, "duration": dur, "text": p, "highlight": highlight if highlight in p else ""})
        at += dur
    return out


def run_build(speaker: str, instruct: str, workers: int = 3):
    script = json.loads((BASE / "script.json").read_text())
    lines_dir = ROOT / f"out/k8s-explained/qwen-lines-{speaker.lower()}"
    lines_dir.mkdir(parents=True, exist_ok=True)
    pub_dir = ROOT / "public/k8s-explained/owned/audio"
    pub_dir.mkdir(parents=True, exist_ok=True)

    tasks = [
        (sc["id"], i, line["spoken"], str(lines_dir / f"{sc['id']}-{i:02d}.wav"))
        for sc in script
        for i, line in enumerate(sc["lines"])
    ]
    with ProcessPoolExecutor(
        max_workers=workers,
        mp_context=multiprocessing.get_context("spawn"),
        initializer=_init_custom_worker,
        initargs=(speaker, instruct),
    ) as pool:
        list(pool.map(_gen_custom_task, tasks))

    samples_per_frame = SR_OUT // FPS
    timeline_scenes = []
    captions = []
    parts = []
    cursor = 0

    def pad_frames(nf: int):
        return np.zeros(nf * samples_per_frame, dtype=np.float32)

    for sc in script:
        intro_f = 12
        parts.append(pad_frames(intro_f))
        local = intro_f
        cues = []
        for i, line in enumerate(sc["lines"]):
            wav_24, sr = sf.read(lines_dir / f"{sc['id']}-{i:02d}.wav", dtype="float32")
            assert sr == SR_IN
            # High-quality 24kHz -> 48kHz upsample
            wav_48 = resample_poly(wav_24, 2, 1).astype(np.float32)
            frames = max(18, math.ceil(len(wav_48) / samples_per_frame))
            padded = np.pad(wav_48, (0, frames * samples_per_frame - len(wav_48)))
            parts.append(padded)
            cues.append(
                {
                    "cue": line["cue"],
                    "from": local,
                    "duration": frames,
                    "display": line["display"],
                    "highlight": line.get("highlight", ""),
                }
            )
            # Live phrase-by-phrase synced subtitles matching exact spoken text!
            captions.extend(split_live_captions(line["spoken"], line.get("highlight", ""), cursor + local, frames))
            local += frames
            if i < len(sc["lines"]) - 1:
                gap_f = 7
                parts.append(pad_frames(gap_f))
                local += gap_f
        tail_f = 36 if sc["id"] == "finale" else 16
        parts.append(pad_frames(tail_f))
        local += tail_f
        timeline_scenes.append(
            {
                "id": sc["id"],
                "badge": sc["badge"],
                "title": sc["title"],
                "theme": sc["theme"],
                "from": cursor,
                "duration": local,
                "cues": cues,
            }
        )
        cursor += local
        print(f"SCENE {sc['id']}: {local}f ({local/FPS:.2f}s)", flush=True)

    narration = np.concatenate(parts)
    narration_wav = pub_dir / "narration.wav"
    pcm = np.clip(narration * 32767.0, -32768, 32767).astype(np.int16)
    sf.write(narration_wav, pcm, SR_OUT, subtype="PCM_16")

    result = {
        "fps": FPS,
        "duration": cursor,
        "voice": {"engine": "Qwen3-TTS-12Hz-0.6B-CustomVoice", "speaker": speaker, "instruct": instruct},
        "scenes": timeline_scenes,
        "captions": captions,
    }
    (BASE / "source/timeline.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(f"QWEN NARRATION DONE: {cursor}f ({cursor/FPS:.2f}s) -> {narration_wav}", flush=True)


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("audition")
    b = sub.add_parser("build")
    b.add_argument("--speaker", default="Vivian")
    b.add_argument(
        "--instruct",
        default="年轻活泼的中文女声，像B站科技科普UP主跟朋友聊天一样自然，语速适中略轻快，断句自然有真实呼吸感，不要播音腔，不要机械朗读。",
    )
    b.add_argument("--workers", type=int, default=3)
    args = p.parse_args()
    if args.cmd == "audition":
        run_audition()
    else:
        run_build(args.speaker, args.instruct, args.workers)
