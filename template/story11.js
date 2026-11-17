// Kaja episode, layout 11 (episodes/sNN.json with "layout": "story11"): see story11.css.
(() => {
  const { EP, $, $$, ic, emo, av, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data, P = D.pip, W = SB.W;
  const sav = `<div class="av" style="background:#0B1F1A">${ic('storefront')}</div>`;
  const body = (s, k) => {
    if (s.kind === 'link') return `<div class="fld rd" style="top:0">${ic('link-simple')}<span class="v"></span><i class="car"></i></div><div class="or rd">${s.or}</div>` +
      s.lives.map((l, i) => `<div class="lvr rd" style="top:${176 + i * 104}px">${ic('video-camera')}${l}<span class="ok">${ic('check-circle')}</span></div>`).join('');
    if (s.kind === 'skip') return `<div class="tgl" style="top:0"><div class="tx rd">${s.opt}</div><div class="sw"><i></i></div></div>` +
      `<div class="cmr rd" style="top:180px">${sav}<div class="bd"><div class="cn">${s.shop}</div><div class="ct">${emo(s.own)}</div></div><span class="tg g">${s.tag}</span></div>`;
    if (s.kind === 'read') return s.comments.map((c, i) => `<div class="cmr c rd" style="top:${i * 116}px">${av(c[0])}<div class="bd"><div class="cn">${c[0]}</div><div class="ct">${emo(c[1])}</div></div><span class="tg">${c[2]}</span></div>`).join('') +
      s.orders.map((o, i) => `<div class="ord" style="top:${i * 196}px"><div class="oh rd">${av(o[0])}${o[0]}<span class="pill">${o[2]}</span></div><div class="oi">${o[1].map(t => `<span class="rd">${t}</span>`).join('')}</div></div>`).join('');
    if (s.kind === 'fix') return `<div class="cmr rd" style="top:0">${av(s.c[0])}<div class="bd"><div class="cn">${s.c[0]}</div><div class="ct">${emo(s.c[1])}</div></div><span class="tg">${s.tag}</span></div>` +
      `<div class="fld rd" style="top:140px">${ic('pencil-simple')}<span class="v"></span><i class="car"></i></div>` +
      `<div class="note rd" style="top:272px;background:#ECFDF5;color:#047857">${ic('check-circle')}${s.done}</div>`;
    if (s.kind === 'excel') return `<div class="big rd" style="top:20px">${ic('file-xls')}${s.btn}</div>` +
      `<div class="fil rd" style="top:210px"><div class="ic">${ic('file-xls')}</div><div>${s.file}<small>${s.note}</small></div></div>`;
    if (s.kind === 'msg') return `<div class="msg rd" style="top:0"><b>${s.from_}</b>${emo(s.text)}</div><div class="note rd" style="top:${s.noteTop || 250}px">${ic('plugs-connected')}${s.note}</div>`;
    return '';
  };
  boot(() => {
    const I = D.intro, O = D.outro;
    $('#panel').innerHTML = D.steps.map((s, k) => `<div class="stp" data-k="${k}" style="position:absolute;inset:0;padding:30px 36px">` +
      `<div class="ph0"><div class="st rd">${s.chip}</div><div class="pr">${[1, 2, 3, 4, 5].map(n => `<i style="background:${s.n && n <= s.n ? '#11B981' : '#E5E9E8'}"></i>`).join('')}</div></div>` +
      `<div class="ptl rd">${s.title}</div><div class="body">${body(s, k)}</div></div>`).join('');
    $('#ui').innerHTML =
      `<div class="s11 a rd" style="top:0"><span class="dot"></span>${I.live[0]}</div><div class="s11 b rd" style="top:0;left:420px">${ic('chats-circle')}${I.many[0]}</div>` +
      `<div id="ti" class="card"><div class="tt rd">${I.title[0]}</div><span class="pill rd">${I.pill}</span></div>` +
      `<div id="sv" class="card"><div class="ic">${ic('bookmark-simple')}</div><div><div class="tt rd">${O.title}</div><div class="sb rd"><img src="../assets/logo.png" alt="">${O.sub}</div></div></div>`;
    subsLayout('chips');
    window.PHR.forEach((c, k) => { const a = W[c.words[0]][1]; if (a >= P.from - 0.1 && a < P.to) $$('.sub')[k].classList.add('pip'); });
  }, tl => {
    const I = D.intro, O = D.outro, wrap = $('#kwrap'), cl = { r: 2400, x: 540, y: 960 };
    const clip = () => { wrap.style.clipPath = `circle(${cl.r}px at ${cl.x}px ${cl.y}px)`; };
    clip();
    gsap.set(['.s11', '#ti', '#sv', '#panel', '.stp', '.stp .body>*', '#kring'], { opacity: 0 });
    gsap.set('.fld .car', { opacity: 0 });
    // Kaja walks in from the side, then the studio cards
    tl.fromTo('#kwrap', { x: 760 }, { x: 0, duration: 0.7, ease: 'power3.out', immediateRender: false }, 0);
    gsap.set('#kwrap', { x: 760 });
    inn(tl, '.s11.a', { y: 40, scale: 0.9 }, I.live[1], 0.3); inn(tl, '.s11.b', { y: 40, scale: 0.9 }, I.many[1], 0.3);
    out(tl, '.s11', I.title[1], { y: 30 });
    inn(tl, '#ti', { y: 60 }, I.title[1], 0.45, 'power3.out');
    out(tl, '#ti', P.from, { y: 40 });
    // into the circle and back
    tl.to(cl, { r: 190, x: 230, y: 1258, duration: 0.55, ease: 'power3.inOut', onUpdate: clip }, P.from);
    tl.to('#kdisc', { opacity: 1, duration: 0.3 }, P.from + 0.2).to('#kring', { opacity: 1, duration: 0.2 }, P.from + 0.4);
    tl.to('#kring', { opacity: 0, duration: 0.12 }, P.to).to('#kdisc', { opacity: 0, duration: 0.3 }, P.to);
    tl.to(cl, { r: 2400, x: 540, y: 960, duration: 0.55, ease: 'power3.inOut', onUpdate: clip }, P.to);
    inn(tl, '#panel', { y: 80 }, P.from + 0.1, 0.5, 'power3.out');
    out(tl, '#panel', P.to + 0.25, { y: 60 });
    const type = (el, text, t0, t1) => {
      const v = $('.v', el), car = $('.car', el), p = { n: 0 };
      tl.set(car, { opacity: 1 }, t0).set(el, { borderColor: '#0098B7' }, t0);
      tl.to(p, { n: text.length, duration: t1 - t0, ease: 'none', onUpdate: () => { v.textContent = text.slice(0, Math.round(p.n)); } }, t0);
      tl.set(car, { opacity: 0 }, t1 + 0.2).set(el, { borderColor: '#11B981' }, t1 + 0.2);
    };
    D.steps.forEach((s, k) => {
      const el = $(`.stp[data-k="${k}"]`), q = sel => $$(sel, el), B = q('.body>*');
      tl.set(el, { opacity: 1 }, s.from);
      tl.fromTo(q('.ph0, .ptl'), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', stagger: 0.06, immediateRender: false }, s.from);
      if (k < D.steps.length - 1) tl.to(el, { opacity: 0, x: -60, duration: 0.2, ease: 'power2.in' }, s.until - 0.2);
      tl.fromTo(q('.st'), { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', immediateRender: false }, s.from + 0.05);
      const T = s.t;
      if (s.kind === 'link') {
        inn(tl, B[0], { y: 30 }, T[0], 0.3, 'power3.out'); type(B[0], s.url, T[0] + 0.2, T[0] + 1.0);
        inn(tl, B[1], { scale: 0.6 }, T[1], 0.25);
        inn(tl, B[2], { x: -40 }, T[1] + 0.15, 0.3, 'power3.out'); inn(tl, B[3], { x: -40 }, T[1] + 0.3, 0.3, 'power3.out');
        tl.to(B[2], { borderColor: '#11B981', backgroundColor: '#F0FDF7', duration: 0.15 }, T[2]).to($('.ok', B[2]), { opacity: 1, duration: 0.1 }, T[2]);
      } else if (s.kind === 'skip') {
        inn(tl, B[0], { y: 30 }, T[0], 0.3, 'power3.out');
        tl.to($('.sw', B[0]), { backgroundColor: '#11B981', duration: 0.2 }, T[1]).to($('.sw i', B[0]), { x: 62, duration: 0.25, ease: 'back.out(2)' }, T[1]);
        flash(tl, T[1], 0.18);
        inn(tl, B[1], { y: 30 }, T[2], 0.3, 'power3.out');
        tl.to($('.bd', B[1]), { opacity: 0.4, duration: 0.3 }, T[2] + 0.3);
        tl.fromTo($('.tg', B[1]), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)', immediateRender: false }, T[2] + 0.3);
      } else if (s.kind === 'read') {
        const cs = q('.cmr.c'), os = q('.ord');
        cs.forEach((c, i) => {
          inn(tl, c, { x: -50 }, T[0] + i * 0.25, 0.3, 'back.out(1.5)');
          tl.fromTo($('.tg', c), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2.4)', immediateRender: false }, s.comments[i][3]);
          tl.to(c, { x: 40, opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in' }, T[1] - 0.3 + i * 0.04);
        });
        os.forEach((o, i) => {
          inn(tl, o, { y: 50, scale: 0.92 }, T[1] + i * 0.3, 0.38);
          $$('.oi span', o).forEach((sp, j) => tl.fromTo(sp, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2.2)', immediateRender: false }, T[1] + 0.3 + i * 0.3 + j * 0.15));
        });
      } else if (s.kind === 'fix') {
        inn(tl, B[0], { x: -50 }, T[0], 0.3, 'back.out(1.5)');
        tl.to(B[0], { borderColor: '#F59E0B', backgroundColor: '#FFFBEB', duration: 0.2 }, T[0] + 0.3);
        tl.fromTo($('.tg', B[0]), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)', immediateRender: false }, T[0] + 0.3);
        inn(tl, B[1], { y: 30 }, T[1], 0.3, 'power3.out'); type(B[1], s.fixed, T[2], T[2] + 0.8);
        inn(tl, B[2], { scale: 0.5 }, T[3], 0.3, 'back.out(2.2)');
      } else if (s.kind === 'excel') {
        inn(tl, B[0], { scale: 0.5 }, T[0], 0.35, 'back.out(2)');
        tl.to(B[0], { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, T[1]); flash(tl, T[1] + 0.08, 0.25);
        inn(tl, B[1], { y: -120, scale: 0.7 }, T[2], 0.45, 'bounce.out');
      } else if (s.kind === 'msg') {
        inn(tl, B[0], { x: -60, scale: 0.9 }, T[0], 0.35); inn(tl, B[1], { y: 30 }, T[1], 0.3, 'power3.out');
      }
    });
    // ending in the studio
    inn(tl, '#sv', { y: 70 }, O.from, 0.45, 'power3.out');
    tl.fromTo('#sv .ic', { scale: 1 }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, O.from + 0.5);
    subs(tl, { opacity: 0, y: 16, scale: 0.9 });
  });
})();
