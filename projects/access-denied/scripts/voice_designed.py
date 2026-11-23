"""Build a resumable, frame-aligned narration from a designed Mandarin voice.

The voice is designed locally from a text description, then cloned from that
generated reference so every line uses the same speaker. No person's voice is
used as a reference. Outputs stay in out/ until the complete take is checked.
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
from qwen_tts import Qwen3TTSModel


BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parents[1]
OUT = ROOT / "out/access-denied/voice-v2"
LINES = OUT / "lines"
DESIGN_MODEL = Path.home() / ".cache/framecraft/models/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
CLONE_MODEL = Path.home() / ".cache/framecraft/models/Qwen3-TTS-12Hz-0.6B-Base"
REFERENCE_TEXT = (
    "二零二六年九月，中文开发者社区里，关于账号封禁的讨论一条接一条。"
    "更值得追问的，是这些限制究竟怎样执行。"
)
VOICE_DESCRIPTION = (
    "三十五岁左右的中文男性，标准普通话，没有北京、东北或其他地域口音。"
    "声线自然温暖、略低沉，保留真实呼吸和轻微颗粒感。"
    "像科技纪录片作者向朋友讲述调查发现，语速适中，重音和停顿随句意变化，"
    "克制但有张力。不要新闻播报腔、广告腔、朗诵腔，不要故意压低嗓音。"
)
SR = 24000
FPS = 30


def model(path):
    torch.set_num_threads(5)
    return Qwen3TTSModel.from_pretrained(
        str(path), device_map="cpu", dtype=torch.float32, attn_implementation="sdpa"
    )


def clean_audio(audio):
    audio = np.asarray(audio, dtype=np.float32).reshape(-1)
    active = np.flatnonzero(np.abs(audio) > 0.006)
    if len(active):
        audio = audio[max(0, active[0] - 1200) : min(len(audio), active[-1] + 2400)]
    if not len(audio) or not np.isfinite(audio).all():
        raise ValueError("TTS returned empty or invalid audio")
    fade = min(240, len(audio) // 4)
    if fade:
        audio[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
        audio[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    peak = float(np.max(np.abs(audio)))
    if peak > 0.88:
        audio *= 0.88 / peak
    return audio


def reference():
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "designed-reference.wav"
    if path.exists():
        return path
    tts = model(DESIGN_MODEL)
    start = time.monotonic()
    wavs, sample_rate = tts.generate_voice_design(
        text=REFERENCE_TEXT,
        language="Chinese",
        instruct=VOICE_DESCRIPTION,
        max_new_tokens=2048,
    )
    if sample_rate != SR:
        raise ValueError(f"Unexpected sample rate: {sample_rate}")
    sf.write(path, clean_audio(wavs[0]), SR)
    print(f"Reference generated in {time.monotonic() - start:.1f}s: {path}", flush=True)
    del tts
    gc.collect()
    return path


def line_audio(tts, prompt, scene_id, index, text):
    LINES.mkdir(parents=True, exist_ok=True)
    path = LINES / f"{scene_id}-{index:02d}.wav"
    if path.exists():
        audio, sample_rate = sf.read(path, dtype="float32")
        if sample_rate == SR and len(audio) > SR // 4:
            return audio
    start = time.monotonic()
    wavs, sample_rate = tts.generate_voice_clone(
        text=text,
        language="Chinese",
        voice_clone_prompt=prompt,
        non_streaming_mode=True,
        max_new_tokens=2048,
    )
    if sample_rate != SR:
        raise ValueError(f"Unexpected sample rate: {sample_rate}")
    audio = clean_audio(wavs[0])
    sf.write(path, audio, SR)
    print(
        f"{scene_id}-{index:02d}: {len(audio) / SR:.2f}s audio, "
        f"{time.monotonic() - start:.1f}s generated",
        flush=True,
    )
    return audio


_worker_tts = None
_worker_prompt = None


def init_worker(reference_path):
    global _worker_tts, _worker_prompt
    _worker_tts = model(CLONE_MODEL)
    _worker_prompt = _worker_tts.create_voice_clone_prompt(
        ref_audio=reference_path, ref_text=REFERENCE_TEXT
    )


def generate_task(task):
    scene_id, index, spoken = task
    line_audio(_worker_tts, _worker_prompt, scene_id, index, spoken)
    return scene_id, index


def srt_time(frame):
    milliseconds = round(frame * 1000 / FPS)
    return (
        f"{milliseconds // 3600000:02}:"
        f"{milliseconds // 60000 % 60:02}:"
        f"{milliseconds // 1000 % 60:02},"
        f"{milliseconds % 1000:03}"
    )


def build(mode, retake_names):
    ref = reference()
    if mode == "design":
        return
    script = json.loads((BASE / "script.json").read_text())
    if mode == "sample":
        tts = model(CLONE_MODEL)
        prompt = tts.create_voice_clone_prompt(ref_audio=str(ref), ref_text=REFERENCE_TEXT)
        for i, text in enumerate(script[0]["lines"][:2]):
            line_audio(tts, prompt, "opening", i, text)
        return

    tasks = [
        (scene["id"], i, spoken)
        for scene in script
        for i, spoken in enumerate(scene["lines"])
    ]
    if mode == "retake":
        selected = [task for task in tasks if f"{task[0]}-{task[1]:02d}" in retake_names]
        if len(selected) != len(retake_names):
            raise ValueError("Retake names must match existing scene-line IDs")
        tts = model(CLONE_MODEL)
        prompt = tts.create_voice_clone_prompt(ref_audio=str(ref), ref_text=REFERENCE_TEXT)
        for scene_id, index, spoken in selected:
            (LINES / f"{scene_id}-{index:02d}.wav").unlink(missing_ok=True)
            line_audio(tts, prompt, scene_id, index, spoken)
        return
    if mode == "full":
        with ProcessPoolExecutor(
            max_workers=3,
            mp_context=multiprocessing.get_context("spawn"),
            initializer=init_worker,
            initargs=(str(ref),),
        ) as pool:
            list(pool.map(generate_task, tasks))

    timeline = []
    captions = []
    all_audio = []
    cursor = 0

    def pad(frames):
        return np.zeros(frames * SR // FPS, dtype=np.float32)

    for scene in script:
        intro = 25 if scene["id"] == "opening" else 20
        parts = [pad(intro)]
        local = intro
        cues = []
        for i, text in enumerate(scene["lines"]):
            audio, sample_rate = sf.read(
                LINES / f"{scene['id']}-{i:02d}.wav", dtype="float32"
            )
            if sample_rate != SR or not len(audio):
                raise ValueError(f"Invalid line audio: {scene['id']}-{i:02d}")
            frames = math.ceil(len(audio) * FPS / SR)
            padded = np.pad(audio, (0, frames * SR // FPS - len(audio)))
            parts.append(padded)
            display = scene.get("displayLines", scene["lines"])[i]
            cues.append({"text": display, "from": local, "duration": frames, "audio": f"{scene['id']}-{i:02d}.wav"})
            phrases = [p for p in re.split(r"(?<=[，；。？！])", display) if p]
            merged = []
            for phrase in phrases:
                if merged and len(merged[-1]) + len(phrase) <= 25:
                    merged[-1] += phrase
                else:
                    merged.append(phrase)
            total = sum(len(p) for p in merged)
            at = local
            for j, phrase in enumerate(merged):
                length = frames - (at - local) if j == len(merged) - 1 else round(frames * len(phrase) / total)
                captions.append({"from": cursor + at, "duration": length, "text": phrase})
                at += length
            local += frames
            gap = 13
            parts.append(pad(gap))
            local += gap
        tail = 210 if scene["id"] == "credits" else 75 if scene["id"] == "finale" else 30
        parts.append(pad(tail))
        local += tail
        timeline.append({**scene, "from": cursor, "duration": local, "cues": cues})
        all_audio.extend(parts)
        cursor += local
        print(f"SCENE {scene['id']}: {local} frames; total {cursor / FPS:.1f}s", flush=True)

    narration = np.concatenate(all_audio)
    if len(narration) != cursor * SR // FPS:
        raise AssertionError("Narration and timeline duration differ")
    sf.write(OUT / "narration.wav", narration, SR)
    result = {
        "fps": FPS,
        "duration": cursor,
        "scenes": timeline,
        "captions": captions,
        "voice": {
            "designModel": "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
            "cloneModel": "Qwen/Qwen3-TTS-12Hz-0.6B-Base",
            "reference": "AI-generated from text description; no person cloned",
            "sampleRate": SR,
            "captionInteriorAlignment": "proportional within exact sentence audio boundaries",
        },
    }
    (OUT / "timeline.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    (OUT / "subtitles.srt").write_text(
        "\n\n".join(
            f"{i + 1}\n{srt_time(c['from'])} --> {srt_time(c['from'] + c['duration'])}\n{c['text']}"
            for i, c in enumerate(captions)
        )
        + "\n"
    )
    print(f"DONE: {cursor} frames / {cursor / FPS:.2f}s", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("design", "sample", "full", "retake", "assemble"))
    parser.add_argument("retake_names", nargs="*")
    args = parser.parse_args()
    if args.mode == "retake" and not args.retake_names:
        parser.error("retake requires scene-line IDs such as opening-02")
    build(args.mode, args.retake_names)
