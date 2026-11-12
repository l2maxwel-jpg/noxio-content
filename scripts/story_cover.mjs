// Title card for a Kaja episode: node scripts/story_cover.mjs episodes/sNN.json -> build/story/<id>/<id>_cover.jpg
// Episode block "cover": {"t": seconds of a clean still in kaja.video, "frame": {s, x, y}, "top": y of the text block
// (under her chin), "kicker", "head": ["line", "*emerald box*", "_white box_", "~amber box~"], "size", "sub", "tint"}.
// The text must stay in y 330–1440 and x 64–1016 and never cover Kaja's head; the script fails otherwise.
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const epPath = process.argv[2];
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ep = JSON.parse(readFileSync(path.resolve(epPath), 'utf8'));
const out = path.join(root, 'build', 'story', ep.id);
const still = path.join(out, 'cover_still.png');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(ep.cover.t), '-i', path.join(root, ep.cover.video || ep.kaja.video), '-frames:v', '1',
  '-vf', 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920', still]);
const browser = await puppeteer.launch({
  args: [...chromium.args, '--allow-file-access-from-files', '--font-render-hinting=none'],
  executablePath: await chromium.executablePath(), headless: true,
  defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
await page.evaluateOnNewDocument(`window.EP = ${JSON.stringify(ep)}; window.STILL = ${JSON.stringify('file://' + still)};`);
await page.goto('file://' + path.join(root, 'template/story_cover.html'));
const box = await page.evaluate(() => window.ready);
const f = ep.cover.frame || { s: 1, y: 0 }, chin = ep.kaja.face[1] + (ep.kaja.head[3] - ep.kaja.face[1]) * f.s + (f.y || 0);
const bad = [];
if (box.top < chin) bad.push(`text starts at y ${box.top | 0}, Kaja's head ends at ${chin | 0}`);
if (box.top < 330 || box.bottom > 1440) bad.push(`text y ${box.top | 0}–${box.bottom | 0} is outside 330–1440`);
if (box.right > 1016) bad.push(`headline is ${box.right | 0}px wide (limit 1016): shorten a line or lower "size"`);
const file = path.join(out, `${ep.id}_cover.jpg`);
await page.screenshot({ path: file, type: 'jpeg', quality: 93 });
await browser.close();
console.log(file, `text y ${box.top | 0}–${box.bottom | 0}`, bad.length ? 'PROBLEMS: ' + bad.join('; ') : 'ok');
if (bad.length) process.exit(1);
