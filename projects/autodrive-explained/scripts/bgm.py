"""High-energy 126 BPM cyber-cinema synthwave score + crisp impact/whoosh/laser SFX synced to 42 visual beats!"""
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


def synth_pad_chord(freqs: list[float], dur: float, amp: float = 0.032) -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    sig = np.zeros(n, dtype=np.float32)
    for f in freqs:
        sig += (
            0.52 * np.sin(2 * np.pi * f * t)
            + 0.30 * np.sin(2 * np.pi * (f * 1.004) * t)
            + 0.18 * np.sin(2 * np.pi * (f * 2.0) * t) * np.exp(-t * 1.2)
        )
    atk = np.minimum(1.0, t / 0.12)
    rel = np.minimum(1.0, np.maximum(0.0, (dur - t) / 0.22))
    return (sig / max(1, len(freqs)) * atk * rel * amp).astype(np.float32)


def synth_arp(freq: float, dur: float, amp: float = 0.052) -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    raw = (
        0.68 * np.sin(2 * np.pi * freq * t)
        + 0.24 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 15.0)
        + 0.08 * np.sin(2 * np.pi * freq * 3.0 * t) * np.exp(-t * 24.0)
    )
    atk = np.minimum(1.0, t / 0.004)
    dec = np.exp(-t * (8.8 / max(0.07, dur)))
    return (raw * atk * dec * amp).astype(np.float32)


def sfx_whoosh(dur: float = 0.28, amp: float = 0.20, reverse: bool = False) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(2027)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, [350, 3800], btype="bandpass", fs=SR, output="sos")
    filt = sosfilt(sos, noise).astype(np.float32)
    env = np.sin(np.pi * t / dur) ** 1.3
    f = (1400.0 - 1100.0 * (t / dur)) if reverse else (260.0 + 1250.0 * (t / dur) ** 1.3)
    tonal = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.28
    return ((filt + tonal) * env * amp).astype(np.float32)


def sfx_sub_drop(amp: float = 0.28) -> np.ndarray:
    dur = 0.42
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = 140.0 * np.exp(-t * 8.5) + 38.0
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.2) * amp
    return sig.astype(np.float32)


def sfx_laser_hit(freq: float = 960.0, amp: float = 0.18) -> np.ndarray:
    dur = 0.22
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = freq * np.exp(-t * 5.0) + 220.0
    sig = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.35 * np.sin(2 * np.pi * freq * 1.5 * t)) * np.exp(-t * 16.0)
    return (sig * amp).astype(np.float32)


