// Kaja episode, layout 23 (episodes/sNN.json with "layout": "story23"): see story23.css.
(() => {
  const { EP, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const P = D.post, B = D.board, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="pc" class="card"><div class="im">${ic('t-shirt')}</div><div><b>${P.title}</b><small>${P.sub}</small></div><span class="sel">${ic('check-circle')}${P.sel[0]}</span></div>` +
      `<div id="bd">${B.cols.map((c, i) => `<div class="col ${i === B.cols.length - 1 ? 'am' : ''}"><div class="h">${c}</div></div>`).join('')}</div>` +
      B.notes.map((n, i) => `<div class="nt n${i}"><small>${n[0]}</small>${n[1]}</div>`).join('') +
      `<div id="cur">${ic('hand-grabbing')}</div>` +
      `<div id="sh">${B.done.map(d => `<span>${ic(d[1])}${d[0]}</span>`).join('')}</div>` +
      `<div id="qq" class="card"><div class="h">${Q.q}</div><div class="o">${Q.opts.map(o => `<span>${ic(o[1])}${o[0]}</span>`).join('')}</div></div>`;
    subsLayout('caps');
  }, tl => {
    const P = D.post, B = D.board, Q = D.ask;
    const notes = $$('.nt'), colX = c => 12 + c * 317, scatter = [[120, 160], [400, 180], [660, 150], [250, 300], [560, 320]];
    gsap.set(['#pc', '#pc .sel', '#bd', '#cur', '#sh span', '#qq', '#qq .o span'], { opacity: 0 });
    notes.forEach((el, i) => gsap.set(el, { opacity: 0, x: scatter[i][0], y: scatter[i][1], rotation: [-6, 4, -3, 7, -5][i] }));
    // the post and its comments as sticky notes
    inn(tl, '#pc', { y: 40, scale: 0.94 }, P.from, 0.4, 'back.out(1.4)');
    notes.forEach((el, i) => tl.fromTo(el, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2.2)', immediateRender: false }, B.pop[i]));
    // the board with buyer columns; the cursor drags one note slowly
    inn(tl, '#bd', { y: 40 }, B.from, 0.35, 'power3.out');
    tl.to(notes, { y: '+=0', duration: 0.01 }, B.from);
    gsap.set('#cur', { x: scatter[0][0] + 150, y: scatter[0][1] + 40 });
    tl.to('#cur', { opacity: 1, duration: 0.2 }, B.drag - 0.3);
    tl.to(['.n0', '#cur'], { x: (i) => i ? colX(0) + 160 : colX(0) + 4, y: (i) => i ? 240 : 205, rotation: 0, duration: 1.4, ease: 'power1.inOut' }, B.drag);
    tl.to('#cur', { opacity: 0, duration: 0.2 }, B.drag + 1.6);
    // Noxio: pick the post, all notes fly into columns
    inn(tl, '#pc .sel', { scale: 0.4 }, P.sel[1], 0.3, 'back.out(2.4)');
    B.target.forEach((c, i) => tl.to(`.n${i}`, { x: colX(c) + 4, y: 205 + B.slot[i] * 66, rotation: 0, scale: 0.98, duration: 0.45, ease: 'back.out(1.3)' }, B.fly + i * 0.08));
    flash(tl, B.fly + 0.2, 0.15);
    tl.fromTo(`.n${B.target.length - 1}`, { backgroundColor: '#FEF08A' }, { backgroundColor: '#FDE68A', duration: 0.2, immediateRender: false }, B.unclear);
    tl.fromTo('.col.am', { scale: 1 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, B.unclear);
    out(tl, '#pc', B.done[0][2] - 0.25, { y: -20 });
    $$('#sh span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, B.done[i][2], 0.3, 'back.out(2.4)'));
    // question
    out(tl, ['#bd', '.nt', '#sh span'], Q.from, { y: -30 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    $$('#qq .o span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, Q.from + 0.4 + i * 0.2, 0.3, 'back.out(2.4)'));
    subs(tl, { opacity: 0, y: 14, scale: 0.92 });
  });
})();
