"""Word timings for a voice track when the TTS call returned none (HeyGen Voice engine, e.g. the RU voice).

python3 scripts/story_align.py <audio> "<script text>" <out words_raw.json>
Recognises the audio with a local sherpa-onnx Russian zipformer (model from the k2-fsa/sherpa-onnx GitHub release
"asr-models", unpacked to /home/claude/models/sherpa-onnx-small-zipformer-ru-2024-09-18), builds recognised words with times from
the token timestamps, then maps the SCRIPT's words onto them (difflib), interpolating where recognition differs.
Output: [[word with punctuation, start, end], ...] like create_speech_without_player's word_timestamps.
"""
import difflib, json, os, re, subprocess, sys, wave
import numpy as np, sherpa_onnx

M = os.environ.get("RU_ASR", "/home/claude/models/sherpa-onnx-small-zipformer-ru-2024-09-18")
audio, text, out = sys.argv[1:4]
tmp = out + ".16k.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", audio, "-ac", "1", "-ar", "16000", tmp], check=True)
w = wave.open(tmp); sm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768; dur = len(sm) / 16000
rec = sherpa_onnx.OfflineRecognizer.from_transducer(encoder=f"{M}/encoder.onnx", decoder=f"{M}/decoder.onnx", joiner=f"{M}/joiner.onnx",
                                                    tokens=f"{M}/tokens.txt", num_threads=4, decoding_method="greedy_search")
# the model fails on long inputs: decode pause-to-pause chunks of at most ~9 s
env0 = np.sqrt(np.convolve(sm ** 2, np.ones(800) / 800, "same")); quiet = env0 < 0.03 * env0.max()
cuts, i, n = [0], 0, len(sm)
while n - cuts[-1] > 9 * 16000:
    lo, hi = cuts[-1] + 3 * 16000, cuts[-1] + 9 * 16000
    q = np.where(quiet[lo:hi])[0]
    if not len(q): cuts.append(hi); continue
    runs = np.split(q, np.where(np.diff(q) > 1)[0] + 1); best = max(runs, key=len)   # longest pause in the window
    cuts.append(lo + int(best[len(best) // 2]))
cuts.append(n)
class R: tokens = []; timestamps = []
r = R()
for c0, c1 in zip(cuts, cuts[1:]):
    st = rec.create_stream(); st.accept_waveform(16000, sm[c0:c1]); rec.decode_stream(st)
    toks = list(st.result.tokens)
    if toks and r.tokens and not toks[0].startswith("▁"): toks[0] = "▁" + toks[0]
    r.tokens += toks; r.timestamps += [t + c0 / 16000 for t in st.result.timestamps]
os.remove(tmp)
rw = []                                   # recognised words: [text, start]
for tok, t in zip(r.tokens, r.timestamps):
    if tok.startswith("▁") or tok.startswith(" ") or not rw: rw.append([tok.strip("▁ "), t])
    else: rw[-1][0] += tok
rw = [x for x in rw if x[0]]
norm = lambda s: re.sub(r"[^a-zа-я0-9]", "", s.lower().replace("ё", "е"))
sw = text.split()
a, b = [norm(x) for x in sw], [norm(x[0]) for x in rw]
start = [None] * len(sw)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): start[i1 + k] = rw[j1 + k][1]
    elif tag == "replace" and j2 > j1:
        t0 = rw[j1][1]; t1 = rw[j2][1] if j2 < len(rw) else dur
        L = np.cumsum([0] + [max(1, len(x)) for x in a[i1:i2]])
        for k in range(i2 - i1): start[i1 + k] = t0 + (t1 - t0) * L[k] / L[-1]
known = [(i, s) for i, s in enumerate(start) if s is not None]
for i in range(len(sw)):                  # words the recogniser dropped: spread between the neighbours by length
    if start[i] is None:
        p = max([k for k in known if k[0] < i], default=(-1, 0.0)); n = min([k for k in known if k[0] > i], default=(len(sw), dur))
        L = np.cumsum([0] + [max(1, len(a[k])) for k in range(p[0] + 1, n[0])]) if n[0] - p[0] > 1 else [0, 1]
        start[i] = p[1] + (n[1] - p[1]) * (L[i - p[0] - 1] + (1 if p[0] >= 0 else 0)) / (L[-1] + 1)
# word ends: next start, pulled back to the last loud sample before it (so pauses stay pauses)
env = np.sqrt(np.convolve(sm ** 2, np.ones(320) / 320, "same")); loud = env > 0.02 * env.max()
res = []
for i, wd in enumerate(sw):
    s = start[i]; e = start[i + 1] if i + 1 < len(sw) else dur
    i0, i1 = int(s * 16000), int(e * 16000)
    seg = np.where(loud[i0:i1])[0]
    if len(seg): e = min(e, (i0 + seg[-1]) / 16000 + 0.02)
    res.append([wd, round(float(s), 3), round(float(max(e, s + 0.08)), 3)])
json.dump(res, open(out, "w"), ensure_ascii=False)
print("recognised:", " ".join(x[0] for x in rw))
for i, x in enumerate(res): print(i, x)
