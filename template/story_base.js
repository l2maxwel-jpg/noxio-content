// Shared helpers for Kaja layouts from story5 on. A layout script calls SB.boot(layoutFn, buildFn).
// window.EP, WORDS ([text, start, end, key, brk]), PH (Phosphor fill SVGs), KF (Kaja frames) come from story_render.mjs.
window.SB = (() => {
  const EP = window.EP, W = window.WORDS, KF = window.KF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = n => { const s = (window.PH || {})[n]; if (!s) throw new Error(`Phosphor icon ${n} not loaded`); return `<i class="ph">${s}</i>`; };
  const EMO = /(?:[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?)/gu;
  const emo = html => html.replace(EMO, m => `<img class="emo" src="../assets/emoji/${[...m].map(c => c.codePointAt(0).toString(16).toUpperCase()).join('-')}.svg" alt="">`);
  const PAL = ['#0098B7', '#F59E0B', '#8B5CF6', '#64748B', '#EC4899'];
  const col = (() => { const m = {}; let k = 0; return n => (m[n] = m[n] || PAL[k++ % PAL.length]); })();
  const av = (n, c) => `<div class="av" style="background:${c || col(n)}">${n[0]}</div>`;
  const FR = EP.ui.frames;
  function kaja() {
    const [x1, y1, x2, y2] = EP.kaja.head, [FX, FY] = EP.kaja.face;
    Object.assign($('#khead').style, { left: x1 + 'px', top: y1 + 'px', width: (x2 - x1) + 'px', height: (y2 - y1) + 'px' });
    $('#kcam').style.transformOrigin = `${FX}px ${FY}px`;
    $('#ui').style.top = EP.ui.top + 'px';
    if (EP.kaja.key) document.getElementById('stage').classList.add('keyed');
    const bg = $('#bg'); if (bg) { bg.innerHTML = '<div class="bl a"></div><div class="bl b"></div><div class="gr"></div>'; Object.entries(EP.ui.scene || {}).forEach(([k, v]) => bg.style.setProperty('--' + k, v)); }
  }
  // framings: hard cuts on phrase starts, a slow push-in inside each shot
  function shots(tl) {
    EP.shots.forEach(([t, k], i) => {
      const f = FR[k], end = EP.shots[i + 1] ? EP.shots[i + 1][0] : EP.end;
      const d = EP.shots[i][2] || 0;
      if (d) tl.to('#kcam', { scale: f.s, x: f.x || 0, y: f.y || 0, duration: d, ease: 'power3.inOut' }, t);
      else tl.set('#kcam', { scale: f.s, x: f.x || 0, y: f.y || 0 }, t);
      if (!EP.ui.still) tl.to('#kcam', { scale: f.s * 1.025, duration: Math.max(0.1, end - t - d), ease: 'none' }, t + d);
    });
  }
  function subsLayout(style) {
    const ph = []; let cur = null;
    W.forEach((w, i) => {
      const prev = W[i - 1];
      if (EP.subs ? EP.subs.includes(i) : (!cur || (prev && prev[4]) || cur.chars + w[0].length > 30)) { cur = { words: [], chars: 0 }; ph.push(cur); }
      cur.words.push(i); cur.chars += w[0].length + 1;
    });
    window.PHR = ph;
    $('#caps').innerHTML = ph.map(p => `<div class="sub ${style} rd">${p.words.map(i => `<span class="${W[i][3] ? 'k' : ''}">${W[i][0]}</span>`).join(' ')}</div>`).join('');
    if (EP.ui.subTop) $$('.sub').forEach(el => { el.style.top = EP.ui.subTop + 'px'; });
  }
  function subs(tl, from = { opacity: 0, y: 12 }) {
    window.PHR.forEach((c, k) => {
      const el = $$('.sub')[k], a = W[c.words[0]][1], last = W[c.words[c.words.length - 1]];
      const nx = window.PHR[k + 1], off = nx ? Math.min(W[nx.words[0]][1] - 0.02, last[2] + 0.5) : Math.min(EP.end - 0.02, last[2] + 0.6);
      gsap.set(el, { xPercent: -50, opacity: 0 });
      tl.fromTo(el, from, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: 'back.out(1.6)', immediateRender: false }, Math.max(0, a - 0.04));
      tl.set(el, { opacity: 0 }, off);
    });
  }
  // helpers for entrances that never start before their time
  const inn = (tl, sel, from, t, d = 0.35, ease = 'back.out(1.6)') => tl.fromTo(sel, Object.assign({ opacity: 0 }, from), { opacity: 1, x: 0, y: 0, scale: 1, rotation: from.endRot || 0, duration: d, ease, immediateRender: false }, t);
  const out = (tl, sel, t, to = { y: 50 }) => tl.to(sel, Object.assign({ opacity: 0, duration: 0.25, ease: 'power2.in' }, to), t - 0.25);
  const flash = (tl, t, o = 0.3) => tl.to('#flash', { opacity: o, duration: 0.04 }, t).to('#flash', { opacity: 0, duration: 0.2 }, t + 0.04);
  function boot(layoutFn, buildFn) {
    const kimg = $('#kimg'); let cur = 0;
    const frame = async t => {
      const i = Math.max(1, Math.min(KF.n, 1 + Math.floor(t * KF.fps + 1e-6)));
      if (i === cur) return; cur = i;
      kimg.src = `${KF.dir}/${String(i).padStart(4, '0')}.${KF.ext || 'jpg'}`;
      await kimg.decode().catch(() => {});
    };
    window.ready = (async () => {
      kaja(); layoutFn();
      await document.fonts.ready; await frame(0);
      await Promise.all([...document.images].map(im => im.decode().catch(() => {})));
      const tl = gsap.timeline({ paused: true });
      shots(tl); buildFn(tl); tl.set({}, {}, EP.end);
      window.tl = tl; tl.seek(0); return true;
    })();
    window.seek = async t => { window.tl.seek(t, false); await frame(t); };
    window.duration = () => window.tl.duration();
  }
  return { EP, W, $, $$, ic, emo, av, col, subsLayout, subs, inn, out, flash, boot };
})();
