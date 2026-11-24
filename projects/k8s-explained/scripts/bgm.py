"""Upbeat 126 BPM cartoon-tech electro-chiptune BGM + rich playful cue-synced cartoon SFX!

Features:
- Catchy bubbly Nintendo/chiptune-inspired synth groove (marimba/square-tri melody, bouncy bass,
  snappy kick/clap/hat rhythm, warm pad) dynamically ducked under Yunxia voiceover.
- 14 custom procedural cartoon sound effects timed to exact animation cues:
  * 03:00 alarm beeps
  * K8s hero shimmer fanfare
  * Docker chaos comic pops
  * Node / Pod / Namespace playful pops & whooshes
  * Ephemeral "短命临时工" rubber stamp THUD + comic boing!
  * Self-heal hammer crash + 3-second "ding-dong" respawn power-up!
  * Rolling update ascending Do-Mi-Sol chime!
  * HPA traffic spike alert sweep + rapid multi-Pod scale-up pops + night-mode power-down chime!
  * Service / Ingress laser swoosh!
  * ConfigMap / Secret USB click-plug chime!
  * Control Plane 5-baton ascending relay chimes + reconcile radar pings!
  * Finale 18:00 punch-clock "ding!" + confetti celebration chord!
"""
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


def synth_note(freq: float, dur: float, amp: float = 0.12, wave: str = "tri") -> np.ndarray:
    n = max(1, int(dur * SR))
    t = np.arange(n, dtype=np.float32) / SR
    if wave == "square":
        raw = np.sign(np.sin(2 * np.pi * freq * t)) * 0.6 + np.sin(2 * np.pi * freq * t) * 0.4
    elif wave == "bell":
        raw = (
            0.7 * np.sin(2 * np.pi * freq * t)
            + 0.25 * np.sin(2 * np.pi * freq * 2.0 * t)
            + 0.12 * np.sin(2 * np.pi * freq * 3.0 * t)
        )
    else:  # warm bouncy triangle-marimba
        raw = (
            0.75 * np.sin(2 * np.pi * freq * t)
            + 0.22 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t * 14.0)
            + 0.08 * np.sin(2 * np.pi * freq * 3.0 * t) * np.exp(-t * 22.0)
        )
    atk = np.minimum(1.0, t / 0.008)
    dec = np.exp(-t * (6.5 / max(0.08, dur)))
    rel = np.minimum(1.0, np.maximum(0.0, (dur - t) / 0.015))
    return (raw * atk * dec * rel * amp).astype(np.float32)


def sfx_pop(pitch: float = 520.0, rise: float = 420.0, amp: float = 0.24) -> np.ndarray:
    dur = 0.095
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    f = pitch + rise * (t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28.0) * amp).astype(np.float32)


def sfx_whoosh(dur: float = 0.24, amp: float = 0.16) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(77)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, [450, 2600], btype="bandpass", fs=SR, output="sos")
    filt = sosfilt(sos, noise).astype(np.float32)
    env = np.sin(np.pi * t / dur) ** 1.6
    # subtle pitch whistle layer
    f = 320.0 + 780.0 * (t / dur)
    whistle = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.28
    return ((filt * 1.4 + whistle) * env * amp).astype(np.float32)


def sfx_alarm_beeps(amp: float = 0.22) -> np.ndarray:
    total = int(1.05 * SR)
    out = np.zeros(total, dtype=np.float32)
    for k in range(3):
        s = int(k * 0.34 * SR)
        for j in range(2):
            p = s + int(j * 0.11 * SR)
            beep = synth_note(1180.0 if j == 0 else 1480.0, 0.085, amp=amp, wave="square")
            out[p : p + len(beep)] += beep[: max(0, total - p)]
    return out


def sfx_stamp_thud_boing(amp: float = 0.28) -> np.ndarray:
    dur = 0.42
    t = np.arange(int(dur * SR), dtype=np.float32) / SR
    # Low thud
    f_thud = 150.0 * np.exp(-t * 26.0) + 42.0
    thud = np.sin(2 * np.pi * np.cumsum(f_thud) / SR) * np.exp(-t * 18.0) * amp
    # Comic spring boing right after
    t_b = np.maximum(0.0, t - 0.06)
    f_boing = 240.0 + 260.0 * (1.0 - np.exp(-t_b * 10.0)) + 45.0 * np.sin(2 * np.pi * 16.0 * t_b)
    boing = (
        np.where(t >= 0.06, np.sin(2 * np.pi * np.cumsum(f_boing) / SR) * np.exp(-t_b * 8.5), 0.0)
        * (amp * 0.55)
    )
    return (thud + boing).astype(np.float32)


