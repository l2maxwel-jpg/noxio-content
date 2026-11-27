// Kaja episode, layout 19 (episodes/sNN.json with "layout": "story19"): see story19.css.
(() => {
  const { EP, W, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const N = D.note, T = D.table, X = D.xls, S = D.dest, C = D.cmp, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="fl"><div id="nb">${N.lines.map(l => `<div class="l">${l}<i></i></div>`).join('')}<span class="q">${ic('calculator')}${N.calc[0]}</span></div>` +
      `<div id="tb"><div class="h">${T.head.map(h => `<span>${h}</span>`).join('')}</div>` +
      T.rows.map(r => `<div class="r"><b>${r[0]}</b><span>${r[1]}</span><span class="c">${r[2]}</span><span class="s">${r[3]}</span></div>`).join('') + `</div></div>` +
      `<div id="xb">${ic('download-simple')}${X.btn[0]}</div>` +
      `<div id="fc">${ic('file-xls')}${X.file[0]}</div>` +
      `<div id="ds">${S.items.map(s => `<div class="d">${ic(s[1])}${s[0]}</div>`).join('')}</div>` +
      `<div id="cp"><div class="a">${C.a}<small>${C.asub}</small></div><div class="vs">vs</div><div class="b">${C.b}<i></i></div></div>` +
      `<div id="qq" class="card"><div class="h">${Q.q}</div><div class="o">${Q.opts.map(o => `<span>${ic(o[1])}${o[0]}</span>`).join('')}</div></div>`;
    subsLayout('uline');
  }, tl => {
    const N = D.note, T = D.table, X = D.xls, S = D.dest, C = D.cmp, Q = D.ask;
    gsap.set(['#fl', '#nb .l', '#nb .q', '#tb .r', '#xb', '#fc', '#ds .d', '#cp .a', '#cp .vs', '#cp .b', '#qq', '#qq .o span'], { opacity: 0 });
    gsap.set('#tb', { rotationY: -90 });
    // notebook with crossed-out orders
    inn(tl, '#fl', { y: 50, scale: 0.94 }, N.from, 0.4, 'back.out(1.4)');
    $$('#nb .l').forEach((el, i) => inn(tl, el, { x: -30 }, N.from + 0.25 + i * 0.3, 0.25, 'power3.out'));
    N.strike.forEach(([i, t]) => tl.to(`#nb .l:nth-child(${i + 1}) i`, { scaleX: 1, duration: 0.25 }, t));
    inn(tl, '#nb .q', { scale: 0.4 }, N.calc[1], 0.3, 'back.out(2.4)');
    // flip to the table
    tl.to('#nb', { rotationY: 90, duration: 0.3, ease: 'power2.in' }, T.from);
    tl.to('#tb', { rotationY: 0, duration: 0.35, ease: 'power2.out' }, T.from + 0.3);
    $$('#tb .r').forEach((el, i) => inn(tl, el, { x: 40 }, T.from + 0.6 + i * 0.15, 0.25, 'power3.out'));
    tl.set('#tb .r', { className: 'r on' }, T.group);
    tl.fromTo('#tb .r .c', { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, T.colors);
    tl.fromTo('#tb .r .s', { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, T.sizes);
    // export button, file
    inn(tl, '#xb', { y: 30, scale: 0.8 }, X.btn[1], 0.3, 'back.out(1.8)');
    tl.to('#xb', { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, X.click);
    flash(tl, X.click + 0.08, 0.18);
    tl.fromTo('#fc', { opacity: 0, x: -300, scale: 0.5 }, { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)', immediateRender: false }, X.file[1]);
    // destinations
    out(tl, ['#fl', '#xb', '#fc'], S.from, { y: -30 });
    $$('#ds .d').forEach((el, i) => { inn(tl, el, { y: 40, scale: 0.8 }, S.items[i][2], 0.3, 'back.out(2)'); tl.set(el, { className: 'd on' }, S.items[i][2] + 0.15); });
    // 1 click vs evening
    out(tl, '#ds .d', C.from, { y: -30 });
    inn(tl, '#cp .a', { scale: 0.5 }, C.from + 0.05, 0.35, 'back.out(2)');
    inn(tl, '#cp .vs', { scale: 0.3 }, C.from + 0.3, 0.2, 'back.out(2)');
    inn(tl, '#cp .b', { x: 60 }, C.bAt - 0.4, 0.3, 'power3.out');
    tl.to('#cp .b i', { scaleX: 1, duration: 0.3 }, C.bAt + 0.2);
    // question
    out(tl, ['#cp .a', '#cp .vs', '#cp .b'], Q.from, { y: 40 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    $$('#qq .o span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, Q.from + 0.4 + i * 0.15, 0.28, 'back.out(2.4)'));
    subs(tl, { opacity: 0, y: 12 });
    window.PHR.forEach((c, k) => { const el = $$('.sub')[k], a = W[c.words[0]][1], b = W[c.words[c.words.length - 1]][2];
      tl.fromTo(el, { backgroundSize: '0% 8px' }, { backgroundSize: '100% 8px', duration: Math.max(0.3, b - a), ease: 'none', immediateRender: false }, a); });
  });
})();
