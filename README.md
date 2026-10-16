# noxio-content

Short vertical videos (9:16, 1080×1920) for Noxio's Instagram and Facebook Reels, built from data:
an episode file describes the scenes and the language, the template animates them, and a synthesized
soundtrack is timed to the cuts.

## Layout

| Path | What it is |
| --- | --- |
| `template/` | HTML/CSS/GSAP template: `template.js` (scenes + timeline), `l10n.js` (RU/LV/PL/EN strings and default copy), `niches.js` (product sets: cosmetics, shoes, kids, accessories, home), `style.css` (Noxio light and dark themes: #11B981, #0098B7, Inter) |
| `episodes/eNN.json` | One ad episode: `lang` and an ordered list of `scenes` with optional text overrides |
| `episodes/wNN.json` | One warm-up Reel (series `warmup`, Reels tab only) |
| `episodes/pNN.json` | One Reel for Import produktów PrestaShop (series `import`, feed + Reels) |
| `episodes/plan.json` | Publishing plan: date, caption, cover frame, video URL and status per episode |
| `scripts/make_episode.sh` | Render one episode end to end into `videos/<id>.mp4` |
| `scripts/preview_all.sh` | Key-frame contact sheets in `build/` for checking layouts before a full render |
| `scripts/check_unique.mjs` | Fails when two live episodes share a scene order, cover photo (or photo series), headline, product set, scene head or a recent angle |
| `videos/` | Finished MP4s, served publicly via raw.githubusercontent.com for scheduling |
| `assets/logo.png` | Noxio logo |
| `assets/photos/` | Stock photos for covers (`CREDITS.md` lists authors) |
| `assets/covers/` | Cover stills (one per episode), used as Reel thumbnails |
| `assets/clips.md` | Mixkit clips used as video covers (id and page; the clips themselves are downloaded into `build/mixkit/`) |
| `assets/lottie/` | Lottie animations (`SOURCES.md`, `LICENSE.md`) |
| `scripts/fetch_clip.sh`, `scripts/fetch_lottie.py` | Fetch a Mixkit clip / a LottieFiles animation after checking its license, with a contact sheet to review |
| `assets/music.md`, `scripts/fetch_music.py`, `scripts/assign_music.py`, `scripts/vocal_check.py` | Mixkit music: tracks used by episodes (id and list page; the mp3s are downloaded into `build/music/`), fetching with a voice check, one track and cut per episode |

## Scene types

`cover`, `hook`, `codes`, `pain`, `solution`, `ai`, `connect`, `messenger`, `price`, `sendlink`, `group`, `excel`, `merge`,
`review`, `setup`, `offer`, `cta` (durations in `DUR` in `template.js`; any scene takes `"dur"` to stretch it).
`codes` is a seller's post buried in a wall of product codes with rules stickers (override `start`, `colors`, `sizes`, `rules`, `head`);
`price` compares a 3% commission with Noxio's fixed price and the weekly plan (copy in `l10n.js`, prices in zł);
`sendlink` shows a seller sending a live link in Messenger and getting the order list back as Excel (concept K1);
`group` flies one buyer's comments into one order card (`group`: `name`, `comments`, `items`, `badge`, `foot`);
`excel` turns the episode's `table` into a spreadsheet after a click (`excel`: `btn`, `file`);
`merge` collapses several lives into one list (`merge`: `title`, `sources` = [icon `live`|`video`|`post`, label, count]);
`review` passes clear orders and flags an unclear comment that gets fixed (`review`: `ok`, `unclear`, `fix`, …);
`setup` fills expected codes / colours / sizes and switches off the seller's own comments (`setup`: `fields`, `toggle`, `seller`).
Their strings live next to `table`/`chat` in `l10n.js`, so an episode replaces them through `data`.
Warm-up series (`episodes/wNN.json`, `"series": "warmup"`): `wtitle` (`fmt` tip|quiz|pov|myth for the chip colour, `chip`,
`emoji`, `head`, `sub`), `wtips` (`head`, `items` = [title, sub], `"style": "x"` for mistakes), `wquiz` (`head`, `options`,
`ask`), `wpov` (`head`, `comments`, `punch`), `wmyth` (`claim`, `truth`, `"verdict": "truth"` for a true statement) and
`follow` (`tag`, `button`, `small`; defaults in `l10n.js` under `warm`). Their content lives in the scene itself.
Import series (`episodes/pNN.json`, `"series": "import"`; UI strings in `l10n.js` under `imp`): `icard` (`photo`, `name`, `sku`,
`fields` = [label, value] where a value is text, `"#hex|text"` for a colour swatch or an array of chips, `desc`, `id`),
`isync` (`file`, `cols`, `rows` = [sku, name, old price, new price, old stock, new stock], `done`), `idupe` (`photo`, `name`,
`sku`, `existing`, `id`, `done`), `iscan` (`tag` = lines on the label, `read` = values read into code/price/composition),
`ivariants` (`photo`, `colors` = [hex, name], `sizes`, `totalWord`), `iform` (`typed`, `count`, `big`) and `ibatch`
(`items` = [Phosphor icon, name, id]). All take `head`.
Emoji in any text are swapped for Noto SVGs from `assets/emoji/` (`scripts/emoji.py` extracts them; run by the build scripts).
`cover` is a stock photo or a Mixkit clip (`"video": "mixkit:<id>"`, optional `clipStart`, `rate`, `cropX`) with our logo, headline and sub (`"photo": "../assets/photos/eNN.jpg"`, `"head"`, `"sub"`, optional
`"layout": "light"|"dark"`, `"focus"` for object-position) with a slow zoom; `make_episode.sh` saves a still of it as
`assets/covers/eNN.jpg` for the Reel thumbnail. (The old form `"src"` shows a finished image.)
Any scene accepts `kicker` (small label, e.g. "Шаг 1"), `lottie` (an animation from `assets/lottie/` as `{src, x, y, w, h, at, speed, loop,
behind}`; in `wtitle` a plain src replaces the emoji) and `fx` (`blur`, `split` or `scramble` for its heads; `"fx"` on the episode
applies to every scene). `:ph-name:` / `:ph-name.fill:` in any text inserts a Phosphor icon; a `wtips` item takes an icon as its third field. Heads are arrays of lines; `[text]` highlights in emerald,
`{text}` in teal. `connect` accepts `"only": "link"` to show only the paste-a-link option.

Episode options: `"lang"` (`ru`, `pl`, `lv`, `en`), `"theme": "dark"` (default light), `"angle"` (the episode's idea,
checked for repeats), `"niche"` (one of the sets in `niches.js`; default is clothing) and `"data"` for one-off overrides of
any l10n field (`feed`, `table`, `ai`, `chat`, `group`, `review`…). New episodes bring their own products in `data`.
`"music": {"track": "mixkit:<id>"}` scores the episode with a Mixkit track (`scripts/fetch_music.py`, `scripts/track_bed.py`:
the cut puts the drop on a loud downbeat; `"start"` pins it). Without a track the soundtrack is synthesized: tempo, key and
chord progression are picked from the episode id, and `"music": {"bpm", "transpose", "prog", "hats16"}` pins another variant.

```json
{ "id": "e02", "lang": "ru", "scenes": [
  { "type": "hook", "setup": ["Покупатели не пишут", "коды товаров."], "p1": "И не надо.", "p2": "" },
  { "type": "ai" }, { "type": "solution" }, { "type": "offer" }, { "type": "cta" } ] }
```

## Build

```bash
npm install
node scripts/check_unique.mjs              # 0 errors before rendering
scripts/preview_all.sh episodes/e02.json   # check build/sheet_e02.png
scripts/make_episode.sh episodes/e02.json  # -> videos/e02.mp4
```

Requires Node 18+, Python 3 with numpy/scipy, ffmpeg. Headless Chromium comes from `@sparticuz/chromium`.
