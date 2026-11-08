"""Soundtrack for a Kaja story: her voice (from the HeyGen video), a Mixkit track ducked under it, quiet UI sounds on the cues.

Usage: python3 scripts/story_audio.py episodes/s01.json   -> build/story/<id>/<id>.mix.wav (loudness-normalised later by ffmpeg)
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = json.load(open(sys.argv[1]))
OUT = os.path.join(ROOT, "build", "story", EP["id"])
SR = 44100
DUR = float(EP["end"])
N = int(SR * DUR)
rng = np.random.default_rng(7)


def decode(path, start=0.0, dur=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", path]
    if dur:
        cmd += ["-t", str(dur)]
    cmd += ["-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).astype(float)
    out = np.zeros(N)
    out[: min(N, len(x))] = x[:N]
    return out


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-np.maximum(0, t - a) / d)


def filt(x, kind, f):
    return sosfilt(butter(2, f, btype=kind, fs=SR, output="sos"), x)


def pop(f0=700, f1=1500):
    n = int(0.07 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * t / 0.07) / SR) * env(n, 0.001, 0.025)


def click():
    n = int(0.012 * SR)
    return filt(rng.standard_normal(n), "highpass", 2500) * env(n, 0.0003, 0.003)


def ding():
    n = int(0.7 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 1975.5 * t)) * env(n, 0.002, 0.18)


def whoosh(dur=0.4, lo=400, hi=5000, up=False):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = n // 16
    for s in range(16):
        fr = s / 15 if up else 1 - s / 15
        fc = lo * (hi / lo) ** fr
        part = filt(x[s * seg:(s + 1) * seg + 200], "bandpass", [fc * 0.7, min(fc * 1.4, 20000)])
        out[s * seg:s * seg + len(part)] += part[: n - s * seg]
    return out * np.sin(np.pi * np.arange(n) / SR / dur) ** 2


sfx = np.zeros(N)


def add(sig, t, gain):
    i = int(t * SR)
    if i < 0 or i >= N:
        return
    seg = sig[: N - i] * gain
    sfx[i:i + len(seg)] += seg


def thud():
    n = int(0.35 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(90 - 50 * t / 0.35) / SR) * env(n, 0.002, 0.12) + 0.3 * filt(rng.standard_normal(n), "lowpass", 900) * env(n, 0.001, 0.03)


if "sfx" in EP:                        # layout 2: the episode lists its own cues [kind, t, gain]
    KIND = {"pop": lambda: pop(650, 1300), "pop_hi": lambda: pop(1000, 2000), "click": click, "ding": ding, "thud": thud,
            "whoosh_up": lambda: whoosh(0.5, 400, 5500, up=True), "whoosh_down": lambda: whoosh(0.4, 400, 4500)}
    for kind, t, g in EP["sfx"]:
        if kind == "type":
            for j in range(8): add(click(), t + j * 0.062, g)
        elif kind == "tick3":
            for j in range(3): add(click(), t + j * 0.16, g)
        else:
            add(KIND[kind](), t, g)
else:
  # ---- cues of layout 1 (same times the template animates)
  H = EP["hook"]["until"]
  shots = [(t, k, EP["shots"][i + 1][0] if i + 1 < len(EP["shots"]) else DUR) for i, (t, k) in enumerate(EP["shots"])]
  for b in EP["hook"]["bubbles"]:
      add(pop(800, 1600), b[4], 0.22)
  add(whoosh(0.45, 500, 6000, up=True), H - 0.3, 0.22)
  for a, *_ in EP["cards"]:
      add(pop(1100, 1900), a, 0.18)
      add(click(), a + 0.02, 0.12)
  for t, k, end in shots:
      if k.startswith("ins:"):
          add(whoosh(0.5, 400, 5500, up=True), t - 0.2, 0.2)
          add(whoosh(0.4, 400, 4500), end - 0.45, 0.16)
      if k == "summary":
          add(whoosh(0.55, 300, 7000, up=True), t - 0.25, 0.24)
          for j in range(len(EP["summary"]["items"])):
              add(pop(700, 1400), t + 0.6 + j * 0.12, 0.14)
          add(ding(), t + 1.35, 0.12)
  for _, _, at in EP["comments"]["items"]:
      add(pop(650, 1300), at, 0.16)
  for _, at in EP["comments"]["chips"]:
      add(pop(1000, 2000), at, 0.16)
  o = next(t for t, k, _ in shots if k == "ins:orders")
  for i in range(len(EP["orders"]["rows"])):
      add(click(), o + 0.4 + i * 0.07, 0.18)
  for _, at in EP["orders"]["cols"]:
      add(click(), at, 0.14)
  add(ding(), EP["orders"]["cols"][3][1] + 0.45, 0.12)

# ---- voice: speech at about -18 dBFS RMS (measured on the voiced part)
voice = decode(os.path.join(ROOT, EP["kaja"]["video"]))
voiced = voice[np.abs(voice) > 0.01]
voice *= 10 ** ((-18 - rms_db(voiced)) / 20)

# ---- music: Mixkit track, ~20 dB under the voice while she talks, up for the summary, faded out at the end
m = EP["music"]
tid = str(m["track"]).replace("mixkit:", "")
music = decode(os.path.join(ROOT, "build", "music", f"{tid}.mp3"), m.get("start", 0), DUR)
music *= 10 ** ((-20 - rms_db(music[: int(10 * SR)])) / 20)        # music body at -20 dBFS RMS before the bed gain
speech_end = max(w[2] for w in json.load(open(os.path.join(ROOT, EP["kaja"]["words"]))))
t = np.arange(N) / SR
g_db = np.where(t < speech_end + 0.15, m.get("gain_db", -27) + 9, -9.0)   # bed: -18 under speech, -9 for the summary
g_db = np.convolve(g_db, np.ones(int(0.35 * SR)) / int(0.35 * SR), mode="same")
gain = 10 ** (g_db / 20) * np.minimum(1, t / 0.25) * np.clip((DUR - t) / 1.4, 0, 1)
music *= gain
music = filt(music, "highpass", 60)

mix = voice + music + sfx
peak = np.max(np.abs(mix))
if peak > 0.98:
    mix *= 0.98 / peak
os.makedirs(OUT, exist_ok=True)
from scipy.io import wavfile  # noqa: E402

wavfile.write(os.path.join(OUT, f"{EP['id']}.mix.wav"), SR, (mix * 32767).astype(np.int16))
print(f"{EP['id']}.mix.wav {DUR:.1f}s  voice {rms_db(voice[voice != 0]):.1f} dBFS  music under speech {g_db[int(5 * SR)]:.1f} dB, summary {g_db[int((DUR - 2) * SR)]:.1f} dB, peak {peak:.2f}")
