#!/usr/bin/env python3
"""Download a free LottieFiles animation into assets/lottie/<name>.json and note it in assets/lottie/SOURCES.md.

Only animations marked "Free to use under the Lottie Simple License" are accepted (commercial use, no attribution;
assets/lottie/LICENSE.md carries the license, which must travel with the files). After downloading it renders
build/lottie/<name>_sheet.png (6 frames on light and dark) — check it for text, logos, brands or currencies.

  scripts/fetch_lottie.py w50 https://lottiefiles.com/free-animation/order-packed-qaUrAl6RvN [--tint brand|emerald|teal]

--tint recolours saturated colours into the Noxio range (emerald #11B981 .. teal #0098B7), keeping lightness, so an
animation fits the brand; greys, white and black stay.
"""
import argparse, colorsys, io, json, os, re, subprocess, sys, urllib.request, zipfile, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (noxio-content)'}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def tint_rgb(r, g, b, mode):
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if s < .2 or l > .96 or l < .06:
        return r, g, b
    hue = {'emerald': 160, 'teal': 192}.get(mode)
    if hue is None:                      # brand: spread the original hues across emerald..teal, keep their order
        hue = 158 + (h * 360) / 360 * 36
    return colorsys.hls_to_rgb(hue / 360, l, max(s, .55))


def tint(node, mode):
    if isinstance(node, dict):
        ty = node.get('ty')
        if ty in ('fl', 'st') and isinstance(node.get('c'), dict):
            k = node['c'].get('k')
            if node['c'].get('a') and isinstance(k, list):
                for kf in k:
                    for key in ('s', 'e'):
                        if isinstance(kf, dict) and isinstance(kf.get(key), list) and len(kf[key]) >= 3:
                            kf[key][:3] = tint_rgb(*kf[key][:3], mode)
            elif isinstance(k, list) and len(k) >= 3 and all(isinstance(x, (int, float)) for x in k[:3]):
                k[:3] = tint_rgb(*k[:3], mode)
        if ty in ('gf', 'gs') and isinstance(node.get('g'), dict):
            n, kk = node['g'].get('p', 0), node['g'].get('k', {})
            def fix(arr):
                for i in range(n):
                    if 4 * i + 3 < len(arr):
                        arr[4 * i + 1:4 * i + 4] = tint_rgb(*arr[4 * i + 1:4 * i + 4], mode)
            if kk.get('a') and isinstance(kk.get('k'), list):
                for kf in kk['k']:
                    for key in ('s', 'e'):
                        if isinstance(kf, dict) and isinstance(kf.get(key), list):
                            fix(kf[key])
            elif isinstance(kk.get('k'), list):
                fix(kk['k'])
        if isinstance(node.get('sc'), str) and re.fullmatch(r'#[0-9a-fA-F]{6}', node['sc']):
            rgb = [int(node['sc'][i:i + 2], 16) / 255 for i in (1, 3, 5)]
            node['sc'] = '#' + ''.join(f'{round(v * 255):02x}' for v in tint_rgb(*rgb, mode))
        for v in node.values():
            tint(v, mode)
    elif isinstance(node, list):
        for v in node:
            tint(v, mode)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('name')
    ap.add_argument('page')
    ap.add_argument('--tint', choices=['brand', 'emerald', 'teal'])
    a = ap.parse_args()
    html = get(a.page).decode('utf8', 'replace')
    if 'Free to use under the Lottie Simple License' not in html:
        sys.exit(f'{a.page}: not marked "Free to use under the Lottie Simple License" — not usable')
    gif = re.search(r'"contentUrl":"(https://assets-v2\.lottiefiles\.com/a/([0-9a-f-]+)/[^"]+)"', html)
    if not gif:
        sys.exit('no animation found on the page')
    folder = gif.group(2)
    urls = sorted(set(re.findall(r'https://assets-v2\.lottiefiles\.com/a/%s/[A-Za-z0-9_-]+\.(?:json|lottie)' % folder, html)))
    if not urls:
        sys.exit('no .lottie/.json link for this animation')
    url = next((u for u in urls if u.endswith('.json')), urls[0])
    raw = get(url)
    if url.endswith('.lottie'):
        z = zipfile.ZipFile(io.BytesIO(raw))
        names = [n for n in z.namelist() if n.startswith('animations/') and n.endswith('.json')]
        data = json.loads(z.read(names[0]))
        for asset in data.get('assets', []):   # images packed next to the animation -> inline data URIs
            if asset.get('p') and not asset.get('e') and ('images/' + asset['p']) in z.namelist():
                ext = asset['p'].rsplit('.', 1)[-1].lower()
                asset['p'] = f'data:image/{"jpeg" if ext in ("jpg", "jpeg") else ext};base64,' + base64.b64encode(z.read('images/' + asset['p'])).decode()
                asset['u'], asset['e'] = '', 1
    else:
        data = json.loads(raw)
    if any(l.get('ty') == 5 for l in data.get('layers', [])):
        print('warning: the animation has text layers — check the words on the sheet', file=sys.stderr)
    if a.tint:
        tint(data, a.tint)
    out_dir = os.path.join(ROOT, 'assets', 'lottie')
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f'{a.name}.json')
    with open(out, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    author = re.search(r'"creator":\{"@type":"Person","name":"([^"]+)"', html)
    src = os.path.join(out_dir, 'SOURCES.md')
    rows = open(src).read().splitlines() if os.path.exists(src) else [
        '# Lottie animations', '', 'Lottie Simple License (see LICENSE.md). Kept for the record; not shown on the videos.', '',
        '| File | Author | Page | Tint |', '| --- | --- | --- | --- |']
    rows = [r for r in rows if not r.startswith(f'| {a.name}.json |')]
    rows.append(f'| {a.name}.json | {author.group(1) if author else "?"} | {a.page} | {a.tint or "-"} |')
    open(src, 'w').write('\n'.join(rows) + '\n')
    w, h, fr = data.get('w'), data.get('h'), data.get('fr')
    print(f'{out}: {w}x{h}, {fr} fps, {(data.get("op", 0) - data.get("ip", 0)) / (fr or 30):.1f}s, {os.path.getsize(out) // 1024} KB')
    subprocess.run(['node', os.path.join(ROOT, 'scripts', 'lottie_sheet.mjs'), out], check=True)


if __name__ == '__main__':
    main()
