// Kaja episode, layout 12 (episodes/sNN.json with "layout": "story12"): see story12.css.
(() => {
  const { EP, $, $$, ic, emo, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data, P = D.pip, W = SB.W, N = D.steps.length;
  const tile = (c, i, cls = 'pho', ico = 'dress') => `<div class="${cls}" style="background:${c}">${ic(ico)}</div>`;
  const body = s => {
    if (s.kind === 'card') return tile(s.color, 0, 'pho', s.icon) + `<div class="ai rd">${ic('sparkle')}AI</div><div class="arr">${ic('arrow-right')}</div>` +
      `<div class="pc">${s.fields.map(f => `<div class="f rd"><label>${f[0]}</label>${f[1] ? `<span>${f[1]}</span>` : '<i class="ln"></i>'}</div>`).join('')}</div>`;
    if (s.kind === 'variants') return `<div class="chips rd" style="top:0"><span class="lb">${s.lc}</span>${s.colors.map(c => `<span><i class="sw" style="background:${c[1]}"></i>${c[0]}</span>`).join('')}</div>` +
      `<div class="chips rd" style="top:86px"><span class="lb">${s.ls}</span>${s.sizes.map(z => `<span>${z}</span>`).join('')}</div>` +
      `<div class="grid">${s.colors.flatMap(c => s.sizes.map(z => `<div class="rd"><i style="background:${c[1]}"></i>${c[0]} · ${z}</div>`)).join('')}</div>`;
    if (s.kind === 'batch') return `<div class="q">${s.photos.map(p => `<div style="background:${p[0]}">${ic(p[1])}</div>`).join('')}</div>` +
      s.rows.map((r, i) => `<div class="qr rd" style="top:${200 + i * 88}px">${r}<span class="b"><i></i></span><span class="ok">${ic('check-circle')}</span></div>`).join('');
    if (s.kind === 'scan') return `<div class="tagc"><p class="rd">${s.tag.join('<br>')}</p><div class="bc">${Array.from({ length: 26 }, (_, i) => `<i style="width:${[3, 6, 2, 4, 8][i % 5]}px"></i>`).join('')}</div></div><div class="scanl"></div>` +
      s.fields.map((f, i) => `<div class="fl rd" style="top:${10 + i * 116}px"><label>${f[0]}</label><span>${f[1]}</span></div>`).join('');
    if (s.kind === 'dupe') return `<div class="dc rd" style="top:0">${tile(s.color, 0, 'th', s.icon)}<div><b>${s.name}</b><small>${s.now}</small></div><span class="pill">${s.newP}</span></div>` +
      `<div class="dc rd" style="top:140px">${tile(s.color, 0, 'th', s.icon)}<div><b>${s.name}</b><small>${s.old}</small></div><span class="pill" style="background:#64748B">${s.oldP}</span></div>` +
      `<div class="wn rd" style="top:290px">${ic('copy')}${s.warn}</div><div class="up rd" style="top:290px">${ic('arrows-clockwise')}${s.upd}</div>`;
    if (s.kind === 'sync') return `<div class="fh rd" style="top:0"><div class="ic">${ic('file-csv')}</div>${s.file}</div>` +
      `<div class="tb" style="top:100px">${[s.cols].concat(s.rows).map((r, i) => `<div class="r rd"><div>${r[0]}</div><div>${r[1]}</div><div>${i ? `<s>${r[2]}</s><span class="n">${r[3]}</span>` : r[2]}</div><div>${i ? `<s>${r[4]}</s><span class="n">${r[5]}</span>` : r[3]}</div></div>`).join('')}</div>`;
    if (s.kind === 'extras') return `<div class="xt">${s.items.map(x => `<div class="rd">${ic(x[1])}${x[0]}</div>`).join('')}</div>`;
    if (s.kind === 'publish') return `<div class="pb rd">${ic('cloud-arrow-up')}${s.btn}</div><div class="dn rd">${ic('check-circle')}${s.done}</div>`;
    return '';
  };
  boot(() => {
    const H = D.hook, M = D.manual, T = D.title, O = D.offer;
    $('#panel').innerHTML = D.steps.map((s, k) => `<div class="stp" data-k="${k}" style="position:absolute;inset:0;padding:30px 36px">` +
      `<div class="ph0"><div class="st rd"><img src="../assets/logo.png" alt="">${D.tool}</div><div class="cnt rd"><b>${s.n}</b>/ 10</div></div>` +
      `<div class="ptl rd">${s.title}</div><div class="body">${body(s)}</div></div>`).join('');
    $('#ui').innerHTML =
      `<div id="hk" class="card"><div class="tt rd">${H.title}</div><div class="sb rd">${H.sub}</div></div>` +
      M.fields.map((f, i) => `<div class="mf rd" style="top:${i * 72}px"><label>${f[0]}</label><i class="ln"></i></div>`).join('') +
      `<div id="rep" class="rd">${ic('repeat')}${M.rep[0]}</div>` +
      `<div id="tt12" class="card"><img src="../assets/logo.png" alt=""><div class="rd"><b>${T.name}</b><span>${T.sub}</span></div></div>` +
      `<div id="of" class="card"><div class="h"><img src="../assets/logo.png" alt=""><b class="rd">${O.name}</b></div><div class="pt rd">${ic('compass')}${O.path[0]}</div>` +
      `<div class="ps">${O.pills.map((p, i) => `<span class="rd${i === 2 ? ' w' : ''}">${p[0]}</span>`).join('')}</div></div>`;
    subsLayout('marker');
    window.PHR.forEach((c, k) => { const a = W[c.words[0]][1]; if (a >= P.from - 0.1 && a < P.to) { const el = $$('.sub')[k]; el.classList.add('pip'); el.style.top = '1170px'; } });
  }, tl => {
    const H = D.hook, M = D.manual, T = D.title, O = D.offer, wrap = $('#kwrap'), cl = { r: 2400, x: 540, y: 960 };
    const clip = () => { wrap.style.clipPath = `circle(${cl.r}px at ${cl.x}px ${cl.y}px)`; };
    clip();
    gsap.set(['#hk', '.mf', '#rep', '#tt12', '#of', '#of .pt', '#of .ps span', '#panel', '.stp', '.stp .body>*', '.stp .body .rd', '#kring', '#shade'], { opacity: 0 });
    tl.to('#shade', { opacity: 1, duration: 0.4 }, 0).to('#shade', { opacity: 0, duration: 0.4 }, H.until);
    inn(tl, '#hk', { y: 60, scale: 0.92 }, H.from, 0.45);
    tl.fromTo('#hk .tt', { scale: 1 }, { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, H.from + 0.6);
    out(tl, '#hk', H.until, { y: 40 });
    $$('.mf').forEach((el, i) => { inn(tl, el, { x: -60 }, M.fields[i][1], 0.3, 'power3.out'); tl.fromTo($('.ln', el), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 0.5, ease: 'none', immediateRender: false }, M.fields[i][1] + 0.2); });
    inn(tl, '#rep', { scale: 0.4, rotation: -14 }, M.rep[1], 0.35, 'back.out(2)');
    tl.to('.mf', { y: '+=12', duration: 0.06, yoyo: true, repeat: 3 }, M.rep[1] + 0.3);
    out(tl, ['.mf', '#rep'], T.from, { x: -40 });
    inn(tl, '#tt12', { y: 60, scale: 0.92 }, T.from, 0.45);
    out(tl, '#tt12', P.from, { y: 40 });
    // into the circle and back
    tl.to(cl, { r: 190, x: 230, y: 1258, duration: 0.55, ease: 'power3.inOut', onUpdate: clip }, P.from);
    tl.to('#kdisc', { opacity: 1, duration: 0.3 }, P.from + 0.2).to('#kring', { opacity: 1, duration: 0.2 }, P.from + 0.4);
    tl.to('#kring', { opacity: 0, duration: 0.12 }, P.to).to('#kdisc', { opacity: 0, duration: 0.3 }, P.to);
    tl.to(cl, { r: 2400, x: 540, y: 960, duration: 0.55, ease: 'power3.inOut', onUpdate: clip }, P.to);
    inn(tl, '#panel', { y: 80 }, P.from + 0.1, 0.5, 'power3.out');
    out(tl, '#panel', P.to + 0.25, { y: 60 });
    D.steps.forEach((s, k) => {
      const el = $(`.stp[data-k="${k}"]`), q = sel => $$(sel, el), T = s.t;
      tl.set(el, { opacity: 1 }, s.from);
      tl.set(q('.body>*'), { opacity: 1 }, s.from);
      tl.fromTo(q('.ph0, .ptl'), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', stagger: 0.06, immediateRender: false }, s.from);
      tl.fromTo(q('.cnt b'), { scale: 1.6 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)', immediateRender: false }, s.from + 0.1);
      if (k < N - 1) tl.to(el, { opacity: 0, x: -60, duration: 0.2, ease: 'power2.in' }, s.until - 0.2);
      const pop = (sel, t, from = { scale: 0.5 }) => inn(tl, sel, from, t, 0.3, 'back.out(2)');
      if (s.kind === 'card') {
        gsap.set(q('.pho, .ai, .arr, .pc'), { opacity: 0 });
        pop(q('.pho'), T[0], { y: -80, scale: 0.7 }); pop(q('.ai'), T[1]); pop(q('.arr'), T[1], { x: -30 }); pop(q('.pc'), T[1] + 0.2, { x: 40, scale: 0.95 });
        q('.pc .f').forEach((f, i) => inn(tl, f, { x: 30 }, s.fields[i][2], 0.25, 'power3.out'));
      } else if (s.kind === 'variants') {
        const ch = q('.chips'); inn(tl, ch[0], { x: -40 }, T[0], 0.3, 'power3.out'); inn(tl, ch[1], { x: -40 }, T[1], 0.3, 'power3.out');
        q('.grid div').forEach((g, i) => inn(tl, g, { scale: 0.4 }, T[2] + i * 0.06, 0.25, 'back.out(2.2)'));
      } else if (s.kind === 'batch') {
        gsap.set(q('.q div'), { opacity: 0 });
        q('.q div').forEach((p, i) => tl.fromTo(p, { y: -160, opacity: 0, rotation: (i % 2 ? 8 : -8) }, { y: 0, opacity: 1, rotation: 0, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, T[0] + i * 0.12));
        q('.qr').forEach((r, i) => { inn(tl, r, { x: -40 }, T[1] + i * 0.15, 0.3, 'power3.out'); tl.to($('.b i', r), { width: '100%', duration: 0.6 + i * 0.25, ease: 'power1.inOut' }, T[1] + 0.2 + i * 0.15); tl.to($('.ok', r), { opacity: 1, duration: 0.15 }, T[1] + 0.85 + i * 0.4); });
      } else if (s.kind === 'scan') {
        gsap.set(q('.fl'), { opacity: 0 });
        tl.fromTo(q('.scanl'), { y: 0 }, { y: 400, duration: 1.0, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, T[0]);
        q('.fl').forEach((f, i) => inn(tl, f, { x: 40 }, s.fields[i][2], 0.3, 'power3.out'));
      } else if (s.kind === 'dupe') {
        const dc = q('.dc');
        gsap.set([dc[1], q('.wn')[0], q('.up')[0]], { opacity: 0 });
        inn(tl, dc[1], { y: 40 }, T[0], 0.3, 'power3.out');
        tl.to(dc, { borderColor: '#F59E0B', duration: 0.2 }, T[1]);
        pop(q('.wn'), T[1]);
        out(tl, q('.wn'), T[2], { y: 0, scale: 0.8 });
        pop(q('.up'), T[2]); tl.to(dc[1], { opacity: 0, height: 0, duration: 0.3 }, T[2] + 0.2).to(dc[0], { borderColor: '#11B981', duration: 0.2 }, T[2] + 0.2);
      } else if (s.kind === 'sync') {
        q('.tb .r').forEach((r, i) => inn(tl, r, { x: -30 }, s.from + 0.25 + i * 0.12, 0.28, 'power3.out'));
        q('.n').forEach((n, i) => { tl.to(n, { opacity: 1, duration: 0.15 }, (i % 2 ? T[1] : T[0]) + Math.floor(i / 2) * 0.12); });
        q('.tb .r').forEach((r, i) => i && tl.to(r, { backgroundColor: '#F0FDF7', duration: 0.2 }, T[2] + i * 0.1));
      } else if (s.kind === 'extras') {
        gsap.set(q('.xt div'), { opacity: 0 });
        q('.xt div').forEach((x, i) => pop(x, s.items[i][2], { scale: 0.6, y: 30 }));
      } else if (s.kind === 'publish') {
        gsap.set(q('.dn'), { opacity: 0 });
        tl.to(q('.pb'), { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, T[0]); flash(tl, T[0] + 0.08, 0.25);
        pop(q('.dn'), T[1]);
      }
    });
    // where to find it, then the walk-away clip under the card
    inn(tl, '#of', { y: 70 }, O.from, 0.45, 'power3.out');
    inn(tl, '#of .pt', { x: -40 }, O.path[1], 0.3, 'power3.out');
    $$('#of .ps span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, O.pills[i][1], 0.3, 'back.out(2.4)'));
    tl.to('#shade', { opacity: 1, duration: 0.4 }, O.clip);
    subs(tl, { opacity: 0, scale: 0.85 });
  });
})();
