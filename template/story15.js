// Kaja episode, layout 15 (episodes/sNN.json with "layout": "story15"): see story15.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const H = D.hook, S = D.src, P = D.page, C = D.post, G = D.group, Y = D.day, T = D.tease;
    $('#ui').innerHTML =
      `<div id="hk"><div class="q">${H.q}</div><div class="s">${H.stamp}</div></div>` +
      `<div id="tl">${S.items.map((s, i) => `<div class="t t${i}">${ic(s[1])}${s[0]}</div>`).join('')}</div>` +
      `<div id="pg" class="card"><div class="hd">${ic('storefront')}${P.title}<span class="ok">${ic('check-circle')}${P.ok}</span></div>` +
      P.items.map((s, i) => `<div class="it it${i}">${ic(s[1])}${s[0]}<small>${s[2]}</small></div>`).join('') + `</div>` +
      `<div id="cur">${ic('cursor')}</div>` +
      `<div id="po" class="card"><div class="t">${ic('image-square')}${C.title}</div>` +
      C.cm.map((c, i) => `<div class="c c${i}">${av(c[0], c[2])}<div class="tx"><small>${c[0]}</small>${c[1]}</div><span class="o">${C.tag}</span></div>`).join('') + `</div>` +
      `<div id="bk">${C.chip[0]}</div>` +
      `<div id="gr" class="card"><div class="t">${ic('users-three')}${G.title}</div>` +
      G.rows.map((r, i) => `<div class="b b${i}">${av(r[0], r[2])}<b>${r[0]}</b><div class="its">${r[1].map(x => `<span>${x}</span>`).join('')}</div></div>`).join('') + `</div>` +
      `<div id="dy"><div class="h h1">${ic('sun')}<b>${Y.a[0]}</b><span>${Y.a[1]}</span></div><div class="a">${ic('arrow-right')}</div><div class="h h2">${ic('moon-stars')}<b>${Y.b[0]}</b><span>${Y.b[1]}</span></div></div>` +
      `<div id="ts" class="card"><span class="pill">${ic('calendar-blank')}${T.kicker}</span><div class="tt">${T.title}</div></div>`;
    subsLayout('halo');
  }, tl => {
    const H = D.hook, S = D.src, P = D.page, C = D.post, G = D.group, Y = D.day, T = D.tease;
    gsap.set(['#hk .q', '#hk .s', '#tl .t', '#pg', '#pg .it', '#pg .ok', '#cur', '#po', '#po .c', '#po .o', '#bk', '#gr', '#gr .b', '#dy .h', '#dy .a', '#ts'], { opacity: 0 });
    // hook
    inn(tl, '#hk .q', { y: 40, scale: 0.9 }, H.from, 0.35);
    tl.fromTo('#hk .s', { opacity: 0, scale: 2.2, rotation: -20 }, { opacity: 1, scale: 1, rotation: -7, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, H.stampAt);
    flash(tl, H.stampAt + 0.15, 0.25);
    // source tiles
    $$('#tl .t').forEach((el, i) => { inn(tl, el, { y: 50, scale: 0.8 }, S.items[i][2], 0.3, 'back.out(2)'); tl.set(el, { className: `t t${i} on` }, S.items[i][2] + 0.1); });
    // page list
    out(tl, ['#hk .q', '#hk .s', '#tl .t'], P.from, { y: -30 });
    inn(tl, '#pg', { y: 60, scale: 0.94 }, P.from, 0.4, 'back.out(1.4)');
    inn(tl, '#pg .ok', { scale: 0.4 }, P.okAt, 0.3, 'back.out(2.4)');
    $$('#pg .it').forEach((el, i) => inn(tl, el, { x: -40 }, P.listAt + i * 0.12, 0.28, 'power3.out'));
    const rowY = i => 92 + i * 78;
    tl.fromTo('#cur', { opacity: 0, x: 860, y: rowY(0) + 60 }, { opacity: 1, x: 700, y: rowY(0), duration: 0.35, ease: 'power2.out', immediateRender: false }, P.pick[0] - 0.3);
    P.pick.forEach((t, i) => {
      if (i) tl.to('#cur', { y: rowY(i), duration: 0.25, ease: 'power2.inOut' }, t - 0.25);
      tl.set('#pg .it', { className: (j, el) => el.className.replace(' on', '') }, t);
      tl.set(`#pg .it${i}`, { className: `it it${i} on` }, t);
    });
    tl.to('#cur', { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1 }, P.pick[2] + 0.1);
    // the post's comments become orders
    out(tl, ['#pg', '#cur'], C.from, { y: -30 });
    inn(tl, '#po', { y: 60, scale: 0.94 }, C.from, 0.4, 'back.out(1.4)');
    $$('#po .c').forEach((el, i) => inn(tl, el, { x: -50 }, C.from + 0.3 + i * 0.25, 0.3, 'power3.out'));
    $$('#po .o').forEach((el, i) => inn(tl, el, { scale: 0.3 }, C.orderAt + i * 0.14, 0.26, 'back.out(2.6)'));
    tl.fromTo('#bk', { opacity: 0, scale: 0.4, rotation: 10 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, C.chip[1]);
    // grouped by buyer
    out(tl, ['#po', '#bk'], G.from, { y: -30 });
    inn(tl, '#gr', { y: 60, scale: 0.94 }, G.from, 0.35, 'back.out(1.4)');
    $$('#gr .b').forEach((el, i) => inn(tl, el, { x: 60 }, G.from + 0.2 + i * 0.18, 0.3, 'back.out(1.6)'));
    // morning -> evening
    out(tl, '#gr', Y.from, { y: -30 });
    inn(tl, '#dy .h1', { x: -60 }, Y.from, 0.35, 'back.out(1.6)');
    inn(tl, '#dy .a', { scale: 0.3 }, Y.b[2] - 0.2, 0.25, 'back.out(2)');
    inn(tl, '#dy .h2', { x: 60, scale: 0.9 }, Y.b[2], 0.35, 'back.out(1.8)');
    flash(tl, Y.b[2] + 0.5, 0.18);
    // teaser
    out(tl, ['#dy .h', '#dy .a'], T.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, T.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 14, scale: 0.92 });
  });
})();
