"""Snappy 130 BPM G-major crisp electric-memory BGM + 15 custom Redis cue-synced SFX!"""
import argparse
import json
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parents[1]
SR = 48000


def add_stereo(buf_l: np.ndarray, buf_r: np.ndarray, s0: int, sig: np.ndarray, pan: float = 0.5):
    if s0 < 0 or s0 >= len(buf_l):
        return
    end = min(len(buf_l), s0 + len(sig))
    seg = sig[: end - s0]
    buf_l[s0:end] += seg * np.sqrt(1.0 - pan)
    buf_r[s0:end] += seg * np.sqrt(pan)


def synth_note(freq: float, dur: float, amp: float = 0.12, wave: str = "pluck") -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    if wave == "bell":
        raw = (
            0.70 * np.sin(2 * np.pi * freq * t)
            + 0.25 * np.sin(2 * np.pi * freq * 2.0 * t)
            + 0.12 * np.sin(2 * np.pi * freq * 3.0 * t)
        )
    else:
        raw = (
            0.75 * np.sin(2 * np.pi * freq * t)
            + 0.20 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 16.0)
            + 0.10 * np.sin(2 * np.pi * freq * 3.0 * t) * np.exp(-t * 25.0)
        )
    atk = np.minimum(1.0, t / 0.006)
    dec = np.exp(-t * (6.8 / max(0.08, dur)))
    rel = np.minimum(1.0, np.maximum(0.0, (dur - t) / 0.014))
    return (raw * atk * dec * rel * amp).astype(np.float32)


def sfx_pop(pitch: float = 580.0, rise: float = 440.0, amp: float = 0.20) -> np.ndarray:
    dur = 0.085
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = pitch + rise * (t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30.0) * amp).astype(np.float32)


def sfx_whoosh(dur: float = 0.21, amp: float = 0.145) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(707)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, [580, 3200], btype="bandpass", fs=SR, output="sos")
    filt = sosfilt(sos, noise).astype(np.float32)
    env = np.sin(np.pi * t / dur) ** 1.6
    f = 420.0 + 920.0 * (t / dur)
    whistle = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return ((filt * 1.2 + whistle) * env * amp).astype(np.float32)


def sfx_alert(amp: float = 0.20) -> np.ndarray:
    dur = 0.28
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(313)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, 1600, btype="low", fs=SR, output="sos")
    boom = sosfilt(sos, noise).astype(np.float32) * np.exp(-t * 14.0)
    drop_f = 360.0 * np.exp(-t * 8.5) + 64.0
    drop = np.sin(2 * np.pi * np.cumsum(drop_f) / SR) * np.exp(-t * 12.0) * 0.68
    return ((boom + drop) * amp).astype(np.float32)


