"""124 BPM forensic cyber-investigative C#-minor score + X-ray scan/drop/servo SFX for robot-truth."""
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


def synth_pad_chord(freqs: list[float], dur: float, amp: float = 0.036) -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    sig = np.zeros(n, dtype=np.float32)
    for f in freqs:
        sig += (
            0.52 * np.sin(2 * np.pi * f * t)
            + 0.28 * np.sin(2 * np.pi * (f * 1.003) * t)
            + 0.20 * np.sin(2 * np.pi * (f * 2.0) * t) * np.exp(-t * 1.15)
        )
    atk = np.minimum(1.0, t / 0.14)
    rel = np.minimum(1.0, np.maximum(0.0, (dur - t) / 0.24))
    return (sig / max(1, len(freqs)) * atk * rel * amp).astype(np.float32)


def synth_pluck(freq: float, dur: float, amp: float = 0.044) -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    raw = (
        0.65 * np.sin(2 * np.pi * freq * t)
        + 0.25 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 14.0)
        + 0.10 * np.sin(2 * np.pi * freq * 3.0 * t) * np.exp(-t * 25.0)
    )
    atk = np.minimum(1.0, t / 0.003)
    dec = np.exp(-t * (9.0 / max(0.06, dur)))
    return (raw * atk * dec * amp).astype(np.float32)


def sfx_whoosh(dur: float = 0.26, amp: float = 0.18, reverse: bool = False) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(9091)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, [380, 4000], btype="bandpass", fs=SR, output="sos")
    filt = sosfilt(sos, noise).astype(np.float32)
    env = np.sin(np.pi * t / dur) ** 1.3
    f = (1450.0 - 1100.0 * (t / dur)) if reverse else (260.0 + 1250.0 * (t / dur) ** 1.25)
    tonal = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    return ((filt + tonal) * env * amp).astype(np.float32)


def sfx_sub_drop(amp: float = 0.26) -> np.ndarray:
    dur = 0.44
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = 148.0 * np.exp(-t * 8.2) + 36.0
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.0) * amp
    return sig.astype(np.float32)


def sfx_xray_ping(amp: float = 0.17) -> np.ndarray:
    dur = 0.36
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = 1180.0 - 520.0 * (t / dur) ** 0.7
    sig = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(2 * np.pi * 2360.0 * t)) * np.exp(-t * 8.5)
    return (sig * amp).astype(np.float32)


