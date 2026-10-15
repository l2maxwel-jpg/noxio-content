# noxio-content

Short vertical videos (9:16, 1080×1920) for Noxio's Instagram and Facebook Reels, built from data:
an episode file describes the scenes and the language, the template animates them, and a synthesized
soundtrack is timed to the cuts.

## Layout

| Path | What it is |
| --- | --- |
| `template/` | HTML/CSS/GSAP template: `template.js` (scenes + timeline), `l10n.js` (RU/LV/PL strings and default copy), `style.css` (Noxio light theme: #11B981, #0098B7, Inter) |
| `episodes/eNN.json` | One episode: `lang` and an ordered list of `scenes` with optional text overrides |
| `episodes/plan.json` | Publishing plan: date, caption, cover frame, video URL and status per episode |
| `scripts/make_episode.sh` | Render one episode end to end into `videos/<id>.mp4` |
| `scripts/preview_all.sh` | Key-frame contact sheets in `build/` for checking layouts before a full render |
| `videos/` | Finished MP4s, served publicly via raw.githubusercontent.com for scheduling |
| `assets/logo.png` | Noxio logo |

## Scene types

`hook`, `pain`, `solution`, `ai`, `connect`, `messenger`, `offer`, `cta` (durations 3.5 / 3.5 / 4 / 3 / 3 / 3 / 2.5 / 2.5 s).
Any scene accepts `kicker` (small label, e.g. "Шаг 1"). Heads are arrays of lines; `[text]` highlights in emerald,
`{text}` in teal. `connect` accepts `"only": "link"` to show only the paste-a-link option.

```json
{ "id": "e02", "lang": "ru", "scenes": [
  { "type": "hook", "setup": ["Покупатели не пишут", "коды товаров."], "p1": "И не надо.", "p2": "" },
  { "type": "ai" }, { "type": "solution" }, { "type": "offer" }, { "type": "cta" } ] }
```

## Build

```bash
npm install
scripts/preview_all.sh episodes/e02.json   # check build/sheet_e02.png
scripts/make_episode.sh episodes/e02.json  # -> videos/e02.mp4
```

Requires Node 18+, Python 3 with numpy/scipy, ffmpeg. Headless Chromium comes from `@sparticuz/chromium`.
