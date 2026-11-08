// Kaja episode, layout 2 (episodes/sNN.json with "layout": "story2"). Same contract as story.js: window.EP, WORDS
// ([text, start, end, key, brk]), PH (Phosphor fill SVGs), KF (Kaja frames); exposes ready / seek / duration.
(() => {
  const EP = window.EP, W = window.WORDS, KF = window.KF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = 'power3.out';
  const ic = n => { const s = (window.PH || {})[n]; if (!s) throw new Error(`Phosphor icon ${n} not loaded`); return `<i class="ph">${s}</i>`; };
  const [FX, FY] = EP.kaja.face;
  const FR = { wide: { s: 1.0, y: 0 }, mid: { s: 1.17, y: 10 }, close: { s: 1.32, y: 30 }, split: { s: 1.12, y: -70 }, splitc: { s: 1.26, y: -60 } };
  const shots = EP.shots.map(([t, k], i) => ({ t, k, end: i + 1 < EP.shots.length ? EP.shots[i + 1][0] : EP.end }));
  const inSplit = t => t >= EP.split.from && t < EP.split.to;

  function layout() {
    const [x1, y1, x2, y2] = EP.kaja.head;
    Object.assign($('#khead').style, { left: x1 + 'px', top: y1 + 'px', width: (x2 - x1) + 'px', height: (y2 - y1) + 'px' });
    $('#kcam').style.transformOrigin = `${FX}px ${FY}px`;
    const H = EP.hook;
    $('#hook').innerHTML = `<div class="hcard rd"><div class="hkick">${ic('list-checks')}${H.kicker}</div>` +
      H.rows.map(r => `<div class="hrow"><div>${r[0]}</div><div class="p">${r[1]}</div><div><span class="sz">${r[2]}</span></div><div>${r[3]}</div></div>`).join('') +
      `</div><div class="stamp rd">${H.stamp[0]}</div>`;
    $('#split').innerHTML = EP.steps.map((s, i) => {
      let body = '';
      if (s.ui === 'url') body = `<div class="url">${ic('lock-simple')}<span class="typed"></span><span class="caret"></span></div>
        <div style="margin-top:26px;display:flex;gap:20px;align-items:center"><div class="btn">${ic('user-plus')}${s.button[0]}</div><div class="chip">${ic('check-circle')}${s.chip[0]}</div></div>`;
      if (s.ui === 'link') body = `<div class="url">${ic('link-simple')}<span class="typed" style="color:#9CA3AF">${s.placeholder}</span></div>
        <div class="or">${s.or}</div>
        <div style="display:flex;gap:20px;align-items:center"><div class="btn ghost">${ic('plugs-connected')}${s.alt[0]}</div><div class="chip y">${ic('lightning')}${s.chip[0]}</div></div>`;
      if (s.ui === 'list') body = s.rows.map(r => `<div class="lrow"><div>${r[0]}</div><div style="font-weight:600;color:#374151">${r[1]}</div><div><span class="sz">${r[2]}</span></div></div>`).join('') +
        `<div style="margin-top:24px;display:flex;gap:20px;align-items:center"><div class="btn">${ic('download-simple')}${s.xlsx[0]}</div><div class="file">${ic('file-xls')}${s.file[0]}</div></div>`;
      return `<div class="step rd" data-i="${i}"><div class="shead"><div class="num">${s.n}</div><div class="stitle">${s.title}</div></div><div class="sbody">${body}</div></div>`;
    }).join('');
    $('#terms').innerHTML = EP.terms.map(([i, t]) => `<div class="chip rd">${ic(i)}${t}</div>`).join('');
    const T = EP.tease;
    $('#tease').innerHTML = `<div class="tk">${ic('chats-circle')}${T.kicker}</div><div class="tt">${T.title}</div><div class="tb"><img src="../assets/logo.png" alt="">Noxio · noxio.pl</div>`;
    $('#tease').classList.add('rd');
    // phrase captions
    const phrases = []; let cur = null;
    W.forEach((w, i) => {
      const prev = W[i - 1];
      const brk = !cur || cur.words.length >= 3 || (prev && (prev[4] || w[1] - prev[2] > 0.22)) || cur.chars + w[0].length > 18 || inSplit(w[1]) !== inSplit(cur.t0);
      if (brk) { cur = { words: [], chars: 0, t0: w[1] }; phrases.push(cur); }
      cur.words.push(i); cur.chars += w[0].length + 1;
    });
    window.PHRASES = phrases;
    $('#caps').innerHTML = phrases.map(p => `<div class="cl rd">${p.words.map(i => `<span class="cw${W[i][3] ? ' k' : ''}">${W[i][0]}</span>`).join('')}</div>`).join('');
  }

  function build() {
    const tl = gsap.timeline({ paused: true });
    const cam = $('#kcam');
    // ---- framing: jump cuts between shots; smooth moves into and out of the split screen
    for (const s of shots) {
      const f = FR[s.k];
      const smooth = (s.k.startsWith('split') && Math.abs(s.t - EP.split.from) < 0.01) || (!s.k.startsWith('split') && Math.abs(s.t - EP.split.to) < 0.01);
      if (smooth) tl.to(cam, { scale: f.s, y: f.y, duration: 0.5, ease: 'power3.inOut' }, s.t - 0.15);
      else tl.set(cam, { scale: f.s, y: f.y }, s.t);
      tl.to(cam, { scale: '+=0.02', duration: Math.max(0.1, s.end - s.t - (smooth ? 0.35 : 0)), ease: 'none' }, s.t + (smooth ? 0.35 : 0));
    }
    // ---- hook: the list is already there on frame 0; the stamp slams down on "zero"
    const H = EP.hook, st = H.stamp[1];
    tl.fromTo('.hcard', { y: 0 }, { y: 0, duration: 0.01 }, 0);
    tl.fromTo('.stamp', { scale: 2.6, opacity: 0, rotation: -24 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.24, ease: 'back.out(1.4)', immediateRender: false }, st);
    tl.to('#flash', { opacity: 0.35, duration: 0.04 }, st + 0.2).to('#flash', { opacity: 0, duration: 0.18 }, st + 0.24);
    tl.to('.hcard', { x: -14, duration: 0.05, yoyo: true, repeat: 3, ease: 'sine.inOut' }, st + 0.2);
    tl.to(['.hcard', '.stamp'], { y: 80, opacity: 0, duration: 0.35, ease: 'power2.in' }, H.until - 0.35);
    // ---- split screen
    const S = EP.split;
    tl.fromTo('#split', { y: 1100 }, { y: 0, duration: 0.55, ease: 'power3.out', immediateRender: false }, S.from - 0.15);
    tl.to('#split', { y: 1100, duration: 0.45, ease: 'power3.in' }, S.to - 0.45);
    EP.steps.forEach((s, i) => {
      const el = $(`.step[data-i="${i}"]`), next = EP.steps[i + 1];
      tl.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: E, immediateRender: false }, s.from);
      tl.from($('.num', el), { scale: 0.4, rotation: -30, duration: 0.45, ease: 'back.out(2.2)' }, s.from + 0.05);
      if (next) tl.to(el, { y: -50, opacity: 0, duration: 0.25, ease: 'power2.in' }, next.from - 0.25);
      if (s.ui === 'url') {
        const typed = $('.typed', el), txt = s.type[0], p = { n: 0 };
        tl.fromTo(p, { n: 0 }, { n: txt.length, duration: 0.5, ease: 'none', immediateRender: false, onUpdate: () => { typed.textContent = txt.slice(0, Math.round(p.n)); } }, s.type[1]);
        tl.fromTo($('.caret', el), { opacity: 1 }, { opacity: 0, duration: 0.3, repeat: 12, yoyo: true, ease: 'steps(1)' }, s.from);
        tl.from($('.btn', el), { scale: 0.6, opacity: 0, duration: 0.35, ease: 'back.out(2)' }, s.button[1]);
        tl.to($('.btn', el), { scale: 0.93, duration: 0.08, yoyo: true, repeat: 1 }, s.button[1] + 0.45);
        tl.from($('.chip', el), { scale: 0.5, opacity: 0, duration: 0.35, ease: 'back.out(2.2)' }, s.chip[1]);
      }
      if (s.ui === 'link') {
        const typed = $('.typed', el);
        tl.set(typed, { textContent: s.paste[0], color: '#111827' }, s.paste[1]);
        tl.fromTo($('.url', el), { backgroundColor: '#F1F5F4' }, { backgroundColor: '#DDF7EC', duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, s.paste[1]);
        tl.from([$('.or', el), $('.btn', el)], { y: 30, opacity: 0, duration: 0.35, stagger: 0.1, ease: E }, s.alt[1]);
        tl.from($('.chip', el), { scale: 0.5, opacity: 0, duration: 0.35, ease: 'back.out(2.2)' }, s.chip[1]);
      }
      if (s.ui === 'list') {
        tl.from($$('.lrow', el), { x: -60, opacity: 0, duration: 0.3, stagger: 0.16, ease: E }, s.rowsAt);
        tl.from($('.btn', el), { scale: 0.6, opacity: 0, duration: 0.35, ease: 'back.out(2)' }, s.xlsx[1]);
        tl.to($('.btn', el), { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, s.click);
        tl.from($('.file', el), { x: 40, opacity: 0, duration: 0.35, ease: 'back.out(1.8)' }, s.click + 0.15);
      }
    });
    // ---- terms chips, teaser
    $$('#terms .chip').forEach((c, i) => tl.from(c, { y: 40, scale: 0.6, opacity: 0, duration: 0.38, ease: 'back.out(2)' }, EP.terms[i][2]));
    tl.to('#terms', { opacity: 0, y: -30, duration: 0.25 }, EP.tease.from - 0.25);
    tl.fromTo('#tease', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: E, immediateRender: false }, EP.tease.from);
    // ---- phrase captions
    window.PHRASES.forEach((p, k) => {
      const el = $$('.cl')[k], a = W[p.words[0]][1], last = W[p.words[p.words.length - 1]];
      const nextP = window.PHRASES[k + 1], off = nextP ? Math.min(W[nextP.words[0]][1] - 0.04, last[2] + 0.35) : last[2] + 0.5;
      gsap.set(el, { top: inSplit(a) ? 778 : 1250, xPercent: -50, opacity: 0 });
      tl.fromTo(el, { opacity: 1, scale: 0.9 }, { scale: 1, duration: 0.12, ease: 'back.out(2)', immediateRender: false }, Math.max(0, a - 0.04));
      tl.set(el, { opacity: 0 }, off);
      p.words.forEach(i => { const sp = el.children[p.words.indexOf(i)];
        tl.set(sp, { color: W[i][3] ? '#11B981' : '#111827' }, W[i][1]);
        tl.fromTo(sp, { scale: 1.12 }, { scale: 1, duration: 0.14, immediateRender: false }, W[i][1]); });
    });
    tl.set({}, {}, EP.end);
    return tl;
  }

  const kimg = $('#kimg'); let cur = 0;
  const frame = async t => {
    const i = Math.max(1, Math.min(KF.n, 1 + Math.floor(t * KF.fps + 1e-6)));
    if (i === cur) return; cur = i;
    kimg.src = `${KF.dir}/${String(i).padStart(4, '0')}.jpg`;
    await kimg.decode().catch(() => {});
  };
  window.ready = (async () => {
    layout();
    await document.fonts.ready; await frame(0);
    await Promise.all([...document.images].map(im => im.decode().catch(() => {})));
    window.tl = build(); window.tl.seek(0); return true;
  })();
  window.seek = async t => { window.tl.seek(t, false); await frame(t); };
  window.duration = () => window.tl.duration();
})();
