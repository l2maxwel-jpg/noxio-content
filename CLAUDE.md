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
   then set `status: scheduled`.

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
