// Kaja episode, layout 22 (episodes/sNN.json with "layout": "story22"): see story22.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  const cols = ['#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#0EA5E9'];
  boot(() => {
    const H = D.hook, M = D.manual, Wh = D.wh, C = D.cm, K = D.chips, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="hk" class="card"><div class="ic">${ic('dress')}</div><div><b>${H.item}<span class="n">${H.left}</span></b>` +
      `<div class="av2">${H.who.map((n, i) => av(n, cols[i])).join('')}</div></div></div>` +
      `<div id="mn"><div class="th">${M.think[0]}</div><div class="rs"><b>${M.rs[0]}</b>${M.rs[1]}</div></div>` +
      `<div id="wh" class="card"><div class="t">${ic('warehouse')}${Wh.title}<span class="pill">Noxio</span></div>` +
      Wh.rows.map((r, i) => `<div class="r r${i}">${r[0]}<span class="av3 ${r[1] ? '' : 'no'}">${r[1] ? Wh.yes : Wh.no}</span><span class="q">${r[1]}</span><span class="mn1">−1</span></div>`).join('') + `</div>` +
      `<div id="cs">${C.rows.map((c, i) => `<div class="c c${i}">${av(c[0], cols[i])}${c[0]}: ${c[1]}<span class="bg ${c[2] ? 'rz' : ''}">${c[2] ? C.rz : C.ok}</span><div class="bt b${i}">${ic('robot')}${c[2] ? C.botRz : C.botOk}</div></div>`).join('')}</div>` +
      `<div id="tk">${K.items.map(k => `<span>${ic('check-circle')}${k[0]}</span>`).join('')}</div>` +
      `<div id="qq" class="card"><div class="h">${Q.q}</div><div class="o">${Q.opts.map(o => `<span>${o}</span>`).join('')}</div></div>`;
    subsLayout('bullet');
  }, tl => {
    const H = D.hook, M = D.manual, Wh = D.wh, C = D.cm, K = D.chips, Q = D.ask;
    gsap.set(['#hk', '#hk .av', '#mn .th', '#mn .rs', '#wh', '#wh .av3', '#wh .mn1', '#cs .c', '#cs .bg', '#cs .bt', '#tk span', '#qq', '#qq .o span'], { opacity: 0 });
    // stock 3, more buyers
    inn(tl, '#hk', { y: 40, scale: 0.94 }, H.from, 0.4, 'back.out(1.4)');
    $$('#hk .av').forEach((el, i) => inn(tl, el, { scale: 0.3 }, H.whoAt + i * 0.12, 0.25, 'back.out(2.4)'));
    // counting in the head, a paper reserve list
    inn(tl, '#mn .th', { scale: 0.6 }, M.think[1], 0.3, 'back.out(2)');
    M.count.forEach((c, i) => tl.call(() => { $('#mn .th').textContent = c; }, null, M.think[1] + 0.25 + i * 0.4));
    tl.call(() => { $('#mn .th').textContent = M.think[0]; }, null, M.think[1] - 0.01);
    inn(tl, '#mn .rs', { x: 40, rotation: 4 }, M.rsAt, 0.3, 'back.out(1.6)');
    tl.fromTo('#mn .rs', { rotation: 0 }, { rotation: 3, duration: 0.12, yoyo: true, repeat: 5, immediateRender: false }, M.reread);
    // Noxio warehouse
    out(tl, ['#hk', '#mn .th', '#mn .rs'], Wh.from, { y: -30 });
    inn(tl, '#wh', { y: 50, scale: 0.94 }, Wh.from, 0.4, 'back.out(1.4)');
    $$('#wh .av3').forEach((el, i) => inn(tl, el, { scale: 0.3 }, Wh.avAt + i * 0.12, 0.25, 'back.out(2.4)'));
    // comments: deduct, reserve
    tl.to('#wh', { scale: 0.86, y: -16, transformOrigin: '50% 0%', duration: 0.3 }, C.rows[0][3] - 0.2);
    C.rows.forEach((c, i) => {
      inn(tl, `.c${i}`, { x: -40 }, c[3], 0.3, 'back.out(1.6)');
      inn(tl, `.c${i} .bg`, { scale: 0.3 }, c[4], 0.28, 'back.out(2.4)');
    });
    tl.call(() => { $('.r0 .q').textContent = Wh.rows[0][1]; }, null, C.minus - 0.01);
    tl.call(() => { $('.r0 .q').textContent = Wh.rows[0][1] - 1; }, null, C.minus);
    tl.fromTo('.r0 .mn1', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.8, immediateRender: false }, C.minus);
    tl.fromTo('.r0 .q', { scale: 1.4, color: '#DC2626' }, { scale: 1, color: '#0B1F1A', duration: 0.4, immediateRender: false }, C.minus);
    // bot replies
    C.rows.forEach((c, i) => inn(tl, `.b${i}`, { y: -10, scale: 0.8 }, c[2] ? C.botRzAt + (i - 1) * 0.2 : C.botOkAt, 0.28, 'back.out(2)'));
    // chips
    out(tl, ['#wh', '#cs .c'], K.from, { y: -30 });
    $$('#tk span').forEach((el, i) => inn(tl, el, { y: 40, scale: 0.8 }, K.items[i][1], 0.3, 'back.out(2)'));
    // question
    out(tl, '#tk span', Q.from, { y: 40 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    $$('#qq .o span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, Q.from + 0.4 + i * 0.15, 0.28, 'back.out(2.4)'));
    subs(tl, { opacity: 0, y: 12 });
  });
})();
