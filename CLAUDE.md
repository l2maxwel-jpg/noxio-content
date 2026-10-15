# Working on noxio-content

This repository produces Noxio's Reels. Read README.md for the layout. Rules for any session that adds content:

## Only advertise what works today

Noxio (noxio.pl) turns comments under Facebook live streams, videos and sale posts into an order list. Safe to show:
- orders are recognized from comments **after** the stream ends (processing is not real-time);
- AI understands orders written in natural language, without product codes (codes are optional, they improve accuracy);
- two ways in: connect the Facebook business page (fast mode) **or** paste a link to the video, without logging in through Facebook;
- a ready order table (buyer, item, size, quantity), discrepancy check, Excel export;
- messages to buyers in Messenger, when the Facebook page is connected;
- interface in English, Polish, Latvian and Russian;
- trial: 14 days free, up to 3 streams, no card.

Never present these as available: real-time scanning or a bot during the live, auto-replies, Instagram integration,
payments, courier labels, invoices, a warehouse. If a roadmap item must be mentioned, label it clearly as planned.

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
