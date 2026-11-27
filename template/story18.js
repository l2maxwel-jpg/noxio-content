// Kaja episode, layout 18 (episodes/sNN.json with "layout": "story18"): see story18.css.
(() => {
  const { EP, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  const hanger = `<svg viewBox="0 0 170 150"><path d="M85 8 a14 14 0 1 1 14 14 v10 L162 120 a8 8 0 0 1 -5 14 H13 a8 8 0 0 1 -5 -14 L71 32" fill="none" stroke="#64748B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  boot(() => {
    const A = D.board, B = D.manual, L = D.list, M = D.msg, N = D.ben, O = D.offer;
    $('#ui').innerHTML =
      `<div id="bd" class="card"><div class="ch">${A.chat.map(c => `<div class="m"><small>${c[0]}</small>${c[1]}</div>`).join('')}</div>` +
      `<div class="rl"><div class="bar"></div>${A.tags.map((t, i) => `<div class="hg h${i}" style="left:${i * 190}px">${hanger}<div class="tg"><b></b><span></span></div></div>`).join('')}</div></div>` +
      `<div id="hd">${ic('hand')}${B.head[0]}</div>` +
      `<div id="q" class="card">${ic('envelope-simple')}${B.q}<span class="n"></span>${ic('package')}</div>` +
      `<div id="ls" class="card"><div class="t">${ic('list-checks')}${L.title}<span class="pill">Noxio</span></div>` +
      L.rows.map(r => `<div class="r"><b>${r[0]}</b><div class="it">${r[1].map(x => `<span>${x}</span>`).join('')}</div>${r[2] ? `<span class="nc">${L.nc[0]}</span>` : ''}</div>`).join('') + `</div>` +
      `<div id="ms" class="card"><div class="hd2">${ic('chat-circle-dots')}${M.title}</div><div class="bd2">` +
      `<div class="bt">${ic('paper-plane-tilt')}${M.btn[0]}</div>` +
      M.to.map((n, i) => `<div class="bb b${i}" style="top:${24 + i * 64}px">${ic('checks')}${n}</div>`).join('') +
      `<div class="pg">${ic('check-circle')}${M.page[0]}</div></div></div>` +
      `<div id="bn">${N.items.map(b => `<div class="c">${ic(b[2])}${b[0]}</div>`).join('')}</div>` +
      `<div id="of" class="card"><div class="h">${O.head}</div><div class="p">${O.sub}</div><div class="o">${O.opts.map(o => `<span>${o}</span>`).join('')}</div></div>`;
    subsLayout('glass');
  }, tl => {
    const A = D.board, B = D.manual, L = D.list, M = D.msg, N = D.ben, O = D.offer;
    gsap.set(['#bd', '#bd .m', '.hg', '#hd', '#q', '#ls', '#ls .r', '#ls .nc', '#ms', '#ms .bb', '#ms .pg', '#bn .c', '#of', '#of .o'], { opacity: 0 });
    // the board: chat + hangers with tags
    inn(tl, '#bd', { y: 50, scale: 0.94 }, A.from, 0.4, 'back.out(1.4)');
    $$('#bd .m').forEach((el, i) => inn(tl, el, { y: 30 }, A.chatAt + i * 0.35, 0.25, 'power3.out'));
    $$('.hg').forEach((el, i) => inn(tl, el, { y: -40, rotation: -8 }, A.hangAt + i * 0.25, 0.35, 'back.out(1.8)'));
    A.tags.forEach((t, i) => {
      tl.call(() => { $(`.h${i} .tg b`).textContent = ''; $(`.h${i} .tg span`).textContent = ''; }, null, A.from - 0.01);
      tl.call(() => { $(`.h${i} .tg b`).textContent = t[0]; }, null, A.code + i * 0.12);
      tl.call(() => { $(`.h${i} .tg span`).textContent = t[1]; }, null, A.name + i * 0.12);
    });
    // manual work: tags shuffle, slow message queue, parcel
    inn(tl, '#hd', { scale: 0.5 }, B.from, 0.3, 'back.out(2.2)');
    tl.to('.hg', { rotation: () => gsap.utils.random(-14, 14), x: () => gsap.utils.random(-40, 40), duration: 0.25, stagger: 0.06, yoyo: true, repeat: 3 }, B.shuffle);
    tl.to('#bd .ch', { opacity: 0.3, duration: 0.3 }, B.shuffle);
    inn(tl, '#q', { y: 30 }, B.qAt - 0.2, 0.3, 'power3.out');
    B.names.forEach((n, i) => tl.call(() => { $('#q .n').textContent = n; }, null, B.qAt + i * 0.6));
    tl.call(() => { $('#q .n').textContent = ''; }, null, B.qAt - 0.21);
    tl.fromTo('#q .pk', { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, B.ship);
    // Noxio list by buyer
    out(tl, ['#bd', '#hd', '#q'], L.from, { y: -30 });
    inn(tl, '#ls', { y: 60, scale: 0.94 }, L.from, 0.4, 'back.out(1.4)');
    $$('#ls .r').forEach((el, i) => inn(tl, el, { x: -50 }, L.rowsAt + i * 0.2, 0.3, 'back.out(1.6)'));
    inn(tl, '#ls .nc', { scale: 0.3 }, L.nc[1], 0.3, 'back.out(2.4)');
    // Messenger: send to all
    out(tl, '#ls', M.from, { y: -30 });
    inn(tl, '#ms', { y: 60, scale: 0.94 }, M.from, 0.4, 'back.out(1.4)');
    tl.to('#ms .bt', { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, M.btn[1]);
    flash(tl, M.btn[1] + 0.08, 0.15);
    $$('#ms .bb').forEach((el, i) => tl.fromTo(el, { opacity: 0, x: -380, scale: 0.6 }, { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)', immediateRender: false }, M.btn[1] + 0.15 + i * 0.12));
    inn(tl, '#ms .pg', { x: -20 }, M.page[1], 0.25, 'power3.out');
    // benefits
    out(tl, '#ms', N.from, { y: -30 });
    $$('#bn .c').forEach((el, i) => inn(tl, el, { x: -80, scale: 0.8 }, N.items[i][1], 0.32, 'back.out(1.8)'));
    // offer + question
    out(tl, '#bn .c', O.from, { y: 40 });
    inn(tl, '#of', { y: 70 }, O.from, 0.45, 'back.out(1.4)');
    inn(tl, '#of .o', { y: 20 }, O.q, 0.3, 'power3.out');
    subs(tl, { opacity: 0, y: 12, scale: 0.94 });
  });
})();
