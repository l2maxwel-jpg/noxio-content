# Working on noxio-content

This repository produces Noxio's Reels. Read README.md for the layout. Rules for any session that adds content:

## Only advertise what works today

Noxio (noxio.pl) turns comments under Facebook live streams, videos and sale posts into an order list. Safe to show:
- orders are recognized from comments **after** the stream ends (processing is not real-time);
- AI understands orders written in natural language, without product codes, with typos, emoji and in different
  languages (codes are optional, they improve accuracy) — show it on real-looking comments, don't just claim it;
- two ways in: paste a link to the video, without logging in through Facebook (slower), **or** connect the Facebook
  business page once and pick videos from a list (faster); works with finished lives, regular videos and sale posts;
- before a scan the seller can set expected codes, colours and sizes and ignore comments from the seller and admins;
- orders grouped by buyer, search and manual edits, a check of unclear orders, several lives merged into one list;
- one-click Excel (XLSX) export;
- order confirmation to buyers in Messenger when the page is connected (Facebook allows one reply per comment within 7 days);
- interface in English, Polish, Latvian and Russian;
- trial: 14 days free, up to 3 streams, no card. Plans (confirmed on noxio.pl 2026-10-15): week 89,99 zł / 7 days,
  month 219,99 zł, year 1999,99 zł (166,67 zł/month, save 24%); fixed price, no percentage of sales.

