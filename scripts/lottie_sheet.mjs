// Contact sheet of a Lottie animation: 6 frames on light and on dark -> build/lottie/<name>_sheet.png
// Usage: node scripts/lottie_sheet.mjs assets/lottie/w50.json
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const file = path.resolve(process.argv[2]);
const data = readFileSync(file, 'utf8');
const out = path.join(root, 'build', 'lottie', path.basename(file, '.json') + '_sheet.png');
mkdirSync(path.dirname(out), { recursive: true });
const browser = await puppeteer.launch({ args: [...chromium.args, '--allow-file-access-from-files'],
  executablePath: await chromium.executablePath(), headless: true, defaultViewport: { width: 1320, height: 480 } });
const page = await browser.newPage();
await page.setContent(`<html><body style="margin:0;font:14px sans-serif">
  <div id="g" style="display:grid;grid-template-columns:repeat(6,220px)"></div></body></html>`, { waitUntil: 'load' });
await page.addScriptTag({ path: path.join(root, 'node_modules/lottie-web/build/player/lottie_svg.min.js') });
await page.evaluate(json => {
  const d = JSON.parse(json), g = document.getElementById('g');
  ['#ffffff', '#0F1714'].forEach(bg => [0, .2, .4, .6, .8, 1].forEach(p => {
    const c = document.createElement('div'); c.style.cssText = `width:220px;height:220px;background:${bg};position:relative`;
    const lab = document.createElement('span'); lab.textContent = Math.round(p * 100) + '%';
    lab.style.cssText = `position:absolute;left:6px;top:4px;color:${bg === '#ffffff' ? '#888' : '#aaa'}`;
    const box = document.createElement('div'); box.style.cssText = 'width:200px;height:200px;margin:10px';
    c.append(box, lab); g.append(c);
    const a = lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: JSON.parse(JSON.stringify(d)) });
    a.goToAndStop(Math.round(p * (a.totalFrames - 1)), true);
  }));
}, data);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1320, height: 440 } });
await browser.close();
console.log('sheet', out);
