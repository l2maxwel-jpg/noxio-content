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

1. Continue the schedule in `episodes/plan.json`: Mondays and Thursdays, 10:00 Europe/Warsaw (check the UTC offset for DST).
2. Write new `episodes/eNN.json` files with fresh angles; mostly Russian, about one Latvian and one Polish per eight.
   Keep heads to the line counts the template expects (pain ≤ 3, solution ≤ 4, ai ≤ 3, connect ≤ 4, messenger ≤ 3).
3. `scripts/preview_all.sh` each new episode and look at the contact sheets before rendering.
4. `scripts/make_episode.sh` each episode, then check duration with ffprobe and look at a few frames.
5. Add the episodes to `plan.json` (caption, date, offset, coverMs, url, `status: planned`), commit and push.
6. Schedule each as an Instagram REEL + Facebook REEL with manual approval (`autoPublish: false`), then set `status: scheduled`.
