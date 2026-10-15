#!/usr/bin/env bash
# Save a still of the episode's opening photo cover as assets/covers/<id>.jpg — the Reel thumbnail.
# Does nothing when the episode does not open with a `cover` scene that has a `photo`.
# Usage: scripts/cover_still.sh episodes/e09.json
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"
read -r ID T < <(python3 -c "
import json,sys
d=json.load(open(sys.argv[1])); s=d['scenes'][0]
print(d['id'], f\"{s.get('dur',2.8)-0.25:.2f}\" if s['type']=='cover' and 'photo' in s else '-')" "$EP")
[ "$T" = "-" ] && exit 0
node scripts/render.mjs preview "$EP" "$T" > /dev/null
TS=$(printf "%05s" "$T" | tr ' ' 0)
convert "build/${ID}_${TS}.png" -quality 90 "assets/covers/$ID.jpg"
echo "cover assets/covers/$ID.jpg"
