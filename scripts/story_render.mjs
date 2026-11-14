// Render a Kaja story (episodes/sNN.json, template/story.html).
//   node scripts/story_render.mjs preview episodes/s01.json 1.0 5.5 ...  -> build/story/<id>/p_<t>.png + safe-zone report
//   node scripts/story_render.mjs full    episodes/s01.json               -> build/story/<id>/<id>.silent.mp4
// The Kaja video (HeyGen, build/story/<id>/kaja.mp4) is cut into 30 fps frames that the page swaps on every seek.
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [mode, epPath, ...rest] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FPS = 30;
const ep = JSON.parse(readFileSync(path.resolve(epPath), 'utf8'));
const out = path.join(root, 'build', 'story', ep.id);
mkdirSync(out, { recursive: true });

const video = path.join(root, ep.kaja.video);
if (!existsSync(video)) throw new Error(`${ep.kaja.video} is missing: download HeyGen video ${ep.kaja.heygen} (get_video gives a fresh URL)`);
let KF;
if (ep.kaja.key) {
  // keyed Kaja (RGBA webp, scripts/story_key.py): the template puts her on its own scene
  const kdir = path.join(out, 'frames_key'), kj = path.join(kdir, 'key.json');
  const want = { video: ep.kaja.video, size: readFileSync(video).length, key: ep.kaja.key };
  if (!existsSync(kj) || JSON.stringify(JSON.parse(readFileSync(kj, 'utf8'))) !== JSON.stringify(want))
    throw new Error(`keyed frames are missing or stale: run python3 scripts/story_key.py ${epPath}`);
  KF = { dir: path.relative(path.join(root, 'template'), kdir), n: readdirSync(kdir).filter(f => f.endsWith('.webp')).length, fps: FPS, ext: 'webp' };
} else {
  const fdir = path.join(out, 'frames'), key = JSON.stringify({ video: ep.kaja.video, size: readFileSync(video).length, fps: FPS });
  if (!existsSync(path.join(fdir, 'key.json')) || readFileSync(path.join(fdir, 'key.json'), 'utf8') !== key) {
    rmSync(fdir, { recursive: true, force: true }); mkdirSync(fdir, { recursive: true });
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-an',
      '-vf', `fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`, '-q:v', '2', path.join(fdir, '%04d.jpg')]);
    writeFileSync(path.join(fdir, 'key.json'), key);
  }
  KF = { dir: path.relative(path.join(root, 'template'), fdir), n: readdirSync(fdir).filter(f => f.endsWith('.jpg')).length, fps: FPS };
}
const WORDS = JSON.parse(readFileSync(path.join(root, ep.kaja.words), 'utf8'));

// Phosphor icons (fill) named by the episode plus the ones the template uses itself.
const names = new Set(['chat-circle-dots', 'check-circle', 'list-checks', 'camera', 'arrow-circle-right']);
(ep.cards || []).forEach(c => names.add(c[2]));
((ep.summary || {}).items || []).forEach(i => names.add(i[0]));
if (ep.layout === 'story5') ['storefront', 'question', 'sliders-horizontal', 'caret-right', 'chats-circle', 'eye-slash', 'check-circle', 'calendar-blank', 'cursor-click'].forEach(n => names.add(n));
if (ep.layout === 'story6') ['seal-question', 'check-circle', 'x-circle', 'barcode', 'target', 'calendar-blank', 'magnifying-glass', 'arrow-right'].forEach(n => names.add(n));
if (ep.layout === 'story4') ['check-circle', 'chats-circle', 'list-checks', 'arrows-left-right', 'translate', 'plus-circle'].forEach(n => names.add(n));
if (ep.layout === 'story3') ['package', 'pencil-simple', 'warning-circle', 'calendar-blank', 'check-circle', 'list-checks'].forEach(n => names.add(n));
if (ep.layout === 'story2') ['lock-simple', 'user-plus', 'link-simple', 'plugs-connected', 'lightning', 'download-simple', 'file-xls', 'chats-circle'].forEach(n => names.add(n));
(ep.terms || []).forEach(t => names.add(t[0]));
(ep.icons || []).forEach(n => names.add(n));
const PH = {};
for (const n of names) {
  const f = path.join(root, 'node_modules/@phosphor-icons/core/assets/fill', `${n}-fill.svg`);
  if (!existsSync(f)) throw new Error(`Phosphor icon ${n} (fill) does not exist`);
  PH[n] = readFileSync(f, 'utf8');
}