def sfx_chime(notes: list[float], step: float = 0.048, amp: float = 0.17) -> np.ndarray:
    total = int((len(notes) * step + 0.32) * SR)
    out = np.zeros(total, dtype=np.float32)
    for i, f in enumerate(notes):
        s = int(i * step * SR)
        sig = synth_arp(f, 0.25, amp=amp)
        end = min(total, s + len(sig))
        out[s:end] += sig[: end - s]
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--timeline", type=Path, default=BASE / "source/timeline.json")
    parser.add_argument("--narration", type=Path, default=ROOT / "public/autodrive-explained/owned/audio/narration.wav")
    parser.add_argument("--out", type=Path, default=ROOT / "public/autodrive-explained/owned/audio/master.wav")
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
    bpm = 126.0
    sixteenth_sec = (60.0 / bpm) * 0.25
    bar_sec = (60.0 / bpm) * 4.0

    chords = [
        [261.63, 311.13, 392.00, 466.16, 587.33],
        [207.65, 261.63, 311.13, 392.00],
        [311.13, 392.00, 466.16, 587.33],
        [233.08, 293.66, 349.23, 392.00],
    ]
    bass_roots = [65.41, 51.91, 77.78, 58.27]
    arp_patterns = [
        [523.25, 622.25, 783.99, 932.33, 783.99, 622.25, 587.33, 622.25],
        [415.30, 523.25, 622.25, 783.99, 622.25, 523.25, 466.16, 523.25],
        [622.25, 783.99, 932.33, 1174.66, 932.33, 783.99, 698.46, 783.99],
        [466.16, 587.33, 698.46, 783.99, 698.46, 587.33, 523.25, 466.16],
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
        pad = synth_pad_chord(chords[ci], bar_sec * 1.04, amp=0.052)
        add_stereo(bgm_l, bgm_r, s0, pad, pan=0.48)

    total_16ths = int(np.ceil((n / SR) / sixteenth_sec))
    rng = np.random.default_rng(20265)

    for step in range(total_16ths):
        bar = (step // 16) % 4
        pos = step % 16
        s0 = int(step * sixteenth_sec * SR)
        if s0 >= n:
            break

        # Energetic 8th-note driving synth arpeggio
        if pos % 2 == 0:
            af = arp_patterns[bar][(pos // 2) % 8]
            arp = synth_arp(af, sixteenth_sec * 1.9, amp=0.048)
            add_stereo(bgm_l, bgm_r, s0, arp, pan=0.35 if (pos // 2) % 2 == 0 else 0.65)

        # Driving cyber sub-bass pulse
        if pos % 2 == 0:
            bf = bass_roots[bar] * (2.0 if pos in (6, 14) else 1.0)
            bd = min(int(sixteenth_sec * 1.9 * SR), n - s0)
            tb = np.arange(bd, dtype=np.float32) / SR
            bass = (np.sin(2 * np.pi * bf * tb) + 0.38 * np.sin(2 * np.pi * bf * 2 * tb)) * np.exp(-tb * 7.2) * 0.125
            add_stereo(bgm_l, bgm_r, s0, bass.astype(np.float32))

        # Punchy 4-on-the-floor electronic kick
        if pos in (0, 8):
            kd = min(int(0.13 * SR), n - s0)
            tk = np.arange(kd, dtype=np.float32) / SR
            kf = 128.0 * np.exp(-tk * 30.0) + 44.0
            kick = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-tk * 22.0) * 0.165
            add_stereo(bgm_l, bgm_r, s0, kick.astype(np.float32))

        # Crisp snare/tick & 16th hi-hat motion
        if pos in (4, 12):
            cd = min(int(0.055 * SR), n - s0)
            tc = np.arange(cd, dtype=np.float32) / SR
            tick = rng.standard_normal(cd).astype(np.float32) * np.exp(-tc * 68.0) * 0.038
            add_stereo(bgm_l, bgm_r, s0, tick, pan=0.56)
        elif pos % 2 == 1:
            hd = min(int(0.020 * SR), n - s0)
            th = np.arange(hd, dtype=np.float32) / SR
            hat = rng.standard_normal(hd).astype(np.float32) * np.exp(-th * 145.0) * 0.018
            add_stereo(bgm_l, bgm_r, s0, hat, pan=0.44)

    sos = butter(3, 4600, btype="low", fs=SR, output="sos")
    bgm_l = sosfilt(sos, bgm_l).astype(np.float32)
    bgm_r = sosfilt(sos, bgm_r).astype(np.float32)

    def at_frame(fg: int) -> int:
        return int(fg / fps * SR)

    # Sync crisp cinema SFX to every scene change & dramatic visual cut!
    drop_cues = {"titleSlam", "lv3Laser", "hdShatter", "e2eVortex", "wmFreeze", "ratio99", "warpPortals"}
    laser_cues = {"xrayPerception", "radarRain", "lidarCloud", "tunnelBlock", "predictCutin", "e2eGuardrail", "caseTire"}
    chime_cues = {"slamLock", "dbwXray", "bevStitch", "occVoxels", "vlaVoicePark", "globeFlywheel", "cinemaEnd"}

    for sc in tl["scenes"]:
        sf = sc["from"]
        if sf > 0:
            add_stereo(sfx_l, sfx_r, at_frame(sf), sfx_whoosh(0.26, 0.18))
        for c in sc["cues"]:
            gf = sf + c["from"]
            cname = c["cue"]
            if cname in drop_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_sub_drop(0.26))
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_whoosh(0.24, 0.16, reverse=True))
            elif cname in laser_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_laser_hit(920.0, 0.17))
            elif cname in chime_cues:
                add_stereo(sfx_l, sfx_r, at_frame(gf), sfx_chime([523.25, 622.25, 783.99, 1046.5], 0.045, 0.17))

    win = int(0.07 * SR)
    env_n = np.convolve(np.abs(narr), np.ones(win, dtype=np.float32) / win, mode="same")
    duck = np.clip(1.0 - env_n * 4.4, 0.38, 1.0)
    fade_in = np.minimum(1.0, t / 0.35)
    fade_out = np.minimum(1.0, np.maximum(0.0, (n / SR - t) / 1.2))
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
    print(f"AUTODRIVE V2 MASTER MIX READY: {args.out} ({n / SR:.2f}s, peak={peak:.3f})")


if __name__ == "__main__":
    main()
