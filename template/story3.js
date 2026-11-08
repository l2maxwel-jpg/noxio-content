// Kaja episode, layout 3 (episodes/sNN.json with "layout": "story3"). Same contract as story.js / story2.js:
// window.EP, WORDS ([text, start, end, key, brk]), PH (Phosphor fill SVGs), KF (Kaja frames, here keyed RGBA webp);
// exposes ready / seek / duration.
(() => {
  const EP = window.EP, W = window.WORDS, KF = window.KF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = 'power3.out';
  const ic = n => { const s = (window.PH || {})[n]; if (!s) throw new Error(`Phosphor icon ${n} not loaded`); return `<i class="ph">${s}</i>`; };
  const EMO = /(?:[\u{1F1E6}-\u{1F1FF}]{2})|(?:[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿〰〽㊗㊙\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?(?:‍[☀-➿\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?)*)/gu;
  const emo = html => html.replace(EMO, m => {
    if (!m.includes('️') && m.codePointAt(0) < 0x1F000 && !'❤✅⭐✨☀'.includes(m[0])) return m;
    return `<img class="emo" src="../assets/emoji/${[...m].map(c => c.codePointAt(0).toString(16).toUpperCase()).join('-')}.svg" alt="">`;
  });
  // avatar colours of the test buyers: the heroine is emerald, everybody else gets a neutral or teal tone
  const PAL = ['#0098B7', '#94A3B8', '#F59E0B', '#0F766E', '#64748B'];
  const hero = (EP.order || {}).buyer;
  const col = (() => { const m = {}; let k = 0; return n => n === hero ? '#11B981' : (m[n] = m[n] || PAL[k++ % PAL.length]); })();
  const av = (n, cls = 'av') => `<div class="${cls}" style="background:${col(n)}">${n[0]}</div>`;
  const cm = (n, t, e) => `<div class="cm${e ? ' e' : ''} rd">${av(n)}<div><div class="cn">${n}</div><div class="ct">${emo(t)}</div></div></div>`;
  const [FX, FY] = EP.kaja.face;
  const POSE = { mid: { s: 1.12, x: 0, y: 30 }, side: { s: 0.68, x: 245, y: 470 }, center: { s: 1.0, x: 0, y: 60 }, close: { s: 1.25, x: 0, y: 30 } };

  function layout() {
    const [x1, y1, x2, y2] = EP.kaja.head;
    Object.assign($('#khead').style, { left: x1 + 'px', top: y1 + 'px', width: (x2 - x1) + 'px', height: (y2 - y1) + 'px' });
    $('#kcam').style.transformOrigin = `${FX}px ${FY}px`;
    const H = EP.hook;
    $('#hook').innerHTML = H.bubbles.map(b => cm(b[0], b[1], 1)).join('') + `<div class="pk">${ic('package')}<div class="bd rd">?</div></div>`;
    $$('#hook .cm').forEach((el, i) => { el.style.top = (830 + i * 128) + 'px'; });
    const F = EP.feed;
    $('#feed').innerHTML = `<div class="head rd"><span class="dot"></span>${F.title}</div>` + F.items.map(c => cm(c[0], c[1], c[3])).join('');
    $$('#feed .cm').forEach((el, i) => { el.style.top = (80 + i * 108) + 'px'; });
    const M = EP.manual;
    $('#manual').innerHTML = `<div class="panel" style="margin-top:60px"><div class="ptitle rd">${ic('pencil-simple')}${M.title}</div>` +
      M.rows.map(r => `<div class="mrow"><div class="it rd"><b>${r[0]}</b><span>${M.buyer}</span></div><div class="bx">${ic('package')}</div></div>`).join('') +
      `</div><div class="warn rd">${ic('warning-circle')}${M.warn[0]}</div>`;
    const N = EP.noxio;
    $('#noxio').innerHTML = `<div class="nxhead"><img src="../assets/logo.png" alt=""><b class="rd">Noxio</b><span class="chip rd">${ic('check-circle')}${N.chip}</span></div>` +
      `<div class="scan">${EP.feed.items.map(c => `<div class="ln${c[3] ? ' e' : ''}" style="width:${60 + (c[1].length * 7) % 35}%"></div>`).join('')}<div class="bar"></div></div>` +
      `<div class="grp"><div class="gmain"><div class="gh rd">${av(N.main[0])}${N.main[0]}</div>${N.main[1].map(t => `<div class="gi rd">${ic('check-circle')}${t}</div>`).join('')}</div>` +
      N.others.map(o => `<div class="gsm rd">${av(o[0])}${o[0]}<span>· ${o[1]}</span></div>`).join('') + `</div>`;
    const O = EP.order;
    $('#order').innerHTML = `<div class="oh">${av(O.buyer)}<b class="rd">${O.buyer}</b><span class="chip rd">${ic('check-circle')}${O.chip[0]}</span></div>` +
      `<div class="ocols rd"><div>${O.cols[0]}</div><div>${O.cols[1]}</div><div>${O.cols[2]}</div></div>` +
      O.rows.map(r => `<div class="orow rd"><div>${r[0]}</div><div><span class="sz">${r[1]}</span></div><div class="q">${r[2]}${ic('check-circle')}</div></div>`).join('') +
      `<div class="ofoot rd">${ic('list-checks')}<span>${O.count[0]}</span></div><div class="sticker rd">${ic('package')}${O.pack[0]}</div>`;
    $('.ofoot .ph').style.cssText = 'width:34px;height:34px;color:#11B981';
    const T = EP.tease;
    $('#tease').innerHTML = `<div class="tk rd">${ic('calendar-blank')}${T.kicker}</div><div class="tt rd">${T.title}</div><div class="tb rd"><img src="../assets/logo.png" alt="">Noxio · noxio.pl</div>`;
    // kinetic captions: chunks of at most two words / 14 characters, new chunk after punctuation or a pause
    const chunks = []; let cur = null;
    W.forEach((w, i) => {
      const prev = W[i - 1];
      if (!cur || cur.words.length >= 2 || (prev && (prev[4] || w[1] - prev[2] > 0.25)) || cur.chars + w[0].length > 14) { cur = { words: [], chars: 0 }; chunks.push(cur); }
      cur.words.push(i); cur.chars += w[0].length + 1;
    });
    window.CHUNKS = chunks;
    $('#caps').innerHTML = chunks.map(c => `<div class="kw rd">${c.words.map(i => `<span class="${W[i][3] ? 'k' : ''}">${W[i][0]}</span>`).join(' ')}</div>`).join('');
  }

  function build() {
    const tl = gsap.timeline({ paused: true });
    const cam = $('#kcam'), END = EP.end;
    // everything that enters later starts hidden (the tweens below do not render before they start)
    gsap.set(['#hook .cm', '#hook .pk', '#feed .head', '#feed .cm', '#manual .panel', '#manual .mrow', '#manual .bx', '#manual .warn',
      '#noxio', '#noxio .gmain', '#noxio .gi', '#noxio .gsm', '#order', '#order .orow', '#order .oh .chip', '#order .q .ph',
      '#order .ofoot', '#order .sticker', '#tease'], { opacity: 0 });
    // ---- scene: slow drift of the colour blobs
    tl.fromTo('.b1', { x: 0, y: 0 }, { x: 120, y: 90, duration: END, ease: 'sine.inOut' }, 0);
    tl.fromTo('.b2', { x: 0, y: 0 }, { x: -110, y: -120, duration: END, ease: 'sine.inOut' }, 0);
    tl.fromTo('.b3', { x: 0 }, { x: 160, duration: END, ease: 'sine.inOut' }, 0);
    // ---- Kaja's placement: smooth moves between poses, a slow push-in inside each
    EP.poses.forEach(([t, k, d], i) => {
      const p = POSE[k], next = EP.poses[i + 1], end = next ? next[0] : END;
      if (!d) tl.set(cam, { scale: p.s, x: p.x, y: p.y }, t);
      else tl.to(cam, { scale: p.s, x: p.x, y: p.y, duration: d, ease: 'power3.inOut' }, t);
      tl.to(cam, { scale: p.s * 1.025, duration: Math.max(0.1, end - t - d), ease: 'none' }, t + d);
    });
    // ---- hook: three comments, a parcel with "?", they collapse into one parcel on "Jedna"
    const H = EP.hook, hb = $$('#hook .cm'), pk = $('#hook .pk'), bd = $('#hook .bd');
    hb.forEach((el, i) => tl.fromTo(el, { scale: 0.5, opacity: 0, x: -40 }, { scale: 1, opacity: 1, x: 0, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, H.bubbles[i][2]));
    tl.fromTo(pk, { scale: 0.3, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.2)', immediateRender: false }, H.pack);
    tl.fromTo(bd, { scale: 1 }, { scale: 1.18, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, H.pack + 0.3);
    hb.forEach((el, i) => {
      const top = 830 + i * 128;
      tl.to(el, { x: 795 - 360, y: 1005 - (top + 52), scale: 0.15, opacity: 0, duration: 0.28, ease: 'power3.in' }, H.merge - 0.3 + i * 0.05);
    });
    tl.set(bd, { textContent: '1', backgroundColor: '#11B981' }, H.merge);
    tl.fromTo(pk, { scale: 1.3 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)', immediateRender: false }, H.merge);
    tl.to('#flash', { opacity: 0.35, duration: 0.04 }, H.merge).to('#flash', { opacity: 0, duration: 0.2 }, H.merge + 0.04);
    tl.to(pk, { scale: 0.4, opacity: 0, duration: 0.3, ease: 'power2.in' }, H.until - 0.3);
    // ---- feed of live comments, the heroine's three stand out
    const F = EP.feed;
    tl.fromTo('#feed .head', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: E, immediateRender: false }, F.from);
    $$('#feed .cm').forEach((el, i) => tl.fromTo(el, { x: -60, opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 0.32, ease: 'back.out(1.8)', immediateRender: false }, F.items[i][2]));
    tl.to('#feed', { x: -40, opacity: 0, duration: 0.3, ease: 'power2.in' }, F.until - 0.3);
    // ---- by hand: three separate orders, three parcels
    const M = EP.manual;
    tl.fromTo('#manual .panel', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: E, immediateRender: false }, M.from);
    $$('#manual .mrow').forEach((el, i) => tl.fromTo(el, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: E, immediateRender: false }, M.rows[i][1]));
    $$('#manual .bx').forEach((el, i) => tl.fromTo(el, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)', immediateRender: false }, M.packs + i * 0.14));
    tl.fromTo('#manual .warn', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.2)', immediateRender: false }, M.warn[1]);
    tl.to('#manual .warn', { x: 10, duration: 0.05, yoyo: true, repeat: 3 }, M.warn[1] + 0.35);
    tl.to('#manual', { x: -40, opacity: 0, duration: 0.3, ease: 'power2.in' }, M.until - 0.3);
    // ---- Noxio reads every comment and groups them by buyer
    const N = EP.noxio;
    tl.fromTo('#noxio', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: E, immediateRender: false }, N.from);
    tl.fromTo('#noxio .scan .bar', { y: -70 }, { y: 420, duration: N.scan[1] - N.scan[0], ease: 'none', immediateRender: false }, N.scan[0]);
    $$('#noxio .scan .ln').forEach((el, i) => tl.to(el, { backgroundColor: el.classList.contains('e') ? '#11B981' : '#B7C4BF', duration: 0.15 }, N.scan[0] + (i + 0.6) * (N.scan[1] - N.scan[0]) / 8));
    tl.to('#noxio .scan', { opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in' }, N.group - 0.25);
    tl.fromTo('#noxio .gmain', { y: 60, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)', immediateRender: false }, N.group);
    $$('#noxio .gi').forEach((el, i) => tl.fromTo(el, { y: -30 - i * 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', immediateRender: false }, N.group + 0.15 + i * 0.1));
    $$('#noxio .gsm').forEach((el, i) => tl.fromTo(el, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false }, N.others[i][2]));
    tl.to('#noxio', { x: -40, opacity: 0, duration: 0.3, ease: 'power2.in' }, N.until - 0.3);
    // ---- the result: one order, three items, one parcel
    const O = EP.order;
    tl.fromTo('#order', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E, immediateRender: false }, O.from);
    $$('#order .orow').forEach((el, i) => tl.fromTo(el, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: E, immediateRender: false }, O.from + 0.2 + i * 0.12));
    tl.fromTo('#order .oh .chip', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.4)', immediateRender: false }, O.chip[1]);
    $$('#order .q .ph').forEach((el, i) => tl.fromTo(el, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2.4)', immediateRender: false }, O.count[1] + i * 0.16));
    tl.fromTo('#order .ofoot', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, O.count[1]);
    tl.fromTo('#order .sticker', { scale: 1.6, opacity: 0, rotation: -14, transformOrigin: '100% 100%' }, { scale: 1, opacity: 1, rotation: -5, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, O.pack[1]);
    tl.to('#order', { y: 8, duration: 0.06, yoyo: true, repeat: 1 }, O.pack[1] + 0.26);
    tl.to('#flash', { opacity: 0.3, duration: 0.04 }, O.pack[1] + 0.26).to('#flash', { opacity: 0, duration: 0.2 }, O.pack[1] + 0.3);
    tl.to('#order', { y: 60, opacity: 0, duration: 0.3, ease: 'power2.in' }, O.until - 0.3);
    // ---- teaser of the next episode
    const T = EP.tease;
    tl.fromTo('#tease', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E, immediateRender: false }, T.from);
    tl.fromTo('#tease .tk', { scale: 1 }, { scale: 1.1, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, T.at);
    // ---- kinetic captions
    window.CHUNKS.forEach((c, k) => {
      const el = $$('.kw')[k], a = W[c.words[0]][1], last = W[c.words[c.words.length - 1]];
      const nx = window.CHUNKS[k + 1], off = nx ? Math.min(W[nx.words[0]][1] - 0.03, last[2] + 0.4) : last[2] + 0.6;
      gsap.set(el, { xPercent: -50, opacity: 0 });
      const rot = k % 2 ? 3 : -3;
      tl.fromTo(el, { opacity: 1, scale: 0.55, y: 24, rotation: rot }, { scale: 1, y: 0, rotation: 0, duration: 0.2, ease: 'back.out(2.6)', immediateRender: false }, Math.max(0, a - 0.03));
      tl.set(el, { opacity: 0 }, off);
      c.words.forEach((i, j) => { if (j) { const sp = el.children[j]; tl.set(sp, { opacity: 0 }, Math.max(0, a - 0.03)); tl.set(sp, { opacity: 1 }, W[i][1]); } });
    });
    tl.set({}, {}, END);
    return tl;
  }

  const kimg = $('#kimg'); let cur = 0;
  const frame = async t => {
    const i = Math.max(1, Math.min(KF.n, 1 + Math.floor(t * KF.fps + 1e-6)));
    if (i === cur) return; cur = i;
    kimg.src = `${KF.dir}/${String(i).padStart(4, '0')}.${KF.ext || 'jpg'}`;
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
