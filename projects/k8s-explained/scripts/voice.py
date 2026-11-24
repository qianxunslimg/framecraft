"""Generate clean, natural-phrasing Yunxia voiceover + exact sentence-locked live subtitles for k8s-explained.

Key fixes for natural human-like phrasing with zh-CN-YunxiaNeural:
- Pure unwarped pitch (+0Hz) and comfortable lively speed (+5%) — zero mechanical pitch artifacts.
- Splits each cue cleanly by sentence punctuation (。？！) so every single sentence gets its own
  natural rising/falling intonation, real breath pause, and exact frame-measured live subtitle!
- Pronunciation normalization strictly for TTS input (e.g. K8s -> K八S, etcd -> E T C D, Base64 -> Base六十四)
  while keeping clean technical spelling (K8s, etcd, Base64) on screen!
"""
import argparse
import array
import asyncio
import json
import math
import re
import subprocess
import wave
from pathlib import Path

import edge_tts

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parents[1]
FFMPEG = ROOT / "node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
FPS = 30
SR = 48000


def to_tts_text(text: str) -> str:
    """Normalize tricky tech acronyms strictly for clean Mandarin TTS pronunciation."""
    replacements = [
        ("K8s", "K八S"),
        ("etcd", "E T C D"),
        ("Base64", "Base 64"),
        ("RBAC", "R B A C"),
        ("v1", "V一"),
        ("v2", "V二"),
        ("kubectl", "kube control"),
        ("kubelet", "kube let"),
        ("kube-proxy", "kube proxy"),
        ("localhost", "local host"),
    ]
    out = text
    for src, dst in replacements:
        out = out.replace(src, dst)
    return out


def split_sentences(text: str) -> list[str]:
    """Split a cue paragraph into crisp natural sentences (for clean breath & intonation)."""
    parts = [p.strip() for p in re.split(r"(?<=[。？！])", text) if p.strip()]
    return parts if parts else [text.strip()]


def split_caption_phrases(sentence: str, highlight: str, abs_start: int, total_frames: int) -> list[dict]:
    """Keep on-screen subtitles crisp (<= 26 chars per phrase) synced within exact sentence audio."""
    if len(sentence) <= 26:
        return [
            {
                "from": abs_start,
                "duration": total_frames,
                "text": sentence,
                "highlight": highlight if highlight and highlight in sentence else "",
            }
        ]
    pieces = [p.strip() for p in re.split(r"(?<=[，；：])", sentence) if p.strip()]
    merged = []
    for p in pieces:
        if merged and len(merged[-1]) + len(p) <= 26:
            merged[-1] += p
        else:
            merged.append(p)
    total_chars = sum(len(p) for p in merged)
    out = []
    at = 0
    for k, p in enumerate(merged):
        dur = total_frames - at if k == len(merged) - 1 else max(12, round(total_frames * len(p) / total_chars))
        out.append(
            {
                "from": abs_start + at,
                "duration": dur,
                "text": p,
                "highlight": highlight if highlight and highlight in p else "",
            }
        )
        at += dur
    return out


async def synth_sentence(text: str, voice: str, rate: str, pitch: str, out_mp3: Path):
    comm = edge_tts.Communicate(text=to_tts_text(text), voice=voice, rate=rate, pitch=pitch)
    await comm.save(str(out_mp3))


