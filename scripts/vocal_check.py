#!/usr/bin/env python3
"""Does a track have a voice in it? Runs the Silero voice detector (MIT, taken from the silero-vad wheel on PyPI) over the
whole track and prints the share of time with a voice, the longest stretch and the 95th percentile of the voice score.

  python3 scripts/vocal_check.py build/music/774.mp3 [...]

Calibrated on librosa's examples: speech 0.87 / 4.4 s / 1.00, a sung song 0.17 / 5.5 s / 0.91, instrumental jazz 0.02 / 0.5 s
/ 0.19. A track counts as instrumental when share <= 0.04, longest <= 1.2 s and p95 < 0.4 (`instrumental()`); short vocal
chops in EDM land just above and are left out on purpose. Needs onnxruntime (pip install --break-system-packages onnxruntime).
"""
import glob, os, subprocess, sys, zipfile

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, 'build', 'vad', 'silero_vad.onnx')
_session = None


def session():
    global _session
    if _session is None:
        import onnxruntime as ort
        if not os.path.exists(MODEL):
            d = os.path.dirname(MODEL)
            os.makedirs(d, exist_ok=True)
            subprocess.run([sys.executable, '-m', 'pip', 'download', 'silero-vad', '--no-deps', '-q', '-d', d], check=True)
            z = zipfile.ZipFile(sorted(glob.glob(os.path.join(d, 'silero_vad-*.whl')))[-1])
            open(MODEL, 'wb').write(z.read('silero_vad/data/silero_vad.onnx'))
        _session = ort.InferenceSession(MODEL)
    return _session


def vocals(path):
    import librosa
    y, _ = librosa.load(path, sr=16000, mono=True)
    s = session()
    state = np.zeros((2, 1, 128), np.float32); ctx = np.zeros((1, 64), np.float32); probs = []
    for i in range(0, len(y) - 512, 512):
        x = np.concatenate([ctx, y[i:i + 512][None, :].astype(np.float32)], axis=1)
        out, state = s.run(None, {'input': x, 'state': state, 'sr': np.array(16000, dtype=np.int64)})
        ctx = x[:, -64:]; probs.append(float(out[0, 0]))
    p = np.array(probs); on = p > .6
    run = best = 0
    for v in on:
        run = run + 1 if v else 0; best = max(best, run)
    return float(on.mean()), best * 512 / 16000, float(np.percentile(p, 95))


def instrumental(share, longest, p95):
    return share <= .04 and longest <= 1.2 and p95 < .4


if __name__ == '__main__':
    for f in sys.argv[1:]:
        v = vocals(f)
        print(f'{f}: voice {v[0]:.3f} of the time, longest {v[1]:.2f}s, p95 {v[2]:.2f} ->',
              'instrumental' if instrumental(*v) else 'VOICE — do not use')
