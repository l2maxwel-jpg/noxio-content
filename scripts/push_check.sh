#!/usr/bin/env bash
# Commit and push the given episodes' videos and covers, then check that raw.githubusercontent.com serves the same bytes.
# Usage: scripts/push_check.sh "message" e10 e26 ...
set -euo pipefail
cd "$(dirname "$0")/.."
MSG="$1"; shift
for ID in "$@"; do git add "videos/$ID.mp4"; [ -f "assets/covers/$ID.jpg" ] && git add "assets/covers/$ID.jpg"; done
git add episodes assets/photos 2>/dev/null || true
git commit -q -m "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Kr1mLf3vFnABTkxhKi5XWi" && git push -q origin main
sleep 15
RAW=https://raw.githubusercontent.com/l2maxwel-jpg/noxio-content/main
for ID in "$@"; do
  v=$(curl -s -o /dev/null -w '%{size_download}' "$RAW/videos/$ID.mp4"); lv=$(stat -c %s "videos/$ID.mp4")
  c=-; lc=-; if [ -f "assets/covers/$ID.jpg" ]; then c=$(curl -s -o /dev/null -w '%{size_download}' "$RAW/assets/covers/$ID.jpg"); lc=$(stat -c %s "assets/covers/$ID.jpg"); fi
  [ "$v" = "$lv" ] && [ "$c" = "$lc" ] && echo "$ID ok" || echo "$ID MISMATCH video $v/$lv cover $c/$lc"
done
