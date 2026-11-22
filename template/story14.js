// Kaja episode, layout 14 (episodes/sNN.json with "layout": "story14"): see story14.css.
(() => {
  const { EP, W, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const Q = D.q, S = D.set, C = D.cmt, K = D.skip, O = D.opt, T = D.tease;
    $('#ui').innerHTML =
      `<div id="q" class="card">${ic('target')}<b>${Q.text}</b></div>` +
      `<div id="st" class="card"><div class="t">${ic('sliders-horizontal')}${S.title}<span class="pill">${S.tag}</span></div>` +
      S.rows.map((r, i) => `<div class="rw r${i}"><span class="lb">${r.label}</span><span class="cs">${r.chips.map((c, j) => `<span class="ch c${i}_${j}">${c[1] ? `<i style="background:${c[1]}"></i>` : ''}${c[0]}</span>`).join('')}</span></div>`).join('') + `</div>` +
      `<div id="cm2" class="cm">${av(C.name, '#8B5CF6')}<div class="bd"><div class="cn">${C.name} · ${C.when}</div><div class="ct">${C.text}</div></div></div>` +
      `<div id="res" class="card">${av(C.name, '#8B5CF6')}<b>${C.name}</b><div class="it">${C.items.map(x => `<span>${x}</span>`).join('')}</div>${ic('check-circle')}</div>` +
      `<div id="sk" class="card"><div class="t">${ic('user-minus')}${K.title}<span class="sw"><i></i></span></div>` +
      `<div class="own">${av(K.shop, '#0098B7')}<div class="tx"><small>${K.shop} · ${K.role}</small>${K.text}</div><div class="ln"></div><span class="tg">${K.tag}</span></div></div>` +
      `<div id="op" class="card"><div class="h">${O.head}</div>` + O.rows.map(r => `<div class="r">${ic(r[2])}${r[0]}<span class="st">${ic('star').repeat(r[1])}</span></div>`).join('') + `</div>` +
      `<div id="ts" class="card"><span class="pill">${ic('calendar-blank')}${T.kicker}</span><div class="tt">${T.title}</div></div>`;
    $('#res .ph:last-child').classList.add('ok');
    subsLayout('lit');
  }, tl => {
    const Q = D.q, S = D.set, C = D.cmt, K = D.skip, O = D.opt, T = D.tease;
    gsap.set(['#q', '#st', '#st .rw', '#st .ch', '#cm2', '#res', '#sk', '#sk .tg', '#op', '#op .r', '#ts'], { opacity: 0 });
    // hook question
    inn(tl, '#q', { y: 50, scale: 0.9 }, Q.from, 0.35);
    tl.fromTo('#q .ph', { rotation: -30, scale: 0.6 }, { rotation: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, Q.hint);
    // settings sheet
    out(tl, '#q', S.from, { y: -30 });
    inn(tl, '#st', { y: 60, scale: 0.94 }, S.from, 0.4, 'back.out(1.4)');
    S.rows.forEach((r, i) => {
      inn(tl, `#st .r${i}`, { x: -40 }, r.at, 0.3, 'power3.out');
      r.chips.forEach((c, j) => inn(tl, `#st .c${i}_${j}`, { scale: 0.3 }, c[2], 0.26, 'back.out(2.6)'));
    });
    // the comment becomes an order, matching chips light up
    tl.to('#st', { scale: 0.86, y: -40, transformOrigin: '50% 0%', duration: 0.35, ease: 'power2.inOut' }, C.from - 0.1);
    inn(tl, '#cm2', { y: 50, scale: 0.9 }, C.from, 0.35);
    C.match.forEach(([sel, t]) => tl.set(sel, { className: `ch ${sel.slice(1)} on` }, t).fromTo(sel, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, t));
    out(tl, '#cm2', C.order, { y: -20, scale: 0.9 });
    inn(tl, '#res', { scale: 0.7 }, C.order, 0.35, 'back.out(1.8)');
    flash(tl, C.order + 0.05, 0.18);
    // skip the seller's own comments
    out(tl, ['#st', '#res'], K.from, { y: -30 });
    inn(tl, '#sk', { y: 70, scale: 0.92 }, K.from, 0.4, 'back.out(1.4)');
    tl.to('#sk .sw', { backgroundColor: '#11B981', duration: 0.15 }, K.flip).to('#sk .sw i', { x: 50, duration: 0.22, ease: 'back.out(2)' }, K.flip);
    tl.to('#sk .own .ln', { scaleX: 1, duration: 0.35, ease: 'power2.out' }, K.strike);
    tl.to('#sk .own .tx, #sk .own .av', { opacity: 0.45, duration: 0.2 }, K.strike);
    inn(tl, '#sk .tg', { scale: 0.4 }, K.strike + 0.25, 0.3, 'back.out(2.4)');
    // codes are optional
    out(tl, '#sk', O.from, { y: -30 });
    inn(tl, '#op', { y: 70, scale: 0.92 }, O.from, 0.4, 'back.out(1.4)');
    $$('#op .r').forEach((el, i) => inn(tl, el, { x: -60 }, O.rows[i][3], 0.32, 'back.out(1.6)'));
    // teaser
    out(tl, '#op', T.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, T.from, 0.45, 'power3.out');
    // lit subtitles: each word lights up as it is spoken
    subs(tl, { opacity: 0, y: 10 });
    window.PHR.forEach((c, k) => c.words.forEach((wi, j) => tl.set($$('.sub')[k].children[j], { opacity: 1 }, W[wi][1])));
  });
})();
