"""Rebuild frame-aligned motion features from the selected, untrimmed audio.

Usage: python projects/of-course-mv/analyze-audio.py
Needs numpy and scipy. This analysis is offline; the animation has no Python or
model service dependency. Source is not downloaded by this script.
"""
import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import correlate, find_peaks, stft

project = Path(__file__).resolve().parent
root = project.parent.parent
audio = root / "public/of-course-mv/external/audio/of-course-reference.wav"
with wave.open(str(audio)) as reader:
    rate = reader.getframerate()
    channels = reader.getnchannels()
    samples = np.frombuffer(reader.readframes(reader.getnframes()), dtype="<i2")
signal = samples.reshape(-1, channels).mean(axis=1) / 32768
freq, time, spectrum = stft(signal, fs=rate, nperseg=2048, noverlap=1808)
magnitude = np.abs(spectrum)
log_spectrum = np.log1p(magnitude * 100)
flux = np.r_[0, np.maximum(np.diff(log_spectrum, axis=1), 0).sum(axis=0)]
low = np.sqrt(np.mean(magnitude[freq < 180] ** 2, axis=0))
flux_scale = max(float(np.percentile(flux, 95)), 1e-9)
low_scale = max(float(np.percentile(low, 95)), 1e-9)
flux_norm = np.clip(flux / flux_scale, 0, 1.5)
low_norm = np.clip(low / low_scale, 0, 1.3)
indices, _ = find_peaks(flux_norm, distance=30, prominence=.22)
fps, frames = 30, 1313
frame_time = np.arange(frames) / fps
features = [{"low": round(float(a), 3), "onset": round(float(b), 3)} for a, b in zip(np.interp(frame_time, time, low_norm), np.interp(frame_time, time, flux_norm))]
(project / "source/audio-energy.json").write_text(json.dumps(features, separators=(",", ":")) + "\n")
correlation = correlate(flux - flux.mean(), flux - flux.mean(), mode="full", method="fft")[len(flux) - 1:]
lags, _ = find_peaks(correlation[50:161])
lags = lags + 50
ranked = sorted(lags, key=lambda i: correlation[i], reverse=True)[:5]
analysis = {"durationSeconds": len(signal) / rate, "videoFrames": frames, "fps": fps, "sampleRate": rate, "channels": channels, "peakDbFS": round(float(20 * np.log10(max(abs(samples).max() / 32768, 1e-9))), 2), "tempoCandidates": [{"bpm": round(60 / (lag * 240 / rate), 2), "correlation": round(float(correlation[lag]), 3)} for lag in ranked], "detectedOnsets": [round(float(time[i]), 3) for i in indices], "method": "STFT 2048 / hop 240; positive log spectral flux; RMS below 180Hz; 95th percentile normalization; frame interpolation"}
(project / "audio-analysis.json").write_text(json.dumps(analysis, ensure_ascii=False, indent=2) + "\n")
print(f"{len(signal)/rate:.6f}s, {frames} aligned frames, {len(indices)} onsets; tempo candidates: {analysis['tempoCandidates']}")
