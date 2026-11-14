// Kaja episode, layout 8 (episodes/sNN.json with "layout": "story8"): see story8.css.
(() => {
  const { EP, $, $$, ic, emo, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const C = D.comment, E = D.edit, L = D.list, S = D.tease;
    $('#ui').innerHTML =
      `<div id="cm8" class="cm rd">${av(C.name, '#8B5CF6')}<div class="bd"><div class="cn">${C.name}</div><div class="ct">${emo(C.text)}</div></div><div class="flag">${ic('warning')}${C.flag[0]}</div></div>` +
      C.qm.map((q, i) => `<div class="qm" style="left:${q[0]}px;top:${q[1]}px">?</div>`).join('') +
      `<div class="n8 a rd"><img src="../assets/logo.png" alt="">${C.no[0]}</div><div class="n8 b rd">${ic('magnifying-glass')}${C.tab[0]}<span class="cnt">1</span></div>` +
      `<div id="ed8" class="card"><div class="et rd">${ic('pencil-simple')}${E.title}</div><div class="qt rd">${emo(E.quote)}</div>` +
      E.fields.map(f => `<div class="fl"><label class="rd">${f[0]}</label><div class="in rd"><span class="v"></span><i class="car"></i></div></div>`).join('') +
      `<div class="sv rd">${ic('floppy-disk')}<span>${E.save[0]}</span></div></div>` +
      `<div id="ls8" class="card"><div class="lt rd">${ic('list-checks')}${L.title}<span class="pill">${L.pill}</span></div>` +
      L.rows.map(r => `<div class="l8 rd"><div>${r[0]}</div><div>${r[1]}</div><div><span class="sz">${r[2]}</span></div>${ic('check-circle')}</div>`).join('') + `</div>` +
      `<div id="ts8" class="card"><span class="pill rd">${ic('calendar-blank')}${S.kicker}</span><div class="tt rd">${S.title}</div></div>`;
    subsLayout('chips');
  }, tl => {
    const C = D.comment, E = D.edit, L = D.list, S = D.tease;
    gsap.set(['#cm8', '#cm8 .flag', '.qm', '.n8', '#ed8', '#ed8 .car', '#ls8', '.l8', '#ts8'], { opacity: 0 });
    inn(tl, '#cm8', { y: 60, scale: 0.9 }, C.from, 0.35);
    $$('.qm').forEach((el, i) => {
      inn(tl, el, { scale: 0.2, y: 30 }, C.qm[i][2], 0.3, 'back.out(2.6)');
      tl.fromTo(el, { rotation: -10 }, { rotation: 10, duration: 0.3, yoyo: true, repeat: 7, ease: 'sine.inOut', immediateRender: false }, C.qm[i][2] + 0.3);
      out(tl, el, C.no[1] + 0.1 + i * 0.05, { scale: 0.3, y: 0 });
    });
    inn(tl, '.n8.a', { x: -60 }, C.no[1], 0.35);
    out(tl, '.n8.a', C.tab[1], { x: 0, y: 20 });
    inn(tl, '#cm8 .flag', { scale: 0.3 }, C.flag[1], 0.3, 'back.out(2.6)');
    tl.to('#cm8', { borderColor: '#F59E0B', backgroundColor: '#FFFBEB', duration: 0.2 }, C.flag[1]);
    inn(tl, '.n8.b', { x: -60 }, C.tab[1], 0.35);
    out(tl, ['#cm8', '.n8.b'], E.from, { y: 40 });
    // fixing it by hand
    inn(tl, '#ed8', { y: 70 }, E.from, 0.45, 'power3.out');
    $$('#ed8 .fl').forEach((el, i) => {
      const f = E.fields[i], v = $('.v', el), car = $('.car', el), p = { n: 0 };
      tl.set(car, { opacity: 1 }, f[2]).set($('.in', el), { borderColor: '#0098B7' }, f[2]);
      tl.to(p, { n: f[1].length, duration: f[3] - f[2], ease: 'none', onUpdate: () => { v.textContent = f[1].slice(0, Math.round(p.n)); } }, f[2]);
      tl.set(car, { opacity: 0 }, f[3] + 0.15).set($('.in', el), { borderColor: '#11B981' }, f[3] + 0.15);
    });
    tl.to('#ed8 .sv', { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1 }, E.save[1]);
    tl.set('#ed8 .sv span', { textContent: E.save[2] }, E.save[1] + 0.1).set('#ed8 .sv', { backgroundColor: '#11B981' }, E.save[1] + 0.1);
    flash(tl, E.save[1] + 0.1, 0.22);
    out(tl, '#ed8', L.from, { y: 40 });
    inn(tl, '#ls8', { y: 70 }, L.from, 0.45, 'power3.out');
    $$('.l8').forEach((el, i) => inn(tl, el, { x: -40 }, L.from + 0.2 + i * 0.14, 0.3, 'power3.out'));
    tl.to($$('.l8')[L.hi[0]], { backgroundColor: '#ECFDF5', duration: 0.25 }, L.hi[1]);
    tl.fromTo('#ls8 .lt .pill', { scale: 1 }, { scale: 1.2, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false }, L.hi[1]);
    out(tl, '#ls8', S.from, { y: 40 });
    inn(tl, '#ts8', { y: 70 }, S.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 16, scale: 0.9 });
  });
})();
