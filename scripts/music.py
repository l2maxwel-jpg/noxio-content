"""Soundtrack for a Noxio episode, driven by the cues the template exports.

With "music": {"track": "mixkit:<id>"[, "start": s]} in the episode, the bed is a real Mixkit track (scripts/track_bed.py:
cut so the drop lands on a loud downbeat, muffled before the drop); otherwise it is synthesized as below.

Usage: python3 scripts/music.py build/<id>.cues.json build/<id>.wav

Tempo, key and progression vary per episode (from its id). Calm part (kick + hats + pad) until cues["drop"], riser into the drop, then a full groove
(kick, clap, hats, bass, chord stabs). SFX are placed at the times the visuals request.
"""
import json
import os
import sys
import zlib

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
# Every episode gets its own arrangement (tempo, key, chord progression, hat pattern), picked from its id,
# so two videos never share the same track.
EP_ID = os.path.basename(sys.argv[1]).split(".")[0]
SEED = zlib.crc32(EP_ID.encode())
rng = np.random.default_rng(SEED)


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


PROGS = [  # (semitones from A, quality)
    [(0, "m"), (-4, "M"), (3, "M"), (-2, "M")],   # Am F C G
    [(0, "m"), (-2, "M"), (-4, "M"), (-5, "M")],  # Am G F E
    [(3, "M"), (-2, "M"), (0, "m"), (-4, "M")],   # C G Am F
    [(0, "m"), (3, "M"), (-2, "M"), (-4, "M")],   # Am C G F
    [(-4, "M"), (-2, "M"), (0, "m"), (0, "m")],   # F G Am Am
]
# An episode can pin its own variant ("music": {"bpm": 120, "transpose": 2, "prog": 3, "hats16": true}, passed through
# the cues) when two episodes would otherwise share one — scripts/check_unique.mjs reports that.
MUS = cues.get("music") or {}
BPM = MUS.get("bpm", [116, 120, 124, 128][SEED % 4])
TRANSPOSE = MUS.get("transpose", [0, 2, -2, 3, -3, 1][(SEED // 4) % 6])
PROG = PROGS[MUS.get("prog", (SEED // 24) % len(PROGS))]
HATS16 = MUS.get("hats16", (SEED // 120) % 2 == 1)
BEAT = 60.0 / BPM
f = lambda base, semi: base * 2 ** (semi / 12)
ROOTS = [f(55.0, s + TRANSPOSE) for s, _ in PROG]
CHORDS = [[f(220.0, s + TRANSPOSE + i) for i in (0, 3 if q == "m" else 4, 7)] for s, q in PROG]
PAD = [f(110.0, PROG[0][0] + TRANSPOSE), f(164.81, PROG[0][0] + TRANSPOSE)]

TRACK = str(MUS.get("track") or "").replace("mixkit:", "")
TRACK_INFO = None
if TRACK:   # the track is kept apart; the effects go into L/R and are mixed under it at the end
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from track_bed import bed
    BL, BR, TRACK_INFO = bed(TRACK, DUR, DROP, MUS.get("start"))

# calm part (synthesized bed only)
if DROP > 0.5 and not TRACK:
    add(pad(PAD, DROP), 0.0, 0.22)
    for b in range(int(DROP / BEAT)):
        t = b * BEAT
        add(kick(), t, 0.65)
        add(hat(), t + BEAT / 2, 0.22, 0.3)
    if DROP >= 2.0:
        add(riser(1.3), DROP - 1.35, 0.55)
    add(impact(), DROP, 0.8)

# groove
start = DROP
for b in range(0 if TRACK else int((DUR - start) / BEAT) + 1):
    t = start + b * BEAT
    if t >= DUR:
        break
    bar = int((t - start) // (4 * BEAT)) % 4
    bi = b % 4
    add(kick(), t, 0.9)
    add(hat(open_=(bi % 2 == 1)), t + BEAT / 2, 0.28, 0.3)
    add(hat(), t + BEAT * 0.75, 0.12, -0.3)
    if HATS16:
        add(hat(), t + BEAT * 0.25, 0.09, 0.15)
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
if TRACK:   # over a real track: no pitched stabs or bells (they would clash with its key), ticks barely there
    for k in ("chord", "chord_end", "dissonant", "ding"):
        SFX.pop(k)
    SFX["tick"] = lambda t: add(click(), t, 0.12, -0.4)
    SFX["tick_soft"] = lambda t: add(click(), t, 0.12, 0.2)
    SFX["impact"] = lambda t: add(impact(), t, 0.35) if abs(t - DROP) > 0.05 else None
    if DROP > 0.5:
        add(impact(), DROP, 0.4)
for e in cues["events"]:
    f = SFX.get(e["kind"])
    if f:
        f(float(e["t"]))

fade = np.ones(N); fn = int(0.8 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
if TRACK:
    # the music leads: the effects sit about 7 dB under the track (bed RMS 0.16 vs effects at their gains x 0.45),
    # the track dips a little under each whoosh and impact so the cut is felt, and a soft limiter catches the peaks
    duck = np.ones(N)
    for e in cues["events"]:
        if e["kind"] in ("whoosh", "whoosh_up", "impact", "impact_soft"):
            i = int(float(e["t"]) * SR); n = int(0.35 * SR)
            if 0 <= i < N:
                seg = 1 - 0.25 * np.sin(np.pi * np.arange(min(n, N - i)) / n)
                duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], seg)
    mix = np.stack([(BL * duck * 1.0 + L * 0.45) * fade, (BR * duck * 1.0 + R * 0.45) * fade], axis=1)
    mix = mix / (np.sqrt(np.mean(mix[int(DROP * SR):] ** 2)) + 1e-9) * 0.2
    mix = np.tanh(mix / 0.8) * 0.8
else:
    mix = np.stack([L * fade, R * fade], axis=1)
    mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4) * 0.85
wavfile.write(OUT, SR, (mix * 32767).astype(np.int16))
if TRACK:
    print(OUT, f"{DUR:.1f}s, drop at {DROP:.1f}s, {len(cues['events'])} sfx, track mixkit:{TRACK} from {TRACK_INFO['start']:.2f}s ({TRACK_INFO['tempo']:.0f} bpm)")
else:
    print(OUT, f"{DUR:.1f}s, drop at {DROP:.1f}s, {len(cues['events'])} sfx, {BPM} bpm, transpose {TRANSPOSE:+d}, prog {PROGS.index(PROG)}")