def decode_and_trim(mp3: Path, wav: Path) -> array.array:
    subprocess.run(
        [
            str(FFMPEG),
            "-y",
            "-i",
            str(mp3),
            "-ar",
            str(SR),
            "-ac",
            "1",
            "-sample_fmt",
            "s16",
            str(wav),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    with wave.open(str(wav), "rb") as wf:
        raw = array.array("h")
        raw.frombytes(wf.readframes(wf.getnframes()))
    lo = 0
    while lo < len(raw) and abs(raw[lo]) < 240:
        lo += 1
    hi = len(raw) - 1
    while hi > lo and abs(raw[hi]) < 240:
        hi -= 1
    # Natural breath padding: ~35ms lead, ~65ms tail
    lo = max(0, lo - 1680)
    hi = min(len(raw), hi + 3120)
    return raw[lo:hi] if hi > lo else raw


async def run_build(voice: str, rate: str, pitch: str):
    script = json.loads((BASE / "script.json").read_text())
    lines_dir = ROOT / "out/k8s-explained/voice-lines-v2"
    lines_dir.mkdir(parents=True, exist_ok=True)
    pub_dir = ROOT / "public/k8s-explained/owned/audio"
    pub_dir.mkdir(parents=True, exist_ok=True)

    samples_per_frame = SR // FPS
    timeline_scenes = []
    captions = []
    all_pcm = array.array("h")
    cursor = 0

    def add_silence(n_frames: int):
        if n_frames > 0:
            all_pcm.extend([0] * (n_frames * samples_per_frame))

    for scene in script:
        intro_f = 14 if scene["id"] != "opening" else 12
        scene_cues = []
        local = intro_f
        add_silence(intro_f)

        for i, line in enumerate(scene["lines"]):
            cue_start_local = local
            sentences = split_sentences(line["spoken"])
            highlight = line.get("highlight", "")

            for s_idx, sent in enumerate(sentences):
                mp3 = lines_dir / f"{scene['id']}-{i:02d}-s{s_idx:02d}.mp3"
                wav = lines_dir / f"{scene['id']}-{i:02d}-s{s_idx:02d}.wav"
                await synth_sentence(sent, voice, rate, pitch, mp3)
                trimmed = decode_and_trim(mp3, wav)
                frames = max(14, math.ceil(len(trimmed) / samples_per_frame))
                target_len = frames * samples_per_frame
                all_pcm.extend(trimmed)
                if target_len > len(trimmed):
                    all_pcm.extend([0] * (target_len - len(trimmed)))

                # Exact sentence-synced live subtitles!
                captions.extend(split_caption_phrases(sent, highlight, cursor + local, frames))
                local += frames

                # Clean human breath pause between sentences inside same cue
                if s_idx < len(sentences) - 1:
                    sent_gap = 6
                    add_silence(sent_gap)
                    local += sent_gap

            cue_dur = local - cue_start_local
            scene_cues.append(
                {
                    "cue": line["cue"],
                    "from": cue_start_local,
                    "duration": cue_dur,
                    "display": line["display"],
                    "highlight": highlight,
                }
            )
            if i < len(scene["lines"]) - 1:
                line_gap = 9
                add_silence(line_gap)
                local += line_gap

        tail_f = 38 if scene["id"] == "finale" else 18
        add_silence(tail_f)
        local += tail_f

        timeline_scenes.append(
            {
                "id": scene["id"],
                "badge": scene["badge"],
                "title": scene["title"],
                "theme": scene["theme"],
                "from": cursor,
                "duration": local,
                "cues": scene_cues,
            }
        )
        cursor += local
        print(f"SCENE {scene['id']}: {local}f ({local / FPS:.2f}s)", flush=True)

    narration_wav = pub_dir / "narration.wav"
    with wave.open(str(narration_wav), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(all_pcm.tobytes())

    result = {
        "fps": FPS,
        "duration": cursor,
        "voice": {"engine": "edge-tts", "voice": voice, "rate": rate, "pitch": pitch},
        "scenes": timeline_scenes,
        "captions": captions,
    }
    (BASE / "source/timeline.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    )

    # Also write standard SRT file
    def srt_ts(f: int) -> str:
        ms = round(f * 1000 / FPS)
        return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"

    srt_lines = [
        f"{idx + 1}\n{srt_ts(c['from'])} --> {srt_ts(c['from'] + c['duration'])}\n{c['text']}"
        for idx, c in enumerate(captions)
    ]
    (BASE / "subtitles.srt").write_text("\n\n".join(srt_lines) + "\n")
    print(f"YUNXIA V2 DONE: {cursor} frames ({cursor / FPS:.2f}s), {len(captions)} live captions -> {narration_wav}", flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default="zh-CN-YunxiaNeural")
    parser.add_argument("--rate", default="+5%")
    parser.add_argument("--pitch", default="+0Hz")
    args = parser.parse_args()
    asyncio.run(run_build(args.voice, args.rate, args.pitch))


if __name__ == "__main__":
    main()
