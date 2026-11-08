"""Tighten a Kaja video before montage: shorten long pauses (jump cuts) and speed it up a little, keeping lip-sync.

Reads episodes/sNN.json -> "edit": {
  "raw": "build/story/sNN/words_raw.json",   # [[word, start, end], ...] from create_speech_without_player
  "tempo": 1.08,                              # speed of the whole take (video and voice together)
  "pause": 0.16,                              # a gap longer than this is cut down to it ...
  "keep": [9, 29],                            # ... except after these word indices (dramatic pauses)
  "show": {"lajwa": "live'a"},                # on-screen spelling of phonetic words
  "merge": [[20, 23, "noxio.pl"]],            # several spoken words shown as one caption word
  "key": ["zero", ...]}                       # words shown in emerald
Writes build/story/sNN/kaja_edit.mp4, words.json ([text, start, end, key]) and cuts.json (join times, new timeline).
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = json.load(open(sys.argv[1])); E = EP["edit"]
OUT = os.path.join(ROOT, "build", "story", EP["id"])
raw = json.load(open(os.path.join(ROOT, E["raw"])))
src = os.path.join(ROOT, EP["kaja"]["source"])
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
P, keep, tempo = E["pause"], set(E.get("keep", [])), E["tempo"]

# kept intervals of the original take
segs, a = [], 0.0
for i in range(len(raw) - 1):
    gap = raw[i + 1][1] - raw[i][2]
    if i in keep or gap <= P + 0.06: continue
    segs.append((a, raw[i][2] + P / 2)); a = raw[i + 1][1] - P / 2
segs.append((a, min(dur, raw[-1][2] + 0.5)))
# position of an original time inside the kept, sped-up timeline
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

# video: trim the kept parts, join them (short audio fades at each join), then speed up
parts, fc = [], []
for k, (s0, s1) in enumerate(segs):
    fc.append(f"[0:v]trim={s0:.3f}:{s1:.3f},setpts=PTS-STARTPTS[v{k}]")
    fc.append(f"[0:a]atrim={s0:.3f}:{s1:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={max(0, s1 - s0 - 0.012):.3f}:d=0.012[a{k}]")
    parts.append(f"[v{k}][a{k}]")
fc.append("".join(parts) + f"concat=n={len(segs)}:v=1:a=1[vc][ac]")
fc.append(f"[vc]setpts=PTS/{tempo},fps=30[v];[ac]atempo={tempo}[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k",
                os.path.join(OUT, "kaja_edit.mp4")], check=True)

# captions: merged words, on-screen spellings, key words
show, key = E.get("show", {}), set(E.get("key", []))
merge = {m[0]: m for m in E.get("merge", [])}
words, i = [], 0
while i < len(raw):
    if i in merge:
        m0, m1, text = merge[i]; brk = 1 if raw[m1][0][-1] in ",.:?!" else 0
        words.append([text, round(remap(raw[m0][1]), 3), round(remap(raw[m1][2]), 3), 1 if text in key else 0, brk]); i = m1 + 1; continue
    w, s, e = raw[i]; bare = w.strip(",.:?!—"); brk = 1 if w[-1] in ",.:?!" else 0
    text = show.get(bare, bare)
    words.append([text, round(remap(s), 3), round(remap(e), 3), 1 if bare in key or text in key else 0, brk]); i += 1
json.dump(words, open(os.path.join(OUT, "words.json"), "w"), ensure_ascii=False)
json.dump({"joins": joins, "duration": round(remap(segs[-1][1]), 3), "segments": segs, "tempo": tempo}, open(os.path.join(OUT, "cuts.json"), "w"), indent=1)
print(f"{len(segs)} segments, {len(joins)} jump cuts, {dur:.2f}s -> {remap(segs[-1][1]):.2f}s")
for j, w in enumerate(words): print(j, w)
