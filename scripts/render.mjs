// Render a Noxio episode.
//   node scripts/render.mjs preview episodes/e02.json 1.0 5.5 ...  -> build/<id>_<t>.png + layout report
//   node scripts/render.mjs full    episodes/e02.json               -> build/<id>.silent.mp4 + build/<id>.cues.json
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [mode, epPath, ...rest] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FPS = 30;
const ep = JSON.parse(readFileSync(path.resolve(epPath), 'utf8'));
const build = path.join(root, 'build');
mkdirSync(build, { recursive: true });

// ---- media the page cannot load by itself ----
// Video covers ("video": "mixkit:<id>"): the clip is downloaded again from the page noted in assets/clips.md when build/ is
// empty (clips are never committed), then cut into frames that the template swaps on every seek.
ep.scenes.forEach((s, i) => {
  if (!s.video) return;
  const id = String(s.video).replace(/^mixkit:/, '');
  const clip = path.join(build, 'mixkit', `${id}.mp4`);
  if (!existsSync(clip)) {
    const row = readFileSync(path.join(root, 'assets/clips.md'), 'utf8').split('\n').find(l => l.split('|').map(x => x.trim())[2] === id);
    if (!row) throw new Error(`clip ${id} is not in assets/clips.md — fetch it with scripts/fetch_clip.sh`);
    execFileSync(path.join(root, 'scripts/fetch_clip.sh'), ['-', row.split('|')[3].trim()], { stdio: 'inherit' });
  }
  const len = (s.dur || 3.2) + .8, rate = s.rate || 1, start = s.clipStart || 0;
  const dir = path.join(build, 'frames', `${ep.id}_${i}`), key = JSON.stringify({ id, len, rate, start, cropX: s.cropX ?? .5 });
  if (!existsSync(path.join(dir, 'key.json')) || readFileSync(path.join(dir, 'key.json'), 'utf8') !== key) {
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(start), '-i', clip, '-t', String(len), '-an',
      '-vf', `setpts=PTS/${rate},fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920:(iw-1080)*${s.cropX ?? .5}:(ih-1920)/2`,
      '-q:v', '3', path.join(dir, '%04d.jpg')]);
    writeFileSync(path.join(dir, 'key.json'), key);
  }
  s.frames = { dir: `../build/frames/${ep.id}_${i}`, n: readdirSync(dir).filter(f => f.endsWith('.jpg')).length, fps: FPS };
});
// Lottie JSON by src (paths relative to template/, e.g. "../assets/lottie/w50.json").
const LOTTIE = {};
for (const s of ep.scenes) for (const o of [].concat(s.lottie || [])) {
  const src = typeof o === 'string' ? o : o.src;
  LOTTIE[src] = JSON.parse(readFileSync(path.resolve(root, 'template', src), 'utf8'));
}
// Phosphor icons named in the episode (":ph-name:" / ":ph-name.fill:" in texts, the third field of a wtips item).
const PH = {};
// The template's own scenes use some too (import series), and an ibatch item names its icon in its first field.
const PHRE = /:ph-([a-z0-9-]+)(?:\.(bold|fill|duotone|regular|light|thin))?:/g;
const tplText = ['template/template.js', 'template/l10n.js'].map(f => readFileSync(path.join(root, f), 'utf8')).join('\n');
const icons = [...JSON.stringify(ep).matchAll(PHRE), ...tplText.matchAll(PHRE)].filter(m => !m[1].includes('$')).map(m => [m[1], m[2] || 'bold']);
for (const s of ep.scenes) if (s.type === 'wtips') for (const it of s.items || []) if (it[2]) { const [n, w] = it[2].split('.'); icons.push([n, w || 'bold']); }
for (const s of ep.scenes) if (s.type === 'ibatch') for (const it of s.items || []) icons.push([it[0], 'fill']);
for (const [n, w] of icons) {
  const f = path.join(root, 'node_modules/@phosphor-icons/core/assets', w, w === 'regular' ? `${n}.svg` : `${n}-${w}.svg`);
  if (!existsSync(f)) throw new Error(`Phosphor icon ${n} (${w}) does not exist`);
  PH[`${n}.${w}`] = readFileSync(f, 'utf8');
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
await page.evaluateOnNewDocument(`window.EP = ${JSON.stringify(ep)}; window.LOTTIE = ${JSON.stringify(LOTTIE)}; window.PH = ${JSON.stringify(PH)};`);
await page.goto('file://' + path.join(root, 'template', 'index.html'), { waitUntil: 'load' });
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.duration());
const cues = await page.evaluate(() => window.cues);
writeFileSync(path.join(build, `${ep.id}.cues.json`), JSON.stringify(cues, null, 1));
console.log(`${ep.id}: duration ${duration}s, scenes ${cues.scenes.map(s => s.type).join(' > ')}`);

// Text that leaves the frame or the feed-safe band (y 320..1450: 4:5 feed crop, Reels caption) while its scene is visible.
async function layoutReport() {
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.scene').forEach(s => {
      if (parseFloat(getComputedStyle(s).opacity) < 0.5) return;
      s.querySelectorAll('.line,.p1,.p2,.big,.chip,.pill,.cta,.tag,.sub,.ot,.os,.inp,.qb,.tt,.badge,.msg,.small,.tcard,.chat,.cardB,.nocode,.dn,.fr,.wmtxt,.gcard,.gb,.xcard,.sheet,.mcard,.src,.rcard,.rq,.scard,.sbub,.srow').forEach(el => {
        if (el.closest('.fly,.feed,.bgwrap')) return;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        if (r.right > 1040 || r.left < 36 || r.bottom > 1450 || r.top < 320)   // feed-safe band, see SAFE in template.js
          out.push(`${s.className} .${el.className} "${el.textContent.trim().slice(0, 28)}" L${Math.round(r.left)} R${Math.round(r.right)} B${Math.round(r.bottom)}`);
      });
    });
    return out;
  });
}

if (mode === 'preview') {
  for (const ts of rest) {
    const t = parseFloat(ts);
    await page.evaluate(t => window.seek(t), t);
    await page.screenshot({ path: path.join(build, `${ep.id}_${ts.padStart(5, '0')}.png`) });
    const o = await layoutReport();
    console.log(t, o.length ? '\n   ' + o.join('\n   ') : 'ok');
  }
} else if (mode === 'full') {
  const out = path.join(build, `${ep.id}.silent.mp4`);
  const n = Math.round(duration * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-vf', 'noise=c0s=3:c0f=t+u', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.seek(t), i / FPS);
    const buf = await page.screenshot({ type: 'png', optimizeForSpeed: true });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await browser.close();
