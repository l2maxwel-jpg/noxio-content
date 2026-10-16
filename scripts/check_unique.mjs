// Uniqueness check: every Noxio video must be one of a kind, across all languages.
// Compares every episode that is not retired (published, scheduled, planned, new files not yet in plan.json;
// spares are checked too but only warn) and fails on:
//   - the same scene order;
//   - the same cover photo, or two photos by the same author (a photo series); the same Mixkit cover clip, or two clips
//     whose ids are within 20 of each other (Mixkit numbers a shoot's clips in a row: same people, same place);
//   - the same cover headline in one language;
//   - the same product set: a shared niche or the default set (those are translations of each other,
//     so they count across languages), or own `data` sets with the same products in one language;
//   - the same scene head (same scene type, same text) in one language;
//   - the same `angle` (the episode's idea, e.g. "excel-export") less than 14 days apart, in any language
//     (an episode without a date yet counts as "now"); further apart it only warns;
// Warm-up series episodes (wNN, "series": "warmup") share one format on purpose, so their scene order is not
// compared; instead any repeated text line (a head, tip, option, claim, punchline…) in one language and a repeated
// title emoji fail.
// Warns on the same music variant within 7 days, on the same Lottie accent within 7 days, on reused cta tags and on
// episodes without an `angle`. A Lottie that replaces a warm-up's title emoji counts as its emoji (never reused).
// Usage: node scripts/check_unique.mjs [eNN|wNN ...]   (ids limit the report to pairs that involve them)
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['template/l10n.js', 'template/niches.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
const { L10N, NICHES } = ctx.window;

const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'episodes/plan.json'), 'utf8')).episodes;
const status = Object.fromEntries(plan.map(e => [e.id, e.status]));
const credits = {};
for (const line of fs.readFileSync(path.join(ROOT, 'assets/photos/CREDITS.md'), 'utf8').split('\n')) {
  const m = line.match(/^\|\s*([ew]\d+)\s*\|\s*([^|]+?)\s*\|/);
  if (m) credits[m[1]] = m[2];
}
const only = new Set(process.argv.slice(2));

// Which strings a scene shows (beyond its own head): feed comments, the order table, the AI bubble, Messenger.
const USES = { hook: ['feed'], pain: ['feed'], solution: ['feed', 'table'], ai: ['ai'], messenger: ['chat'],
  group: ['group'], excel: ['table'], review: ['review'], merge: ['merge'], setup: ['setup'] };
const HEADS = { cover: d => d.head, hook: d => [...(d.setup || []), d.p1, d.p2], codes: d => d.head, price: d => d.head,
  sendlink: d => d.head, pain: d => [...(d.head || []), d.big], solution: d => d.head, ai: d => d.head, connect: d => d.head,
  messenger: d => [...(d.head || []), d.sub], group: d => d.head, excel: d => d.head, review: d => d.head, merge: d => d.head,
  setup: d => d.head, wtitle: d => [...(d.head || []), d.sub], wtips: d => d.head, wquiz: d => d.head, wpov: d => [...(d.head || []), ...(d.punch || [])],
  wmyth: d => [...(d.head || []), d.claim] };
// Every text line a warm-up shows (comments under a POV are left out: short "+" or "беру!" repeat naturally).
const WTEXT = s => [(s.head || []).join(' '), s.sub, ...(s.items || []).flat(), ...(s.options || []), (s.punch || []).join(' '), s.claim, s.truth]
  .filter(Boolean).map(norm).filter(t => t.length >= 10);
