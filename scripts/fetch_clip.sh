#!/usr/bin/env bash
# Download a vertical stock clip from Mixkit for a video cover into build/mixkit/<mixkit id>.mp4 and note it in
# assets/clips.md. Only clips under the "Stock Video Free License" are accepted (the "Restricted" one forbids business use).
# The clip itself is never committed: Mixkit's terms forbid making the items available to others as files, so the repo keeps
# only the id and the page, and scripts/render.mjs downloads the clip again when build/ is empty.
# Usage: scripts/fetch_clip.sh e30 "https://mixkit.co/free-stock-video/hands-of-two-people-sealing-a-package-with-tape-42137/"
#        scripts/fetch_clip.sh - <page url>     (download only, e.g. to preview a clip before choosing it)
# Writes build/mixkit/<id>_sheet.jpg (6 frames) — look at it for signs, brands, logos or currencies before using the clip.
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; PAGE="$2"
ID=$(printf '%s' "$PAGE" | grep -oE -- '-[0-9]+/?$' | tr -dc 0-9)
[ -n "$ID" ] || { echo "no Mixkit id in $PAGE" >&2; exit 1; }
mkdir -p build/mixkit
HTML="build/mixkit/$ID.html"
curl -sSfL -m 60 -o "$HTML" "$PAGE"
grep -q '"license":"https://mixkit.co/license/#videoFree"' "$HTML" && grep -q 'data-license="videoFree"' "$HTML" \
  && ! grep -q 'data-license="videoRestricted"' "$HTML" \
  || { echo "clip $ID is not under the Mixkit Stock Video Free License — not usable for Noxio" >&2; exit 1; }
OUT="build/mixkit/$ID.mp4"
if [ ! -s "$OUT" ]; then
  for R in 1080 720; do
    curl -sSfL -m 300 -o "$OUT.part" "https://assets.mixkit.co/videos/$ID/$ID-$R.mp4" 2>/dev/null && break || rm -f "$OUT.part"
  done
  [ -s "$OUT.part" ] || { echo "no download for clip $ID" >&2; exit 1; }
  mv "$OUT.part" "$OUT"
fi
read -r W H D <<< "$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height:format=duration -of csv=p=0 "$OUT" | tr ',\n' '  ')"
[ "$H" -gt "$W" ] || echo "warning: clip $ID is not vertical (${W}x${H}); the cover crops its middle" >&2
# contact sheet: 6 frames across the clip
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$OUT" -vf "fps=6/$D,scale=270:-2,tile=6x1:padding=6:color=white" -frames:v 1 "build/mixkit/${ID}_sheet.jpg"
if [ "$EP" != "-" ]; then
  [ -f assets/clips.md ] || printf '# Cover clips\n\nMixkit Stock Video Free License (commercial use, no attribution). The clips are not kept in the repo;\nscripts/render.mjs downloads them from the page below. Kept for the record; not shown on the videos.\n\n| Episode | Mixkit id | Page |\n| --- | --- | --- |\n' > assets/clips.md
  grep -v "^| $EP |" assets/clips.md > build/clips.tmp || true
  mv build/clips.tmp assets/clips.md
  echo "| $EP | $ID | ${PAGE%/}/ |" >> assets/clips.md
fi
echo "mixkit:$ID ${W}x${H} ${D}s -> $OUT, sheet build/mixkit/${ID}_sheet.jpg"
