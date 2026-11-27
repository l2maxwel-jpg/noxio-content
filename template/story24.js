// Kaja episode, layout 24 (episodes/sNN.json with "layout": "story24"): see story24.css.
(() => {
  const { EP, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const T = D.tag, R = D.road, L = D.list, N = D.notes, O = D.outc, Q = D.ask;
    $('#ui').innerHTML =
      `<div id="tg"><div class="str"><svg viewBox="0 0 300 250"><path d="M20 10 C 80 30, 120 40, 182 62" fill="none" stroke="#C9A24B" stroke-width="5" stroke-linecap="round"/></svg><div class="card2"><b></b><span></span></div></div>` +
      `<div class="ch">${T.chat.map(c => `<div class="m"><small>${c[0]}</small>${c[1]}</div>`).join('')}</div></div>` +
      `<div id="rd" class="card"><div class="ln"></div>${R.nodes.map((n, i) => `<div class="nd nd${i}" style="left:${70 + i * 266}px"><i></i><span>${n[0]}</span></div>`).join('')}<div class="dot"></div></div>` +
      `<div id="ls" class="card"><div class="t">${ic('list-checks')}${L.title}<span class="pill">Noxio</span></div>` +
      L.rows.map(r => `<div class="r"><b>${r[0]}</b>${r[1].map(x => `<span>${x}</span>`).join('')}</div>`).join('') + `</div>` +
      `<div id="bk">${L.nc[0]}</div>` +
      `<div id="nf">${N.to.map(n => `<div class="n"><span class="ic">${ic('chat-circle-dots')}</span><div>${N.title}<small>${n}</small></div><em>${N.sent}</em></div>`).join('')}<div class="pg">${ic('check-circle')}${N.page[0]}</div></div>` +
      `<div id="oc">${O.items.map((o, i) => `<span class="${i ? '' : 'a'}">${ic(o[1])}${o[0]}</span>`).join('')}</div>` +
      `<div id="qq" class="card"><div class="h">${ic('chat-teardrop-dots')}${Q.q}</div></div>`;
    subsLayout('ribbon');
  }, tl => {
    const T = D.tag, R = D.road, L = D.list, N = D.notes, O = D.outc, Q = D.ask;
    gsap.set(['#tg', '#tg .m', '#rd', '#ls', '#ls .r', '#bk', '#nf .n', '#nf .pg', '#oc span', '#qq'], { opacity: 0 });
    // chat + the paper tag being written
    inn(tl, '#tg', { y: 40 }, T.from, 0.35, 'power3.out');
    $$('#tg .m').forEach((el, i) => inn(tl, el, { x: 40 }, T.chatAt + i * 0.4, 0.28, 'back.out(1.6)'));
    tl.fromTo('#tg .card2', { rotation: -30, y: -40 }, { rotation: -7, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', immediateRender: false }, T.cardAt);
    tl.call(() => { $('#tg .card2 b').textContent = ''; $('#tg .card2 span').textContent = ''; }, null, T.from - 0.01);
    [...T.code].forEach((ch, i) => tl.call(() => { $('#tg .card2 b').textContent = T.code.slice(0, i + 1); }, null, T.codeAt + i * 0.1));
    [...T.name].forEach((ch, i) => tl.call(() => { $('#tg .card2 span').textContent = T.name.slice(0, i + 1); }, null, T.nameAt + i * 0.08));
    // the manual road, a slow dot
    inn(tl, '#rd', { y: 30 }, R.from, 0.35, 'power3.out');
    R.nodes.forEach((n, i) => { tl.set(`.nd${i}`, { className: `nd nd${i} on` }, n[1]); tl.to('#rd .dot', { x: i * 266, duration: 0.7, ease: 'power1.inOut' }, n[1] - 0.6); });
    // Noxio: the list
    out(tl, ['#tg', '#rd'], L.from, { y: -30 });
    inn(tl, '#ls', { y: 60, scale: 0.94 }, L.from, 0.4, 'back.out(1.4)');
    $$('#ls .r').forEach((el, i) => inn(tl, el, { x: -50 }, L.rowsAt + i * 0.18, 0.3, 'back.out(1.6)'));
    tl.fromTo('#bk', { opacity: 0, scale: 2, rotation: -20 }, { opacity: 1, scale: 1, rotation: -5, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, L.nc[1]);
    // Messenger notifications to all
    out(tl, ['#ls', '#bk'], N.from, { y: -30 });
    $$('#nf .n').forEach((el, i) => tl.fromTo(el, { opacity: 0, y: -50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false }, N.all + i * 0.1));
    flash(tl, N.all + 0.05, 0.15);
    inn(tl, '#nf .pg', { x: -20 }, N.page[1], 0.25, 'power3.out');
    // outcomes
    out(tl, ['#nf .n', '#nf .pg'], O.from, { y: -30 });
    $$('#oc span').forEach((el, i) => inn(tl, el, { y: 40, scale: 0.8 }, O.items[i][2], 0.32, 'back.out(1.8)'));
    // question
    out(tl, '#oc span', Q.from, { y: 40 });
    inn(tl, '#qq', { y: 60 }, Q.from, 0.4, 'back.out(1.4)');
    subs(tl, { opacity: 0, x: -40 });
  });
})();
