"""Tighten Kaja's voice track BEFORE the avatar video is generated (saves HeyGen credits: a shorter take costs less).

Same idea as story_prep.py, but on the TTS audio instead of the finished video: long pauses are cut down and the whole
take is sped up a little; HeyGen then lip-syncs Kaja to the tightened audio, so the video needs no jump cuts.

Reads episodes/sNN.json -> "tts": {
  "audio": "build/story/sNN/tts.mp3",          # from create_speech_without_player
  "raw": "build/story/sNN/words_raw.json",      # [[word, start, end], ...] from the same call
  "tempo": 1.08, "pause": 0.16,                 # a gap longer than pause is cut down to it ...
  "hold": {"3": 0.5},                           # ... except after these word indices (gap kept at this length)
  "show": {"lajwie": "live'ie"}, "merge": [[i0, i1, "text"]], "key": [...]}   # captions, as in story_prep.py
Writes build/story/sNN/voice.mp3 (upload it to HeyGen), words.json ([text, start, end, key, brk]) and cuts.json.
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = json.load(open(sys.argv[1])); T = EP["tts"]
OUT = os.path.join(ROOT, "build", "story", EP["id"])
raw = json.load(open(os.path.join(ROOT, T["raw"])))
src = os.path.join(ROOT, T["audio"])
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                           capture_output=True, text=True).stdout)
P, tempo = T["pause"], T["tempo"]
hold = {int(k): v for k, v in T.get("hold", {}).items()}

segs, a = [], 0.0
for i in range(len(raw) - 1):
    gap = raw[i + 1][1] - raw[i][2]
    want = hold.get(i, P)
    if gap <= want + 0.06: continue
    segs.append((a, raw[i][2] + want / 2)); a = raw[i + 1][1] - want / 2
segs.append((a, min(dur, raw[-1][2] + 0.45)))

def remap(t):
    pos = 0.0
    for s0, s1 in segs:
        if t <= s0: return pos / tempo
        if t <= s1: return (pos + t - s0) / tempo
        pos += s1 - s0
    return pos / tempo
joins, pos = [], 0.0
for s0, s1 in segs[:-1]:
    pos += s1 - s0; joins.append(round(pos / tempo, 3))

# 0.25 s of silence in front: HeyGen starts the take on a still face, the first word is not clipped
fc, parts = [], []
for k, (s0, s1) in enumerate(segs):
    fc.append(f"[0:a]atrim={s0:.3f}:{s1:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,"
              f"afade=t=out:st={max(0, s1 - s0 - 0.012):.3f}:d=0.012[a{k}]")
    parts.append(f"[a{k}]")
fc.append("".join(parts) + f"concat=n={len(segs)}:v=0:a=1[ac]")
fc.append(f"[ac]atempo={tempo},adelay=250:all=1,aresample=44100[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", ";".join(fc), "-map", "[a]",
                "-c:a", "libmp3lame", "-b:a", "192k", os.path.join(OUT, "voice.mp3")], check=True)
LEAD = 0.25

show, key = T.get("show", {}), set(T.get("key", []))
merge = {m[0]: m for m in T.get("merge", [])}
words, i = [], 0
R = lambda t: round(remap(t) + LEAD, 3)
while i < len(raw):
    if i in merge:
        m0, m1, text = merge[i]; brk = 1 if raw[m1][0][-1] in ",.:?!" else 0
        words.append([text, R(raw[m0][1]), R(raw[m1][2]), 1 if text in key else 0, brk]); i = m1 + 1; continue
    w, s, e = raw[i]; bare = w.strip(",.:?!—"); brk = 1 if w[-1] in ",.:?!" else 0
    text = show.get(bare, bare)
    words.append([text, R(s), R(e), 1 if bare in key or text in key else 0, brk]); i += 1
json.dump(words, open(os.path.join(OUT, "words.json"), "w"), ensure_ascii=False)
total = round(remap(segs[-1][1]) + LEAD, 3)
json.dump({"joins": [round(j + LEAD, 3) for j in joins], "duration": total, "segments": segs, "tempo": tempo, "lead": LEAD},
          open(os.path.join(OUT, "cuts.json"), "w"), indent=1)
print(f"{len(segs)} segments, {dur:.2f}s -> {total:.2f}s")
for j, w in enumerate(words): print(j, w)
