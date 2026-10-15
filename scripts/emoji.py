"""Extract the emoji used by episodes and the template strings into assets/emoji/<CODE>.svg (Noto Emoji artwork).

Headless Chromium here has no colour emoji font, so the template swaps every emoji for an <img> of these files.
Usage: python3 scripts/emoji.py [episodes/eNN.json ...]   (always also scans template/l10n.js and template/niches.js)
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITE = os.path.join(ROOT, "node_modules/@svgmoji/noto/sprites/all.svg")
OUT = os.path.join(ROOT, "assets/emoji")

# Same rule as emojify() in template.js: a pictograph, optional VS16, optional ZWJ chain or skin tone.
EMOJI = re.compile(
    "(?:[\U0001F1E6-\U0001F1FF]{2})"
    "|(?:[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿〰〽㊗㊙"
    "\U0001F000-\U0001FAFF][️]?[\U0001F3FB-\U0001F3FF]?"
    "(?:‍[☀-➿\U0001F000-\U0001FAFF][️]?[\U0001F3FB-\U0001F3FF]?)*)"
)


def code(s):
    return "-".join(f"{ord(c):X}" for c in s)


def texts(paths):
    for p in paths:
        with open(p, encoding="utf-8") as f:
            yield f.read()


def main():
    files = [os.path.join(ROOT, "template/l10n.js"), os.path.join(ROOT, "template/niches.js")] + sys.argv[1:]
    wanted = {m.group(0) for t in texts(files) for m in EMOJI.finditer(t)}
    # arrows like → are text symbols in our copy, not emoji: only keep ones with VS16 or in the emoji planes
    wanted = {w for w in wanted if "️" in w or ord(w[0]) >= 0x1F000 or w[0] in "❤✅⭐✨☀"}
    os.makedirs(OUT, exist_ok=True)
    missing = [w for w in wanted if not os.path.exists(os.path.join(OUT, code(w) + ".svg"))]
    if not missing:
        return
    sprite = open(SPRITE, encoding="utf-8").read()
    for w in missing:
        full = code(w)
        for cand in (full, full.replace("-FE0F", ""), full + "-FE0F"):
            m = re.search(r'<svg[^>]*\sid="%s"[^>]*>.*?</svg>' % re.escape(cand), sprite, re.S)
            if m:
                svg = m.group(0).replace(f' id="{cand}"', "", 1)
                if "xlink:" in svg and "xmlns:xlink" not in svg:
                    svg = svg.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ', 1)
                with open(os.path.join(OUT, full + ".svg"), "w", encoding="utf-8") as f:
                    f.write(svg)
                print("emoji", w, full)
                break
        else:
            print("emoji not found in sprite:", w, full, file=sys.stderr)


if __name__ == "__main__":
    main()
