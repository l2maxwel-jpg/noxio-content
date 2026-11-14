// Kaja episode, layout 9 (episodes/sNN.json with "layout": "story9"): see story9.css.
(() => {
  const { EP, $, $$, ic, emo, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const C = D.claim, L = D.live, T = D.time, W = D.ways, S = D.tease;
    $('#ui').innerHTML =
      `<div id="cl9" class="card"><div class="lb rd">${C.label}</div><div class="q rd">${C.text}</div></div>` +
      `<div id="st9" class="rd">${C.verdict[0]}</div><div id="gd9" class="rd">${ic('thumbs-up')}${C.good[0]}</div>` +
      `<div id="lv9" class="card p9"><div class="hd rd"><span class="dot"></span>${L.title}</div>` +
      L.rows.map(r => `<div class="c9 rd">${av(r[0])}<b>${r[0]}</b>${emo(r[1])}${r[2] ? `<span class="tg">${r[2]}</span>` : ""}</div>`).join('') + `</div>` +
      `<div id="tl9" class="card p9"><div class="hd rd">${ic('timer')}${T.title}</div><div class="trk"><div class="fill"></div><span class="a rd">${T.a}</span><span class="b rd">${ic('flag-checkered')}${T.b}</span></div>` +
      `<div class="row9"><div class="scan9 rd">${ic('scan')}${T.btn}</div><div class="ok9 rd">${ic('check-circle')}${T.ok[0]}</div></div></div>` +
      `<div class="w9 a rd">${ic('link-simple')}${W.a[0]}</div><div class="w9 b rd">${ic('list-bullets')}${W.b[0]}</div>` +
      `<div id="rd9" class="card rd">${ic('check-circle')}${W.ready[0]}</div>` +
      `<div id="ts9" class="card"><span class="pill rd">${ic('calendar-blank')}${S.kicker}</span><div class="tt rd">${S.title}</div></div>`;
    subsLayout('bar');
  }, tl => {
    const C = D.claim, L = D.live, T = D.time, W = D.ways, S = D.tease;
    gsap.set(['#cl9', '#st9', '#gd9', '#lv9', '.c9', '#tl9', '.ok9', '.w9', '#rd9', '#ts9'], { opacity: 0 });
    inn(tl, '#cl9', { y: 60, scale: 0.92 }, C.from, 0.4);
    tl.fromTo('#cl9 .lb', { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, C.from + 0.4);
    tl.set('#cl9 .lb', { textContent: C.no[0], backgroundColor: '#E5484D' }, C.no[1]);
    tl.fromTo('#cl9 .lb', { scale: 1.35 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', immediateRender: false }, C.no[1]);
    tl.to('#cl9 .q', { color: '#9CA3AF', duration: 0.25 }, C.no[1]);
    flash(tl, C.no[1], 0.25);
    inn(tl, '#gd9', { x: -60, scale: 0.9 }, C.good[1], 0.32); out(tl, '#gd9', L.from, { y: 20 });
    // during the live everything keeps changing
    inn(tl, '#lv9', { y: 60 }, L.from, 0.4, 'power3.out');
    tl.fromTo('#lv9 .dot', { opacity: 1 }, { opacity: 0.25, duration: 0.4, yoyo: true, repeat: 11, immediateRender: false }, L.from);
    $$('.c9').forEach((el, i) => inn(tl, el, { x: -50 }, L.rows[i][3], 0.3, 'back.out(1.6)'));
    out(tl, '#lv9', T.from, { y: 30 });
    // after the live: the comments are complete, scan
    inn(tl, '#tl9', { y: 60 }, T.from, 0.4, 'power3.out');
    tl.to('#tl9 .fill', { width: '100%', duration: T.end - T.from - 0.3, ease: 'power1.inOut' }, T.from + 0.3);
    tl.fromTo('#tl9 .trk .b', { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: '100% 50%', immediateRender: false }, T.end);
    tl.to('#tl9 .scan9', { backgroundColor: '#11B981', duration: 0.25 }, T.end);
    tl.fromTo('#tl9 .scan9', { scale: 1 }, { scale: 1.1, duration: 0.22, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, T.end + 0.2);
    inn(tl, '.ok9', { x: -40, scale: 0.9 }, T.ok[1], 0.3);
    out(tl, '#tl9', W.from, { y: 30 });
    inn(tl, '.w9.a', { y: 40, scale: 0.9 }, W.a[1], 0.3); inn(tl, '.w9.b', { y: 40, scale: 0.9 }, W.b[1], 0.3);
    inn(tl, '#rd9', { y: 50, scale: 0.9 }, W.ready[1], 0.35);
    out(tl, ['.w9', '#rd9'], C.verdict[1] - 0.45, { y: 30 });
    // verdict
    tl.set('#cl9 .lb', { textContent: C.label.replace('?', '') }, C.verdict[1] - 0.5);
    tl.fromTo('#st9', { scale: 1.5, opacity: 0, rotation: 10 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.22, ease: 'power3.in', immediateRender: false }, C.verdict[1]);
    tl.to('#ui', { y: 7, duration: 0.05, yoyo: true, repeat: 3 }, C.verdict[1] + 0.22);
    flash(tl, C.verdict[1] + 0.22, 0.35);
    inn(tl, '#ts9', { y: 60 }, S.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, x: -30 });
  });
})();
