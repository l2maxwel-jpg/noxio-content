// Kaja episode, layout 10 (episodes/sNN.json with "layout": "story10"): see story10.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const L = D.lives, O = D.one, S = D.tease;
    $('#ui').innerHTML =
      L.items.map((l, i) => `<div class="lv card" style="left:${i * 298}px"><div class="h rd">${ic('video-camera')}${l[0]}<span class="ck">${ic('check')}</span></div>` +
        `<div class="ls rd">${ic('list-bullets')}${L.list} ${i + 1}</div><div class="by rd">${av(L.buyer, '#8B5CF6')}${L.buyer}</div><div class="it rd">${l[1]}</div></div>`).join('') +
      `<div id="mg" class="rd">${ic('arrows-merge')}${L.btn[0]}</div>` +
      `<div id="one" class="card"><div class="t rd">${ic('list-checks')}${O.title}<span class="pill">${O.pill}</span></div>` +
      `<div class="r"><div style="display:flex;align-items:center;gap:16px">${av(L.buyer, '#8B5CF6')}<b class="rd">${L.buyer}</b></div></div>` +
      `<div class="chips">${L.items.map(l => `<span class="rd">${l[1]}<small>${l[0].split(' · ')[1]}</small></span>`).join('')}</div></div>` +
      `<div id="pk" class="rd">${ic('package')}${O.pack[0]}</div>` +
      `<div id="ts" class="card"><span class="pill rd">${ic('calendar-blank')}${S.kicker}</span><div class="tt rd">${S.title}</div></div>`;
    subsLayout('line');
  }, tl => {
    const L = D.lives, O = D.one, S = D.tease;
    gsap.set(['.lv', '.lv .ls', '.lv .by', '.lv .it', '#mg', '#one', '#one .chips span', '#pk', '#ts'], { opacity: 0 });
    $$('.lv').forEach((el, i) => {
      const l = L.items[i];
      inn(tl, el, { y: 60, scale: 0.88 }, L.from + i * 0.22, 0.32);
      inn(tl, $('.ls', el), { x: -20 }, L.listAt + i * 0.2, 0.25, 'power3.out');
      inn(tl, $('.by', el), { scale: 0.5 }, L.buyerAt + i * 0.14, 0.28, 'back.out(2.2)');
      inn(tl, $('.it', el), { scale: 0.4 }, l[2], 0.28, 'back.out(2.4)');
      tl.to($('.ck', el), { backgroundColor: '#11B981', borderColor: '#11B981', duration: 0.15 }, l[3]).to($('.ck .ph', el), { opacity: 1, duration: 0.1 }, l[3]);
      tl.to(el, { borderColor: '#11B981', duration: 0.15 }, l[3]);
      tl.to(el, { x: (1 - i) * 240, scale: 0.6, opacity: 0, duration: 0.3, ease: 'power3.in' }, O.from - 0.3);
    });
    inn(tl, '#mg', { y: 40, scale: 0.8 }, L.btn[1], 0.35, 'back.out(2)');
    tl.to('#mg', { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, L.btn[2]);
    flash(tl, L.btn[2] + 0.08, 0.25);
    out(tl, '#mg', O.from, { y: 0, scale: 0.7 });
    inn(tl, '#one', { scale: 0.85, y: 30 }, O.from, 0.4, 'back.out(1.5)');
    $$('#one .chips span').forEach((el, i) => inn(tl, el, { y: -40, scale: 0.6 }, O.itemsAt + i * 0.22, 0.3, 'back.out(2)'));
    tl.fromTo('#pk', { scale: 0.4, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false, transformOrigin: '100% 100%' }, O.pack[1]);
    flash(tl, O.pack[1] + 0.25, 0.25);
    out(tl, ['#one', '#pk'], S.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, S.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 14, scale: 0.94 });
  });
})();