const norm = s => String(s || '').replace(/[\[\]{}]/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
// Same rule as scripts/music.py (5 progressions), with the episode's own "music" override on top.
const music = (id, m = {}) => { if (m.track) return `track ${String(m.track).replace(/^mixkit:/, '')}`;
  const s = zlib.crc32(Buffer.from(id));
  return [m.bpm ?? [116, 120, 124, 128][s % 4], m.transpose ?? [0, 2, -2, 3, -3, 1][Math.floor(s / 4) % 6],
    m.prog ?? Math.floor(s / 24) % 5, +(m.hats16 ?? Math.floor(s / 120) % 2 === 1)].join('/'); };
// calendar days (the local date in plan.json), so 26.10 -> 09.11 is 14 days whatever the hour or DST
const dates = Object.fromEntries(plan.map(e => [e.id, e.date ? new Date(e.date.slice(0, 10) + 'T00:00:00Z') : null]));

const eps = fs.readdirSync(path.join(ROOT, 'episodes')).filter(f => /^[ew]\d+\.json$/.test(f)).map(f => {
  const ep = JSON.parse(fs.readFileSync(path.join(ROOT, 'episodes', f), 'utf8'));
  const st = status[ep.id] || 'new';
  if (st === 'retired') return null;
  const lang = ep.lang || 'ru', defs = L10N[lang].defaults, niche = ep.niche ? NICHES[ep.niche][lang] : {};
  const data = ep.data || {};
  const origin = k => (k in data) ? `own:${ep.id}` : (ep.niche && k in niche) ? `niche:${ep.niche}` : 'default';
  const value = k => (k in data) ? data[k] : (ep.niche && k in niche) ? niche[k] : L10N[lang][k];
  const scenes = ep.scenes.map(s => Object.assign({}, defs[s.type] || {}, s));
  const used = new Set(scenes.flatMap(s => USES[s.type] || []));
  const products = {};
  for (const k of used) {
    // own sets: compare what is on screen (product names, the AI comment), not the origin
    let v = value(k), key;
    if (k === 'table') key = (v.rows || []).map(r => norm(r[1])).sort().join('|');
    else if (k === 'feed') key = v.filter((_, i) => [0, 1, 3, 4].includes(i)).map(c => norm(c[1])).sort().join('|');
    else if (k === 'ai') key = norm(v.html);
    else if (k === 'chat') key = (v.msgs || []).map(norm).join('|');
    else key = JSON.stringify(v);
    const o = origin(k);
    products[k] = o.startsWith('own:') ? `${lang}:${key}` : `${o}:${k}`;   // niche/default sets are translations: no lang
  }
  const cover = scenes.find(s => s.type === 'cover');
  return { id: ep.id, lang, st, ep, scenes, products,
    order: scenes.map(s => s.type + (s.only ? `:${s.only}` : '')).join('>'),
    photo: cover && (cover.photo || cover.src) ? path.basename(cover.photo || cover.src) : null,
    clip: cover && cover.video ? +String(cover.video).replace(/^mixkit:/, '') : null,
    lotties: new Set(scenes.filter(s => s.type !== 'wtitle').flatMap(s => [].concat(s.lottie || []).map(o => typeof o === 'string' ? o : o.src))),
    author: credits[ep.id] || null,
    coverHead: cover && cover.head ? norm(cover.head.join(' ')) : null,
    heads: scenes.filter(s => s.type !== 'cover' && HEADS[s.type]).map(s => `${s.type}:${norm(HEADS[s.type](s).filter(Boolean).join(' '))}`),
    cta: norm((scenes.find(s => s.type === 'cta') || {}).tag),
    warm: ep.series === 'warmup', texts: new Set(scenes.flatMap(WTEXT)),
    emoji: (t => t ? t.emoji || (t.lottie ? 'lottie ' + [].concat(t.lottie).map(o => typeof o === 'string' ? o : o.src)[0] : null) : null)(scenes.find(s => s.type === 'wtitle')),
    angle: ep.angle || null, date: dates[ep.id] || new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z'),
    music: music(ep.id, ep.music) };
}).filter(Boolean).sort((a, b) => a.id.localeCompare(b.id));

const errors = [], warns = [];
const report = (a, b, what, hard = true) => {
  if (only.size && !only.has(a.id) && !only.has(b.id)) return;
  const spare = [a, b].filter(e => e.st === 'spare').map(e => e.id);
  const msg = `${a.id} (${a.lang}, ${a.st}) ↔ ${b.id} (${b.lang}, ${b.st}): ${what}` + (spare.length ? `  [spare ${spare.join(', ')}: change it before use]` : '');
  (hard && !spare.length ? errors : warns).push(msg);
};
for (let i = 0; i < eps.length; i++) for (let j = i + 1; j < eps.length; j++) {
  const a = eps[i], b = eps[j], same = a.lang === b.lang;
  const days = Math.abs(a.date - b.date) / 864e5;
  if (a.order === b.order && !(a.warm && b.warm)) report(a, b, `same scene order ${a.order}`);
  if (same && (a.warm || b.warm)) { const dup = [...a.texts].filter(t => b.texts.has(t)); if (dup.length) report(a, b, `same text "${dup[0]}"` + (dup.length > 1 ? ` (+${dup.length - 1})` : '')); }
  if (a.emoji && a.emoji === b.emoji) report(a, b, `same title emoji ${a.emoji}`);
  if (a.clip && b.clip && Math.abs(a.clip - b.clip) <= 20) report(a, b, a.clip === b.clip ? `same cover clip mixkit:${a.clip}` : `cover clips mixkit:${a.clip} and mixkit:${b.clip} come from one Mixkit shoot`);
  if (days < 7) { const dup = [...a.lotties].filter(x => b.lotties.has(x)); if (dup.length) report(a, b, `same Lottie ${dup.join(', ')} ${days.toFixed(0)} days apart`, false); }
  if (a.photo && a.photo === b.photo) report(a, b, `same cover photo ${a.photo}`);
  else if (a.author && a.author === b.author) report(a, b, `cover photos by the same author (${a.author}) — a photo series`);
  if (same && a.coverHead && a.coverHead === b.coverHead) report(a, b, `same cover headline "${a.coverHead}"`);
  for (const k of Object.keys(a.products)) if (b.products[k] && a.products[k] === b.products[k])
    report(a, b, `same ${k} products (${a.products[k].startsWith('niche:') || a.products[k].startsWith('default:') ? a.products[k].split(':').slice(0, 2).join(' ') + ', translated' : 'same items'})`);
  if (same) for (const h of a.heads) if (b.heads.includes(h)) report(a, b, `same ${h.split(':')[0]} head "${h.slice(h.indexOf(':') + 1)}"`);
  if (same && a.cta && a.cta === b.cta) report(a, b, `same cta tag "${a.cta}"`, false);
  if (a.music === b.music && a.music.startsWith('track '))   // a real track: once per 14 days, and then with another cut
    report(a, b, `same music ${a.music} ${days.toFixed(0)} days apart` + (days < 14 ? '' : ' — use another part of it'), days < 14);
  else if (a.music === b.music && days < 7) report(a, b, `same music variant ${a.music} ${days.toFixed(0)} days apart (pin another one with "music")`, false);
  if (a.angle && a.angle === b.angle) {
    report(a, b, `same angle "${a.angle}" ${days.toFixed(0)} days apart` + (days < 14 ? '' : ' — make sure everything else differs'), days < 14);
  }
}
for (const e of eps) if (!e.angle && e.st !== 'published' && (!only.size || only.has(e.id))) warns.push(`${e.id}: no "angle" set`);
for (const w of warns) console.log('warn ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`${eps.length} episodes checked: ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
