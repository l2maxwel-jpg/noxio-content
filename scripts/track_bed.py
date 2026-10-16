"""Music bed from a Mixkit track for scripts/music.py (episode "music": {"track": "mixkit:<id>", "start": <s>}).

The cut is chosen so that the episode's drop (the first non-calm scene) lands on a downbeat where the track gets loud and
stays loud until the end, without a break (a stop of the band would sound like a glitch); before the drop the track plays
muffled (low-pass at 1.5 kHz, about 3 dB down), the filter opens over the last beats and the full track comes in on the drop.
"start" pins the cut (seconds into the track) — music.py prints the start it chose, so a good cut can be kept.
"""
import os
import sys

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def track_path(tid):
    sys.path.insert(0, os.path.join(ROOT, 'scripts'))
    from fetch_music import ensure, page_for
    out = os.path.join(ROOT, 'build', 'music', f'{tid}.mp3')
    if not os.path.exists(out):
        page = page_for(tid)
        if not page:
            sys.exit(f'track {tid} is not in assets/music.md — fetch it with scripts/fetch_music.py')
        ensure(tid, page, record=False)
    return out


def analyse(path):
    import librosa
    y, sr = librosa.load(path, sr=22050, mono=True)
    hop = 512
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, hop_length=hop, units='time')
    tempo = float(np.atleast_1d(tempo)[0])
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop)[0]
    k = max(1, int(sr / hop))                                   # ~1 s smoothing
    energy = np.convolve(rms, np.ones(k) / k, mode='same')
    energy = energy / (np.percentile(energy, 90) + 1e-9)
    times = np.arange(len(energy)) * hop / sr
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    ot = np.arange(len(onset)) * hop / sr
    strength = np.interp(beats, ot, onset) if len(beats) else np.array([])
    phase = max(range(4), key=lambda p: strength[p::4].sum()) if len(beats) >= 8 else 0
    downs = beats[phase::4]
    E = lambda a, b: float(energy[(times >= a) & (times < b)].mean()) if b > a else 0.0
    ks = max(1, int(.4 * sr / hop))                             # ~0.4 s: catches the band stopping for a moment
    short = np.convolve(rms, np.ones(ks) / ks, mode='same')
    short = short / (np.median(short) + 1e-9)
    sections = [float(b) for b in downs if E(b, b + 4) > 0.8 and E(b, b + 4) - E(b - 4, b) > 0.12]
    return {'tempo': tempo, 'beats': beats, 'downs': downs, 'times': times, 'energy': energy, 'short': short,
            'length': len(y) / sr, 'sections': sections, 'E': E}


def choose_start(a, drop, dur):
    """Seconds into the track where the episode starts."""
    return best_cut(a, drop, dur)[0]


def best_cut(a, drop, dur):
    """(start, score): the best cut and how good it is (higher is better; below ~1 the track does not suit the episode)."""
    E, times, energy = a['E'], a['times'], a['energy']
    tail = dur - drop
    best, best_s = None, -1e9
    for b in a['downs']:
        if b - drop < 0 or b + tail > a['length'] - 1.5:
            continue
        win = energy[(times >= b) & (times < b + tail)]
        if not len(win):
            continue
        after, low = float(win.mean()), float(np.percentile(win, 10))
        rise = E(b, b + 2) - E(b - 2, b)
        sw = a['short'][(times >= b - drop + .3) & (times < b + tail - 1.0)]   # intro too; the last second fades out anyway
        gap = float(sw.min()) if len(sw) else 1.0
        intro = a['short'][(times >= b - drop) & (times < b)]
        silent_intro = float(np.mean(intro < .25)) if len(intro) else 0.0
        lead = E(b - drop, b) if drop > 0.5 else after          # the intro must not be thin: the first seconds are the hook
        score = (after + 0.6 * low + (0.5 * rise if drop > 0.5 else 0) - 0.02 * b / 10   # slight preference for earlier cuts
                 - 4.0 * max(0.0, 0.45 - gap) - 1.5 * silent_intro - 1.2 * max(0.0, 0.5 - lead))
        if score > best_s:
            best, best_s = b - drop, score
    return float(best if best is not None else 0.0), float(best_s if best is not None else -9.0)


def bed(tid, dur, drop, start=None):
    """Stereo bed (L, R arrays at 44.1 kHz, dur seconds) and info."""
    import librosa
    path = track_path(tid)
    a = analyse(path)
    s = float(start) if start is not None else choose_start(a, drop, dur)
    y, _ = librosa.load(path, sr=SR, mono=False, offset=s, duration=dur + 0.1)
    if y.ndim == 1:
        y = np.stack([y, y])
    n = int(SR * dur)
    if y.shape[1] < n:
        y = np.pad(y, ((0, 0), (0, n - y.shape[1])))
    y = y[:, :n].copy()
    d = int(SR * drop)
    full_rms = np.sqrt(np.mean(y[:, d:] ** 2)) + 1e-9
    if drop > 0.6:                                              # muffled until the drop, the filter opens, then the full track
        sos = butter(2, 1500, 'low', fs=SR, output='sos')
        muff = sosfilt(sos, y[:, :d], axis=1)
        muff *= 0.7 * full_rms / (np.sqrt(np.mean(muff ** 2)) + 1e-9)    # about 3 dB under the full track
        x = np.ones(d)                                          # 1 = muffled, 0 = full
        o = min(int(SR * 1.2), d // 2)                          # the opening sweep over the last ~1.2 s
        x[d - o:] = np.linspace(1, 0.35, o) ** 1.6
        y[:, :d] = y[:, :d] * (1 - x) * 0.85 + muff * x
    fi, fo = int(0.06 * SR), int(0.9 * SR)
    env = np.ones(n)
    env[:fi] = np.linspace(0, 1, fi)
    env[-fo:] = np.linspace(1, 0, fo) ** 1.5
    y = y * env
    y = y / (np.sqrt(np.mean(y[:, d:] ** 2)) + 1e-9) * 0.16  # same loudness for every track
    return y[0], y[1], {'track': tid, 'start': s, 'tempo': a['tempo']}