const browser = await puppeteer.launch({
  args: [...chromium.args, '--allow-file-access-from-files', '--font-render-hinting=none'],
  executablePath: await chromium.executablePath(),
  headless: true,
  defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.evaluateOnNewDocument(`window.EP = ${JSON.stringify(ep)}; window.WORDS = ${JSON.stringify(WORDS)}; window.PH = ${JSON.stringify(PH)}; window.KF = ${JSON.stringify(KF)};`);
await page.goto('file://' + path.join(root, 'template', (ep.layout || 'story') + '.html'), { waitUntil: 'load' });
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.duration());
console.log(`${ep.id}: duration ${duration.toFixed(2)}s, ${KF.n} Kaja frames`);

// Readable things outside the stories safe zone (x 36..1044, y 250..1580) while visible.
const report = () => page.evaluate(() => {
  const o = [];
  const reels = !!document.querySelector('#split') || document.body.dataset.reels === '1';            // layout 2 is cut for Reels: y 330–1440, clear of the right-hand buttons
  const big = id => { const e = document.querySelector(id); if (!e) return false; const m = getComputedStyle(e).clipPath.match(/circle\(([\d.]+)px/); return m && parseFloat(m[1]) > 900; };
  const sumOn = (() => { const e = document.querySelector('#sum'); if (!e) return false; const m = getComputedStyle(e).clipPath.match(/inset\(([\d.]+)%/); return m && parseFloat(m[1]) < 40; })();
  const kajaVisible = !big('#insC') && !big('#insO') && !sumOn && parseFloat(getComputedStyle(document.querySelector('#kwrap')).opacity) > .5;
  document.querySelectorAll(reels ? '.rd' : '.ncard,.cw,.hhead .line,.hsub,.kick,.bub,.chip,.tbl,.shead .line,.scard,.snext,.sbrand').forEach(el => {
    if (el.closest('#kwrap')) return;
    let v = el, op = 1;
    while (v && v !== document.body) { const cs = getComputedStyle(v); op *= parseFloat(cs.opacity); if (cs.clipPath && cs.clipPath.includes('circle(0px')) op = 0; if (cs.clipPath && cs.clipPath.includes('inset(100%')) op = 0; v = v.parentElement; }
    if (op < .5) return;
    const r = el.getBoundingClientRect();
    if (!r.width || r.right < 0 || r.left > 1080 || r.top > 1920 || r.bottom < 0) return;
    if (el.classList.contains('fly')) return;
    const name = `.${el.className.split(' ').join('.')} "${el.textContent.trim().slice(0, 26)}"`;
    if (reels ? (r.left < 40 || r.right > 1040 || r.top < 330 || r.bottom > 1440 || (r.bottom > 1000 && r.right > 950)) : (r.left < 36 || r.right > 1044 || r.top < 250 || r.bottom > 1580))
      o.push(`${name} L${Math.round(r.left)} R${Math.round(r.right)} T${Math.round(r.top)} B${Math.round(r.bottom)}`);
    // never over Kaja's head: #khead moves and scales with her framing; skip while an insert or the summary covers her
    if (kajaVisible && !el.closest('.ins,#sum') && !el.closest('#split')) {   // inserts and the summary are opaque: they hide her
      const h = document.querySelector('#khead').getBoundingClientRect();
      if (r.left < h.right && r.right > h.left && r.top < h.bottom && r.bottom > h.top)
        o.push(`${name} COVERS KAJA'S HEAD (head T${Math.round(h.top)} B${Math.round(h.bottom)} L${Math.round(h.left)} R${Math.round(h.right)})`);
    }
  });
  return o;
});

if (mode === 'preview') {
  for (const ts of rest) {
    const t = parseFloat(ts);
    await page.evaluate(t => window.seek(t), t);
    await page.screenshot({ path: path.join(out, `p_${ts.padStart(5, '0')}.png`) });
    const o = await report();
    console.log(t, o.length ? '\n   ' + o.join('\n   ') : 'ok');
  }
} else if (mode === 'full') {
  const file = path.join(out, `${ep.id}.silent.mp4`);
  const n = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', file],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now(), bad = new Set();
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.seek(t), i / FPS);
    if (i % 3 === 0) for (const l of await report()) bad.add(l);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  if (bad.size) console.log('outside the safe zone:\n   ' + [...bad].join('\n   '));
  console.log('done', file, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await browser.close();