def sfx_chime(notes: list[float], step: float = 0.045, amp: float = 0.16) -> np.ndarray:
    total = int((len(notes) * step + 0.34) * SR)
    out = np.zeros(total, dtype=np.float32)
    for i, f in enumerate(notes):
        s = int(i * step * SR)
        sig = synth_pluck(f, 0.26, amp=amp)
        end = min(total, s + len(sig))
        out[s:end] += sig[: end - s]
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--timeline", type=Path, default=BASE / "source/timeline.json")
    parser.add_argument("--narration", type=Path, default=ROOT / "public/robot-truth/owned/audio/narration.wav")
    parser.add_argument("--out", type=Path, default=ROOT / "public/robot-truth/owned/audio/master.wav")
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
    bpm = 124.0
    sixteenth_sec = (60.0 / bpm) * 0.25
    bar_sec = (60.0 / bpm) * 4.0

    # C# minor investigative sci-fi harmony: C#m9 -> AMaj7 -> F#m9 -> G#7sus4
    chords = [
        [277.18, 329.63, 415.30, 493.88, 622.25],
        [220.00, 277.18, 329.63, 415.30],
        [185.00, 220.00, 277.18, 329.63, 415.30],
        [207.65, 277.18, 311.13, 369.99],
    ]
    bass_roots = [69.30, 55.00, 46.25, 51.91]
    arp_patterns = [
        [554.37, 659.25, 830.61, 987.77, 830.61, 659.25, 622.25, 659.25],
        [440.00, 554.37, 659.25, 830.61, 659.25, 554.37, 493.88, 554.37],
        [369.99, 440.00, 554.37, 659.25, 554.37, 440.00, 415.30, 440.00],
        [415.30, 554.37, 622.25, 739.99, 622.25, 554.37, 493.88, 415.30],
    ]

    bgm_l = np.zeros(n, dtype=np.float32)
    bgm_r = np.zeros(n, dtype=np.float32)
    sfx_l = np.zeros(n, dtype=np.float32)
    sfx_r = np.zeros(n, dtype=np.float32)

    total_bars = int(np.ceil((n / SR) / bar_sec))
    for b in range(total_bars):
        ci = b % 4
        s0 = int(b * bar_sec * SR)
        if s0 >= n:
            break
        pad = synth_pad_chord(chords[ci], bar_sec * 1.05, amp=0.048)
        add_stereo(bgm_l, bgm_r, s0, pad, pan=0.47)

    total_16ths = int(np.ceil((n / SR) / sixteenth_sec))
    rng = np.random.default_rng(202611)

    for step in range(total_16ths):
        bar = (step // 16) % 4
        pos = step % 16
        s0 = int(step * sixteenth_sec * SR)
        if s0 >= n:
            break

        if pos % 2 == 0:
            af = arp_patterns[bar][(pos // 2) % 8]
            arp = synth_pluck(af, sixteenth_sec * 1.85, amp=0.042)
            add_stereo(bgm_l, bgm_r, s0, arp, pan=0.35 if (pos // 2) % 2 == 0 else 0.65)

        if pos % 2 == 0:
            bf = bass_roots[bar] * (2.0 if pos in (6, 14) else 1.0)
            bd = min(int(sixteenth_sec * 1.9 * SR), n - s0)
            tb = np.arange(bd, dtype=np.float32) / SR
            bass = (np.sin(2 * np.pi * bf * tb) + 0.40 * np.sin(2 * np.pi * bf * 2 * tb)) * np.exp(-tb * 7.5) * 0.12
            add_stereo(bgm_l, bgm_r, s0, bass.astype(np.float32))

        if pos in (0, 8):
            kd = min(int(0.125 * SR), n - s0)
            tk = np.arange(kd, dtype=np.float32) / SR
            kf = 128.0 * np.exp(-tk * 30.0) + 42.0
            kick = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-tk * 22.0) * 0.155
            add_stereo(bgm_l, bgm_r, s0, kick.astype(np.float32))

        if pos in (4, 12):
            cd = min(int(0.050 * SR), n - s0)
            tc = np.arange(cd, dtype=np.float32) / SR
            tick = rng.standard_normal(cd).astype(np.float32) * np.exp(-tc * 72.0) * 0.034
            add_stereo(bgm_l, bgm_r, s0, tick, pan=0.58)
        elif pos % 2 == 1:
            hd = min(int(0.018 * SR), n - s0)
            th = np.arange(hd, dtype=np.float32) / SR
            hat = rng.standard_normal(hd).astype(np.float32) * np.exp(-th * 150.0) * 0.016
            add_stereo(bgm_l, bgm_r, s0, hat, pan=0.42)

    sos = butter(3, 4400, btype="low", fs=SR, output="sos")
    bgm_l = sosfilt(sos, bgm_l).astype(np.float32)
    bgm_r = sosfilt(sos, bgm_r).astype(np.float32)

    def at_frame(fg: int) -> int:
        return int(fg / fps * SR)

    drop_cues = {"titleSlam", "sharedAuto", "yankBlind", "dataGap", "dualSystem"}
    xray_cues = {"xrayReveal", "gamepadScript", "vrRetarget", "speedTrap", "jitterWave", "fourChecks"}
    chime_cues = {"leaderFollower", "yankClosedLoop", "imitationLoop", "sys2Sys1", "sim2Real", "outroCall"}

    for sc in tl["scenes"]:
        sf = sc["from"]
        if sf > 0:
            add_stereo(sfx_l, sfx_r, at_frame(sf), sfx_whoosh(0.25, 0.18))
        for c in sc["cues"]:
            gf = sf + c["from"]
            cname = c["cue"]
            if cname in drop_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_sub_drop(0.25))
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_whoosh(0.22, 0.15, reverse=True))
            elif cname in xray_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_xray_ping(0.16))
            elif cname in chime_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_chime([554.37, 659.25, 830.61, 1108.73], 0.044, 0.16))

    win = int(0.07 * SR)
    env_n = np.convolve(np.abs(narr), np.ones(win, dtype=np.float32) / win, mode="same")
    duck = np.clip(1.0 - env_n * 4.5, 0.35, 1.0)
    fade_in = np.minimum(1.0, t / 0.35)
    fade_out = np.minimum(1.0, np.maximum(0.0, (n / SR - t) / 1.4))
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
    print(f"ROBOT-TRUTH MASTER MIX READY: {args.out} ({n / SR:.2f}s, peak={peak:.3f})")


if __name__ == "__main__":
    main()
