// Kaja episode, layout 21 (episodes/sNN.json with "layout": "story21"): see story21.css.
(() => {
  const { EP, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const Y = D.day, P = D.pieces, C = D.check, M = D.merged, O = D.morning, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="dy" class="card"><div class="t">${ic('sun-horizon')}${Y.title}</div><div class="st">` +
      Y.ev.map(e => `<div class="e ${e[1] === 'lv' ? 'lv' : ''}">${ic(e[1] === 'lv' ? 'broadcast' : 'image-square')}${e[2]}<small>${e[0]}</small></div>`).join('') + `</div></div>` +
      `<div id="pz" class="card"><div class="bk">${ic('shopping-bag')}</div><div class="ps">${P.items.map(p => `<span class="p">${p[0]} <small>· ${p[1]}</small></span>`).join('')}</div></div>` +
      `<div id="ck" class="card"><div class="t">${ic('list-checks')}${C.title}</div><div class="g">` +
      Y.ev.map(e => `<div class="i"><span class="bx">${ic('check')}</span>${e[2]} · ${e[0]}</div>`).join('') + `</div></div>` +
      `<div id="mb">${ic('stack')}${C.btn[0]}</div>` +
      `<div id="ml" class="card"><div class="t">${ic('users-three')}${M.title}<span class="pill">Noxio</span></div>` +
      M.rows.map(r => `<div class="r"><b>${r[0]}</b><div class="it">${r[1].map(x => `<span>${x}</span>`).join('')}${r[2].map(x => `<span class="s">${x}</span>`).join('')}</div></div>`).join('') + `</div>` +
      `<div id="mo"><div class="a">${ic('package')}${O.a}</div><div class="b">${O.b}<i></i></div></div>` +
      `<div id="qq" class="card"><div class="h">${Q.q}</div><div class="o">${Q.opts.map(o => `<span>${o}</span>`).join('')}</div></div>`;
    subsLayout('frame');
  }, tl => {
    const Y = D.day, P = D.pieces, C = D.check, M = D.merged, O = D.morning, Q = D.ask;
    gsap.set(['#dy', '#dy .e', '#pz', '#pz .p', '#ck', '#ck .i', '#mb', '#ml', '#ml .r', '#mo .a', '#mo .b', '#qq', '#qq .o span'], { opacity: 0 });
    // the day strip
    inn(tl, '#dy', { y: 50, scale: 0.94 }, Y.from, 0.4, 'back.out(1.4)');
    $$('#dy .e').forEach((el, i) => inn(tl, el, { y: 30, scale: 0.7 }, Y.from + 0.3 + i * 0.28, 0.25, 'back.out(2)'));
    // next morning: the basket piece by piece
    inn(tl, '#pz', { y: 40 }, P.from, 0.35, 'power3.out');
    $$('#pz .p').forEach((el, i) => inn(tl, el, { x: 200, rotation: 8 }, P.at[i], 0.35, 'back.out(1.6)'));
    tl.fromTo('#pz .bk', { rotation: 0 }, { rotation: 6, duration: 0.12, yoyo: true, repeat: 5, immediateRender: false }, P.at[P.at.length - 1] + 0.3);
    // Noxio: pick and merge
    out(tl, ['#dy', '#pz'], C.from, { y: -30 });
    inn(tl, '#ck', { y: 60, scale: 0.94 }, C.from, 0.4, 'back.out(1.4)');
    $$('#ck .i').forEach((el, i) => { inn(tl, el, { x: -30 }, C.from + 0.3 + i * 0.1, 0.25, 'power3.out'); tl.set(el, { className: 'i on' }, C.tick + i * 0.18); });
    inn(tl, '#mb', { scale: 0.5 }, C.btn[1] - 0.5, 0.3, 'back.out(2)');
    tl.to('#mb', { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, C.btn[1]);
    flash(tl, C.btn[1] + 0.1, 0.18);
    out(tl, ['#ck', '#mb'], M.from, { scale: 0.9 });
    inn(tl, '#ml', { y: 40, scale: 0.9 }, M.from, 0.35, 'back.out(1.6)');
    $$('#ml .r').forEach((el, i) => inn(tl, el, { x: 50 }, M.from + 0.25 + i * 0.18, 0.3, 'back.out(1.6)'));
    // morning: packing, not rewriting
    out(tl, '#ml', O.from, { y: -30 });
    inn(tl, '#mo .a', { x: -60, scale: 0.8 }, O.from, 0.35, 'back.out(1.8)');
    inn(tl, '#mo .b', { x: 60 }, O.bAt - 0.3, 0.3, 'power3.out');
    tl.to('#mo .b i', { scaleX: 1, duration: 0.3 }, O.bAt + 0.2);
    // question
    out(tl, ['#mo .a', '#mo .b'], Q.from, { y: 40 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    $$('#qq .o span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, Q.from + 0.4 + i * 0.15, 0.28, 'back.out(2.4)'));
    subs(tl, { opacity: 0, y: 12, scale: 0.94 });
  });
})();
