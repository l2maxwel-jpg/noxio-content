#!/usr/bin/env python3
"""Write episodes/manual.md: the Reels Maxim posts by hand.

Metricool's free plan publishes 20 posts per calendar month; everything over that is rendered as usual, gets
"status": "manual" in episodes/plan.json and is listed here with its time, where to post it, the video, the cover and
the caption to copy. Posts that Metricool failed to publish ("status": "missed") are listed at the end.

  scripts/manual_list.py            (run after changing plan.json, then commit episodes/manual.md)
"""
import datetime, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = 'https://raw.githubusercontent.com/l2maxwel-jpg/noxio-content/main/'
DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
KIND = {'warmup': 'прогрев', 'import': 'Import', 'kaja': 'Kaja'}


def entry(e):
    d = datetime.datetime.fromisoformat(e['date'][:19])
    kind = KIND.get(e.get('series'), 'реклама')
    if e.get('reelsOnly'):
        where = 'Instagram: Reels, **без** «Показывать в ленте» · Facebook: Reels'
    else:
        where = 'Instagram: Reels + в ленте · Facebook: Reels'
    if e.get('aiGenerated'):
        where += ' · в Instagram включить метку «AI»'
    cover = f"[обложка]({RAW}{e['cover']})" if e.get('cover') else f"обложка — кадр на {e.get('coverMs', 3000) / 1000:.1f} с".replace('.', ',')
    return '\n'.join([
        f"### {d.day:02d}.{d.month:02d} {DAYS[d.weekday()]} {d:%H:%M} · {e['lang'].upper()} · {kind} · {e['id']}",
        '',
        f"{where}  ",
        f"[видео]({RAW}{e['file']}) · {cover}",
        '',
        '```',
        e['caption'],
        '```',
        ''])


def main():
    plan = json.load(open(os.path.join(ROOT, 'episodes', 'plan.json')))['episodes']
    today = datetime.date.today().isoformat()
    manual = sorted((e for e in plan if e['status'] == 'manual' and e['date'][:10] >= today), key=lambda e: e['date'])
    missed = sorted((e for e in plan if e['status'] == 'missed'), key=lambda e: e['date'])
    out = ['# Ручная публикация', '',
           'Бесплатный Metricool публикует 20 постов в месяц. Эти ролики сверх лимита — их выкладываем вручную '
           '(удобно поставить сразу на неделю вперёд в Meta Business Suite: он публикует и в Instagram, и в Facebook). '
           'Время — Europe/Warsaw. Список обновляется вместе с планом.', '']
    out += ['## Выложить вручную', ''] + ([entry(e) for e in manual] or ['Сейчас нечего.', ''])
    if missed:
        out += ['## Не вышли из-за лимита — можно выложить, когда удобно', ''] + [entry(e) for e in missed]
    open(os.path.join(ROOT, 'episodes', 'manual.md'), 'w').write('\n'.join(out))
    print(f'episodes/manual.md: {len(manual)} to post by hand, {len(missed)} missed')


if __name__ == '__main__':
    main()