Never present these as available: real-time scanning or a bot during the live, auto-replies, Instagram or TikTok
integration, payments, courier labels, invoices, a warehouse or reservations, a buyer app, CRM integrations.
If a roadmap item must be mentioned, label it clearly as planned ("тестируем / wkrótce / скоро").
Never use invented numbers (only real results with the seller's permission), competitor names, logos or screenshots
(say "other systems" / "systems that take a percentage"), fake customers or testimonials. Buyer names on screen are
test data. Brand: emerald #11B981, teal #0098B7, Inter, plenty of white; don't borrow other brands' palettes.

## Content concepts (use these angles)

- **K1 "Send us a link — get your orders"** (main): the seller sends a link to their last live in Messenger, Noxio replies
  with the order list in Excel, free. Maxim answers these messages himself, so this offer is allowed. Scene `sendlink`,
  CTA "write to us in Messenger"; caption says how to send the link.
- **K2 "Wall of codes vs live comments"**: a sales post full of "kod 612 biały 75E…" lines and rules like "1 kolor =
  1 komentarz" → real-looking comments with typos and emoji → a clean order table. Scenes `codes` → `solution` → `ai`.
- **K3 "Fixed price, no percentage"**: "Ile oddajesz z każdej sprzedaży?" — example 20 000 zł × 3% = 600 zł vs Noxio
  219,99 zł/month, plus the weekly plan 89,99 zł; mark it as an example calculation. Scene `price`. PL/RU only.
- **K4 "Buyers write in different languages"** (LV, RU): mixed LV/RU/PL comments with typos and emoji → one order list.
- **K5 "The live is over, the work begins"**, **K6 "Buyers get the confirmation in Messenger"** (page connected).
- Feature angles with their own scenes: `setup` (expected codes / colours / sizes before the scan, the seller's own comments
  skipped), `group` (one buyer's comments → one order), `review` (an unclear comment flagged for a check and fixed by hand),
  `merge` (several lives → one list — lives only; don't show videos or posts merged), `excel` (one-click XLSX export).
Show "without codes" on comments instead of just claiming it. Every ad ends with the logo and the offer
"14 days free, up to 3 streams, no card" (warm-ups end with the follow card instead). Everything readable must stay inside y 330–1440 of the 1920 frame:
Facebook and Instagram show Reels in the feed cropped to 4:5 (y 285–1635) and the Reels player covers the bottom
quarter with the caption. The template scales every scene into that band (`SAFE` in template.js) and
`render.mjs preview` flags anything outside it — never move text closer to the edges.

## Every video is one of a kind (Maxim's rule)

Each Reel must be unrepeatable — across all languages, not just within one. Before rendering anything new:
- give it its own `angle` (the idea, e.g. `excel-export`, `grouped-by-buyer`; see `plan.json` and the episode files for
  the ones taken) — the same angle may come back only 14+ days later, and then with everything else different;
- its own product set in `data` (`feed`, `table`, `ai`, `chat`, and `group`/`review`/`merge`/`setup` when used): never the
  language defaults or a shared `niche` that another live episode already shows — those are translations of each other;
- its own cover photo or clip (never a photo, photo series or clip another episode used — check `assets/photos/CREDITS.md`
  and `assets/clips.md`),
  cover headline, scene order, heads for every scene and `cta` tag; never translate another episode's text;
- run `node scripts/check_unique.mjs` — it must report 0 errors. Fix its warnings for scheduled episodes too (same music
  variant → pin `"music": {"bpm", "transpose", "prog", "hats16"}`; spares that clash get changed before they are used).

## Warm-up series (Reels tab only)

Besides the ads above, two short warm-up Reels go out every day to keep the account visible and win followers
(Maxim's decision, 2026-10-16). They are not ads: useful or funny content for people who sell on lives, ending with a
follow card instead of the offer.
- Files `episodes/wNN.json` with `"series": "warmup"`; scenes `wtitle` → one of `wtips` (tips, or `"style": "x"` for
  mistakes), `wquiz` (question with A–D answers for the comments), `wpov` (POV joke over a comment feed), `wmyth`
  (myth or truth) → `follow`. Rotate the five formats per language and alternate light/dark.
- Slots (Europe/Warsaw): 08:00 and 19:30 every day — Mon LV/PL, Tue RU/PL, Wed RU/EN, Thu LV/RU, Fri PL/RU,
  Sat LV/EN, Sun RU/PL.
- Every warm-up has its own topic (`angle` starting with `warm-`), title emoji (never reused), headline and lines;
  general advice only — no invented numbers, nothing from the never-list; Noxio itself is named only on the follow card.
  Pick emoji that exist in the Noto sprite (`scripts/emoji.py` fails otherwise) and from the U+1Fxxx range.
- `check_unique.mjs` compares them too (texts and emoji instead of scene order).
- Plan entries carry `"series": "warmup", "reelsOnly": true, "coverMs": 2600`. In Metricool: Instagram REEL with
  `showReelOnFeed: false` (Reels tab only, not the profile grid), Facebook REEL, `videoCoverMilliseconds: 2600`,
  `autoPublish: true`.

## Import series (second product)

Noxio also sells **Import produktów PrestaShop**, a separate tool with its own subscription, for adding products to a
PrestaShop shop quickly (noxio.pl → Narzędzia). Price (confirmed on noxio.pl by Maxim, 2026-10-16): **149,99 zł/month**,
14-day free trial, no card. Don't mix it with the live-orders plans or the "up to 3 streams" offer.
- Safe to show: AI writes the product card from a photo (name, description, category matching, colour, sizes,
  composition), variants (combinations of colours and sizes), publishing to the shop, batch import of many photos,
  label scanning (code, price, composition read from a tag), duplicate detection before publishing, sync with a
  supplier's file (prices and stock by SKU), quantity discounts, SEO fields, import history, catalogue export.
  Steps: connect the shop → add photos → AI fills the card → publish.
- **Not live yet — never show or mention** (Maxim, 2026-10-16): "Zdjęcie studyjne AI", "Zdjęcie na modelu AI",
  "Przeniesienie na górę kategorii" — not in videos, captions or covers, not even as "coming soon". No multi-language
  claims (cards in several shop languages) either until Maxim confirms them.
- PrestaShop is named in text only: never its logo, admin screens or colours. The template draws our own cards.
- Files `episodes/pNN.json` with `"series": "import"`, 10–15 s: `cover` (a Mixkit clip) → one scene of `icard` (photo →
  card → publish), `isync` (supplier file → updated prices/stock), `idupe` (duplicate found → update instead of a copy),
  `iscan` (label → fields), `ivariants` (colours from the photo × sizes → combinations), `iform` + `ibatch` (a long form →
  a queue of cards) → `offer` (14 days, pills with the price and "no card") → `cta` (tag naming the tool). Each episode
  brings its own products, ids and texts in the scene (strings in `l10n.js` under `imp`); new features get new scenes.
- Slots: Tuesday and Saturday 12:00 (Europe/Warsaw), languages in turn PL, RU, EN, PL, LV, RU. Feed **and** Reels:
  Instagram REEL with `showReelOnFeed: true` + Facebook REEL, `autoPublish: true`, the cover still as the thumbnail.
  Captions say the price, the trial and where to find it. Same uniqueness rules as the ads (`check_unique.mjs`).

## Clips, animations, icons, text effects

All of these are free for business use without credits on screen; never show a source, author or watermark.
- **Video covers (Mixkit)** — new ads should open with a moving cover: `{"type": "cover", "video": "mixkit:<id>", "head", "sub",
  "layout"}` instead of `photo` (optional `clipStart` in s, `rate` 0.5–1 for slow motion, `cropX` 0–1). Find vertical clips at
  `https://mixkit.co/free-stock-video/discover/<word>/?orientation=vertical`, then `scripts/fetch_clip.sh eNN <item page URL>`:
  it accepts only the "Stock Video Free License" (the "Restricted" one forbids business use) and writes
  `build/mixkit/<id>_sheet.jpg` — check it for signs, brands, phone or laptop logos, currencies. Clips are never committed
  (Mixkit's terms forbid handing out the files); `assets/clips.md` keeps id → page and `render.mjs` downloads them again.
  Each clip is used once; `check_unique.mjs` also rejects clips whose ids are within 20 (one shoot = a series).
- **Lottie animations** (`assets/lottie/`, Lottie Simple License — keep `LICENSE.md` and `SOURCES.md` with the files):
  `scripts/fetch_lottie.py <name> <https://lottiefiles.com/free-animation/... URL> [--tint emerald|teal|brand]`, then look at
  `build/lottie/<name>_sheet.png` (no words, logos, social-network UI such as like counters, currencies). A Lottie can replace
  a warm-up's title emoji (`"lottie": "../assets/lottie/x.json"` in `wtitle`; never reused, like emoji) or sit in any scene as
  an accent: `"lottie": {"src", "x", "y", "w", "h", "at", "speed", "loop", "behind"}` (frame pixels). Accents repeated within
  7 days are warned about.
- **Phosphor icons** (MIT, npm `@phosphor-icons/core`): `:ph-name:` or `:ph-name.fill:` in any text; a `wtips` item takes an
  icon name as its third field. phosphoricons.com is not reachable from here — list names in
  `node_modules/@phosphor-icons/core/assets/bold/`.
- **Text effects** in the spirit of React Bits: `"fx": "blur" | "split" | "scramble"` on the episode or one scene (animates the
  heads). Vary them between episodes.
- **Music (Mixkit)** — every episode gets a real track: `"music": {"track": "mixkit:<id>"}` (optional `"start"` in s pins the
  cut; `scripts/music.py` prints the one it chose). Pick from the genre or mood list pages
  (`https://mixkit.co/free-stock-music/<genre>/`, `.../mood/<mood>/`), then `scripts/fetch_music.py <id> <list page URL>`: it
  accepts only the "Stock Music Free License" and prints tempo, loud sections and a voice check (`scripts/vocal_check.py`).
  Instrumental tracks only (the check must say "instrumental"), nothing whose title names a brand, an artist or a game.
  Style (Maxim, 2026-10-16): house, EDM, electropop, synthpop, electronica — modern and upbeat; **no funk**. Ads get the
  house/EDM tracks with a clear drop. For a batch: fetch candidates with `scripts/fetch_music.py <id> <page> --try` (a few
  at a time — Mixkit answers 429 to many requests in a row), then `scripts/assign_music.py <ids>` gives every episode its own
  track and cut (skips tracks used within 14 days) and writes `music` into the episodes. The mp3 is never committed; `assets/music.md`
  keeps id → list page and `music.py` downloads it again. The cut puts the drop on a loud downbeat and muffles the track before
  it; our effects play quietly on top. A track may come back only 14+ days later and with another part of it
  (`check_unique.mjs`). Without `track` the old synthesized bed is used.

## Making a batch

1. Continue the schedule in `episodes/plan.json` (Europe/Warsaw, check the UTC offset for DST):
   Mondays and Thursdays — RU at 10:00 **and** PL at 14:00; Wednesdays — LV at 10:00; Fridays — EN at 10:00.
   Continue the warm-ups (two a day) and the import series (Tuesdays and Saturdays 12:00) in the same batch.
2. Every language gets its own episode (see "Every video is one of a kind"). The RU and PL episodes of the same day
   must differ in products and theme. Retired copies stay in `plan.json` with `status: retired`. Spares must pass
   `check_unique.mjs` and be re-rendered before use (their videos predate the feed-safe layout).
   Aim for 15–20 s (scene `dur` can stretch a scene).
   Keep heads to the line counts the template expects (pain ≤ 3, solution ≤ 4, ai ≤ 3, connect ≤ 4, messenger ≤ 3,
   group/excel/merge/review/setup ≤ 3). Table: buyer names ≤ 8 letters, items ≤ 16, variants ≤ 6.
3. `node scripts/check_unique.mjs`, then `scripts/preview_all.sh` each new episode and look at the contact sheets before rendering.
4. `scripts/make_episode.sh` each episode, then check duration with ffprobe and look at a few frames.
5. Add the episodes to `plan.json` (caption in the episode's language, date, offset, url, `status: planned`, plus
   `cover`/`thumbnail`/`aiGenerated` when the episode has a cover, otherwise `coverMs: 3000`), commit and push.
6. Schedule each as an Instagram REEL + Facebook REEL with `autoPublish: true` (Maxim's decision, 2026-10-15),
   then set `status: scheduled` — but only within the Metricool limit (next section); the rest becomes `manual`.

## Metricool limit and manual posting (Maxim, 2026-10-29)

Metricool stays on the free plan, which publishes only **20 posts per calendar month**; anything over that fails with
"You have reached your Metricool account limit" (this happened from 22.10.2026). Maxim posts the rest by hand.
- Per calendar month create at most 20 posts in Metricool, counting the posts already there for that month (drafts
  don't count). Priority: ads (eNN) and the import series, then Kaja, then warm-ups — each group in date order.
- Everything else is rendered, committed and listed in plan.json as usual but with `"status": "manual"` and is not
  created in Metricool (a post already there gets `draft: true`). Then run `scripts/manual_list.py` and commit
  `episodes/manual.md` — Maxim's list with the time, where to post, video, cover and caption of every manual post.
- Statuses in plan.json: `planned`, `scheduled` (in Metricool), `manual` (by hand), `published`, `missed` (Metricool
  failed; listed at the end of manual.md), `paused`, `spare`, `retired`.

**Publishing is paused (Maxim, 2026-11-02):** every pending post in Metricool was set to `draft: true`, the future
episodes are `paused` in plan.json and the monthly task is switched off. Schedule nothing until Maxim says to resume.

## Kaja — the face of Noxio (HeyGen avatar)

Kaja is Noxio's virtual presenter: an AI photo avatar in HeyGen (avatar group "Kaja", 14 looks, 8 of them vertical;
HeyGen connector, Creator plan, 600 premium credits a month). Maxim, 2026-10-29: she is a blogger who keeps followers up
to date on Noxio — what's new, what we're working on, how things work. She is **not** an ad presenter: never make avatar
videos in the ad format of the other series (hook → feature → offer).
- Plan until 28.11.2026 (Maxim, 2026-11-07): 28 videos, 14 PL + 14 RU, in 3-day blocks (PL / RU / PL+RU), PL at 18:00
  and RU at 20:00 (Europe/Warsaw), all the month's HeyGen credits; calendar in the Docs artifact «Ролики с Каей: план до
  28 ноября». Each topic has its own script (never a translation); the same topic in the other language comes 14+ days
  later in another format. Scripts go to Maxim in batches of 2–3, two or three days ahead. Maxim posts by hand.
- Voices: PL `015482a78b9a46ebae74bd0beb17765b` (Bold Kasia - Excited); RU `655364e79506483a8f768ba50199cbb4`
  (Polina - Bright & Articulate, chosen by Maxim 2026-11-08).
- Rubrics: new in Noxio; what we're working on (every such topic approved by Maxim first and clearly marked as not
  available yet); how it works; your questions (real questions only); a tip.
- Facts come from Maxim's weekly notes and the safe lists above. She never poses as a seller or a customer and gives
  no testimonials. **Never say or write that she is virtual, an avatar or AI** — not in her script, on-screen cards and
  captions, or post texts (Maxim, 2026-11-06: he marks it himself when publishing).
- Scripts are approved by Maxim before generating (each video spends HeyGen credits), so Kaja episodes are made in a
  session with him, not by the monthly task. Plan entries carry `"series": "kaja"`.

### Stories with Kaja (`episodes/sNN.json`, pilot s01 — 2026-11-06)
Topic plan: the Docs artifact «Сторис Noxio: от новичка до профи» (24 topics, PL/RU, beginner → pro).
- Pipeline: script → `create_speech_without_player` (word timestamps → `build/story/sNN/words.json`, on-screen spellings
  such as `live'ach` for the phonetic `lajwach`) → `create_video_from_avatar` with that `audioUrl`, 9:16, 1080p, Avatar IV,
  `expressiveness: "medium"` + a `motionPrompt` (Avatar V rejects a motion prompt: the group has no digital twin)
  → `build/story/sNN/kaja.mp4` → `python3 scripts/story_audio.py episodes/sNN.json` → `node scripts/story_render.mjs
  preview|full episodes/sNN.json` (template `template/story.*`) → mux with the loudness-normalised mix (−14 LUFS).
- **No text over Kaja's head or face, ever** (Maxim, 2026-11-06). `kaja.head` is her head box (hair + margin) in the
  HeyGen frame; `story_render.mjs` moves it with every framing and prints `COVERS KAJA'S HEAD` — it must print nothing.
  Notification cards sit in the lower third (below the chin in every framing), word captions under them; headroom above
  her head is too small for text. Stories safe zone for text: y 250–1580.
- A phrase can be removed from a finished Kaja video by cutting it (`kaja.cut`, cut on a framing change) instead of
  generating it again. A ~30 s video costs ~20 credits (Creator plan: 600/month).
- Look `7ac044c8603c4a2b8976659a88c2d41b` (matcha latte, blazer) has a generator's sparkle mark in the corner: never use it.
- Layout 2 (`"layout": "story2"`, template `template/story2.*`, first used by s02): result-first hook with a stamp,
  split screen with numbered steps, phrase captions with the spoken word lit, terms chips, teaser card; cut for Reels
  (text in y 330–1440, clear of the right-hand buttons). `python3 scripts/story_prep.py episodes/sNN.json` first: it cuts
  long pauses (jump cuts), speeds the take up (`edit.tempo`) and writes `kaja_edit.mp4`, `words.json`, `cuts.json` (put
  framing changes on the join times). Sound effects come from the episode's own `sfx` cue list. Every episode must
  differ from the previous ones in hook, layout, captions, look, ending and music — never the same video with new text.
- Save credits: tighten the voice BEFORE generating — `python3 scripts/story_tts.py episodes/sNN.json` (block `tts`) cuts
  long pauses and speeds the TTS take up into `voice.mp3` + `words.json`; HeyGen bills by length (s03: 37 s → 31 s). The
  sandbox cannot reach HeyGen's S3 upload, so the file goes to the orphan branch `media` of the public repo
  (`voice/sNN.mp3`) and its raw.githubusercontent.com URL is the `audioUrl`. Then no story_prep.py is needed.
- Layout 3 (`"layout": "story3"`, first used by s03): Kaja keyed off a plain studio wall (`kaja.key`, `python3
  scripts/story_key.py episodes/sNN.json` → RGBA webp frames; works for the lime/green-wall looks) on our own mint scene;
  `poses` move her (mid / side / center / close); in `side` she stands right and a left column holds a live-comment feed,
  a by-hand list or the Noxio card; result card under her chin; white teaser card; big kinetic 1–2-word captions in the
  bottom band (y 1296–1420).
- The RU voice returns no word timestamps: `python3 scripts/story_align.py <tts audio> "<script>" build/story/sNN/words_raw.json`
  aligns the script to the audio with a local sherpa-onnx Russian model (pip `sherpa-onnx`; model
  `sherpa-onnx-small-zipformer-ru-2024-09-18` from the k2-fsa/sherpa-onnx GitHub release `asr-models`, unpacked to
  /home/claude/models or `RU_ASR`). Write "Ноксио" in the TTS text and "Noxio" in the script passed to the aligner.
- Layout 4 (`"layout": "story4"`, first used by s04): full-frame Kaja (podcast look), comment cards with language chips and
  a stamp, name tag, a before/after card with a wipe handle (comments → order list), interface-language switch, follow card
  with the next topic, classic two-line subtitles on a dark bar (`subs` = phrase start indices).
- **Result (2026-11-07):** s01, posted by Maxim as a Reel, had 177 views against 4–26 for the template Reels (stock
  photo + headline) on the same profile grid. The Kaja talking-head format is the one that hooks: give it priority.

## Publishing kit after every finished video (Maxim, 2026-11-06)

Whenever a video is ready, send Maxim everything he needs to post it by hand, without being asked: the caption in the
episode's language ready to paste (no claims that Kaja is virtual), **5 hashtags at most** (Instagram's cap since
December 2025; Facebook gets the same), the cover still as a file, and the settings for the Instagram composer
(poll or prompt if useful, location, share to Facebook on, built-in auto captions off when ours are burned in; the AI
label is his to set).

## Covers

**No marks of other companies anywhere in the visuals** — no tool badges (moda.app or any other), no stock-site credits,
no watermarks, no other brands' logos (Maxim's rule). Do not use Moda exports for covers or frames: the free plan adds a badge.

Every episode except `codes` openers starts with a `cover` scene built by the template (a Mixkit clip instead of the photo
is preferred for new ads, see above):
`{"type": "cover", "photo": "../assets/photos/eNN.jpg", "head": [...], "sub": "..."}` — a stock photo with our logo,
headline and sub on top (light episodes: headline at the top over a light gradient; dark: at the bottom over a dark one;
`layout` and `focus` can override — when a face is in the upper half of the photo use `"layout": "dark"` so the text
does not cover it). Find photos with Moda's `file_search` (`source: "stock"`) or on Unsplash, check a
preview first (no foreign signs, brands or currencies), then `scripts/fetch_photo.sh eNN <images.unsplash.com URL> "<author>"`
— it saves the photo and notes the author in `assets/photos/CREDITS.md` (record only, never on screen).
`scripts/make_episode.sh` also writes `assets/covers/eNN.jpg`, a still of the cover (photo or clip), used as `videoThumbnailUrl`.
Episodes that open with `codes` have no cover; use `coverMs: 2700` (`videoCoverMilliseconds`) for the thumbnail.
Stock photos → `instagramData.isAiGenerated: false`.
