// Kaja episode, layout 16 (episodes/sNN.json with "layout": "story16"): see story16.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const M = D.msg, S = D.search, E = D.edit, A = D.acts, X = D.xls, T = D.tease;
    $('#ui').innerHTML =
      `<div id="ms">${av(M.name, '#F97316')}<div class="bb"><small>${M.name} · ${M.when}</small>${M.text}</div></div>` +
      `<div id="wq">${ic('magnifying-glass')}${M.q[0]}</div>` +
      `<div id="sr" class="card"><div class="bar">${ic('magnifying-glass')}<span class="ty"></span><i class="cur"></i></div>` +
      S.rows.map(r => `<div class="r">${av(M.name, '#F97316')}${r[0]}<span>${r[1]}</span></div>`).join('') + `</div>` +
      `<div id="ed" class="card"><div class="t">${ic('pencil-simple')}${E.title}</div><div class="it"><b>${E.item}</b>` +
      `<div class="sz">${E.label}<span class="f"><span class="m">M<i></i></span><span class="l">L</span></span></div></div>` +
      `<div class="bt"><span>${E.save[0]}</span></div></div>` +
      `<div id="ok">${E.done[0]}</div>` +
      `<div id="ac"><span class="a">${ic('plus-circle')}${A.add[0]}</span><span class="d">${ic('trash')}${A.del[0]}</span></div>` +
      `<div id="xl" class="card"><div class="ic">${ic('file-xls')}</div><div><b>${X.name}</b><small>${X.sub[0]}</small><span class="up">${ic('check-circle')}${X.up[0]}</span></div></div>` +
      `<div id="ts" class="card"><span class="pill">${ic('calendar-blank')}${T.kicker}</span><div class="tt">${T.title}</div></div>`;
    subsLayout('tape');
  }, tl => {
    const M = D.msg, S = D.search, E = D.edit, A = D.acts, X = D.xls, T = D.tease;
    gsap.set(['#ms', '#wq', '#sr', '#sr .r', '#ed', '#ed .l', '#ok', '#ac span', '#xl', '#xl small', '#xl .up', '#ts'], { opacity: 0 });
    inn(tl, '#ms', { y: 50, scale: 0.9 }, M.from, 0.35);
    inn(tl, '#wq', { scale: 0.5 }, M.q[1], 0.3, 'back.out(2.2)');
    // search: type the name, show her orders
    out(tl, ['#ms', '#wq'], S.from, { y: -30 });
    inn(tl, '#sr', { y: 60, scale: 0.94 }, S.from, 0.4, 'back.out(1.4)');
    const nm = S.query, step = (S.typeEnd - S.typeAt) / nm.length;
    for (let i = 1; i <= nm.length; i++) tl.call(() => { $('#sr .ty').textContent = nm.slice(0, i); }, null, S.typeAt + i * step);
    tl.call(() => { $('#sr .ty').textContent = ''; }, null, S.from - 0.01);
    tl.to('#sr .cur', { opacity: 0, duration: 0.01, repeat: 15, yoyo: true, repeatDelay: 0.25 }, S.from);
    $$('#sr .r').forEach((el, i) => inn(tl, el, { x: -40 }, S.rowsAt + i * 0.15, 0.3, 'power3.out'));
    tl.fromTo('#sr .r span', { scale: 1 }, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, S.all);
    // edit card: M struck, L typed, save
    out(tl, '#sr', E.from, { y: -30 });
    inn(tl, '#ed', { y: 60, scale: 0.94 }, E.from, 0.4, 'back.out(1.4)');
    tl.to('#ed .sz .f', { borderColor: '#0098B7', duration: 0.15 }, E.m - 0.3);
    tl.to('#ed .sz .m i', { scaleX: 1, duration: 0.25 }, E.m);
    tl.to('#ed .sz .m', { opacity: 0.4, duration: 0.2 }, E.m + 0.1);
    inn(tl, '#ed .l', { scale: 0.3, y: -10 }, E.l, 0.28, 'back.out(2.6)');
    tl.to('#ed .bt span', { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, E.save[1]);
    flash(tl, E.save[1] + 0.08, 0.18);
    tl.fromTo('#ok', { opacity: 0, scale: 2, rotation: -18 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, E.done[1]);
    // add / remove
    out(tl, ['#ed', '#ok'], A.from, { y: -30 });
    inn(tl, '#ac .a', { x: -60, scale: 0.8 }, A.add[1], 0.32, 'back.out(1.8)');
    inn(tl, '#ac .d', { x: 60, scale: 0.8 }, A.del[1], 0.32, 'back.out(1.8)');
    // excel updated
    out(tl, '#ac span', X.from, { y: -30 });
    inn(tl, '#xl', { y: 60, scale: 0.94 }, X.from, 0.4, 'back.out(1.4)');
    inn(tl, '#xl small', { x: -20 }, X.sub[1], 0.25, 'power3.out');
    inn(tl, '#xl .up', { scale: 0.4 }, X.up[1], 0.3, 'back.out(2.4)');
    // teaser
    out(tl, '#xl', T.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, T.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 14, rotation: -4 });
  });
})();
