#!/usr/bin/env bash
# Build one episode end to end: render frames -> soundtrack -> mux -> videos/<id>.mp4
# Usage: scripts/make_episode.sh episodes/e02.json
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"
ID=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$EP")
[ -d node_modules ] || npm install --no-audit --no-fund >/dev/null
python3 scripts/emoji.py "$EP"
node scripts/render.mjs full "$EP"
python3 scripts/music.py "build/$ID.cues.json" "build/$ID.wav"
mkdir -p videos
ffmpeg -hide_banner -y -loglevel error -i "build/$ID.silent.mp4" -i "build/$ID.wav" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,alimiter=limit=0.72:level=disabled" -ar 48000 -c:a aac -b:a 192k -shortest \
  -movflags +faststart "videos/$ID.mp4"
scripts/fix_peaks.sh "$ID"
scripts/cover_still.sh "$EP"
ffprobe -v error -show_entries format=duration,size -of compact "videos/$ID.mp4"
