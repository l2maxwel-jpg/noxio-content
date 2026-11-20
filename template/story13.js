// Kaja episode, layout 13 (episodes/sNN.json with "layout": "story13"): see story13.css.
(() => {
  const { EP, $, $$, ic, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const C = D.cmt, O = D.ord, M = D.chat, S = D.send, R = D.rule, B = D.ben, T = D.tease;
    $('#ui').innerHTML =
      `<div id="cmt" class="cm">${av(C.name, '#EC4899')}<div class="bd"><div class="cn">${C.name} · ${C.when}</div><div class="ct">${C.text}</div></div></div>` +
      `<div id="wt">${ic('clock')}${C.wait[0]}<span class="dots"><b></b><b></b><b></b></span></div>` +
      `<div id="ord" class="card"><div class="t">${ic('list-checks')}${O.title}<span class="pill">Noxio</span></div>` +
      `<div class="r">${av(C.name, '#EC4899')}<b>${C.name}</b><div class="it">${O.items.map(x => `<span>${x}</span>`).join('')}</div></div></div>` +
      `<div id="pg">${ic('check-circle')}${O.page[0]}</div>` +
      `<div id="chat" class="card"><div class="hd">${ic('chat-circle-dots')}${M.title}<small>${M.to}</small></div>` +
      `<div class="bd"><div class="bb">${M.text.replace(/\{(\d)\}/g, (m, k) => `<span class="c c${k}">${M.chips[k]}</span>`)}</div>` +
      `<div class="ok">${ic('checks')}${M.ok}</div></div></div>` +
      `<div id="snd" class="card"><div class="t">${ic('paper-plane-tilt')}${S.title}</div>` +
      `<div class="bs"><div class="b a">${ic('users-three')}${S.all}<em>${S.n}</em></div><div class="b o">${ic('user')}${S.one}</div></div>` +
      `<div class="pr"><i></i></div><div class="pc">0 / ${S.n}</div></div>` +
      `<div id="rl" class="card"><div class="t">${ic('warning-circle')}${R.title}</div><div class="row">` +
      `<div class="bx"><b>${R.a[0]}</b><span>${R.a[1]}</span></div><div class="bx"><b>${R.b[0]}</b><span>${R.b[1]}</span><div class="dots">${'<i></i>'.repeat(7)}</div></div></div></div>` +
      `<div id="wk">${R.week[0]}</div>` +
      `<div id="bn">${B.items.map(b => `<div class="c">${ic(b[2])}${b[0]}</div>`).join('')}</div>` +
      `<div id="ts" class="card"><span class="pill">${ic('calendar-blank')}${T.kicker}</span><div class="tt">${T.title}</div></div>`;
    subsLayout('ticket');
  }, tl => {
    const C = D.cmt, O = D.ord, M = D.chat, S = D.send, R = D.rule, B = D.ben, T = D.tease;
    gsap.set(['#cmt', '#wt', '#ord', '#ord .it span', '#pg', '#chat', '#chat .bb', '#chat .ok', '#snd', '#rl', '#rl .bx', '#wk', '#bn .c', '#ts'], { opacity: 0 });
    // hook: the comment and its wait
    inn(tl, '#cmt', { y: 60, scale: 0.9 }, C.from, 0.35);
    inn(tl, '#wt', { scale: 0.5 }, C.wait[1], 0.3, 'back.out(2.2)');
    tl.to('#wt .dots b', { y: -8, duration: 0.18, yoyo: true, repeat: 7, stagger: 0.09, ease: 'sine.inOut' }, C.wait[1] + 0.3);
    // the comment becomes an order row
    out(tl, ['#cmt', '#wt'], O.from, { y: -30, scale: 0.9 });
    inn(tl, '#ord', { y: 40, scale: 0.9 }, O.from, 0.4, 'back.out(1.5)');
    $$('#ord .it span').forEach((el, i) => inn(tl, el, { scale: 0.4 }, O.itemsAt + i * 0.16, 0.28, 'back.out(2.4)'));
    inn(tl, '#pg', { x: 60 }, O.page[1], 0.3, 'back.out(1.8)');
    // Messenger card
    out(tl, ['#ord', '#pg'], M.from, { y: -30 });
    inn(tl, '#chat', { y: 70, scale: 0.92 }, M.from, 0.4, 'back.out(1.4)');
    inn(tl, '#chat .bb', { y: 30, scale: 0.8 }, M.bubble, 0.32, 'back.out(1.8)');
    inn(tl, '#chat .ok', { x: -20 }, M.bubble + 0.7, 0.25, 'power3.out');
    M.at.forEach((t, k) => tl.to(`#chat .c${k}`, { backgroundColor: '#11B981', color: '#fff', duration: 0.12 }, t).fromTo(`#chat .c${k}`, { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, t));
    // send panel
    out(tl, '#chat', S.from, { y: -30 });
    inn(tl, '#snd', { y: 70, scale: 0.92 }, S.from, 0.4, 'back.out(1.4)');
    tl.fromTo('#snd .b.a', { scale: 1 }, { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, S.allAt);
    tl.to('#snd .b.a', { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, S.click);
    flash(tl, S.click + 0.08, 0.2);
    tl.to('#snd .pr i', { scaleX: 1, duration: 1.0, ease: 'power1.inOut' }, S.click + 0.1);
    const pc = { v: 0 };
    tl.to(pc, { v: S.n, duration: 1.0, ease: 'power1.inOut', onUpdate: () => { $('#snd .pc').textContent = `${Math.round(pc.v)} / ${S.n} ${Math.round(pc.v) === S.n ? S.done : ''}`; } }, S.click + 0.1);
    tl.to('#snd .b.o', { borderColor: '#0098B7', backgroundColor: '#E0F5FA', duration: 0.15 }, S.oneAt);
    tl.fromTo('#snd .b.o', { scale: 1 }, { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, S.oneAt);
    // rule
    out(tl, '#snd', R.from, { y: -30 });
    inn(tl, '#rl', { y: 70, scale: 0.92 }, R.from, 0.4, 'back.out(1.4)');
    inn(tl, '#rl .bx:nth-child(1)', { scale: 0.5 }, R.a[2], 0.3, 'back.out(2.2)');
    inn(tl, '#rl .bx:nth-child(2)', { scale: 0.5 }, R.b[2], 0.3, 'back.out(2.2)');
    tl.to('#rl .dots i', { backgroundColor: '#F59E0B', duration: 0.08, stagger: 0.09 }, R.b[2] + 0.2);
    tl.fromTo('#wk', { scale: 0.4, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false, transformOrigin: '100% 100%' }, R.week[1]);
    flash(tl, R.week[1] + 0.2, 0.2);
    // benefits
    out(tl, ['#rl', '#wk'], B.from, { y: -30 });
    $$('#bn .c').forEach((el, i) => inn(tl, el, { x: -80, scale: 0.8 }, B.items[i][1], 0.35, 'back.out(1.8)'));
    // teaser
    out(tl, '#bn .c', T.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, T.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 16, scale: 0.9, rotation: -2 });
  });
})();
