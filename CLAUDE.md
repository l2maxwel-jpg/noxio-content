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
- trial: 14 days free, up to 3 streams, no card. Plans (check noxio.pl before quoting): week 89,99 zł, month 219,99 zł,
  year 1999,99 zł; fixed price, no percentage of sales.

Never present these as available: real-time scanning or a bot during the live, auto-replies, Instagram or TikTok
integration, payments, courier labels, invoices, a warehouse or reservations, a buyer app, CRM integrations.
If a roadmap item must be mentioned, label it clearly as planned ("тестируем / wkrótce / скоро").
Never use invented numbers (only real results with the seller's permission), competitor names, logos or screenshots
(say "other systems" / "systems that take a percentage"), fake customers or testimonials. Buyer names on screen are
test data. Brand: emerald #11B981, teal #0098B7, Inter, plenty of white; don't borrow other brands' palettes.

## Making a batch

1. Continue the schedule in `episodes/plan.json` (Europe/Warsaw, check the UTC offset for DST):
   Mondays and Thursdays — RU at 10:00 **and** PL at 14:00; Wednesdays — LV at 10:00; Fridays — EN at 10:00.
2. Every language gets its own episode: a different angle, product niche (`niche`), theme (`theme`), scene order and cover.
   Never translate another episode — videos must not look like copies of each other. The RU and PL episodes of the same
   day must differ in niche and theme. Retired copies stay in `plan.json` with `status: retired`.
   Keep heads to the line counts the template expects (pain ≤ 3, solution ≤ 4, ai ≤ 3, connect ≤ 4, messenger ≤ 3).
3. `scripts/preview_all.sh` each new episode and look at the contact sheets before rendering.
4. `scripts/make_episode.sh` each episode, then check duration with ffprobe and look at a few frames.
5. Add the episodes to `plan.json` (caption in the episode's language, date, offset, url, `status: planned`, plus
   `cover`/`thumbnail`/`aiGenerated` when the episode has a cover, otherwise `coverMs: 3000`), commit and push.
6. Schedule each as an Instagram REEL + Facebook REEL with `autoPublish: true` (Maxim's decision, 2026-10-15),
   then set `status: scheduled`.

## Covers

Episodes with a file in `assets/covers/eNN.jpg` start with a `cover` scene and use that file as `videoThumbnailUrl`
(raw.githubusercontent.com URL). Covers are designed in Moda (canvas "Noxio — обложки Reels", Noxio light brand kit,
1080×1920): a stock photo from Unsplash (`file_search` with `source: "stock"`), logo, headline in the episode's language,
a one-line sub, and a small photo credit ("Fot./Foto/Photo/Фото: <author> / Unsplash"). Dark-theme episodes put the
headline at the bottom over a dark gradient; light ones at the top over a light gradient.
Export the page as JPEG and download it straight into `assets/covers/` (assets-cdn.moda.app is reachable).
Set `instagramData.isAiGenerated: true` only when the photo is AI-generated; stock photos are `false`.
If a Moda export cannot be downloaded, pass its JPEG export URL as `videoThumbnailUrl` and start the episode with a
`hook` scene instead of `cover`. Never crop or hide the moda.app badge that free-plan exports carry.
