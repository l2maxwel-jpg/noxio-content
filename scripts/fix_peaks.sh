#!/usr/bin/env bash
# Re-mux the soundtrack of finished episodes whose true peak is above -1 dBTP (AAC can overshoot the limiter).
# Usage: scripts/fix_peaks.sh e13 [e14 ...]   (needs build/<id>.silent.mp4 and build/<id>.wav)
set -euo pipefail
cd "$(dirname "$0")/.."
tp() { ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Peak:/{p=$2} END{print p}'; }
for ID in "$@"; do
  peak=$(tp "videos/$ID.mp4")
  if awk -v p="$peak" 'BEGIN{exit !(p <= -1.0)}'; then echo "$ID ok ($peak dBTP)"; continue; fi
  for chain in "lowpass=f=16000,loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,alimiter=limit=0.62:level=disabled" \
               "lowpass=f=16000,loudnorm=I=-14:TP=-2:LRA=11,aresample=48000,alimiter=limit=0.72:level=disabled" \
               "lowpass=f=15000,loudnorm=I=-14.5:TP=-2.5:LRA=11,aresample=48000,alimiter=limit=0.55:level=disabled"; do
    ffmpeg -hide_banner -y -loglevel error -i "build/$ID.silent.mp4" -i "build/$ID.wav" -map 0:v -map 1:a -c:v copy \
      -af "$chain" -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart "build/$ID.fix.mp4"
    peak=$(tp "build/$ID.fix.mp4")
    if awk -v p="$peak" 'BEGIN{exit !(p <= -1.0)}'; then mv "build/$ID.fix.mp4" "videos/$ID.mp4"; echo "$ID fixed ($peak dBTP)"; break; fi
  done
done
