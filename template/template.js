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
  const DUR = { cover: 2.8, hook: 3.5, codes: 3.5, pain: 3.5, solution: 4.0, ai: 3.0, connect: 3.0, messenger: 3.0, price: 4.5, sendlink: 3.5,
    group: 3.5, excel: 3.5, merge: 3.5, review: 3.5, setup: 4.0, offer: 2.5, cta: 2.5,
    wtitle: 3.0, wtips: 5.4, wquiz: 5.5, wpov: 6.0, wmyth: 5.5, follow: 3.0 };
  const BODY = { // default top, gap under head, max top before the body would run out of the safe zone
    pain: [580, 40, 605], solution: [690, 40, 910], ai: [790, 60, 945], connect: [690, 40, 870], messenger: [470, 20, 590],
    codes: [560, 40, 620], price: [560, 50, 700], sendlink: [600, 40, 720],
    group: [560, 40, 600], excel: [580, 40, 660], merge: [580, 40, 660], review: [580, 40, 680], setup: [560, 40, 620],
    wtips: [480, 48, 560], wquiz: [500, 44, 560], wpov: [480, 30, 560], wmyth: [440, 56, 540] };
  // Feed-safe band. Facebook and Instagram show Reels in the feed cropped to 4:5 (y 285..1635 of 1920) and the Reels
  // player covers the bottom quarter with the caption, so everything readable must sit inside y 330..1440.
  // Scenes are laid out in the band 255..1450 and then scaled into it (style.css: .framed .frame).
  const SAFE = { top: 330, bottom: 1440 };
  const GLOW = { cover: 'none', hook: 'red', codes: 'red', pain: 'red', price: 'teal', offer: 'teal', cta: 'teal',
    wquiz: 'teal', wmyth: 'red', wpov: 'red', follow: 'teal' };
  // Warm-up series (episodes wNN): each format has its own accent for the label chip.
  const WFMT = { tip: '#11B981', quiz: '#0098B7', pov: '#F59E0B', myth: '#EF4444' };
  const E = 'power3.out';

  // Headless Chromium has no colour emoji font: swap emoji for Noto SVGs from assets/emoji (made by scripts/emoji.py).
  const EMO = /(?:[\u{1F1E6}-\u{1F1FF}]{2})|(?:[\u2190-\u21FF\u2300-\u23FF\u2460-\u27BF\u2900-\u297F\u2B00-\u2BFF\u3030\u303D\u3297\u3299\u{1F000}-\u{1FAFF}]\uFE0F?[\u{1F3FB}-\u{1F3FF}]?(?:\u200D[\u2600-\u27BF\u{1F000}-\u{1FAFF}]\uFE0F?[\u{1F3FB}-\u{1F3FF}]?)*)/gu;
  const emojify = html => html.replace(EMO, m => {
    if (!m.includes('\uFE0F') && m.codePointAt(0) < 0x1F000 && !'❤✅⭐✨☀'.includes(m[0])) return m;
    const c = [...m].map(ch => ch.codePointAt(0).toString(16).toUpperCase()).join('-');
    return `<img class="emo" src="../assets/emoji/${c}.svg" alt="">`;
  });
  const mark = s => String(s).replace(/\[([^\]]+)\]/g, '<span class="lime">$1</span>').replace(/\{([^}]+)\}/g, '<span class="tealc">$1</span>');
  const lines = arr => arr.map(l => `<span class="line">${mark(l)}</span>`).join('');
  const bubble = (name, text, ci, cls = '') =>
    `<div class="bub ${cls}"><div class="ava" style="background:${COLORS[ci % 5]}">${name[0]}</div><div class="bt"><div class="bn">${name}</div><div class="bx">${text}</div></div></div>`;
  const ICON = {
    live: '<span class="ldot"></span>',
    video: '<svg viewBox="0 0 40 40"><path d="M12 7 L33 20 L12 33 Z" fill="currentColor"/></svg>',
    post: '<svg viewBox="0 0 40 40"><rect x="6" y="8" width="28" height="5" rx="2.5" fill="currentColor"/><rect x="6" y="18" width="28" height="5" rx="2.5" fill="currentColor"/><rect x="6" y="28" width="18" height="5" rx="2.5" fill="currentColor"/></svg>' };
  const check = '<svg width="30" height="20" viewBox="0 0 30 20"><path d="M2 10 L10 18 L28 2" stroke="#11B981" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const HTML = {
    // cover: either a finished image (`src`) or a photo with our own headline (`photo`, `head`, `sub`, `layout`, `focus`).
    cover: d => d.photo ? `<div class="cov ${d.layout || (DARK ? 'dark' : 'light')}"><img class="covimg" src="${d.photo}" alt=""${d.focus ? ` style="object-position:${d.focus}"` : ''}><div class="covshade"></div>
        <div class="covbrand"><img src="../assets/logo.png" alt=""><span>Noxio</span></div>
        <div class="h covhead">${lines(d.head)}</div>${d.sub ? `<div class="covsub">${mark(d.sub)}</div>` : ''}</div>`
      : `<div class="cov"><img class="covimg" src="${d.src}" alt=""></div>`,
    codes: d => {
      const c = Object.assign({}, L.codes || {}, d);
      const rows = c.lines || Array.from({ length: 42 }, (_, k) =>
        `${c.word} ${c.start + Math.floor(k / c.sizes.length) * 2} ${c.colors[Math.floor(k / c.sizes.length) % c.colors.length]} ${c.sizes[k % c.sizes.length]}`);
      return `<div class="h head">${lines(c.head)}</div>
        <div class="body"><div class="post"><div class="posthd"><div class="ava pava">${c.shop[0]}</div><div><div class="pn">${c.shop}</div><div class="ps">${c.postSub}</div></div></div>
        <div class="codewrap"><div class="codes">${rows.map(r => `<div>${r}</div>`).join('')}</div></div></div>
        ${c.rules.map((r, i) => `<div class="rule r${i}">${r}</div>`).join('')}</div>`;
    },
    price: d => { const c = Object.assign({}, L.price || {}, d); return `<div class="h head">${lines(c.head)}</div>
      <div class="body"><div class="calc">
        <div class="crow"><span>${c.salesLabel}</span><b>${c.sales}</b></div>
        <div class="crow fee"><span>${c.feeLabel}</span><b><span class="fcnt">0</span> ${c.cur}</b><i class="strike"></i></div>
        <div class="cdiv"></div>
        <div class="crow nox"><span><img class="clogo" src="../assets/logo.png" alt="">Noxio</span><b>${c.noxio}</b></div>
        <div class="cnote"><span class="nopct">${c.nopct}</span>${c.note}</div></div>
        <div class="week"><div class="wq">${c.weekQ}</div><div class="wa">${mark(c.weekA)}</div></div></div>`; },
    sendlink: d => { const c = Object.assign({}, L.sendlink || {}, d); return `<div class="h head">${lines(c.head)}</div>
      <div class="body"><div class="chat sl"><div class="chathd"><div class="ava"><img src="../assets/logo.png" alt=""></div><div><div class="cn">Noxio</div><div class="cs">Messenger</div></div></div>
        <div class="msgs"><div class="msg me"><span class="typed2"></span><span class="cur2"></span></div>
        <div class="msg them"><div class="file"><div class="xls">XLSX</div><div><div class="fn">${c.file}</div><div class="fs">${c.fileSub}</div></div></div></div>
        <div class="free">${c.badge}</div></div></div></div>`; },
    // group: one buyer's comments land in one order (orders grouped by buyer)
    group: d => { const g = L.group; return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="gbubs">${g.comments.map((c, i) => bubble(g.name, c, 2, `gb gb${i}`)).join('')}</div>
      <div class="gcard"><div class="ghd"><div class="ava" style="background:${COLORS[2]}">${g.name[0]}</div><div class="gname">${g.name}</div><div class="badge">${g.badge}</div></div>
      ${g.items.map((it, i) => `<div class="grow gr${i}"><span class="gi">${it[0]}</span><span class="gv">${it[1]}</span><span class="gq">×${it[2]}</span></div>`).join('')}
      <div class="gfoot">${mark(g.foot)}</div></div></div>`; },
    // excel: the order list, one click, a spreadsheet (uses the episode's table)
    excel: d => { const t = L.table, x = L.excel, rows = t.rows.slice(0, 4); return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="xcard"><div class="ttitle"><div class="tt"><img class="tlogo" src="../assets/logo.png" alt="">${t.title}</div><div class="xbtn"><span class="xi">XLSX</span>${x.btn}</div></div>
      ${rows.map(r => `<div class="xrow"><span class="xn">${r[0]}</span><span>${r[1]}</span><span class="xv">${r[2]}</span></div>`).join('')}</div>
      <div class="sheet"><div class="shbar"><span class="xi">XLSX</span><span class="shf">${x.file}</span><span class="shok">${check}</span></div>
      <div class="grid"><div class="gl"></div>${['A', 'B', 'C', 'D'].map(c => `<div class="gl">${c}</div>`).join('')}
      <div class="gl gn">1</div>${t.cols.map(c => `<div class="gc gh">${c}</div>`).join('')}
      ${rows.map((r, i) => `<div class="gl gn">${i + 2}</div>${[r[0], r[1], r[2], r[3]].map(c => `<div class="gc gr r${i}">${c}</div>`).join('')}`).join('')}</div></div></div>`; },
    // merge: several lives / videos / posts -> one order list
    merge: d => { const m = L.merge, total = m.sources.reduce((a, s) => a + s[2], 0); return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="msrc">${m.sources.map((s, i) => `<div class="src s${i}"><div class="sic ic-${s[0]}">${ICON[s[0]]}</div><div class="sl1">${s[1]}</div><div class="sl2"><b>${s[2]}</b> ${L.ordersWord(s[2])}</div></div>`).join('')}</div>
      <div class="mcard" data-total="${total}"><div class="ttitle"><div class="tt"><img class="tlogo" src="../assets/logo.png" alt="">${m.title}</div><div class="badge"><span class="mcnt">0</span> <span class="mcw">${L.ordersWord(0)}</span></div></div>
      ${L.table.rows.slice(0, 3).map(r => `<div class="xrow"><span class="xn">${r[0]}</span><span>${r[1]}</span><span class="xv">${r[2]}</span></div>`).join('')}</div></div>`; },
    // review: clear orders pass, an unclear comment is flagged and fixed by hand
    review: d => { const r = L.review; return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="rcard"><div class="ttitle"><div class="tt"><img class="tlogo" src="../assets/logo.png" alt="">${r.title}</div><div class="rbadge">${r.flagWord}: <b><span class="rc1">1</span><span class="rc0">0</span></b></div></div>
      ${r.ok.map(o => `<div class="rrow ok"><span class="rn">${o[0]}</span><span class="rt">${o[1]}</span><span class="rk">${check}</span></div>`).join('')}
      <div class="rrow un"><div class="ru1"><span class="rn">${r.unclear[0]}</span><span class="rq">“${r.unclear[1]}”</span></div>
      <div class="ru2"><span class="rflag">${r.flag}</span><span class="rfix">${r.fix}</span><span class="rdone">${check} ${r.done}</span></div></div></div></div>`; },
    // setup: expected codes / colours / sizes before the scan, the seller's own comments are skipped
    setup: d => { const s = L.setup; return `<div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="scard"><div class="stitle">${s.title}</div>
      ${s.fields.map((f, i) => `<div class="sfield f${i}"><div class="sfl">${f[0]}</div><div class="sfv">${f[1].map(v => `<span class="schip">${v}</span>`).join('')}</div></div>`).join('')}
      <div class="srow"><span>${s.toggle}</span><div class="tog stog"><div class="knob"></div></div></div></div>
      ${bubble(s.seller[0], s.seller[1], 4, 'sbub').replace('</div></div></div>', `</div></div><span class="skip">${s.skipped}</span></div>`)}</div>`; },
    // ---- warm-up series: title card, tips / mistakes list, question to viewers, POV, myth or truth, follow card ----
    wtitle: d => `<div class="wchip" style="background:${WFMT[d.fmt] || WFMT.tip}">${d.chip}</div>
      <div class="wemoji">${d.emoji || ''}</div><div class="h whead">${lines(d.head)}</div>${d.sub ? `<div class="wsub">${mark(d.sub)}</div>` : ''}`,
    wtips: d => { const st = d.style || 'num', ic = i => st === 'x' ? '<span class="wx">✕</span>' : st === 'check' ? check : `<b>${i + 1}</b>`;
      return `<div class="h head">${lines(d.head)}</div><div class="body"><div class="wlist ${st}">${d.items.map((it, i) =>
        `<div class="witem w${i}"><div class="wic">${ic(i)}</div><div class="wtx"><div class="wt">${mark(it[0])}</div>${it[1] ? `<div class="ws">${mark(it[1])}</div>` : ''}</div></div>`).join('')}</div></div>`; },
    wquiz: d => `<div class="h head">${lines(d.head)}</div><div class="body"><div class="wopts">${d.options.map((o, i) =>
        `<div class="wopt o${i}"><span class="wl" style="background:${COLORS[[2, 1, 3, 4][i]]}">${'ABCD'[i]}</span><span class="wot">${mark(o)}</span></div>`).join('')}</div>
      <div class="wask">${mark(d.ask || L.warm.ask)}</div></div>`,
    wpov: d => `<div class="wchip" style="background:${WFMT.pov}">${d.chip || 'POV'}</div><div class="h head">${lines(d.head)}</div>
      <div class="body"><div class="feedwrap wfeed"><div class="feed">${d.comments.map((c, i) => `<div style="padding-left:${[70, 170, 110, 220][i % 4]}px">${bubble(c[0], c[1], i)}</div>`).join('')}</div></div>
      <div class="h wpunch">${lines(d.punch)}</div></div>`,
    wmyth: d => { const myth = d.verdict !== 'truth'; return `<div class="h head">${lines(d.head || L.warm.mythHead)}</div>
      <div class="body"><div class="wclaim"><div class="wcl">${d.claimLabel || L.warm.claim}</div><div class="wct">${mark(d.claim)}</div>
      <div class="wstamp ${myth ? 'myth' : 'truth'}">${myth ? L.warm.myth : L.warm.truth}</div></div>
      <div class="wtruth"><div class="wtl">${d.truthLabel || (myth ? L.warm.truthLabel : L.warm.whyLabel)}</div><div class="wtt">${mark(d.truth)}</div></div></div>`; },
    follow: d => { const f = Object.assign({}, L.warm.follow, d); return `<div class="fava"><img src="../assets/logo.png" alt=""><span class="fplus">+</span><span class="fok">${check}</span></div>
      <div class="h fname">Noxio</div><div class="ftag">${mark(f.tag)}</div><div class="fbtn">${f.button}</div><div class="fsmall">${f.small}</div>`; },
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
    el.className = `scene sc-${s.type}` + (d.kicker ? ' kicked' : '');
    // Everything but the full-bleed cover sits in a .frame that is scaled into the feed-safe band after layout (see SAFE).
    const inner = emojify((d.kicker ? `<div class="kicker">${d.kicker}</div>` : '') + HTML[s.type](d));
    el.innerHTML = s.type === 'cover' ? inner : `<div class="frame">${inner}</div>`;
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
      if (s.type === 'cover' && $(el, '.covhead')) {
        const h = $(el, '.covhead'), sub = $(el, '.covsub');
        fitWidth(h, 936);
        if ($(el, '.cov.light')) { if (sub) sub.style.top = (bottomOf(h) + 28) + 'px'; }
        else if (sub) { const st = SAFE.bottom - sub.getBoundingClientRect().height; sub.style.top = st + 'px'; h.style.top = (st - 28 - h.getBoundingClientRect().height) + 'px'; }
        else h.style.top = (SAFE.bottom - 10 - h.getBoundingClientRect().height) + 'px';
      }
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
      if (s.type === 'price') { const w = $(el, '.week'); w.style.top = ($(el, '.calc').offsetHeight + 40) + 'px'; }
      if (s.type === 'sendlink') fitOverflow($(el, '.msg.me'), $(el, '.msg.me'), 26);
      if (s.type === 'excel') { $(el, '.sheet').style.top = '120px'; fitOverflow($(el, '.xcard .ttitle'), $(el, '.xcard .tt')); }
      if (s.type === 'review') { fitOverflow($(el, '.ru1'), $(el, '.rq'), 26); }
      if (s.type === 'setup') { $(el, '.sbub').style.top = ($(el, '.scard').offsetHeight + 36) + 'px'; fitOverflow($(el, '.srow'), $(el, '.srow span'), 24);
        const sb = $(el, '.sbub'), sx = $(sb, '.bx'); let g = 0; while (sb.getBoundingClientRect().width > 880 && g++ < 40) sx.style.fontSize = (parseFloat(getComputedStyle(sx).fontSize) - 2) + 'px'; }
      if (s.type === 'group') { $$(el, '.gb').forEach(b => fitOverflow(b, $(b, '.bx'), 28)); }
      if (s.type === 'wtitle') { const h = $(el, '.whead'), sub = $(el, '.wsub'); fitWidth(h, 920);
        if (sub) sub.style.top = (bottomOf(h) + 26) + 'px'; }
      if (s.type === 'wpov') fitWidth($(el, '.wpunch'), 920);
      if (['wtips', 'wquiz', 'wmyth'].includes(s.type)) {   // centre head + list in the 255..1450 band
        const head = $(el, '.head'), kids = [...$(el, '.body').querySelectorAll(':scope > *, :scope > * > *')];
        const top = head.getBoundingClientRect().top, bottom = Math.max(...kids.map(k => k.getBoundingClientRect().bottom));
        const shift = Math.max(0, Math.min(220, (1450 - bottom - (top - 255)) / 2));
        if (shift > 4) [head, $(el, '.body')].forEach(x => { x.style.top = (parseFloat(getComputedStyle(x).top) + shift) + 'px'; });
      }
      if (s.type === 'wquiz') $$(el, '.wopt').forEach(o => fitOverflow(o, $(o, '.wot'), 28));
      if (s.type === 'wtips') $$(el, '.witem').forEach(o => { fitOverflow($(o, '.wtx'), $(o, '.wt'), 30); if ($(o, '.ws')) fitOverflow($(o, '.wtx'), $(o, '.ws'), 24); });
      if (s.type === 'follow') { fitWidth($(el, '.ftag'), 940); fitWidth($(el, '.fbtn'), 900); }
      if (s.type === 'cta') { fitWidth($(el, '.tag'), 960); fitWidth($(el, '.cta'), 900); fitWidth($(el, '.wmtxt'), 900); }
    });
  }

  // ---------- timeline ----------
  const cues = { events: [], scenes: [] };
  const cue = (t, kind) => cues.events.push({ t: Math.round(t * 1000) / 1000, kind });
  const flights = new Map();

  const centre = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, l: r.left }; };
  function measureFlights() {
    scenes.filter(s => s.type === 'group').forEach(s => {
      const rows = [...$$(s.el, '.grow')];
      $$(s.el, '.gb').forEach((b, i) => { const a = centre(b), r = centre(rows[i] || rows[rows.length - 1]); flights.set(b, { x: r.l + 10 - a.l, y: r.y - a.y }); });
    });
    scenes.filter(s => s.type === 'merge').forEach(s => {
      const c = centre($(s.el, '.mcard .ttitle'));
      $$(s.el, '.src').forEach(b => { const a = centre(b); flights.set(b, { x: c.x - a.x, y: c.y - a.y }); });
    });
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
      if ($(el, '.covhead')) {
        tl.from($$(el, '.covhead .line'), { y: 50, opacity: 0, duration: .35, stagger: .1, ease: E }, T + .05);
        if ($(el, '.covsub')) tl.from($(el, '.covsub'), { opacity: 0, y: 20, duration: .3 }, T + .5);
      }
      cue(T + .05, 'pop_down'); cue(T + .9, 'impact_soft');
    },
    codes(tl, T, d, el, dur) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .35, stagger: .12, ease: E }, T);
      tl.from($(el, '.post'), { y: 90, opacity: 0, duration: .4, ease: E }, T + .15);
      tl.fromTo($(el, '.codes'), { y: 0 }, { y: -1100, duration: dur, ease: 'power1.in' }, T);
      [...$$(el, '.rule')].forEach((r, i) => {
        tl.from(r, { scale: 1.8, opacity: 0, duration: .25, ease: 'back.out(2)' }, T + 1.0 + i * .55);
        cue(T + 1.0 + i * .55, i ? 'pop_low' : 'dissonant');
      });
      cue(T + .05, 'pop_down');
      for (let t = T + .2; t < T + dur - .1; t += .2) cue(t, 'tick');
    },
    price(tl, T, d, el) {
      const c = Object.assign({}, L.price || {}, d);
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .13, ease: E }, T);
      tl.from($(el, '.calc'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .3);
      tl.from($$(el, '.crow'), { x: -40, opacity: 0, duration: .3, stagger: .35, ease: E }, T + .6);
      const n = { v: 0 }, fe = $(el, '.fcnt');
      tl.to(n, { v: c.fee, duration: .6, ease: 'none', onUpdate: () => { fe.textContent = Math.round(n.v); } }, T + 1.0);
      for (let k = 0; k < 8; k++) cue(T + 1.0 + k * .075, 'tick_soft');
      tl.fromTo($(el, '.strike'), { scaleX: 0 }, { scaleX: 1, duration: .25, ease: 'power2.out' }, T + 1.8);
      cue(T + 1.8, 'click');
      tl.from($(el, '.crow.nox b'), { scale: .5, duration: .4, ease: 'back.out(2)', transformOrigin: '100% 50%' }, T + 1.45);
      tl.from($(el, '.cnote'), { opacity: 0, y: 20, duration: .3 }, T + 2.1);
      tl.from($(el, '.week'), { y: 60, opacity: 0, duration: .4, ease: E }, T + 2.7);
      cue(T + 2.7, 'pop');
    },
    sendlink(tl, T, d, el) {
      const c = Object.assign({}, L.sendlink || {}, d);
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .13, ease: E }, T);
      tl.from($(el, '.chat'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .3);
      tl.from($(el, '.msg.me'), { scale: .9, opacity: 0, duration: .25, transformOrigin: '100% 100%' }, T + .7);
      const ty = { n: 0 }, te = $(el, '.typed2');
      tl.to(ty, { n: c.link.length, duration: .8, ease: 'none', onUpdate: () => { te.textContent = c.link.slice(0, Math.round(ty.n)); } }, T + .8);
      for (let k = 0; k < 11; k++) cue(T + .8 + k * .07, 'tick_soft');
      tl.to($(el, '.cur2'), { opacity: 0, duration: .1 }, T + 1.65);
      cue(T + 1.7, 'click');
      tl.from($(el, '.msg.them'), { y: 40, scale: .92, opacity: 0, duration: .35, ease: 'back.out(1.6)', transformOrigin: '0% 100%' }, T + 1.95);
      cue(T + 2.05, 'ding');
      tl.from($(el, '.free'), { scale: 1.8, opacity: 0, duration: .3, ease: 'back.out(2)' }, T + 2.5);
      cue(T + 2.5, 'pop');
    },
    group(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      [...$$(el, '.gb')].forEach((b, i) => { tl.from(b, { scale: .6, opacity: 0, duration: .3, ease: 'back.out(2)' }, T + .3 + i * .25); cue(T + .3 + i * .25, 'pop_small'); });
      tl.from($(el, '.gcard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + 1.05);
      const rows = [...$$(el, '.grow')];
      [...$$(el, '.gb')].forEach((b, i) => {
        const t = T + 1.5 + i * .25, f = flights.get(b);
        tl.to(b, { x: f.x, y: f.y, scale: .5, opacity: 0, duration: .4, ease: 'power2.in', transformOrigin: '0% 50%' }, t);
        if (rows[i]) { tl.from(rows[i], { opacity: 0, x: -40, duration: .3, ease: E }, t + .32);
          tl.fromTo(rows[i], { backgroundColor: 'rgba(17,185,129,.16)' }, { backgroundColor: 'rgba(17,185,129,0)', duration: .6 }, t + .32); }
        cue(t + .32, 'pop');
      });
      tl.from($(el, '.gcard .badge'), { scale: .4, opacity: 0, duration: .3, ease: 'back.out(2)' }, T + 2.4);
      tl.from($(el, '.gfoot'), { opacity: 0, y: 16, duration: .3 }, T + 2.55);
      tl.to($(el, '.gcard'), { y: -250, duration: .45, ease: 'power2.inOut' }, T + 2.5);   // close the gap the comments left
    },
    excel(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      tl.from($(el, '.xcard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .3);
      tl.from($$(el, '.xcard .xrow'), { x: -30, opacity: 0, duration: .25, stagger: .1, ease: E }, T + .55);
      tl.to($(el, '.xbtn'), { scale: .88, duration: .1, yoyo: true, repeat: 1 }, T + 1.25);
      cue(T + 1.25, 'click');
      tl.fromTo($(el, '.sheet'), { y: 700, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }, T + 1.45);
      cue(T + 1.4, 'whoosh_up');
      tl.from($$(el, '.grid .gh'), { opacity: 0, duration: .2 }, T + 1.8);
      [0, 1, 2, 3].forEach(i => { const c = $$(el, `.grid .r${i}`); if (c.length) { tl.from(c, { opacity: 0, x: -14, duration: .2, stagger: .04 }, T + 1.95 + i * .14); cue(T + 1.95 + i * .14, 'tick_soft'); } });
      tl.from($(el, '.shok'), { scale: 0, duration: .3, ease: 'back.out(2.4)' }, T + 2.6);
      cue(T + 2.6, 'ding');
    },
    merge(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      [...$$(el, '.src')].forEach((b, i) => { tl.from(b, { y: 60, opacity: 0, duration: .35, ease: E }, T + .3 + i * .18); cue(T + .3 + i * .18, 'pop_small'); });
      tl.from($(el, '.mcard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + 1.0);
      [...$$(el, '.src')].forEach((b, i) => { const f = flights.get(b);
        tl.to(b, { x: f.x, y: f.y, scale: .3, opacity: 0, duration: .42, ease: 'power2.in' }, T + 1.45 + i * .14); cue(T + 1.8 + i * .14, 'pop'); });
      const total = +$(el, '.mcard').dataset.total, n = { v: 0 }, ce = $(el, '.mcnt'), cw = $(el, '.mcw');
      tl.to(n, { v: total, duration: .7, ease: 'none', onUpdate: () => { const k = Math.round(n.v); ce.textContent = k; cw.textContent = L.ordersWord(k); } }, T + 1.75);
      tl.from($$(el, '.mcard .xrow'), { x: -30, opacity: 0, duration: .25, stagger: .12, ease: E }, T + 2.2);
      tl.to($(el, '.mcard .badge'), { scale: 1.15, duration: .15, yoyo: true, repeat: 1 }, T + 2.55);
    },
    review(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      tl.from($(el, '.rcard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .3);
      [...$$(el, '.rrow.ok')].forEach((r, i) => { tl.from(r, { x: -30, opacity: 0, duration: .25, ease: E }, T + .6 + i * .18);
        tl.from($(r, '.rk'), { scale: 0, duration: .25, ease: 'back.out(2.4)' }, T + .7 + i * .18); cue(T + .7 + i * .18, 'pop_small'); });
      tl.from($(el, '.rrow.un'), { x: -30, opacity: 0, duration: .3, ease: E }, T + 1.25);
      cue(T + 1.25, 'pop_low');
      tl.to($(el, '.rflag'), { scale: 1.12, duration: .14, yoyo: true, repeat: 3 }, T + 1.55);
      cue(T + 2.0, 'click');
      tl.to($(el, '.rflag'), { opacity: 0, duration: .12 }, T + 2.0);
      tl.from($(el, '.rfix'), { scale: .6, opacity: 0, duration: .3, ease: 'back.out(2)', transformOrigin: '0% 50%' }, T + 2.1);
      tl.to($(el, '.rrow.un'), { backgroundColor: 'rgba(17,185,129,.12)', borderColor: 'rgba(17,185,129,.5)', duration: .3 }, T + 2.3);
      tl.from($(el, '.rdone'), { scale: 0, opacity: 0, duration: .3, ease: 'back.out(2.4)' }, T + 2.35);
      tl.to($(el, '.rc1'), { opacity: 0, duration: .1 }, T + 2.35).to($(el, '.rc0'), { opacity: 1, duration: .1 }, T + 2.4);
      cue(T + 2.35, 'ding');
    },
    setup(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      tl.from($(el, '.scard'), { y: 80, opacity: 0, duration: .45, ease: E }, T + .3);
      [...$$(el, '.sfield')].forEach((f, i) => { tl.from($(f, '.sfl'), { opacity: 0, duration: .2 }, T + .6 + i * .38);
        tl.from($$(f, '.schip'), { scale: .5, opacity: 0, duration: .22, stagger: .06, ease: 'back.out(2)' }, T + .7 + i * .38); cue(T + .7 + i * .38, 'pop_small'); });
      tl.from($(el, '.srow'), { opacity: 0, duration: .25 }, T + 1.75);
      tl.to($(el, '.stog .knob'), { x: 58, duration: .25, ease: 'power2.out' }, T + 2.1);
      tl.to($(el, '.stog'), { backgroundColor: '#11B981', duration: .2 }, T + 2.1);
      cue(T + 2.1, 'click');
      tl.from($(el, '.sbub'), { y: 40, opacity: 0, duration: .35, ease: E }, T + 2.5);
      cue(T + 2.5, 'pop');
      tl.to($(el, '.sbub'), { opacity: .45, filter: 'grayscale(1)', duration: .3 }, T + 3.05);
      tl.from($(el, '.skip'), { scale: 1.7, opacity: 0, duration: .3, ease: 'back.out(2)' }, T + 3.05);
      cue(T + 3.05, 'pop_low');
    },
    wtitle(tl, T, d, el) {
      tl.from($(el, '.wchip'), { x: -60, opacity: 0, duration: .35, ease: E }, T + .05);
      tl.from($(el, '.wemoji'), { scale: 0, rotation: -25, duration: .55, ease: 'back.out(2.2)', transformOrigin: '50% 60%' }, T + .2);
      tl.to($(el, '.wemoji'), { rotation: 6, duration: .25, yoyo: true, repeat: 3, ease: 'sine.inOut', transformOrigin: '50% 90%' }, T + .8);
      tl.from($$(el, '.whead .line'), { y: 60, opacity: 0, duration: .4, stagger: .14, ease: E }, T + .45);
      if ($(el, '.wsub')) tl.from($(el, '.wsub'), { opacity: 0, y: 20, duration: .3 }, T + 1.2);
      cue(T + .05, 'pop_down'); cue(T + .25, 'pop'); cue(T + .9, 'impact_soft');
    },
    wtips(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      [...$$(el, '.witem')].forEach((w, i) => { const t = T + .55 + i * 1.2;
        tl.from(w, { x: 120, opacity: 0, duration: .4, ease: E }, t);
        tl.from($(w, '.wic'), { scale: 0, duration: .35, ease: 'back.out(2.4)' }, t + .15);
        cue(t + .15, i ? 'pop' : 'pop_small'); });
    },
    wquiz(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      [...$$(el, '.wopt')].forEach((o, i) => { tl.from(o, { y: 40, opacity: 0, duration: .32, ease: E }, T + .6 + i * .32); cue(T + .6 + i * .32, 'pop_small'); });
      const t = T + .7 + $$(el, '.wopt').length * .32 + .4;
      tl.from($(el, '.wask'), { scale: .6, opacity: 0, duration: .4, ease: 'back.out(2)' }, t);
      tl.to($(el, '.wask'), { y: -10, duration: .22, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + .5);
      cue(t, 'ding');
    },
    wpov(tl, T, d, el, dur) {
      tl.from($(el, '.wchip'), { x: -60, opacity: 0, duration: .3, ease: E }, T);
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T + .1);
      tl.fromTo($(el, '.wfeed .feed'), { y: 420 }, { y: -1350, duration: dur, ease: 'power1.in' }, T);
      for (let t = T + .2; t < T + 3.0; t += .22) cue(t, 'tick');
      tl.to($(el, '.wfeed'), { opacity: .25, duration: .4 }, T + 3.0);
      tl.from($(el, '.wpunch'), { scale: 1.5, opacity: 0, duration: .4, ease: E, transformOrigin: '0% 50%' }, T + 3.1);
      cue(T + 3.1, 'impact_soft');
    },
    wmyth(tl, T, d, el) {
      tl.from($$(el, '.head .line'), { y: 50, opacity: 0, duration: .4, stagger: .12, ease: E }, T);
      tl.from($(el, '.wclaim'), { y: 70, opacity: 0, duration: .45, ease: E }, T + .35);
      tl.from($(el, '.wstamp'), { scale: 2.6, opacity: 0, rotation: -30, duration: .3, ease: 'power3.in' }, T + 1.7);
      tl.to($(el, '.wclaim'), { x: 8, duration: .05, repeat: 5, yoyo: true, ease: 'none' }, T + 2.0);
      cue(T + 1.95, d.verdict === 'truth' ? 'ding' : 'impact');
      tl.from($(el, '.wtruth'), { y: 80, opacity: 0, duration: .45, ease: E }, T + 2.5);
      cue(T + 2.5, 'pop');
    },
    follow(tl, T, d, el) {
      tl.from($(el, '.fava'), { scale: .3, opacity: 0, duration: .5, ease: 'back.out(1.8)' }, T + .05);
      tl.from($(el, '.fplus'), { scale: 0, duration: .3, ease: 'back.out(2.4)' }, T + .4);
      tl.from($(el, '.fname'), { y: 40, opacity: 0, duration: .4, ease: E }, T + .25);
      tl.from($(el, '.ftag'), { y: 40, opacity: 0, duration: .4, ease: E }, T + .45);
      tl.from($(el, '.fbtn'), { scale: .5, opacity: 0, duration: .4, ease: 'back.out(1.8)' }, T + .65);
      tl.from($(el, '.fsmall'), { opacity: 0, duration: .4 }, T + .9);
      tl.to($(el, '.fbtn'), { scale: .9, duration: .1, yoyo: true, repeat: 1 }, T + 1.5);
      tl.to($(el, '.fplus'), { scale: 0, duration: .15 }, T + 1.6);
      tl.fromTo($(el, '.fok'), { scale: 0 }, { scale: 1, duration: .3, ease: 'back.out(2.4)' }, T + 1.65);
      tl.to($(el, '.fbtn'), { backgroundColor: DARK ? '#25332F' : '#E5E7EB', color: DARK ? '#F2F6F4' : '#111827', duration: .2 }, T + 1.65);
      cue(T, 'impact'); cue(T + .05, 'chord_end'); cue(T + 1.5, 'click'); cue(T + 1.7, 'ding');
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
    const calm = new Set(['cover', 'hook', 'codes', 'pain', 'wtitle']);
    cues.drop = null;
    cues.music = EP.music || null;   // optional per-episode soundtrack variant, read by scripts/music.py
    scenes.forEach((s, i) => {
      s.start = t;
      cues.scenes.push({ type: s.type, start: t, dur: s.dur });
      if (cues.drop === null && !calm.has(s.type)) cues.drop = t;
      glowTo(tl, GLOW[s.type] || 'em', t, i === 0);
      if (i > 0) tl.set(s.el, { opacity: 1 }, t);
      TL[s.type](tl, t, s.d, s.el, s.dur);
      const end = t + s.dur, next = scenes[i + 1];
      if (next) {
        const wipe = next.type === 'solution' && i > 0 ? '#wipe' : (next.type === 'offer' || next.type === 'follow') ? '#wipe2' : null;
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
    document.body.classList.add('framed');   // scale frames into the safe band only now: layout and flights are measured unscaled
    window.tl = build();
    window.tl.seek(0);
    window.cues = cues;
    return true;
  })();
  window.seek = t => { window.tl.seek(t, false); };
  window.duration = () => window.tl.duration();
})();
