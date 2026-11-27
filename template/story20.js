// Kaja episode, layout 20 (episodes/sNN.json with "layout": "story20"): see story20.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  const cols = ['#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#0EA5E9', '#EF4444'];
  boot(() => {
    const P = D.post, G = D.group, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="po" class="card"><div class="ph0">${ic('dress')}</div><div class="cs">` +
      P.cm.map((c, i) => `<div class="c c${i}">${av(c[0], cols[i % cols.length])}${c[1]}</div>`).join('') + `</div></div>` +
      `<div id="mg">${ic('magnifying-glass')}</div>` +
      `<div id="bk">${P.baskets.map(b => `<div class="b">${ic('shopping-bag')}${b}<i></i></div>`).join('')}</div>` +
      `<div id="gr" class="card"><div class="t">${ic('shopping-bag')}${G.title}<span class="pill">Noxio</span></div><div class="bx">` +
      G.buyers.map(b => `<div class="bb"><div class="n">${ic('user-circle')}${b[0]}</div><div class="it">${b[1].map(x => `<span>${x}</span>`).join('')}</div></div>`).join('') +
      `</div><div class="uq">${ic('question')}${G.uq}<span class="tg">${G.tag[0]}</span></div></div>` +
      `<div id="ok">${ic('check-circle')}${G.ok[0]}</div>` +
      `<div id="qq" class="card"><div class="h">${Q.q}</div><div class="o">${Q.opts.map(o => `<span>${ic(o[1])}${o[0]}</span>`).join('')}</div></div>`;
    subsLayout('bubble');
  }, tl => {
    const P = D.post, G = D.group, Q = D.ask;
    gsap.set(['#po', '#po .c', '#mg', '#bk', '#gr', '#gr .bb', '#gr .uq', '#gr .tg', '#ok', '#qq', '#qq .o span'], { opacity: 0 });
    // the post and the avalanche of comments
    inn(tl, '#po', { y: 50, scale: 0.94 }, P.from, 0.4, 'back.out(1.4)');
    const rows = $$('#po .c');
    rows.forEach((el, i) => {
      const t = i < 3 ? P.first[i] : P.flood + (i - 3) * 0.12, y = (i % 6) * 50 + (i >= 6 ? 24 : 0);
      tl.fromTo(el, { opacity: 0, y: -60, rotation: gsap.utils.random(-4, 4) }, { opacity: 1, y, duration: 0.3, ease: 'bounce.out', immediateRender: false }, t);
    });
    // re-reading: the magnifier sweeps
    gsap.set('#mg', { x: 320, y: 40 });
    tl.to('#mg', { opacity: 1, duration: 0.2 }, P.reread - 0.2);
    tl.to('#mg', { x: 760, y: 260, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, P.reread);
    tl.to('#mg', { opacity: 0, duration: 0.2 }, P.basket + 0.6);
    // hand-filled baskets, slowly
    inn(tl, '#bk', { y: 30 }, P.basket - 0.3, 0.3, 'power3.out');
    $$('#bk .b i').forEach((el, i) => tl.fromTo(el, { '--f': '0%' }, { '--f': `${[35, 20, 10][i]}%`, duration: 1.4, ease: 'none', immediateRender: false }, P.basket + i * 0.2));
    // Noxio: grouped by buyer
    out(tl, ['#po', '#bk'], G.from, { y: -30 });
    inn(tl, '#gr', { y: 60, scale: 0.94 }, G.from, 0.4, 'back.out(1.4)');
    $$('#gr .bb').forEach((el, i) => inn(tl, el, { y: 40, scale: 0.8 }, G.buyersAt + i * 0.2, 0.32, 'back.out(1.8)'));
    flash(tl, G.buyersAt + 0.1, 0.15);
    inn(tl, '#gr .uq', { x: -40 }, G.tag[1] - 0.6, 0.3, 'power3.out');
    inn(tl, '#gr .tg', { scale: 0.3 }, G.tag[1], 0.28, 'back.out(2.4)');
    inn(tl, '#ok', { scale: 0.5 }, G.ok[1], 0.3, 'back.out(2)');
    // question
    out(tl, ['#gr', '#ok'], Q.from, { y: -30 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    $$('#qq .o span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, Q.from + 0.4 + i * 0.2, 0.3, 'back.out(2.4)'));
    subs(tl, { opacity: 0, y: 14, scale: 0.9 });
  });
})();
