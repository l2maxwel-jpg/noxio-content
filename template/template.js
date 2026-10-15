// Builds a Noxio vertical video from window.EP (episode) + window.L10N, drives it with a paused GSAP timeline.
// Exposes: window.ready (Promise), window.seek(t), window.duration(), window.cues (for the soundtrack).
(function () {
  const EP = window.EP || { id: 'demo', lang: 'ru', scenes: ['hook','pain','solution','ai','connect','messenger','offer','cta'].map(type => ({ type })) };
  // Strings for the language, then the product niche (window.NICHES[niche][lang]) and per-episode `data` on top.
  // Objects (table, ai, chat, connect, live) merge one level deep; arrays and strings replace.
  const merge = (base, over) => {
    const out = Object.assign({}, base);
    Object.entries(over || {}).forEach(([k, v]) => {
      const b = base[k];
      out[k] = v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b) ? Object.assign({}, b, v) : v;
    });
    return out;
  };
  const lang = EP.lang || 'ru';
  const niche = EP.niche && window.NICHES && window.NICHES[EP.niche] ? window.NICHES[EP.niche][lang] : null;
  if (EP.niche && !niche) throw new Error(`niche "${EP.niche}" has no "${lang}" strings`);
  const L = merge(merge(window.L10N[lang], niche), EP.data);
  if (EP.theme === 'dark') document.body.classList.add('dark');
  const DARK = EP.theme === 'dark';
  const COLORS = ['#EF4444', '#0098B7', '#11B981', '#F59E0B', '#8B5CF6'];
  const DUR = { cover: 2.8, hook: 3.5, pain: 3.5, solution: 4.0, ai: 3.0, connect: 3.0, messenger: 3.0, offer: 2.5, cta: 2.5 };
  const BODY = { // default top, gap under head, max top before the body would run out of the safe zone
    pain: [580, 40, 605], solution: [690, 40, 910], ai: [790, 60, 945], connect: [690, 40, 870], messenger: [470, 20, 590] };
  const GLOW = { cover: 'none', hook: 'red', pain: 'red', offer: 'teal', cta: 'teal' };
  const E = 'power3.out';

  const mark = s => String(s).replace(/\[([^\]]+)\]/g, '<span class="lime">$1</span>').replace(/\{([^}]+)\}/g, '<span class="tealc">$1</span>');
  const lines = arr => arr.map(l => `<span class="line">${mark(l)}</span>`).join('');
  const bubble = (name, text, ci, cls = '') =>
    `<div class="bub ${cls}"><div class="ava" style="background:${COLORS[ci % 5]}">${name[0]}</div><div class="bt"><div class="bn">${name}</div><div class="bx">${text}</div></div></div>`;
  const check = '<svg width="30" height="20" viewBox="0 0 30 20"><path d="M2 10 L10 18 L28 2" stroke="#11B981" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const HTML = {
    cover: d => `<div class="cov"><img class="covimg" src="${d.src}" alt=""></div>`,
    hook: d => {
      const pos = [[60,640],[420,840],[140,1060],[520,1260],[90,1460],[460,1660],[200,1860],[560,2060]];
      const bg = pos.map((p, i) => bubble(L.feed[i][0], L.feed[i][1], i, 'bgb').replace('class="bub bgb"', `class="bub bgb" style="left:${p[0]}px;top:${p[1]}px"`)).join('');
      return `<div class="bgwrap">${bg}</div>
        <div class="live"><span class="dot"></span><span class="lts" style="display:grid"><span class="lt on" style="grid-area:1/1">${L.live.on}</span><span class="lt off" style="grid-area:1/1;position:relative;left:0">${L.live.off}</span></span></div>
        <div class="setup">${lines(d.setup)}</div>
        <div class="h p1 lime">${mark(d.p1)}</div>${d.p2 ? `<div class="h p2">${mark(d.p2)}</div>` : ''}`;
    },
    pain: d => `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="feedwrap"><div class="feed">${L.feed.map((f, i) => `<div style="padding-left:${i % 2 ? 150 : 80}px">${bubble(f[0], f[1], i)}</div>`).join('')}</div></div>
      <div class="h big">${mark(d.big)}</div></div>`,
    solution: d => {
      const t = L.table;
      const rows = t.rows.map(r => `<div class="trow r"><div class="c1"><span class="mini" style="background:${COLORS[r[4] % 5]}">${r[0][0]}</span>${r[0]}</div><div>${r[1]}</div><div class="c3">${r[2]}</div><div class="c4">${r[3]}</div></div>`).join('');
      const fly = [[0,90,70,1,0],[2,260,200,0,-1],[1,150,330,1,1],[5,330,460,0,-1],[3,110,590,1,2],[4,300,720,1,3]];
      const flyers = fly.map(f => bubble(L.feed[f[0]][0], L.feed[f[0]][1], f[0], 'fly').replace('class="bub fly"', `class="bub fly" data-order="${f[3]}" data-row="${f[4]}" style="left:${f[1]}px;top:${f[2]}px"`)).join('');
      return `<div class="h head">${lines(d.head)}</div>
        <div class="body"><div class="tcard"><div class="ttitle"><div class="tt"><img class="tlogo" src="../assets/logo.png" alt="">${t.title}</div><div class="badge"><span class="cnt">0</span> <span class="cw">${L.ordersWord(0)}</span></div></div>
        <div class="trow hd"><div>${t.cols[0]}</div><div>${t.cols[1]}</div><div class="c3">${t.cols[2]}</div><div class="c4">${t.cols[3]}</div></div>${rows}</div>
        <div class="flyers">${flyers}</div></div>`;
    },
    ai: d => `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="qb"><div class="ava" style="background:${COLORS[0]}">${L.ai.name[0]}</div><div class="bt"><div class="bn">${L.ai.name}</div><div class="bx">${L.ai.html}</div></div></div>
      <svg class="arrow" viewBox="0 0 60 150"><path d="M30 4 V128" stroke="#11B981" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M8 104 L30 136 L52 104" stroke="#11B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      <div class="chips"><div class="chip l">${L.ai.chips[0]}</div><div class="chip v">${L.ai.chips[1]}</div><div class="chip p">${L.ai.chips[2]}</div></div>
      <div class="nocode"><s>${L.ai.code}</s>${L.ai.nocode}</div></div>`,
    connect: d => { const c = L.connect; return `<div class="h head">${lines(d.head)}</div>
      <div class="body">${d.only === 'link' ? '' : `<div class="ocard cardA"><div><div class="ot">${c.aTitle}</div><div class="os">${c.aSub}</div></div><div class="tog"><div class="knob"></div></div></div>
      <div class="ili"><i></i>${c.or}<i></i></div>`}
      <div class="ocard cardB"${d.only === 'link' ? ' style="top:0"' : ''}><div class="ot">${c.bTitle}</div><div class="os">${c.bSub}</div><div class="inp"><span class="typed"></span><span class="cur"></span></div><div class="btn">${c.btn}</div></div></div>`; },
    messenger: d => { const c = L.chat; return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="sub">${mark(d.sub)}</div><div class="chat"><div class="chathd"><div class="ava">${c.ava}</div><div><div class="cn">${c.shop}</div><div class="cs">${c.net}</div></div></div>
      <div class="msgs">${c.msgs.map((m, i) => `<div class="msg m${i}">${m}</div><div class="sent s${i}">${c.sent} ${check}</div>`).join('')}</div></div></div>`; },
    offer: d => `<div class="h n14">${d.big}</div><div class="h dn">${mark(d.l2)}</div><div class="h fr">${mark(d.l3)}</div>
      <div class="pills">${d.pills.map(p => `<div class="pill">${p}</div>`).join('')}</div>`,
    cta: d => `<div class="wm"><img class="logo" src="../assets/logo.png" alt=""><div class="h wmtxt">${d.brand}</div></div>
      <div class="tag">${d.tag}</div><div class="cta">${d.button}</div><div class="small">${d.small}</div>`
  };

  // ---------- build DOM ----------
  const root = document.getElementById('scenes');
  const scenes = EP.scenes.map((s, i) => {
    const d = Object.assign({}, L.defaults[s.type] || {}, s);
    const el = document.createElement('section');
    el.className = `scene sc-${s.type}`;
    el.innerHTML = (d.kicker ? `<div class="kicker">${d.kicker}</div>` : '') + HTML[s.type](d);
    if (i === 0) el.style.opacity = 1;
    root.appendChild(el);
    return { type: s.type, d, el, dur: s.dur || DUR[s.type] };
  });
  const $ = (el, sel) => el.querySelector(sel);
  const $$ = (el, sel) => el.querySelectorAll(sel);

  // ---------- layout helpers ----------
  function fitWidth(el, maxW, minFs = 24) {
    let fs = parseFloat(getComputedStyle(el).fontSize), g = 0;
    const kids = $$(el, '.line');
    const widest = () => kids.length ? Math.max(...[...kids].map(k => k.getBoundingClientRect().width)) : el.getBoundingClientRect().width;
    while (widest() > maxW && fs > minFs && g++ < 300) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  function fitOverflow(container, textEl, minFs = 24) {
    let fs = parseFloat(getComputedStyle(textEl).fontSize), g = 0;
    while (container.scrollWidth > container.clientWidth + 1 && fs > minFs && g++ < 300) { fs -= 2; textEl.style.fontSize = fs + 'px'; }
  }
  const bottomOf = el => el.getBoundingClientRect().bottom;

  function layout() {
    scenes.forEach(s => {
      const el = s.el;
      const head = $(el, '.head');
      if (head) fitWidth(head, 920);
      if (s.type === 'hook') {
        const setup = $(el, '.setup'), p1 = $(el, '.p1'), p2 = $(el, '.p2');
        fitWidth(setup, 920);
        fitWidth(p1, 940);
        p1.style.top = (bottomOf(setup) + 6) + 'px';
        if (p2) { fitWidth(p2, 920); p2.style.top = (p1.getBoundingClientRect().top + p1.getBoundingClientRect().height * 0.96) + 'px'; }
      }
      if (BODY[s.type]) {
        const [def, gap, max] = BODY[s.type], body = $(el, '.body');
        let g = 0, top;
        const place = () => { top = Math.max(def, bottomOf(head) + gap); body.style.top = top + 'px'; };
        place();
        while (top > max && g++ < 100) { head.style.fontSize = (parseFloat(getComputedStyle(head).fontSize) - 4) + 'px'; place(); }
      }
      if (s.type === 'pain') fitWidth($(el, '.big'), 940);
      if (s.type === 'ai') {
        fitOverflow($(el, '.qb'), $(el, '.qb .bx'));
        const chips = $(el, '.chips'), nocode = $(el, '.nocode');
        nocode.style.top = (chips.offsetTop + chips.offsetHeight + 50) + 'px';
      }
      if (s.type === 'connect' && $(el, '.cardA')) { fitOverflow($(el, '.cardA'), $(el, '.cardA .ot')); }
      if (s.type === 'offer') { fitWidth($(el, '.dn'), 920); fitWidth($(el, '.fr'), 920); }
      if (s.type === 'cta') { fitWidth($(el, '.tag'), 960); fitWidth($(el, '.cta'), 900); fitWidth($(el, '.wmtxt'), 900); }
    });
  }

  // ---------- timeline ----------
  const cues = { events: [], scenes: [] };
  const cue = (t, kind) => cues.events.push({ t: Math.round(t * 1000) / 1000, kind });
  const flights = new Map();

  function measureFlights() {
    scenes.filter(s => s.type === 'solution').forEach(s => {
      const rows = [...$$(s.el, '.trow.r')];
      $$(s.el, '.fly').forEach(b => {
        if (b.dataset.order !== '1') return;
        const br = b.getBoundingClientRect(), rr = rows[+b.dataset.row].getBoundingClientRect();
        flights.set(b, { x: rr.left - br.left, y: (rr.top + rr.height / 2) - (br.top + br.height / 2) });
      });
    });
  }

  const TL = {
    cover(tl, T, d, el, dur) {
      tl.fromTo($(el, '.covimg'), { scale: 1.0, yPercent: 0 }, { scale: 1.09, yPercent: -1.5, duration: dur + .3, ease: 'none' }, T);
      cue(T + .05, 'pop_down'); cue(T + .9, 'impact_soft');
    },
    hook(tl, T, d, el, dur) {
      tl.fromTo($$(el, '.bgb'), { y: 0 }, { y: -620, duration: dur, ease: 'none' }, T);
      tl.to($(el, '.live .dot'), { scale: 1.5, opacity: .35, duration: .22, repeat: 1, yoyo: true }, T + .2);
      tl.to($(el, '.live'), { backgroundColor: DARK ? '#2A3632' : '#E5E7EB', duration: .2 }, T + .8);
      tl.to($(el, '.live .on'), { opacity: 0, duration: .12 }, T + .8).to($(el, '.live .off'), { opacity: 1, duration: .12 }, T + .86);
      tl.to($(el, '.live .dot'), { backgroundColor: '#9CA3AF', duration: .2 }, T + .8);
      cue(T + .05, 'pop_down'); cue(T + .8, 'pop_low');
      tl.from($$(el, '.setup .line'), { y: 40, opacity: 0, duration: .35, stagger: .45, ease: E }, T + .12);
      tl.from($(el, '.p1'), { scale: .35, opacity: 0, duration: .5, ease: 'back.out(1.7)', transformOrigin: '0% 60%' }, T + 1.3);
      cue(T + 1.3, 'impact_soft');
      if ($(el, '.p2')) tl.from($(el, '.p2'), { y: 70, opacity: 0, duration: .45, ease: E }, T + 1.6);
      tl.to($(el, '.p1'), { scale: 1.04, duration: .18, yoyo: true, repeat: 1, transformOrigin: '0% 60%' }, T + 2.4);
    },
    pain(tl, T, d, el, dur) {
      tl.from($$(el, '.head .line'), { y: 60, opacity: 0, duration: .4, stagger: .16, ease: E }, T);
      tl.fromTo($(el, '.feed'), { y: 420 }, { y: -1500, duration: dur, ease: 'power1.in' }, T);
      tl.from($(el, '.big'), { scale: 1.6, opacity: 0, duration: .35, ease: E, transformOrigin: '0% 50%' }, T + 1.5);
      tl.to($(el, '.big'), { x: 10, duration: .05, repeat: 7, yoyo: true, ease: 'none' }, T + 1.9);
      cue(T + 1.5, 'dissonant');
      for (let t = T; t < T + dur - .1; t += .25) cue(t + .125, 'tick');
    },
    solution(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T + .15);
      tl.from($$(el, '.fly'), { scale: .6, opacity: 0, duration: .3, stagger: .05, ease: 'back.out(2)' }, T + .1);
      tl.from($(el, '.tcard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .5);
      const rows = [...$$(el, '.trow.r')];
      [...$$(el, '.fly')].forEach((b, i) => {
        const t = T + .85 + i * .17;
        if (b.dataset.order === '1') {
          const f = flights.get(b), r = rows[+b.dataset.row];
          tl.to(b, { x: f.x, y: f.y, scale: .55, opacity: 0, duration: .42, ease: 'power2.in', transformOrigin: '0% 50%' }, t);
          tl.from(r, { opacity: 0, x: -40, duration: .3, ease: E }, t + .34);
          tl.fromTo(r, { backgroundColor: 'rgba(17,185,129,.16)' }, { backgroundColor: 'rgba(17,185,129,0)', duration: .6 }, t + .34);
          cue(t + .34, 'pop');
        } else {
          tl.to(b, { x: 520, opacity: 0, duration: .42, ease: 'power2.in', filter: 'grayscale(1)' }, t);
        }
      });
      const cnt = { n: 0 }, ce = $(el, '.cnt'), cw = $(el, '.cw'), total = rows.length;
      tl.to(cnt, { n: total, duration: 1.0, ease: 'none', onUpdate: () => { const n = Math.round(cnt.n); ce.textContent = n; cw.textContent = L.ordersWord(n); } }, T + 1.2);
      tl.to($(el, '.badge'), { scale: 1.15, duration: .15, yoyo: true, repeat: 1 }, T + 2.2);
    },
    ai(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .13, ease: E }, T);
      tl.from($(el, '.qb'), { y: 70, opacity: 0, duration: .45, ease: E }, T + .35);
      tl.to($(el, '.h1'), { backgroundSize: '100% 46%', duration: .35, ease: 'power2.out' }, T + .95);
      tl.to($(el, '.h2'), { backgroundSize: '100% 46%', duration: .25, ease: 'power2.out' }, T + 1.2);
      tl.from($(el, '.arrow'), { scaleY: 0, opacity: 0, duration: .3, ease: E }, T + 1.35);
      tl.from($$(el, '.chip'), { scale: .4, opacity: 0, duration: .35, stagger: .14, ease: 'back.out(2)' }, T + 1.55);
      [0, 1, 2].forEach(i => cue(T + 1.55 + i * .14, 'pop_small'));
      tl.from($(el, '.nocode'), { y: 30, opacity: 0, duration: .35, ease: E }, T + 2.0);
    },
    connect(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      if ($(el, '.cardA')) {
        tl.from($(el, '.cardA'), { y: 70, opacity: 0, duration: .4, ease: E }, T + .3);
        tl.to($(el, '.knob'), { x: 58, duration: .25, ease: 'power2.out' }, T + .85);
        tl.to($(el, '.tog'), { backgroundColor: '#11B981', duration: .2 }, T + .85);
        cue(T + .85, 'click');
        tl.from($(el, '.ili'), { opacity: 0, duration: .3 }, T + 1.0);
      }
      tl.from($(el, '.cardB'), { y: 70, opacity: 0, duration: .4, ease: E }, T + ($(el, '.cardA') ? 1.1 : .4));
      const ty = { n: 0 }, te = $(el, '.typed'), url = L.connect.url;
      tl.to(ty, { n: url.length, duration: .85, ease: 'none', onUpdate: () => { te.textContent = url.slice(0, Math.round(ty.n)); } }, T + 1.4);
      for (let k = 0; k < 12; k++) cue(T + 1.4 + k * .07, 'tick_soft');
      tl.to($(el, '.cur'), { opacity: 0, duration: .2, repeat: 7, yoyo: true, ease: 'steps(1)' }, T + 1.1);
      tl.to($(el, '.btn'), { scale: .9, duration: .1, yoyo: true, repeat: 1 }, T + 2.35);
      cue(T + 2.35, 'click');
    },
    messenger(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .13, ease: E }, T);
      tl.from($(el, '.sub'), { y: 40, opacity: 0, duration: .4, ease: E }, T + .3);
      tl.from($(el, '.chat'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .45);
      [0, 1, 2].forEach(i => {
        tl.from($(el, `.m${i}`), { y: 40, scale: .92, opacity: 0, duration: .35, ease: 'back.out(1.6)', transformOrigin: '100% 100%' }, T + .85 + i * .55);
        tl.from($(el, `.s${i}`), { opacity: 0, duration: .2 }, T + 1.15 + i * .55);
        cue(T + 1.15 + i * .55, 'ding');
      });
    },
    offer(tl, T, d, el) {
      tl.from($(el, '.n14'), { scale: .3, opacity: 0, duration: .5, ease: 'back.out(1.6)', transformOrigin: '0% 60%' }, T + .05);
      tl.from($(el, '.dn'), { y: 60, opacity: 0, duration: .4, ease: E }, T + .3);
      tl.from($(el, '.fr'), { y: 60, opacity: 0, duration: .4, ease: E }, T + .5);
      tl.from($$(el, '.pill'), { scale: .5, opacity: 0, duration: .35, stagger: .15, ease: 'back.out(2)' }, T + .8);
      cue(T, 'impact'); cue(T + .05, 'chord');
    },
    cta(tl, T, d, el) {
      tl.from($(el, '.logo'), { scale: .4, opacity: 0, duration: .55, ease: 'back.out(1.7)' }, T + .05);
      tl.from($(el, '.wmtxt'), { y: 50, opacity: 0, duration: .45, ease: E }, T + .25);
      tl.from($(el, '.tag'), { y: 40, opacity: 0, duration: .4, ease: E }, T + .45);
      tl.from($(el, '.cta'), { scale: .5, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, T + .65);
      tl.from($(el, '.small'), { opacity: 0, duration: .4 }, T + .95);
      tl.to($(el, '.cta'), { scale: 1.06, duration: .25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, T + 1.4);
      cue(T, 'impact'); cue(T + .05, 'chord_end');
    }
  };

  function glowTo(tl, kind, t, instant) {
    const map = { red: '.g-red', em: '.g-em', teal: '.g-teal' };
    Object.entries(map).forEach(([k, sel]) => {
      const op = k === kind ? (k === 'red' ? .8 : 1) : 0;
      if (instant) gsap.set(sel, { opacity: op }); else tl.to(sel, { opacity: op, duration: .5 }, t);
    });
  }

  function build() {
    gsap.set(['#wipe', '#wipe2'], { yPercent: 100 });
    const tl = gsap.timeline({ paused: true });
    let t = 0;
    const calm = new Set(['cover', 'hook', 'pain']);
    cues.drop = null;
    scenes.forEach((s, i) => {
      s.start = t;
      cues.scenes.push({ type: s.type, start: t, dur: s.dur });
      if (cues.drop === null && !calm.has(s.type)) cues.drop = t;
      glowTo(tl, GLOW[s.type] || 'em', t, i === 0);
      if (i > 0) tl.set(s.el, { opacity: 1 }, t);
      TL[s.type](tl, t, s.d, s.el, s.dur);
      const end = t + s.dur, next = scenes[i + 1];
      if (next) {
        const wipe = next.type === 'solution' && i > 0 ? '#wipe' : next.type === 'offer' ? '#wipe2' : null;
        if (wipe) {
          tl.to(wipe, { yPercent: 0, duration: .28, ease: 'power2.in' }, end - .28);
          tl.set(s.el, { opacity: 0 }, end);
          tl.to(wipe, { yPercent: -100, duration: .32, ease: 'power2.out' }, end);
          tl.set(wipe, { yPercent: 100 }, end + .4);
          cue(end - .3, 'whoosh_up');
        } else {
          tl.to(s.el, { opacity: 0, y: -60, duration: .3, ease: 'power2.in' }, end - .3);
          cue(end - .3, 'whoosh');
        }
      }
      t = end;
    });
    if (cues.drop === null) cues.drop = 0;
    cues.duration = t;
    tl.fromTo('.dots', { y: 0 }, { y: -160, duration: t, ease: 'none' }, 0);
    tl.set({}, {}, t);
    return tl;
  }

  window.ready = (async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(im => im.decode().catch(() => {})));
    layout();
    measureFlights();
    window.tl = build();
    window.tl.seek(0);
    window.cues = cues;
    return true;
  })();
  window.seek = t => { window.tl.seek(t, false); };
  window.duration = () => window.tl.duration();
})();
