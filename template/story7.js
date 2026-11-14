// Kaja episode, layout 7 (episodes/sNN.json with "layout": "story7"): see story7.css.
(() => {
  const { EP, $, $$, ic, subsLayout, subs, inn, out, flash, boot } = SB;
  const D = EP.data;
  boot(() => {
    const N = D.nb, T = D.table, F = D.file, O = D.opts, X = D.no, S = D.tease;
    $('#ui').innerHTML =
      `<div id="nb" class="pane nb"><div class="h rd">${N.title}</div>${N.rows.map(r => `<div class="r rd">${r[0]}</div>`).join('')}<div class="clk rd">${ic('clock')}${N.clock[0]}</div></div>` +
      `<div id="big" class="rd">${ic('file-xls')}${D.big[0]}</div><div id="cur">${ic('cursor-click')}</div>` +
      `<div id="tb" class="pane card tb"><div class="th0 rd"><img src="../assets/logo.png" alt="">${T.title}<span class="ex">${ic('file-xls')}${T.btn}</span></div>` +
      `<div class="g hd rd">${T.cols.map(c => `<div>${c}</div>`).join('')}</div>` +
      T.rows.map(r => `<div class="g rw rd"><div>${r[0]}</div><div>${r[1]}</div><div><span class="sz">${r[2]}</span></div><div>${r[3]}</div></div>`).join('') + `</div>` +
      `<div id="file" class="file rd"><div class="ic">${ic('file-xls')}</div><div>${F.name}<small>${F.note}</small></div></div>` +
      `<div id="file2" class="file rd"><div class="ic">${ic('file-xls')}</div><div>${F.name}<small>${F.note}</small></div></div>` +
      `<div class="tile a card rd">${ic('printer')}${O.a[0]}</div><div class="tile b card rd">${ic('paper-plane-tilt')}${O.b[0]}</div>` +
      `<div class="no a rd">${ic('x-circle')}${X.a[0]}</div><div class="no b rd">${ic('x-circle')}${X.b[0]}</div>` +
      `<div id="ts" class="card"><span class="pill rd">${ic('calendar-blank')}${S.kicker}</span><div class="tt rd">${S.title}</div></div>`;
    subsLayout('glow');
  }, tl => {
    const N = D.nb, T = D.table, F = D.file, O = D.opts, X = D.no, S = D.tease;
    gsap.set(['#nb', '#nb .r', '#nb .clk', '#big', '#cur', '#tb', '#tb .rw', '#file', '#file2', '.tile', '.no', '#ts'], { opacity: 0 });
    // the notebook
    inn(tl, '#nb', { y: 60, rotation: -3 }, N.from, 0.4);
    $$('#nb .r').forEach((el, i) => tl.fromTo(el, { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'none', immediateRender: false }, N.rows[i][1]));
    inn(tl, '#nb .clk', { scale: 0.4 }, N.clock[1], 0.3, 'back.out(2.4)');
    tl.fromTo('#nb .clk .ph', { rotation: 0 }, { rotation: 360, duration: 1.2, ease: 'none', immediateRender: false }, N.clock[1] + 0.3);
    // "or one click"
    tl.to('#nb', { opacity: 0.35, scale: 0.96, duration: 0.3 }, D.big[1]);
    inn(tl, '#big', { scale: 0.5 }, D.big[1], 0.4, 'back.out(2)');
    tl.fromTo('#cur', { opacity: 0, x: 160, y: 120 }, { opacity: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, D.big[1] + 0.2);
    tl.to('#big', { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 }, D.big[2]).to('#cur', { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, D.big[2]);
    flash(tl, D.big[2] + 0.08, 0.3);
    out(tl, ['#nb', '#big', '#cur'], T.from, { y: 0, scale: 0.9 });
    // the list in Noxio
    inn(tl, '#tb', { y: 70 }, T.from, 0.45, 'power3.out');
    $$('#tb .rw').forEach((el, i) => inn(tl, el, { x: -40 }, T.from + 0.25 + i * 0.12, 0.3, 'power3.out'));
    $$('#tb .hd div').forEach((el, i) => tl.to(el, { backgroundColor: '#11B981', color: '#fff', duration: 0.15 }, T.colsAt[i]).to(el, { backgroundColor: 'rgba(17,185,129,0)', color: '#6B7280', duration: 0.3 }, T.colsAt[i] + 0.5));
    tl.fromTo('#tb .ex', { scale: 1 }, { scale: 1.14, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, T.click - 0.45);
    tl.to('#tb .ex', { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, T.click);
    flash(tl, T.click + 0.08, 0.22);
    tl.to('#tb', { opacity: 0.4, duration: 0.3 }, F.at);
    inn(tl, '#file', { y: -160, scale: 0.7 }, F.at, 0.45, 'bounce.out');
    out(tl, ['#tb', '#file'], O.from, { y: 0, scale: 0.9 });
    // what you do with the file
    inn(tl, '#file2', { y: 40 }, O.from, 0.35);
    inn(tl, '.tile.a', { y: 60, scale: 0.9 }, O.a[1], 0.35); inn(tl, '.tile.b', { y: 60, scale: 0.9 }, O.b[1], 0.35);
    out(tl, ['#file2', '.tile'], X.from, { y: 40 });
    inn(tl, '.no.a', { x: -80 }, X.a[1], 0.35); inn(tl, '.no.b', { x: -80 }, X.b[1], 0.35);
    out(tl, '.no', S.from, { y: 40 });
    inn(tl, '#ts', { y: 70 }, S.from, 0.45, 'power3.out');
    subs(tl, { opacity: 0, y: 24, scale: 0.8 });
  });
})();
