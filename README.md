# noxio-content

Short vertical videos (9:16, 1080×1920) for Noxio's Instagram and Facebook Reels, built from data:
an episode file describes the scenes and the language, the template animates them, and a synthesized
soundtrack is timed to the cuts.

## Layout

| Path | What it is |
| --- | --- |
| `template/` | HTML/CSS/GSAP template: `template.js` (scenes + timeline), `l10n.js` (RU/LV/PL/EN strings and default copy), `niches.js` (product sets: cosmetics, shoes, kids, accessories, home), `style.css` (Noxio light and dark themes: #11B981, #0098B7, Inter) |
| `episodes/eNN.json` | One episode: `lang` and an ordered list of `scenes` with optional text overrides |
| `episodes/plan.json` | Publishing plan: date, caption, cover frame, video URL and status per episode |
| `scripts/make_episode.sh` | Render one episode end to end into `videos/<id>.mp4` |
| `scripts/preview_all.sh` | Key-frame contact sheets in `build/` for checking layouts before a full render |
| `videos/` | Finished MP4s, served publicly via raw.githubusercontent.com for scheduling |
| `assets/logo.png` | Noxio logo |
| `assets/photos/` | Stock photos for covers (`CREDITS.md` lists authors) |
| `assets/covers/` | Cover stills (one per episode), used as Reel thumbnails |

## Scene types

`cover`, `hook`, `codes`, `pain`, `solution`, `ai`, `connect`, `messenger`, `price`, `sendlink`, `offer`, `cta`
(durations 2.8 / 3.5 / 3.5 / 3.5 / 4 / 3 / 3 / 3 / 4.5 / 3.5 / 2.5 / 2.5 s).
`codes` is a seller's post buried in a wall of product codes with rules stickers (override `start`, `colors`, `sizes`, `rules`, `head`);
`price` compares a 3% commission with Noxio's fixed price and the weekly plan (copy in `l10n.js`, prices in zł);
`sendlink` shows a seller sending a live link in Messenger and getting the order list back as Excel (concept K1).
Emoji in any text are swapped for Noto SVGs from `assets/emoji/` (`scripts/emoji.py` extracts them; run by the build scripts).
`cover` is a stock photo with our logo, headline and sub (`"photo": "../assets/photos/eNN.jpg"`, `"head"`, `"sub"`, optional
`"layout": "light"|"dark"`, `"focus"` for object-position) with a slow zoom; `make_episode.sh` saves a still of it as
`assets/covers/eNN.jpg` for the Reel thumbnail. (The old form `"src"` shows a finished image.)
Any scene accepts `kicker` (small label, e.g. "Шаг 1"). Heads are arrays of lines; `[text]` highlights in emerald,
`{text}` in teal. `connect` accepts `"only": "link"` to show only the paste-a-link option.

Episode options: `"lang"` (`ru`, `pl`, `lv`, `en`), `"theme": "dark"` (default light), `"niche"` (one of the sets in
`niches.js`; default is clothing) and `"data"` for one-off overrides of any l10n field (`feed`, `table`, `ai`, `chat`…).
The soundtrack's tempo, key and chord progression are picked from the episode id, so every video sounds different.

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