def sfx_arpeggio(notes: list[float], step_sec: float = 0.06, amp: float = 0.185) -> np.ndarray:
    total = int((len(notes) * step_sec + 0.34) * SR)
    out = np.zeros(total, dtype=np.float32)
    for i, f in enumerate(notes):
        s = int(i * step_sec * SR)
        sig = synth_note(f, 0.25, amp=amp, wave="bell")
        end = min(total, s + len(sig))
        out[s:end] += sig[: end - s]
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--timeline", type=Path, default=BASE / "source/timeline.json")
    parser.add_argument("--narration", type=Path, default=ROOT / "public/redis-explained/owned/audio/narration.wav")
    parser.add_argument("--out", type=Path, default=ROOT / "public/redis-explained/owned/audio/master.wav")
    args = parser.parse_args()

    tl = json.loads(args.timeline.read_text())
    fps = tl["fps"]
    sr_n, narr = wavfile.read(args.narration)
    if narr.dtype == np.int16:
        narr = narr.astype(np.float32) / 32768.0
    if narr.ndim > 1:
        narr = narr.mean(axis=1)
    assert sr_n == SR

    n = len(narr)
    t = np.arange(n, dtype=np.float32) / SR
    bpm = 130.0
    eighth_sec = (60.0 / bpm) * 0.5

    # Snappy G-major high-speed memory pop groove: Gmaj7 -> Em7 -> Cmaj7 -> D6
    chords = [
        [392.00, 493.88, 587.33, 739.99],  # Gmaj7
        [329.63, 392.00, 493.88, 587.33],  # Em7
        [261.63, 329.63, 392.00, 493.88],  # Cmaj7
        [293.66, 369.99, 440.00, 493.88],  # D6
    ]
    bass_roots = [196.00, 164.81, 130.81, 146.83]
    mel_notes = [
        [783.99, 0, 987.77, 1174.66, 987.77, 0, 880.00, 783.99],
        [987.77, 0, 783.99, 659.25, 783.99, 0, 880.00, 0],
        [1046.50, 0, 987.77, 783.99, 880.00, 987.77, 1174.66, 0],
        [880.00, 0, 783.99, 739.99, 783.99, 0, 587.33, 0],
    ]

    bgm_l = np.zeros(n, dtype=np.float32)
    bgm_r = np.zeros(n, dtype=np.float32)
    sfx_l = np.zeros(n, dtype=np.float32)
    sfx_r = np.zeros(n, dtype=np.float32)

    total_eighths = int(np.ceil((n / SR) / eighth_sec))
    rng = np.random.default_rng(6379)  # Redis port!

    for e in range(total_eighths):
        bar = (e // 8) % 4
        step8 = e % 8
        s0 = int(e * eighth_sec * SR)
        if s0 >= n:
            break

        mf = mel_notes[bar][step8]
        if mf > 0:
            note = synth_note(mf, eighth_sec * 1.05, amp=0.056, wave="pluck")
            add_stereo(bgm_l, bgm_r, s0, note, pan=0.42 if step8 % 2 == 0 else 0.58)

        if step8 in (0, 3, 6):
            for ci, cf in enumerate(chords[bar]):
                stab = synth_note(cf, eighth_sec * 1.35, amp=0.019, wave="pluck")
                add_stereo(bgm_l, bgm_r, s0, stab, pan=0.35 + ci * 0.1)

        if step8 in (0, 2, 4, 6):
            bf = bass_roots[bar] * (2.0 if step8 in (2, 6) else 1.0)
            bd = min(int(eighth_sec * 1.25 * SR), n - s0)
            tb = np.arange(bd, dtype=np.float32) / SR
            bass = (np.sin(2 * np.pi * bf * tb) + 0.22 * np.sin(2 * np.pi * bf * 2 * tb)) * np.exp(-tb * 8.2) * 0.105
            add_stereo(bgm_l, bgm_r, s0, bass.astype(np.float32))

        if step8 in (0, 4):
            kd = min(int(0.125 * SR), n - s0)
            tk = np.arange(kd, dtype=np.float32) / SR
            kf = 132.0 * np.exp(-tk * 28.0) + 52.0
            kick = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-tk * 23.0) * 0.15
            add_stereo(bgm_l, bgm_r, s0, kick.astype(np.float32))

        if step8 in (2, 6):
            cd = min(int(0.075 * SR), n - s0)
            tc = np.arange(cd, dtype=np.float32) / SR
            clap = rng.standard_normal(cd).astype(np.float32) * np.exp(-tc * 50.0) * 0.04
            add_stereo(bgm_l, bgm_r, s0, clap, pan=0.52)

        if step8 % 2 == 1:
            hd = min(int(0.028 * SR), n - s0)
            th = np.arange(hd, dtype=np.float32) / SR
            hat = rng.standard_normal(hd).astype(np.float32) * np.exp(-th * 118.0) * 0.018
            add_stereo(bgm_l, bgm_r, s0, hat, pan=0.46)

    sos = butter(3, 4600, btype="low", fs=SR, output="sos")
    bgm_l = sosfilt(sos, bgm_l).astype(np.float32)
    bgm_r = sosfilt(sos, bgm_r).astype(np.float32)

    def at_frame(fg: int) -> int:
        return int(fg / fps * SR)

    for sc in tl["scenes"]:
        sid = sc["id"]
        sf = sc["from"]
        if sf > 0:
            add_stereo(sfx_l, sfx_r, at_frame(sf), sfx_whoosh(0.21, 0.145))
        cm = {c["cue"]: c for c in sc["cues"]}

        if sid == "opening":
            add_stereo(sfx_l, sfx_r, at_frame(sf + 16), sfx_alert(0.18))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["cachePower"]["from"]), sfx_arpeggio([587.33, 783.99, 987.77, 1174.66], 0.055, 0.19))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["multiUse"]["from"]), sfx_pop(640, 360, 0.17))
        elif sid == "dataTypes":
            for k, pitch in [("stringHash", 520), ("listSet", 620), ("zset", 740)]:
                add_stereo(sfx_l, sfx_r, at_frame(sf + cm[k]["from"]), sfx_pop(pitch, 320, 0.17))
        elif sid == "whyFast":
            for k, freq in [("inMemory", 587.33), ("singleThread", 659.25), ("epoll", 783.99), ("dataStruct", 880.0)]:
                add_stereo(sfx_l, sfx_r, at_frame(sf + cm[k]["from"]), sfx_arpeggio([freq, freq * 1.25], 0.052, 0.175))
        elif sid == "persistence":
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["rdb"]["from"]), sfx_pop(540, 340, 0.17))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["aof"]["from"]), sfx_pop(640, 340, 0.17))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["hybrid"]["from"]), sfx_arpeggio([587.33, 783.99, 987.77, 1174.66], 0.055, 0.20))
        elif sid == "cacheTraps":
            for k in ["penetration", "breakdown", "avalanche"]:
                add_stereo(sfx_l, sfx_r, at_frame(sf + cm[k]["from"]), sfx_alert(0.16), pan=0.35)
                add_stereo(sfx_l, sfx_r, at_frame(sf + cm[k]["from"] + round(cm[k]["duration"] * 0.56)), sfx_arpeggio([659.25, 783.99, 987.77], 0.05, 0.17), pan=0.68)
        elif sid == "clusterHA":
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["eviction"]["from"]), sfx_pop(560, 320, 0.17))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["sentinelCluster"]["from"]), sfx_arpeggio([587.33, 783.99, 987.77, 1174.66], 0.058, 0.20))
        elif sid == "finale":
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["quote"]["from"]), sfx_arpeggio([587.33, 783.99, 987.77], 0.065, 0.18))
            add_stereo(sfx_l, sfx_r, at_frame(sf + cm["signoff"]["from"]), sfx_arpeggio([783.99, 987.77, 1174.66, 1567.98], 0.058, 0.21))

    win = int(0.08 * SR)
    env_n = np.convolve(np.abs(narr), np.ones(win, dtype=np.float32) / win, mode="same")
    duck = np.clip(1.0 - env_n * 4.8, 0.36, 1.0)
    fade_in = np.minimum(1.0, t / 0.35)
    fade_out = np.minimum(1.0, np.maximum(0.0, (n / SR - t) / 1.0))
    bgm_gain = duck * fade_in * fade_out

    mix_l = narr * 0.96 + bgm_l * bgm_gain + sfx_l * 0.85
    mix_r = narr * 0.96 + bgm_r * bgm_gain + sfx_r * 0.85
    stereo = np.stack([mix_l, mix_r], axis=1)
    peak = float(np.max(np.abs(stereo)))
    if peak > 0.94:
        stereo *= 0.94 / peak
    pcm = np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(args.out, SR, pcm)
    print(f"REDIS MASTER MIX READY: {args.out} ({n / SR:.2f}s, peak={peak:.3f})")


if __name__ == "__main__":
    main()
