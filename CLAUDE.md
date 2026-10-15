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
Show "without codes" on comments instead of just claiming it. Every video ends with the logo and the offer
"14 days free, up to 3 streams, no card". Everything readable must stay inside y 330–1440 of the 1920 frame:
Facebook and Instagram show Reels in the feed cropped to 4:5 (y 285–1635) and the Reels player covers the bottom
quarter with the caption. The template scales every scene into that band (`SAFE` in template.js) and
`render.mjs preview` flags anything outside it — never move text closer to the edges.

## Every video is one of a kind (Maxim's rule)

Each Reel must be unrepeatable — across all languages, not just within one. Before rendering anything new:
- give it its own `angle` (the idea, e.g. `excel-export`, `grouped-by-buyer`; see `plan.json` and the episode files for
  the ones taken) — the same angle may come back only 14+ days later, and then with everything else different;
- its own product set in `data` (`feed`, `table`, `ai`, `chat`, and `group`/`review`/`merge`/`setup` when used): never the
  language defaults or a shared `niche` that another live episode already shows — those are translations of each other;
- its own cover photo (never a photo or a photo series another episode used — check `assets/photos/CREDITS.md`),
  cover headline, scene order, heads for every scene and `cta` tag; never translate another episode's text;
- run `node scripts/check_unique.mjs` — it must report 0 errors. Fix its warnings for scheduled episodes too (same music
  variant → pin `"music": {"bpm", "transpose", "prog", "hats16"}`; spares that clash get changed before they are used).

## Making a batch

1. Continue the schedule in `episodes/plan.json` (Europe/Warsaw, check the UTC offset for DST):
   Mondays and Thursdays — RU at 10:00 **and** PL at 14:00; Wednesdays — LV at 10:00; Fridays — EN at 10:00.
2. Every language gets its own episode (see "Every video is one of a kind"). The RU and PL episodes of the same day
   must differ in products and theme. Retired copies stay in `plan.json` with `status: retired`.
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

Every episode except `codes` openers starts with a `cover` scene built by the template:
`{"type": "cover", "photo": "../assets/photos/eNN.jpg", "head": [...], "sub": "..."}` — a stock photo with our logo,
headline and sub on top (light episodes: headline at the top over a light gradient; dark: at the bottom over a dark one;
`layout` and `focus` can override). Find photos with Moda's `file_search` (`source: "stock"`) or on Unsplash, check a
preview first (no foreign signs, brands or currencies), then `scripts/fetch_photo.sh eNN <images.unsplash.com URL> "<author>"`
— it saves the photo and notes the author in `assets/photos/CREDITS.md` (record only, never on screen).
`scripts/make_episode.sh` also writes `assets/covers/eNN.jpg`, a still of the cover, used as `videoThumbnailUrl`.
Episodes that open with `codes` have no cover; use `coverMs: 2700` (`videoCoverMilliseconds`) for the thumbnail.
Stock photos → `instagramData.isAiGenerated: false`.
