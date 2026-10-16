#!/usr/bin/env python3
"""Give each episode its own Mixkit track and the best cut of it, then write "music": {"track", "start"} into the episodes.

  scripts/assign_music.py e30 e31 w50 w51 ...

Candidates are the instrumental tracks in build/music/candidates.json (fetch them first with
scripts/fetch_music.py <id> <list page> --try — a few at a time, Mixkit rate-limits). Tracks that another live episode uses
within 14 days (by the dates in episodes/plan.json; episodes not in the plan count as today) are skipped. Every (episode,
track) pair gets the best cut (scripts/track_bed.py: the drop on a loud downbeat, no breaks, a full intro); ads prefer
house/EDM, warm-ups the lighter electronic styles; then one track per episode by an optimal assignment. Needs the episode's
cues (build/<id>.cues.json): run scripts/preview_all.sh or render.mjs first. The tracks are noted in assets/music.md.
"""
import datetime, json, os, sys
import numpy as np
from scipy.optimize import linear_sum_assignment

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
from track_bed import analyse, best_cut

HOUSE = {'House', 'EDM', 'Tech House', 'Electro House', 'Deep House'}
LIGHT = {'Electropop', 'Synthpop', 'Electronica', 'Future Bass', 'Electronic', 'Dance Pop', 'Dance-Pop'}


def main(ids):
    cand = json.load(open(os.path.join(ROOT, 'build', 'music', 'candidates.json')))
    plan = {e['id']: e for e in json.load(open(os.path.join(ROOT, 'episodes', 'plan.json')))['episodes']}
    day = lambda i: datetime.date.fromisoformat(plan[i]['date'][:10]) if i in plan and plan[i].get('date') else datetime.date.today()
    used = {}   # track -> dates of other live episodes using it
    for f in os.listdir(os.path.join(ROOT, 'episodes')):
        if not (f.endswith('.json') and f[0] in 'ew' and f[1:-5].isdigit()) or f[:-5] in ids:
            continue
        ep = json.load(open(os.path.join(ROOT, 'episodes', f)))
        t = str((ep.get('music') or {}).get('track', '')).replace('mixkit:', '')
        if t and plan.get(ep['id'], {}).get('status') != 'retired':
            used.setdefault(t, []).append(day(ep['id']))
    tids = [t for t, v in cand.items() if v.get('instrumental') and v.get('license', '').endswith('#musicFree')]
    an = {t: analyse(os.path.join(ROOT, 'build', 'music', f'{t}.mp3')) for t in tids}
    S = np.full((len(ids), len(tids)), -99.0); ST = np.zeros_like(S)
    for i, eid in enumerate(ids):
        c = json.load(open(os.path.join(ROOT, 'build', f'{eid}.cues.json')))
        drop, dur = float(c.get('drop') or 0), float(c['duration'])
        for j, t in enumerate(tids):
            if any(abs((day(eid) - d).days) < 14 for d in used.get(t, [])):
                continue
            st, sc = best_cut(an[t], drop, dur)
            g = cand[t].get('genre')
            sc += (.3 if g in HOUSE else 0) if eid.startswith('e') else (.15 if g in LIGHT else 0)
            sc -= .3 if not (98 <= cand[t].get('tempo', 120) <= 136) else 0
            S[i, j], ST[i, j] = sc, st
    if len(tids) < len(ids):
        sys.exit(f'{len(tids)} candidates for {len(ids)} episodes: fetch more tracks')
    rows, cols = linear_sum_assignment(-S)
    md = os.path.join(ROOT, 'assets', 'music.md')
    lines = open(md).read().splitlines()
    for i, j in zip(rows, cols):
        eid, t = ids[i], tids[j]
        if S[i, j] < 1.0:
            print(f'warning: {eid} gets a weak cut of {t} (score {S[i, j]:.2f}) — fetch more tracks of the right style')
        p = os.path.join(ROOT, 'episodes', f'{eid}.json'); ep = json.load(open(p))
        ep['music'] = {'track': f'mixkit:{t}', 'start': round(float(ST[i, j]), 2)}
        json.dump(ep, open(p, 'w'), ensure_ascii=False, indent=1)
        v = cand[t]
        if not any(l.startswith(f'| {t} |') for l in lines):
            lines.append(f"| {t} | {v['name']} | {v['artist']} | {v['genre']} | {v['page']} |")
        print(f"{eid}: mixkit:{t} \"{v['name']}\" ({v['genre']}) from {ST[i, j]:.2f}s, score {S[i, j]:.2f}")
    open(md, 'w').write('\n'.join(lines) + '\n')


if __name__ == '__main__':
    main(sys.argv[1:])
