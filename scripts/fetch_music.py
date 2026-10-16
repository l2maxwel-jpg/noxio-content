#!/usr/bin/env python3
"""Download a Mixkit music track into build/music/<id>.mp3 and note it in assets/music.md.

Only tracks under the "Mixkit Stock Music Free License" are accepted (social media posts and online ads allowed; no
remixing into music-only tracks, no registering with rights management services). The license is read from the Mixkit
list page that shows the track (a genre or mood page). The mp3 is never committed — Mixkit's terms forbid handing out the
files — and scripts/music.py downloads it again from the page noted in assets/music.md when build/ is empty.

  scripts/fetch_music.py 371 https://mixkit.co/free-stock-music/house/        # note it (used by an episode)
  scripts/fetch_music.py 371 https://mixkit.co/free-stock-music/house/ --try  # download only: a candidate for assign_music.py
Prints tempo, the track's energetic sections and whether there is a voice in it (scripts/vocal_check.py; needs librosa and
onnxruntime: pip install --break-system-packages librosa onnxruntime). Mixkit answers 429 to many page requests in a row:
fetch a handful of tracks at a time.
"""
import json, os, re, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (noxio-content)'}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read()


def track_info(tid, page):
    html = get(page).decode('utf8', 'replace')
    for m in re.finditer(r'\{"@id":"[^"]*","@type":"MusicRecording".*?"datePublished":"[^"]*"', html):
        s = m.group(0)
        if f'/music/{tid}/{tid}.mp3' not in s:
            continue
        g = lambda k: (re.search(r'"%s":"([^"]*)"' % k, s) or [None, None])[1]
        return {'name': g('name'), 'artist': g('byArtist'), 'genre': g('genre'), 'license': g('license'), 'url': g('url')}
    return None


def ensure(tid, page, record=True):
    info = track_info(tid, page)
    if not info:
        sys.exit(f'track {tid} is not listed on {page}')
    if info['license'] != 'https://mixkit.co/license/#musicFree':
        sys.exit(f'track {tid} is under {info["license"]}, not the Mixkit Stock Music Free License — not usable')
    os.makedirs(os.path.join(ROOT, 'build', 'music'), exist_ok=True)
    out = os.path.join(ROOT, 'build', 'music', f'{tid}.mp3')
    if not os.path.exists(out):
        data = get(info['url'])
        open(out + '.part', 'wb').write(data)
        os.replace(out + '.part', out)
    if record:
        md = os.path.join(ROOT, 'assets', 'music.md')
        rows = open(md).read().splitlines() if os.path.exists(md) else [
            '# Music', '', 'Mixkit Stock Music Free License. The tracks are not kept in the repo; scripts/music.py downloads them',
            'from the list page below. Kept for the record; not shown on the videos.', '',
            '| Track | Name | Artist | Genre | List page |', '| --- | --- | --- | --- | --- |']
        rows = [r for r in rows if not r.startswith(f'| {tid} |')]
        rows.append(f'| {tid} | {info["name"]} | {info["artist"]} | {info["genre"]} | {page} |')
        open(md, 'w').write('\n'.join(rows) + '\n')
    return out, info


def page_for(tid):
    md = os.path.join(ROOT, 'assets', 'music.md')
    for r in (open(md).read().splitlines() if os.path.exists(md) else []):
        c = [x.strip() for x in r.split('|')]
        if len(c) > 5 and c[1] == str(tid):
            return c[5]
    return None


def note_candidate(tid, page, info, tempo, voice_ok):
    """build/music/candidates.json: tracks fetched for a batch, read by scripts/assign_music.py."""
    f = os.path.join(ROOT, 'build', 'music', 'candidates.json')
    c = json.load(open(f)) if os.path.exists(f) else {}
    c[str(tid)] = dict(info, page=page, tempo=round(tempo, 1), instrumental=voice_ok)
    json.dump(c, open(f, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    tid, page = sys.argv[1], sys.argv[2]
    out, info = ensure(tid, page, record='--try' not in sys.argv)
    print(f'mixkit:{tid} "{info["name"]}" by {info["artist"]} ({info["genre"]}) -> {out}')
    sys.path.insert(0, os.path.join(ROOT, 'scripts'))
    from track_bed import analyse
    from vocal_check import vocals, instrumental
    a = analyse(out)
    print(f'  {a["tempo"]:.0f} bpm, {a["length"]:.0f}s; loud sections start at: ' + ', '.join(f'{t:.1f}s' for t in a['sections'][:8]))
    v = vocals(out)
    print(f'  voice {v[0]:.3f} of the time, longest {v[1]:.2f}s ->', 'instrumental' if instrumental(*v) else 'VOICE — do not use')
    note_candidate(tid, page, info, a['tempo'], instrumental(*v))
