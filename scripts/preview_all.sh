#!/usr/bin/env bash
# Preview key frames (80% into each scene) for the given episodes and make one contact sheet per episode.
set -euo pipefail
cd "$(dirname "$0")/.."
for EP in "$@"; do
  ID=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['id'])" "$EP")
  TIMES=$(python3 -c "
import json,sys
import re
src=open('template/template.js').read()
D={k:float(v) for k,v in re.findall(r'(\w+): ([0-9.]+)', re.search(r'const DUR = \{(.*?)\};', src, re.S).group(1))}
t=0;out=[]
for s in json.load(open(sys.argv[1]))['scenes']:
    d=s.get('dur',D[s['type']]); out.append(f'{t+d*0.82:.2f}'); t+=d
print(' '.join(out))" "$EP")
  python3 scripts/emoji.py "$EP"
  rm -f build/${ID}_*.png
  node scripts/render.mjs preview "$EP" $TIMES | grep -v -E '\.(tag|small|nocode) ' || true
  montage build/${ID}_*.png -tile 8x1 -geometry 270x480+4+4 -background '#888' build/sheet_${ID}.png
done