def sfx_crash(amp: float = 0.24) -> np.ndarray:
    dur = 0.32
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    rng = np.random.default_rng(108)
    noise = rng.standard_normal(n).astype(np.float32)
    sos = butter(2, 1800, btype="low", fs=SR, output="sos")
    boom = sosfilt(sos, noise).astype(np.float32) * np.exp(-t * 13.0)
    drop_f = 340.0 * np.exp(-t * 9.0) + 55.0
    drop = np.sin(2 * np.pi * np.cumsum(drop_f) / SR) * np.exp(-t * 12.0) * 0.75
    return ((boom + drop) * amp).astype(np.float32)


def sfx_arpeggio(notes: list[float], step_sec: float = 0.075, amp: float = 0.20, wave: str = "bell") -> np.ndarray:
    total = int((len(notes) * step_sec + 0.35) * SR)
    out = np.zeros(total, dtype=np.float32)
    for i, f in enumerate(notes):
        s = int(i * step_sec * SR)
        sig = synth_note(f, 0.28, amp=amp, wave=wave)
        end = min(total, s + len(sig))
        out[s:end] += sig[: end - s]
    return out


def sfx_usb_plug(amp: float = 0.22) -> np.ndarray:
    # Iconic cheerful "da-DING!" two-tone hardware connect chime
    return sfx_arpeggio([523.25, 783.99, 1046.50], step_sec=0.07, amp=amp, wave="bell")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--timeline", type=Path, default=BASE / "source/timeline.json")
    parser.add_argument("--narration", type=Path, default=ROOT / "public/k8s-explained/owned/audio/narration.wav")
    parser.add_argument("--out", type=Path, default=ROOT / "public/k8s-explained/owned/audio/master.wav")
    args = parser.parse_args()

    tl = json.loads(args.timeline.read_text())
    fps = tl["fps"]
    sr_n, narr = wavfile.read(args.narration)
    if narr.dtype == np.int16:
        narr = narr.astype(np.float32) / 32768.0
    elif narr.dtype == np.int32:
        narr = narr.astype(np.float32) / 2147483648.0
    if narr.ndim > 1:
        narr = narr.mean(axis=1)
    assert sr_n == SR, f"Expected {SR}Hz narration, got {sr_n}"

    n = len(narr)
    t = np.arange(n, dtype=np.float32) / SR
    bpm = 126.0
    beat_sec = 60.0 / bpm
    eighth_sec = beat_sec * 0.5

    # Catchy bright Japanese/cartoon tech-pop chord loop: Fmaj7 -> G6 -> Em7 -> Am7 (4 bars)
    chords = [
        [349.23, 440.00, 523.25, 659.25],  # Fmaj7
        [392.00, 493.88, 587.33, 659.25],  # G6
        [329.63, 392.00, 493.88, 587.33],  # Em7
        [220.00, 329.63, 392.00, 523.25],  # Am7
    ]
    bass_roots = [174.61, 196.00, 164.81, 110.00]
    # Playful bouncy 8th-note chiptune melody pattern (scale degrees in C major)
    mel_notes = [
        [659.25, 0, 783.99, 659.25, 880.00, 0, 783.99, 659.25],
        [587.33, 0, 659.25, 783.99, 880.00, 783.99, 659.25, 0],
        [659.25, 0, 587.33, 523.25, 587.33, 0, 659.25, 783.99],
        [523.25, 0, 659.25, 523.25, 440.00, 0, 523.25, 0],
    ]

    bgm_l = np.zeros(n, dtype=np.float32)
    bgm_r = np.zeros(n, dtype=np.float32)
    sfx_l = np.zeros(n, dtype=np.float32)
    sfx_r = np.zeros(n, dtype=np.float32)

    total_eighths = int(np.ceil((n / SR) / eighth_sec))
    rng = np.random.default_rng(2026)

    for e in range(total_eighths):
        bar = (e // 8) % 4
        step8 = e % 8
        s0 = int(e * eighth_sec * SR)
        if s0 >= n:
            break

        # 1. Playful marimba/chiptune melody
        mf = mel_notes[bar][step8]
        if mf > 0:
            note = synth_note(mf, eighth_sec * 1.15, amp=0.068, wave="tri")
            add_stereo(bgm_l, bgm_r, s0, note, pan=0.44 if step8 % 2 == 0 else 0.56)

        # 2. Chord pluck stab on beats 0, 3, 6 (syncopated upbeat groove!)
        if step8 in (0, 3, 6):
            for ci, cf in enumerate(chords[bar]):
                stab = synth_note(cf, eighth_sec * 1.5, amp=0.022, wave="tri")
                add_stereo(bgm_l, bgm_r, s0, stab, pan=0.35 + ci * 0.1)

        # 3. Funky octave bouncy bass on 0, 2, 4, 6
        if step8 in (0, 2, 4, 6):
            bf = bass_roots[bar] * (2.0 if step8 in (2, 6) else 1.0)
            bd = min(int(eighth_sec * 1.3 * SR), n - s0)
            tb = np.arange(bd, dtype=np.float32) / SR
            bass = (np.sin(2 * np.pi * bf * tb) + 0.25 * np.sin(2 * np.pi * bf * 2 * tb)) * np.exp(-tb * 7.5) * 0.115
            add_stereo(bgm_l, bgm_r, s0, bass.astype(np.float32), pan=0.5)

        # 4. Crisp drums: kick on 0 & 4, light snappy clap on 2 & 6, bouncy hi-hat on odd 8ths
        if step8 in (0, 4):
            kd = min(int(0.13 * SR), n - s0)
            tk = np.arange(kd, dtype=np.float32) / SR
            kf = 128.0 * np.exp(-tk * 26.0) + 48.0
            kick = np.sin(2 * np.pi * np.cumsum(kf) / SR) * np.exp(-tk * 22.0) * 0.165
            add_stereo(bgm_l, bgm_r, s0, kick.astype(np.float32), pan=0.5)

        if step8 in (2, 6):
            cd = min(int(0.08 * SR), n - s0)
            tc = np.arange(cd, dtype=np.float32) / SR
            clap = rng.standard_normal(cd).astype(np.float32) * np.exp(-tc * 48.0) * 0.045
            add_stereo(bgm_l, bgm_r, s0, clap, pan=0.52)

        if step8 % 2 == 1:
            hd = min(int(0.03 * SR), n - s0)
            th = np.arange(hd, dtype=np.float32) / SR
            hat = rng.standard_normal(hd).astype(np.float32) * np.exp(-th * 110.0) * 0.022
            add_stereo(bgm_l, bgm_r, s0, hat, pan=0.46)

    # Gentle warm filter on BGM so Yunxia voiceover cuts through effortlessly
    sos = butter(3, 4400, btype="low", fs=SR, output="sos")
    bgm_l = sosfilt(sos, bgm_l).astype(np.float32)
    bgm_r = sosfilt(sos, bgm_r).astype(np.float32)

    # === PLAYFUL CUE-SYNCED CARTOON SOUND EFFECTS ===
    def at_frame(f_global: int) -> int:
        return int(f_global / fps * SR)

    for sc in tl["scenes"]:
        sid = sc["id"]
        s_from = sc["from"]
        # Scene wipe-in swoosh (skip frame 0)
        if s_from > 0:
            add_stereo(sfx_l, sfx_r, at_frame(s_from), sfx_whoosh(0.22, 0.16))

        cue_map = {c["cue"]: c for c in sc["cues"]}

        if sid == "opening":
            c_alarm = cue_map["alarm"]
            add_stereo(sfx_l, sfx_r, at_frame(s_from + 2), sfx_alarm_beeps(0.18))
            c_chaos = cue_map["dockerChaos"]
            k8s_enter = s_from + round(c_chaos["from"] * 0.56)
            add_stereo(sfx_l, sfx_r, at_frame(k8s_enter), sfx_arpeggio([523.25, 659.25, 783.99, 1046.5], 0.065, 0.18))
            # Comic pops as Docker containers explode into chaos
            for idx in range(6):
                add_stereo(
                    sfx_l,
                    sfx_r,
                    at_frame(s_from + c_chaos["from"] + 30 + idx * 6),
                    sfx_pop(420 + idx * 75, 300, 0.15),
                    pan=0.25 + idx * 0.1,
                )

        elif sid == "stage":
            # 3 Nodes popping up
            for i in range(3):
                add_stereo(sfx_l, sfx_r, at_frame(s_from + 18 + i * 14), sfx_pop(460 + i * 90, 320, 0.18), pan=0.25 + i * 0.25)
            # Pod capsule zoom pop
            add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["pod"]["from"]), sfx_pop(580, 450, 0.2))
            # Namespace 3 cubicles popping in
            ns_f = s_from + cue_map["namespace"]["from"]
            for i in range(3):
                add_stereo(sfx_l, sfx_r, at_frame(ns_f + i * 14), sfx_pop(520 + i * 110, 340, 0.17), pan=0.2 + i * 0.3)
            # Ephemeral rubber stamp THUD + comic BOING!
            eph_f = s_from + cue_map["ephemeral"]["from"] + 16
            add_stereo(sfx_l, sfx_r, at_frame(eph_f), sfx_stamp_thud_boing(0.28))

        elif sid == "deployment":
            # Self-healing: hammer crash -> respawn fanfare!
            sh = cue_map.get("selfHeal2", cue_map["selfHeal"])
            kill_f = s_from + sh["from"] + round(sh["duration"] * 0.14)
            heal_f = s_from + sh["from"] + round(sh["duration"] * 0.52)
            add_stereo(sfx_l, sfx_r, at_frame(kill_f), sfx_crash(0.24), pan=0.5)
            add_stereo(sfx_l, sfx_r, at_frame(heal_f), sfx_arpeggio([587.33, 739.99, 880.0, 1174.66], 0.06, 0.20), pan=0.72)
            # Rolling update: 3 ascending Do-Mi-Sol ticks
            rl = cue_map["rolling"]
            for idx, (frac, freq) in enumerate([(0.18, 523.25), (0.42, 659.25), (0.65, 783.99)]):
                add_stereo(sfx_l, sfx_r, at_frame(s_from + rl["from"] + round(rl["duration"] * frac)), synth_note(freq, 0.24, 0.21, "bell"), pan=0.25 + idx * 0.25)
            # HPA: rapid elastic pop cascade on spike + gentle coin ding on night shrink!
            hpa = cue_map["hpa"]
            spike_f = s_from + hpa["from"] + round(hpa["duration"] * 0.25)
            calm_f = s_from + hpa["from"] + round(hpa["duration"] * 0.70)
            for idx in range(6):
                add_stereo(sfx_l, sfx_r, at_frame(spike_f + 4 + idx * 5), sfx_pop(480 + idx * 85, 360, 0.16), pan=0.25 + idx * 0.1)
            add_stereo(sfx_l, sfx_r, at_frame(calm_f), sfx_arpeggio([880.0, 659.25, 523.25], 0.075, 0.18))

        elif sid == "network":
            add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["service"]["from"]), sfx_usb_plug(0.20))
            add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["ingress"]["from"]), sfx_whoosh(0.26, 0.18))

        elif sid == "configStorage":
            # USB plug-in chime for ConfigMap & Secret
            add_stereo(sfx_l, sfx_r, at_frame(s_from + 90), sfx_usb_plug(0.22))
            if "secretNote" in cue_map:
                add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["secretNote"]["from"]), sfx_pop(620, 260, 0.17))
            # PV swap pop
            pv = cue_map["pvPvc"]
            add_stereo(sfx_l, sfx_r, at_frame(s_from + pv["from"]), sfx_pop(500, 320, 0.18))
            swap_cue = cue_map.get("pvSwap", pv)
            swap_f = s_from + swap_cue["from"] + 18
            add_stereo(sfx_l, sfx_r, at_frame(swap_f), sfx_arpeggio([523.25, 659.25, 1046.5], 0.065, 0.20))

        elif sid == "brain":
            # 5-baton ascending electronic relay chimes!
            c_api = cue_map["apiEtcd"]
            c_ctrl = cue_map["controller"]
            etcd_local = c_api["from"] + round((c_ctrl["from"] - c_api["from"]) * 0.5)
            batons = [
                (cue_map["apply"]["from"], 440.0),
                (c_api["from"], 523.25),
                (etcd_local, 587.33),
                (c_ctrl["from"], 659.25),
                (cue_map["scheduler"]["from"], 783.99),
                (cue_map["kubelet"]["from"], 1046.50),
            ]
            for local_f, freq in batons:
                add_stereo(sfx_l, sfx_r, at_frame(s_from + local_f), sfx_arpeggio([freq, freq * 1.25], 0.055, 0.20))
            # Victory closed-loop flourish
            add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["kubelet"]["from"] + 48), sfx_arpeggio([523.25, 659.25, 783.99, 1046.5], 0.06, 0.21))

        elif sid == "finale":
            add_stereo(sfx_l, sfx_r, at_frame(s_from + cue_map["quote"]["from"]), sfx_arpeggio([523.25, 659.25, 783.99], 0.08, 0.18))
            # 18:00 punch-clock ding + joyful celebration chord!
            so = s_from + cue_map["signoff"]["from"]
            add_stereo(sfx_l, sfx_r, at_frame(so), sfx_arpeggio([783.99, 1046.5, 1318.5, 1567.98], 0.06, 0.22))

    # Smooth narration-aware ducking (BGM stays upbeat & audible in gaps, cozy under speech)
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
    print(f"MASTER MIX READY: {args.out} ({n / SR:.2f}s, peak={peak:.3f})")


if __name__ == "__main__":
    main()
