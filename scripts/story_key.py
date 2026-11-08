"""Key out the plain studio background of a Kaja look (lime/green wall) so the template can put her on our own scene.

python3 scripts/story_key.py episodes/sNN.json   -> build/story/sNN/frames_key/0001.webp ... (30 fps, RGBA)
Reads "kaja": {"video": ..., "key": {"hue": [47, 57, 100, 112], "sat": [0.22, 0.36], "erode": 1}}:
a pixel is background when its hue lies inside the hue ramp (degrees: soft in, full, full, soft out) and it is saturated
enough. Hair, skin and the white hoodie have other hues or no saturation, so they stay. Green spill on the edges is
pulled down (G <= max(R, B)). The ffmpeg chromakey filter works in UV distance and eats the face on this pale lime wall.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def alpha_of(rgb, K):
    f = rgb.astype(np.float32) / 255.0
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    mx, mn = f.max(-1), f.min(-1); d = mx - mn + 1e-6
    h = np.where(mx == r, 60 * ((g - b) / d % 6), np.where(mx == g, 60 * ((b - r) / d + 2), 60 * ((r - g) / d + 4)))
    s = d / (mx + 1e-6)
    h0, h1, h2, h3 = K.get("hue", [47, 57, 100, 112]); s0, s1 = K.get("sat", [0.22, 0.36])
    ramp = lambda x, a, c: np.clip((x - a) / (c - a), 0, 1)
    bg = np.minimum(ramp(h, h0, h1), 1 - ramp(h, h2, h3)) * ramp(s, s0, s1) * ramp(mx, 0.12, 0.25)
    return 1 - bg

def key_frame(im, K):
    rgb = np.asarray(im.convert("RGB"))
    a = alpha_of(rgb, K)
    am = Image.fromarray((a * 255).astype(np.uint8))
    for _ in range(K.get("erode", 1)): am = am.filter(ImageFilter.MinFilter(3))
    am = am.filter(ImageFilter.GaussianBlur(K.get("soft", 0.8)))
    out = rgb.astype(np.int16).copy()
    out[..., 1] = np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2]))   # despill
    o = Image.fromarray(out.astype(np.uint8)); o.putalpha(am)
    return o

if __name__ == "__main__":
    EP = json.load(open(sys.argv[1])); K = EP["kaja"].get("key", {})
    src = os.path.join(ROOT, EP["kaja"]["video"]); out = os.path.join(ROOT, "build", "story", EP["id"], "frames_key")
    os.makedirs(out, exist_ok=True)
    tmp = os.path.join(out, "_raw"); os.makedirs(tmp, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-vf",
                    "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920", "-q:v", "1",
                    os.path.join(tmp, "%04d.jpg")], check=True)
    names = sorted(os.listdir(tmp))
    for i, n in enumerate(names):
        key_frame(Image.open(os.path.join(tmp, n)), K).save(os.path.join(out, n.replace(".jpg", ".webp")), quality=88, method=4)
        os.remove(os.path.join(tmp, n))
        if i % 150 == 0: print(f"{i}/{len(names)}", flush=True)
    os.rmdir(tmp)
    json.dump({"video": EP["kaja"]["video"], "size": os.path.getsize(src), "key": K}, open(os.path.join(out, "key.json"), "w"))
    print("done", len(names), "frames")
