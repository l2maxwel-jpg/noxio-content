// Kaja episode, layout 5 (episodes/sNN.json with "layout": "story5"): see story5.css.
(() => {
  const { EP, $, $$, ic, emo, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const sav = `<div class="av sell">${ic('storefront')}</div>`;
  const D = EP.data;
  boot(() => {
    const H = D.hook, S = D.set, R = D.res, T = D.tease;
    $('#ui').innerHTML =
      `<div id="hk">${H.items.map(c => `<div class="cm rd">${sav}<div class="bd"><div class="cn">${H.shop}<span class="pill s">${H.badge}</span></div><div class="ct">${emo(c[0])}</div></div></div>`).join('')}</div>` +
      `<div id="q" class="rd">${ic('question')}<span class="qq">${H.q[0]}</span></div>` +
      `<div id="set" class="card"><div class="st rd">${ic('sliders-horizontal')}${S.title}<span class="pill">${S.pill}</span></div>` +
      `<div class="sr a rd">${S.other}${ic('caret-right')}</div><div class="sr b"><div class="tx rd">${S.opt}</div><div class="tg"><i></i></div><div class="ring"></div></div></div>` +
      `<div id="res" class="card"><div class="rt rd">${ic('chats-circle')}${R.title}<span class="pill">${R.pill[0]}</span></div>` +
      R.rows.map(r => `<div class="rr rd">${r[0] ? sav : av(r[1])}<div class="bd"><div class="cn">${r[0] ? H.shop : r[1]}</div><div class="ct">${emo(r[2])}</div></div>` +
        `<div class="tag ${r[0] ? 'skip' : 'ord'}">${ic(r[0] ? 'eye-slash' : 'check-circle')}${r[0] ? R.skip : R.ord}</div></div>`).join('') + `</div>` +
      `<div id="ts" class="card"><span class="pill rd">${ic('calendar-blank')}${T.kicker}</span><div class="tt rd">${T.title}</div><div class="t2 rd">${ic('cursor-click')}${T.sub[0]}</div></div>`;
    $$('#hk .cm').forEach((el, i) => { el.style.top = (i * 124) + 'px'; });
    subsLayout('marker');
  }, tl => {
    const H = D.hook, S = D.set, R = D.res, T = D.tease;
    gsap.set(['#hk .cm', '#q', '#set', '#res', '#res .tag', '#res .rt .pill', '#ts', '#ts .tt', '#ts .t2'], { opacity: 0 });
    // hook
    $$('#hk .cm').forEach((el, i) => inn(tl, el, { y: 50, scale: 0.9 }, H.items[i][1], 0.3));
    inn(tl, '#q', { y: 40, scale: 0.85 }, H.q[1], 0.35, 'back.out(2)');
    tl.fromTo('#q .ph', { rotation: -14 }, { rotation: 14, duration: 0.22, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, H.q[1] + 0.3);
    tl.set('#q .qq', { textContent: H.a[0] }, H.a[1]).set('#q', { backgroundColor: '#11B981' }, H.a[1]).set('#q .ph', { color: '#fff', rotation: 0 }, H.a[1] + 0.01);
    tl.fromTo('#q', { scale: 1.18 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', immediateRender: false }, H.a[1]);
    flash(tl, H.a[1], 0.25);
    out(tl, '#hk .cm', H.until, { y: 40, stagger: 0.04 }); out(tl, '#q', H.until);
    // the switch, close up
    inn(tl, '#set', { y: 70 }, S.from, 0.45, 'power3.out');
    tl.to('#set', { scale: 1.06, duration: 0.5, ease: 'power2.inOut' }, S.zoom);
    tl.to('#set .sr.a, #set .st', { opacity: 0.35, duration: 0.3 }, S.zoom);
    tl.fromTo('#set .ring', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.8)', immediateRender: false }, S.zoom + 0.1);
    tl.to('#set .tg', { backgroundColor: '#11B981', duration: 0.2 }, S.on).to('#set .tg i', { x: 58, duration: 0.25, ease: 'back.out(2)' }, S.on);
    tl.fromTo('#set .ring', { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, S.on + 0.3);
    flash(tl, S.on, 0.2);
    out(tl, '#set', S.until);
    // what stays under the live and what gets on the list
    inn(tl, '#res', { y: 70 }, R.from, 0.45, 'power3.out');
    $$('#res .rr').forEach((el, i) => {
      const r = R.rows[i];
      inn(tl, $('.tag', el), { scale: 0.4 }, r[3], 0.3, 'back.out(2.4)');
      if (r[0]) tl.to($('.bd', el), { opacity: 0.45, duration: 0.3 }, r[3]);
      else tl.fromTo(el, { backgroundColor: 'rgba(17,185,129,0)' }, { backgroundColor: 'rgba(17,185,129,0.12)', duration: 0.25, immediateRender: false }, r[3]);
    });
    inn(tl, '#res .rt .pill', { scale: 0.4 }, R.pill[1], 0.3, 'back.out(2.4)');
    out(tl, '#res', R.until);
    // teaser
    inn(tl, '#ts', { y: 70 }, T.from, 0.45, 'power3.out');
    inn(tl, '#ts .tt', { x: -30 }, T.at, 0.35, 'power3.out');
    inn(tl, '#ts .t2', { x: -30 }, T.sub[1], 0.35, 'power3.out');
    tl.fromTo('#ts .t2 .ph', { scale: 1 }, { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, T.sub[1] + 0.35);
    subs(tl, { opacity: 0, scale: 0.85 });
  });
})();
