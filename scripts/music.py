"""Synthesized soundtrack for a Noxio episode, driven by the cues the template exports.

Usage: python3 scripts/music.py build/<id>.cues.json build/<id>.wav

120 BPM. Calm part (kick + hats + pad) until cues["drop"], riser into the drop, then a full groove
(kick, clap, hats, bass, chord stabs). SFX are placed at the times the visuals request.
"""
import json
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

cues = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
SR = 44100
DUR = float(cues["duration"])
DROP = float(cues.get("drop") or 0.0)
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * (1 - max(pan, 0))
    R[i:i + len(sig)] += sig * (1 + min(pan, 0))


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    ai = int(a * SR)
    if ai > 0:
        e[:ai] *= np.linspace(0, 1, ai)
    return e


def filt(x, kind, f):
    return sosfilt(butter(2, f, btype=kind, fs=SR, output="sos"), x)


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * freq * k * (1 + detune) * t) / k for k in range(1, 12)) * 0.5


def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(48 + 110 * np.exp(-t / 0.03)) / SR
    return np.sin(ph) * env(n, 0.001, 0.16) + filt(rng.standard_normal(n), "highpass", 3000) * env(n, 0.0005, 0.004) * 0.3


def hat(open_=False):
    n = int((0.18 if open_ else 0.06) * SR)
    return filt(rng.standard_normal(n), "highpass", 7500) * env(n, 0.0005, 0.06 if open_ else 0.018)


def clap():
    n = int(0.25 * SR); x = np.zeros(n)
    for off in (0, 0.011, 0.022):
        i = int(off * SR); m = n - i
        x[i:] += filt(rng.standard_normal(m), "bandpass", [900, 2600]) * env(m, 0.0005, 0.03 if off < 0.02 else 0.1)
    return x


def bass(freq, dur=0.22):
    n = int(dur * SR)
    return filt(saw(freq, n) + 0.6 * np.sin(2 * np.pi * freq * np.arange(n) / SR), "lowpass", 420) * env(n, 0.003, dur / 2.2)


def stab(freqs, dur=0.35, cutoff=2400):
    n = int(dur * SR)
    x = sum(saw(f, n, 0.003) + saw(f, n, -0.003) for f in freqs)
    return filt(x / len(freqs), "lowpass", cutoff) * env(n, 0.004, dur / 3)


def pad(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = filt(sum(saw(f, n, 0.004) + saw(f, n, -0.004) for f in freqs) / len(freqs), "lowpass", 900)
    return x * np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.4) * (0.85 + 0.15 * np.sin(2 * np.pi * 4 * t))


def whoosh(dur=0.4, lo=400, hi=5000, up=False):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = n // 16
    for s in range(16):
        fr = s / 15 if up else 1 - s / 15
        fc = lo * (hi / lo) ** fr
        part = filt(x[s * seg:(s + 1) * seg + 200], "bandpass", [fc * 0.7, min(fc * 1.4, 20000)])
        out[s * seg:s * seg + len(part)] += part[: n - s * seg]
    return out * np.sin(np.pi * np.arange(n) / SR / dur) ** 2


def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * (t / dur) ** 2) / SR) * 0.15
    return (whoosh(dur, 300, 9000, up=True) + tone) * (t / dur) ** 1.5


def impact():
    n = int(1.4 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t / 0.08)) / SR) * env(n, 0.001, 0.45)
    return boom + filt(rng.standard_normal(n), "highpass", 4000) * env(n, 0.001, 0.35) * 0.35


def pop(f0=700, f1=1500):
    n = int(0.07 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * t / 0.07) / SR) * env(n, 0.001, 0.025)


def click():
    n = int(0.012 * SR)
    return filt(rng.standard_normal(n), "highpass", 2500) * env(n, 0.0003, 0.003)


def ding():
    n = int(0.7 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1318.5 * t) + 0.5 * np.sin(2 * np.pi * 1975.5 * t)) * env(n, 0.002, 0.18)


BEAT = 0.5
ROOTS = [55.0, 43.65, 65.41, 49.0]
CHORDS = [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [261.63, 329.63, 392.0], [196.0, 246.94, 293.66]]

# calm part
if DROP > 0.5:
    add(pad([110.0, 164.81], DROP), 0.0, 0.22)
    for b in range(int(DROP / BEAT)):
        t = b * BEAT
        add(kick(), t, 0.65)
        add(hat(), t + BEAT / 2, 0.22, 0.3)
    if DROP >= 2.0:
        add(riser(1.3), DROP - 1.35, 0.55)
    add(impact(), DROP, 0.8)

# groove
start = DROP
for b in range(int((DUR - start) / BEAT) + 1):
    t = start + b * BEAT
    if t >= DUR:
        break
    bar = int((t - start) // 2.0) % 4
    bi = b % 4
    add(kick(), t, 0.9)
    add(hat(open_=(bi % 2 == 1)), t + BEAT / 2, 0.28, 0.3)
    add(hat(), t + BEAT * 0.75, 0.12, -0.3)
    if bi in (1, 3):
        add(clap(), t, 0.45)
    add(bass(ROOTS[bar]), t, 0.55)
    add(bass(ROOTS[bar] * 2, 0.15), t + BEAT / 2, 0.4)
    if bi in (0, 2):
        add(stab(CHORDS[bar]), t + BEAT * 0.5, 0.2, -0.25 if bi == 0 else 0.25)

SFX = {
    "pop": lambda t: add(pop(900, 1800), t, 0.35),
    "pop_small": lambda t: add(pop(700, 1400), t, 0.3),
    "pop_down": lambda t: add(pop(1200, 600), t, 0.25),
    "pop_low": lambda t: add(pop(500, 300), t, 0.3),
    "impact": lambda t: add(impact(), t, 0.6) if abs(t - DROP) > 0.05 else None,
    "impact_soft": lambda t: add(impact(), t, 0.35),
    "whoosh": lambda t: add(whoosh(0.35), t, 0.3),
    "whoosh_up": lambda t: add(whoosh(0.4, 500, 6000, up=True), t, 0.35) if abs(t + 0.3 - DROP) > 0.05 else None,
    "click": lambda t: add(click(), t, 0.7),
    "tick": lambda t: add(click(), t, 0.35, -0.4),
    "tick_soft": lambda t: add(click(), t, 0.35, 0.2),
    "ding": lambda t: add(ding(), t, 0.22),
    "dissonant": lambda t: add(stab([440.0, 466.16], 0.3, 1800), t, 0.35),
    "chord": lambda t: add(stab(CHORDS[0], 1.5, 3200), t, 0.25),
    "chord_end": lambda t: add(stab(CHORDS[2], 2.0, 3200), t, 0.25),
}
for e in cues["events"]:
    f = SFX.get(e["kind"])
    if f:
        f(float(e["t"]))

fade = np.ones(N); fn = int(0.8 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
mix = np.stack([L * fade, R * fade], axis=1)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) * 0.85
wavfile.write(OUT, SR, (mix * 32767).astype(np.int16))
print(OUT, f"{DUR:.1f}s, drop at {DROP:.1f}s, {len(cues['events'])} sfx")
