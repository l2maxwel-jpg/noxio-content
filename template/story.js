// Noxio story renderer (Kaja series). Data: window.EP (episodes/sNN.json), window.WORDS ([text, start, end, key]),
// window.PH (Phosphor fill SVGs by name), window.KF ({dir, n, fps}: Kaja video frames). Exposes ready/seek/duration like template.js.
(() => {
  const EP = window.EP, W = window.WORDS, KF = window.KF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = 'power3.out';

  // Headless Chromium has no colour emoji font: Noto SVGs from assets/emoji (scripts/emoji.py), same rule as template.js.
  const EMO = /(?:[\u{1F1E6}-\u{1F1FF}]{2})|(?:[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿〰〽㊗㊙\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?(?:‍[☀-➿\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?)*)/gu;
  const emojify = html => html.replace(EMO, m => {
    if (!m.includes('️') && m.codePointAt(0) < 0x1F000 && !'❤✅⭐✨☀'.includes(m[0])) return m;
    const c = [...m].map(ch => ch.codePointAt(0).toString(16).toUpperCase()).join('-');
    return `<img class="emo" src="../assets/emoji/${c}.svg" alt="">`;
  });
  const ic = n => { const s = (window.PH || {})[n]; if (!s) throw new Error(`Phosphor icon ${n} not loaded`); return `<i class="ph">${s}</i>`; };
  const mark = s => String(s).replace(/\[([^\]]+)\]/g, '<span class="em">$1</span>');
  const COLORS = ['#11B981', '#0098B7', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
  const bub = (name, text, i, extra = '') => `<div class="bub"${extra}><div class="ava" style="background:${COLORS[i % COLORS.length]}">${name[0]}</div>
    <div class="bt"><div class="bn">${name}</div><div class="bx">${emojify(text)}</div></div></div>`;

  const SHOT = { wide: 1.0, mid: 1.15, close: 1.28 };
  const shots = EP.shots.map(([t, kind], i) => ({ t, kind, end: i + 1 < EP.shots.length ? EP.shots[i + 1][0] : EP.end }));
  const hidden = t => t < EP.hook.until - 0.06 || shots.some(s => s.kind !== 'wide' && s.kind !== 'mid' && s.kind !== 'close' && t >= s.t - .05 && t < s.end);

  function layout() {
    const [x1, y1, x2, y2] = EP.kaja.head;   // native 1080x1920 pixels of the HeyGen frame
    Object.assign($('#khead').style, { left: x1 / 10.8 + '%', top: y1 / 19.2 + '%', width: (x2 - x1) / 10.8 + '%', height: (y2 - y1) / 19.2 + '%' });
    const h = EP.hook;
    $('#hookfg').innerHTML = `<div class="hhead">${h.head.map(l => `<span class="line">${mark(l)}</span>`).join('')}</div>
      <div class="hsub">${h.sub}</div>` + h.bubbles.map(([n, t, x, y], i) => bub(n, t, i, ` style="left:${x}px;top:${y}px"`)).join('');

    $('#caps').innerHTML = W.map(([w, , , k]) => `<div class="cw${k ? ' k' : ''}">${w}</div>`).join('');
    $('#cards').innerHTML = EP.cards.map(([, , i, a, b]) => `<div class="ncard"><div class="nic">${ic(i)}</div><div class="ntx"><b>${a}</b><span>${b}</span></div></div>`).join('');

    const C = EP.comments;
    const typo = s => C.typos.reduce((acc, [w]) => acc.replace(new RegExp(`(^|\\s)(${w})(?=[\\s,]|$)`), '$1<span class="typo">$2<i></i></span>'), s);
    $('#insC').innerHTML = `<div class="sdots"></div><div class="sglow g1"></div><div class="sglow g2"></div>
      <div class="kick">${ic('chat-circle-dots')}${C.kicker}</div>` +
      C.items.map(([n, t], i) => bub(n, '', i, ` style="top:${400 + i * 166}px;left:${i % 2 ? 140 : 60}px"`).replace('<div class="bx"></div>', `<div class="bx">${typo(emojify(t))}</div>`)).join('') +
      `<div class="chips">${C.chips.map(([c]) => `<div class="chip">${ic('check-circle')}${c}</div>`).join('')}</div>`;

    const O = EP.orders;
    $('#insO').innerHTML = `<div class="sdots"></div><div class="sglow g1"></div><div class="sglow g2"></div>
      <div class="kick g">${ic('list-checks')}${O.kicker}</div>
      <div class="tbl"><div class="colhl"></div><div class="trow th">${O.cols.map(([c]) => `<div>${c}</div>`).join('')}</div>` +
      O.rows.map(r => `<div class="trow tr"><div class="td">${r[0]}</div><div class="td p">${r[1]}</div><div class="td"><span class="sz">${r[2]}</span></div><div class="td qty">${r[3]}</div></div>`).join('') +
      `</div>` + O.rows.map((r, i) => {
        const c = EP.comments.items.find(x => x[0] === r[0]);
        return bub(r[0], c ? c[1] : r[1], i, ` data-i="${i}" style="left:-700px;top:0"`).replace('class="bub"', 'class="bub fly"');
      }).join('') +
      `<div class="ok chip">${ic('check-circle')}Gotowe po transmisji</div>`;

    const S = EP.summary;
    $('#sum').innerHTML = `<div class="sgrid"></div><div class="sglow2"></div>
      <div class="kick">${ic('camera')}${S.kicker}</div>
      <div class="shead">${S.head.map(l => `<span class="line">${mark(l)}</span>`).join('')}</div>
      <div class="scards">${S.items.map(([i, a, b], k) => `<div class="scard"><div class="sn">0${k + 1}</div><div class="si">${ic(i)}</div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
      <div class="snext">${ic('arrow-circle-right')}${S.next}</div>
      <div class="sbrand"><img src="../assets/logo.png" alt=""><b>Noxio</b><span>noxio.pl</span></div>`;
  }

  function build() {
    const tl = gsap.timeline({ paused: true });
    const k = $('#kwrap'), ki = $('#kcam'), H = EP.hook.until;

    // ---- hook: Kaja as a card under the headline, comment bubbles around it, then the card opens to full screen
    tl.set(k, { left: 287, top: 650, width: 506, height: 900, borderRadius: 48, boxShadow: '0 30px 70px rgba(17,24,39,.25)' }, 0);
    tl.from(k, { scale: .9, opacity: 0, duration: .45, ease: 'back.out(1.6)' }, 0);
    tl.from($$('.hhead .line'), { y: 60, opacity: 0, filter: 'blur(14px)', duration: .45, stagger: .12, ease: E }, 0);
    tl.from('.hsub', { y: 30, opacity: 0, duration: .4, ease: E }, .3);
    $$('#hookfg .bub').forEach((b, i) => tl.from(b, { scale: .4, opacity: 0, duration: .4, ease: 'back.out(2)', transformOrigin: i % 2 ? '100% 50%' : '0% 50%' }, EP.hook.bubbles[i][4]));
    tl.fromTo(ki, { scale: 1.12 }, { scale: 1.0, duration: H, ease: 'none' }, 0);
    tl.to(['.hhead', '.hsub'], { y: -80, opacity: 0, duration: .32, ease: 'power2.in' }, H - .3);
    tl.to('#hookfg .bub', { scale: .6, opacity: 0, duration: .25, ease: 'power2.in', stagger: .04 }, H - .32);
    tl.to(k, { left: 0, top: 0, width: 1080, height: 1920, borderRadius: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: .5, ease: 'power3.inOut' }, H - .22);
    tl.set('#hookbg', { opacity: 0 }, H + .3);

    // ---- shots: jump cuts between framings (scale about the face), with a slow push inside each shot
    for (const s of shots) {
      if (!(s.kind in SHOT)) continue;
      const sc = SHOT[s.kind];
      tl.fromTo(ki, { scale: sc }, { scale: sc + .025, duration: s.end - s.t, ease: 'none', immediateRender: false }, s.t);
    }

    // ---- inserts: a light panel opens out of Kaja's bubble (PiP); she keeps talking in the bubble
    const ins = { 'ins:comments': '#insC', 'ins:orders': '#insO' };
    for (const s of shots) {
      const sel = ins[s.kind]; if (!sel) continue;
      tl.fromTo('#pip', { scale: 0, opacity: 1 }, { scale: 1, duration: .45, ease: 'back.out(1.8)' }, s.t - .1);
      tl.fromTo(sel, { clipPath: 'circle(0px at 897px 1441px)' }, { clipPath: 'circle(2300px at 897px 1441px)', duration: .55, ease: 'power2.inOut' }, s.t - .12);
      tl.to(sel, { clipPath: 'circle(0px at 897px 1441px)', duration: .4, ease: 'power2.in' }, s.end - .42);
      tl.to('#pip', { scale: 0, duration: .25, ease: 'power2.in' }, s.end - .1);
      if (sel === '#insC') insComments(tl, s); else insOrders(tl, s);
    }

    // ---- notification cards
    $$('.ncard').forEach((c, i) => {
      const [a, b] = EP.cards[i];
      tl.fromTo(c, { y: 40, scale: .9, opacity: 0, xPercent: -50 }, { y: 0, scale: 1, opacity: 1, xPercent: -50, duration: .42, ease: 'back.out(1.7)', immediateRender: false }, a);
      tl.from($('.nic', c), { rotation: -18, scale: .6, duration: .45, ease: 'back.out(2.4)' }, a + .08);
      tl.to(c, { y: 20, opacity: 0, duration: .22, ease: 'power2.in' }, b - .22);
    });

    // ---- captions: one word at a time, key words on emerald
    $$('.cw').forEach((el, i) => {
      const [, a, b] = W[i];
      if (hidden(a)) return;
      const next = i + 1 < W.length ? W[i + 1][1] : b + .3;
      const off = Math.min(next, b + .3);
      tl.fromTo(el, { opacity: 1, scale: .78, xPercent: -50 }, { scale: 1, xPercent: -50, duration: .11, ease: 'back.out(2.5)', immediateRender: false }, a);
      tl.set(el, { opacity: 0 }, off);
    });

    // ---- summary
    const sm = shots.find(s => s.kind === 'summary');
    if (sm) {
      const T = sm.t;
      tl.to('#sum', { clipPath: 'inset(0% 0 0 0)', duration: .55, ease: 'power3.inOut' }, T - .1);
      tl.from('#sum .kick', { y: 30, opacity: 0, duration: .4, ease: E }, T + .3);
      tl.from($$('.shead .line'), { y: 60, opacity: 0, filter: 'blur(12px)', duration: .45, stagger: .1, ease: E }, T + .35);
      tl.from($$('.scard'), { y: 50, scale: .92, opacity: 0, duration: .45, stagger: .12, ease: 'back.out(1.5)' }, T + .6);
      tl.from('.snext', { x: -60, opacity: 0, duration: .45, ease: E }, T + 1.2);
      tl.from('.sbrand', { y: 30, opacity: 0, duration: .45, ease: E }, T + 1.35);
      tl.fromTo('.sgrid', { y: 0 }, { y: 72, duration: EP.end - T, ease: 'none' }, T);
    }
    tl.fromTo('.sdots', { y: 0 }, { y: 40, duration: EP.end, ease: 'none' }, 0);
    tl.set({}, {}, EP.end);
    return tl;
  }

  function insComments(tl, s) {
    const C = EP.comments, el = $('#insC');
    tl.from($('.kick', el), { y: 30, opacity: 0, duration: .35, ease: E }, s.t + .15);
    $$('.bub', el).forEach((b, i) => tl.from(b, { x: -80, scale: .6, opacity: 0, duration: .38, ease: 'back.out(1.8)', transformOrigin: '0% 50%' }, Math.max(s.t + .25, C.items[i][2])));
    const chips = $$('.chip', el);
    chips.forEach((c, i) => tl.from(c, { y: 30, scale: .7, opacity: 0, duration: .35, ease: 'back.out(2)' }, C.chips[i][1]));
    tl.from($$('.typo i', el), { scaleX: 0, duration: .35, stagger: .08, ease: 'power2.out' }, C.chips[1][1] + .05);
    // emoji wiggle on "emotki"
    tl.to($$('.bx .emo', el), { scale: 1.35, duration: .18, yoyo: true, repeat: 1, stagger: .05, ease: 'sine.inOut' }, C.chips[2][1] + .05);
  }

  function insOrders(tl, s) {
    const O = EP.orders, el = $('#insO');
    tl.from($('.kick', el), { y: 30, opacity: 0, duration: .35, ease: E }, s.t + .15);
    tl.from($('.tbl', el), { y: 60, opacity: 0, duration: .4, ease: E }, s.t + .2);
    const rows = $$('.tr', el), flies = $$('.fly', el);
    rows.forEach((r, i) => {
      const at = s.t + .1 + i * .07, ry = 396 + 14 + 96 + i * 136;
      // the comment flies in from the left and shrinks into its row, then the row appears
      tl.fromTo(flies[i], { left: -620, top: ry, scale: .9, opacity: 1 }, { left: 70, scale: .62, duration: .3, ease: 'power3.out', transformOrigin: '0% 50%' }, at);
      tl.to(flies[i], { opacity: 0, x: 40, duration: .14 }, at + .3);
      tl.from($$('.td', r), { opacity: 0, x: -24, duration: .25, stagger: .03, ease: E }, at + .3);
    });
    // column highlight walks with the voice: kto, co, jaki rozmiar, ile sztuk
    const hl = $('.colhl', el), ths = $$('.th > div', el);
    const X = [26, 266, 658, 834], Wd = [232, 384, 168, 106];
    O.cols.forEach(([, at], i) => {
      if (i === 0) tl.fromTo(hl, { opacity: 0, left: X[0] - 8, width: Wd[0] }, { opacity: 1, duration: .2 }, at);
      else tl.to(hl, { left: X[i] - 8, width: Wd[i], duration: .25, ease: 'power3.inOut' }, at);
      tl.set(ths[i], { color: '#11B981' }, at);
      if (i > 0) tl.set(ths[i - 1], { color: '#6B7280' }, at);
      tl.fromTo($$(`.tr > div:nth-child(${i + 1})`, el), { scale: 1 }, { scale: 1.08, duration: .14, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '0% 50%' }, at);
    });
    tl.from($('.ok', el), { y: 30, scale: .7, opacity: 0, duration: .35, ease: 'back.out(2)' }, O.cols[3][1] + .45);
  }

  // ---- Kaja frames (swapped on seek), the same frame in the PiP bubble
  const kimg = $('#kimg'), pimg = $('#pimg');
  let cur = 0;
  const frame = async t => {
    const i = Math.max(1, Math.min(KF.n, 1 + Math.floor(t * KF.fps + 1e-6)));
    if (i === cur) return;
    cur = i;
    const src = `${KF.dir}/${String(i).padStart(4, '0')}.jpg`;
    kimg.src = src; pimg.src = src;
    await Promise.all([kimg.decode().catch(() => {}), pimg.decode().catch(() => {})]);
  };

  window.ready = (async () => {
    layout();
    await document.fonts.ready;
    await frame(0);
    await Promise.all([...document.images].map(im => im.decode().catch(() => {})));
    window.tl = build();
    window.tl.seek(0);
    return true;
  })();
  window.seek = async t => { window.tl.seek(t, false); await frame(t); };
  window.duration = () => window.tl.duration();
})();
