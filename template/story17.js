// Kaja episode, layout 17 (episodes/sNN.json with "layout": "story17"): see story17.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const C = D.cm, K = D.codes, Q = D.ask;
    $('#ui').innerHTML =
      C.rows.map((r, i) => `<div class="rw r${i}">${av(r[0], r[2])}<div class="tx"><small>${r[0]} · live</small>${r[1]}</div>` +
        `<span class="tg ${r[3] ? 'am' : ''}">${r[3] ? ic('question') + C.check : ic('check') + C.order}</span></div>`).join('') +
      `<div id="st1">${C.sticker[0]}</div>` +
      `<div id="cd" class="card"><div class="h">${K.head}</div>` + K.rows.map(r => `<div class="r">${ic(r[2])}${r[0]}<b>${r[1]}</b></div>`).join('') + `</div>` +
      `<div id="qq" class="card"><div class="h">${ic('chat-teardrop-dots')}${Q.q}</div><div class="in">${Q.ph}<i></i>${ic('paper-plane-right')}</div></div>`;
    $$('#qq .in .ph').forEach(el => el.classList.add('snd'));
    subsLayout('react');
  }, tl => {
    const C = D.cm, K = D.codes, Q = D.ask, Wn = D.win;
    const wrap = $('#kwrap'), cl = { t: 565, r: 540, b: 1355, l: 540 };
    const clip = () => { wrap.style.clipPath = `inset(${cl.t}px ${cl.r}px ${cl.b}px ${cl.l}px round 44px)`; };
    clip();
    const rows = $$('.rw'), wallY = i => [340, 525, 710, 935, 1130][i], listY = i => 900 + i * 104, rots = [-3, 2.5, -1.5, 3, -2];
    rows.forEach((el, i) => gsap.set(el, { y: wallY(i), rotation: rots[i], x: i % 2 ? 20 : -10, opacity: 0 }));
    gsap.set(['#kwin', '#st1', '#cd', '#qq', '.rw .tg'], { opacity: 0 });
    // the wall of comments (first frame)
    rows.forEach((el, i) => tl.to(el, { opacity: 1, duration: 0.2 }, 0.02 + i * 0.05));
    tl.set('.r0', { className: 'rw r0 on' }, C.at[0]);
    gsap.set('#st1', { x: 600, y: wallY(1) - 40 });
    tl.fromTo('#st1', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.2)', immediateRender: false }, C.sticker[1]);
    // Kaja's window opens, the comments slide into a list
    tl.to(cl, { t: 300, r: 80, b: 1090, l: 80, duration: 0.55, ease: 'back.out(1.3)', onUpdate: clip }, Wn.open);
    tl.to('#kwin', { opacity: 1, duration: 0.2 }, Wn.open + 0.35);
    tl.to('#st1', { opacity: 0, duration: 0.2 }, Wn.list - 0.25);
    rows.forEach((el, i) => tl.to(el, { y: listY(i), rotation: 0, x: 0, scale: 1, duration: 0.5, ease: 'power3.inOut' }, Wn.list + i * 0.05));
    // quoted comments light up, orders get tags
    C.at.forEach((t, i) => { if (i) tl.set(`.r${i}`, { className: `rw r${i} on` }, t); });
    $$('.rw .tg').forEach((el, i) => { if (i < 4) inn(tl, el, { scale: 0.3 }, C.orderAt + i * 0.14, 0.26, 'back.out(2.6)'); });
    flash(tl, C.orderAt + 0.1, 0.15);
    inn(tl, '.r4 .tg', { scale: 0.3 }, C.checkAt, 0.28, 'back.out(2.4)');
    tl.to('.r4 .tg', { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, C.click);
    tl.call(() => { const t = $('.r4 .tg'); t.classList.remove('am'); t.innerHTML = ic('check') + C.order; }, null, C.click + 0.1);
    tl.call(() => { const t = $('.r4 .tg'); t.classList.add('am'); t.innerHTML = ic('question') + C.check; }, null, C.click + 0.09);
    flash(tl, C.click + 0.12, 0.15);
    // codes optional
    tl.to(rows, { opacity: 0, y: '+=40', duration: 0.3, stagger: 0.04 }, K.from - 0.15);
    inn(tl, '#cd', { y: 60, scale: 0.94 }, K.from, 0.4, 'back.out(1.4)');
    $$('#cd .r').forEach((el, i) => inn(tl, el, { x: -60 }, K.rows[i][3], 0.32, 'back.out(1.6)'));
    gsap.set('#cd .r', { opacity: 0 });
    // question to the viewers
    out(tl, '#cd', Q.from, { y: -30 });
    inn(tl, '#qq', { y: 60, scale: 0.94 }, Q.from, 0.4, 'back.out(1.4)');
    tl.to('#qq .in', { borderColor: '#0098B7', backgroundColor: '#E0F5FA', duration: 0.2 }, Q.write);
    tl.to('#qq .in i', { opacity: 0, duration: 0.01, repeat: 9, yoyo: true, repeatDelay: 0.25 }, Q.write);
    subs(tl, { opacity: 0, y: 10, scale: 0.92 });
  });
})();
