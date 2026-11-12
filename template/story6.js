// Kaja episode, layout 6 (episodes/sNN.json with "layout": "story6"): see story6.css.
(() => {
  const { EP, $, $$, ic, emo, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const C = D.claim, T = D.test, N = D.notes, S = D.tease;
    $('#ui').innerHTML =
      `<div id="claim" class="card"><div class="lb rd">${ic('seal-question')}<span>${C.label}</span></div><div class="q rd">${C.text}<s></s></div></div>` +
      T.rows.map(r => `<div class="t6 rd">${av(r[0])}<div class="bd"><div class="cn">${r[0]}<span class="pill">${T.nocode}</span></div><div class="ct">${emo(r[1])}</div></div><div class="rs">${ic('check-circle')}${r[2]}</div></div>`).join('') +
      `<div class="n6 a rd" style="top:160px">${ic('check-circle')}${N.a[0]}</div><div class="n6 b rd" style="top:278px">${ic('target')}${N.b[0]}</div>` +
      `<div id="stamp" class="rd">${C.verdict[0]}</div>` +
      `<div id="ts6" class="card"><span class="pill rd">${ic('calendar-blank')}${S.kicker}</span><div class="tt rd">${S.title}</div></div>`;
    $$('.t6').forEach((el, i) => { el.style.top = (148 + i * 92) + 'px'; });
    subsLayout('paper');
  }, tl => {
    const C = D.claim, T = D.test, N = D.notes, S = D.tease;
    gsap.set(['#claim', '.t6', '.t6 .pill', '.t6 .rs', '.n6', '#stamp', '#ts6'], { opacity: 0 });
    gsap.set('#claim .q s', { scaleX: 0 });
    inn(tl, '#claim', { y: 60, scale: 0.92 }, C.from, 0.4);
    tl.fromTo('#claim .lb', { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, C.from + 0.4);
    tl.set('#claim .lb span', { textContent: C.check[0] }, C.check[1]).set('#claim .lb', { backgroundColor: '#0098B7' }, C.check[1]);
    tl.fromTo('#claim .lb', { scale: 1.2 }, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)', immediateRender: false }, C.check[1]);
    $$('.t6').forEach((el, i) => {
      const r = T.rows[i];
      inn(tl, el, { x: -60, scale: 0.92 }, r[3], 0.32);
      inn(tl, $('.pill', el), { scale: 0.3 }, T.nocodeAt + i * 0.14, 0.25, 'back.out(2.6)');
      inn(tl, $('.rs', el), { scale: 0.3, x: 30 }, r[4], 0.3, 'back.out(2.2)');
      tl.to(el, { backgroundColor: '#F0FDF7', duration: 0.2 }, T.listAt + i * 0.1);
    });
    out(tl, '.t6', T.until, { x: -40, stagger: 0.04 });
    inn(tl, '.n6.a', { y: 40, scale: 0.9 }, N.a[1], 0.32); inn(tl, '.n6.b', { y: 40, scale: 0.9 }, N.b[1], 0.32);
    out(tl, '.n6', N.until, { y: 30 });
    // the verdict
    tl.set('#claim .lb span', { textContent: C.label.replace('?', '') }, C.verdict[1] - 0.6).set('#claim .lb', { backgroundColor: '#E5484D' }, C.verdict[1] - 0.6);
    tl.fromTo('#stamp', { scale: 1.5, opacity: 0, rotation: 10 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.22, ease: 'power3.in', immediateRender: false }, C.verdict[1]);
    tl.to('#ui', { y: 7, duration: 0.05, yoyo: true, repeat: 3 }, C.verdict[1] + 0.22);
    flash(tl, C.verdict[1] + 0.22, 0.35);
    tl.to('#claim .q s', { scaleX: 1, duration: 0.3, ease: 'power2.out' }, C.verdict[1] + 0.3);
    tl.to('#claim .q', { color: '#6B7280', duration: 0.3 }, C.verdict[1] + 0.3);
    inn(tl, '#ts6', { y: 60 }, S.from, 0.45, 'power3.out');
    subs(tl);
  });
})();
