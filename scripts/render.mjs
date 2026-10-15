// Render a Noxio episode.
//   node scripts/render.mjs preview episodes/e02.json 1.0 5.5 ...  -> build/<id>_<t>.png + layout report
//   node scripts/render.mjs full    episodes/e02.json               -> build/<id>.silent.mp4 + build/<id>.cues.json
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [mode, epPath, ...rest] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FPS = 30;
const ep = JSON.parse(readFileSync(path.resolve(epPath), 'utf8'));
const build = path.join(root, 'build');
mkdirSync(build, { recursive: true });

const browser = await puppeteer.launch({
  args: [...chromium.args, '--allow-file-access-from-files', '--font-render-hinting=none'],
  executablePath: await chromium.executablePath(),
  headless: true,
  defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('pageerror', e => console.error('PAGE ERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
await page.evaluateOnNewDocument(`window.EP = ${JSON.stringify(ep)};`);
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
