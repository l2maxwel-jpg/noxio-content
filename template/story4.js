// Kaja episode, layout 4 (episodes/sNN.json with "layout": "story4"). Same contract as the other story layouts:
// window.EP, WORDS ([text, start, end, key, brk]), PH (Phosphor fill SVGs), KF (Kaja frames); exposes ready / seek / duration.
(() => {
  const EP = window.EP, W = window.WORDS, KF = window.KF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const E = 'power3.out';
  const ic = n => { const s = (window.PH || {})[n]; if (!s) throw new Error(`Phosphor icon ${n} not loaded`); return `<i class="ph">${s}</i>`; };
  const EMO = /(?:[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿\u{1F000}-\u{1FAFF}]️?[\u{1F3FB}-\u{1F3FF}]?)/gu;
  const emo = html => html.replace(EMO, m => `<img class="emo" src="../assets/emoji/${[...m].map(c => c.codePointAt(0).toString(16).toUpperCase()).join('-')}.svg" alt="">`);
  const PAL = ['#0098B7', '#F59E0B', '#11B981', '#64748B'];
  const col = (() => { const m = {}; let k = 0; return n => (m[n] = m[n] || PAL[k++ % PAL.length]); })();
  const av = n => `<div class="av" style="background:${col(n)}">${n[0]}</div>`;
  const [FX, FY] = EP.kaja.face, TOP = EP.ui.top;
  const FR = Object.assign({ wide: { s: 1, y: 0 }, mid: { s: 1.1, y: 0 }, close: { s: 1.2, y: 0 } }, EP.ui.frames || {});

  function layout() {
    const [x1, y1, x2, y2] = EP.kaja.head;
    Object.assign($('#khead').style, { left: x1 + 'px', top: y1 + 'px', width: (x2 - x1) + 'px', height: (y2 - y1) + 'px' });
    $('#kcam').style.transformOrigin = `${FX}px ${FY}px`;
    const H = EP.hook;
    $('#hook').style.top = (H.top || TOP) + 'px';
    $('#hook').innerHTML = H.items.map(c => `<div class="cm rd">${av(c[0])}<div class="bd"><div class="cn">${c[0]}</div><div class="ct">${emo(c[1])}</div></div><div class="lg">${c[2]}</div><i class="ok">${ic('check-circle')}</i></div>`).join('') +
      `<div class="stamp rd">${H.stamp[0]}</div>`;
    $$('#hook .cm').forEach((el, i) => { el.style.top = (i * 124) + 'px'; });
    $$('#hook .ok .ph').forEach(el => { el.style.cssText = 'width:58px;height:58px'; });
    const T = EP.tag;
    $('#tag').style.top = (TOP + 60) + 'px';
    $('#tag').innerHTML = `<img src="../assets/logo.png" alt=""><div class="rd"><b>${T.name}</b><span>${T.sub}</span></div>`;
    const B = EP.ba;
    $('#ba').style.top = TOP + 'px';
    $('#ba').innerHTML =
      `<div class="ly before"><div class="bt rd">${ic('chats-circle')}${B.before}<span class="pill">${B.beforePill}</span></div>` +
      B.rows.map(r => `<div class="br rd">${av(r[0])}<div class="bd"><div class="cn">${r[0]}</div><div class="ct">${emo(r[1])}</div></div><div class="lg">${r[2]}</div></div>`).join('') + `</div>` +
      `<div class="ly after"><div class="bt rd">${ic('list-checks')}${B.after}<span class="pill">${B.afterPill}</span></div>` +
      `<div class="th rd">${B.cols.map(c => `<div>${c}</div>`).join('')}</div>` +
      B.rows.map(r => `<div class="tr rd"><div>${r[0]}</div><div>${r[3]}</div><div class="sz">${r[4]}</div></div>`).join('') + `</div>` +
      `<div class="hd"><i>${ic('arrows-left-right')}</i></div>`;
    const L = EP.lang;
    $('#lang').style.top = (TOP + 40) + 'px';
    $('#lang').innerHTML = `<div class="lt rd">${ic('translate')}${L.title}</div><div class="sw"><div class="sel"></div>${L.opts.map(o => `<span class="rd">${o}</span>`).join('')}</div>`;
    const F = EP.follow;
    $('#follow').style.top = (TOP + 20) + 'px';
    $('#follow').innerHTML = `<div class="fr"><img src="../assets/logo.png" alt=""><div class="fn rd"><b>${F.name}</b><span>${F.sub}</span></div><div class="fb rd">${ic('plus-circle')}${F.btn}</div></div>` +
      `<div class="fx rd"><span class="k">${F.kicker}</span>${F.teaser}</div>`;
    // subtitles: phrases end at punctuation or when they would not fit in two lines
    const ph = []; let cur = null;
    W.forEach((w, i) => {
      const prev = W[i - 1];
      if (EP.subs ? EP.subs.includes(i) : (!cur || (prev && prev[4]) || cur.chars + w[0].length > 34)) { cur = { words: [], chars: 0 }; ph.push(cur); }
      cur.words.push(i); cur.chars += w[0].length + 1;
    });
    window.PHR = ph;
    $('#caps').innerHTML = ph.map(p => `<div class="sub rd">${p.words.map(i => `<span class="${W[i][3] ? 'k' : ''}">${W[i][0]}</span>`).join(' ')}</div>`).join('');
  }

  function build() {
    const tl = gsap.timeline({ paused: true }), cam = $('#kcam'), END = EP.end;
    gsap.set(['#hook .cm', '#hook .lg', '#hook .ok', '#hook .stamp', '#tag', '#ba', '#lang', '#follow'], { opacity: 0 });
    // framings: hard cuts on phrase starts, a slow push-in inside each shot
    EP.shots.forEach(([t, k], i) => {
      const f = FR[k], end = EP.shots[i + 1] ? EP.shots[i + 1][0] : END;
      tl.set(cam, { scale: f.s, y: f.y }, t);
      tl.to(cam, { scale: f.s * 1.03, duration: end - t, ease: 'none' }, t);
    });
    // hook: three comments, their languages, "0 codes", all three are orders
    const H = EP.hook;
    $$('#hook .cm').forEach((el, i) => {
      const c = H.items[i];
      tl.fromTo(el, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.8)', immediateRender: false }, c[3]);
      tl.fromTo($('.lg', el), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.6)', immediateRender: false }, c[4]);
      tl.to(el, { borderColor: '#0098B7', duration: 0.12 }, c[4]).to(el, { borderColor: 'rgba(0,0,0,0)', duration: 0.3 }, c[4] + 0.35);
      tl.to($('.lg', el), { scale: 0.3, opacity: 0, duration: 0.15 }, H.ok + i * 0.12 - 0.1);
      tl.fromTo($('.ok', el), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(2.6)', immediateRender: false }, H.ok + i * 0.12);
      tl.to(el, { borderColor: '#11B981', backgroundColor: '#F0FDF7', duration: 0.15 }, H.ok + i * 0.12);
      tl.to(el, { y: 40, opacity: 0, duration: 0.25, ease: 'power2.in' }, H.until - 0.3 + i * 0.03);
    });
    tl.fromTo('#hook .stamp', { scale: 0.4, opacity: 0, rotation: -16 }, { scale: 1, opacity: 1, rotation: -7, duration: 0.26, ease: 'back.out(1.8)', immediateRender: false, transformOrigin: '50% 100%' }, H.stamp[1]);
    tl.to('#flash', { opacity: 0.3, duration: 0.04 }, H.stamp[1] + 0.22).to('#flash', { opacity: 0, duration: 0.2 }, H.stamp[1] + 0.26);
    tl.to('#hook .stamp', { opacity: 0, scale: 0.7, duration: 0.2 }, H.until - 0.3);
    // name tag
    const T = EP.tag;
    tl.fromTo('#tag', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', immediateRender: false }, T.from);
    tl.to('#tag', { x: -80, opacity: 0, duration: 0.25, ease: 'power2.in' }, T.until - 0.25);
    // before / after
    const B = EP.ba, ba = $('#ba'), after = $('#ba .after'), hd = $('#ba .hd'), p = { v: 0 };
    const wipe = () => { after.style.clipPath = `inset(0 ${100 - p.v}% 0 0)`; hd.style.left = p.v + '%'; hd.style.opacity = p.v < 0.5 || p.v > 99.5 ? 0 : 1; };
    wipe();
    tl.fromTo(ba, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E, immediateRender: false }, B.from);
    $$('#ba .br').forEach((el, i) => {
      tl.fromTo(el, { backgroundColor: 'rgba(0,152,183,0)' }, { backgroundColor: 'rgba(0,152,183,0.13)', duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.3, immediateRender: false }, B.scan[i]);
      tl.fromTo($('.lg', el), { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, B.scan[i]);
    });
    tl.to('#ba .br u', { borderBottomColor: '#F59E0B', duration: 0.2, stagger: 0.1 }, B.typo);
    tl.fromTo('#ba .br .emo', { scale: 1 }, { scale: 1.6, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.1, ease: 'sine.inOut', immediateRender: false }, B.emo);
    tl.to(p, { v: 100, duration: B.wipe[1] - B.wipe[0], ease: 'power2.inOut', onUpdate: wipe }, B.wipe[0]);
    $$('#ba .th div').forEach((el, i) => tl.to(el, { backgroundColor: '#11B981', color: '#fff', duration: 0.15 }, B.colsAt[i]).to(el, { backgroundColor: 'rgba(17,185,129,0)', color: '#6B7280', duration: 0.3 }, B.colsAt[i] + 0.45));
    tl.to(ba, { y: 60, opacity: 0, duration: 0.25, ease: 'power2.in' }, B.until - 0.25);
    // interface languages
    const L = EP.lang, sp = $$('#lang .sw span');
    tl.fromTo('#lang', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: E, immediateRender: false }, L.from);
    tl.set(sp[0], { color: '#fff' }, L.from);
    tl.to('#lang .sel', { x: L.sel * 186, duration: 0.45, ease: 'back.out(1.4)' }, L.at);
    tl.to(sp[0], { color: '#6B7280', duration: 0.15 }, L.at).to(sp[L.sel], { color: '#fff', duration: 0.15 }, L.at + 0.2);
    tl.to('#lang', { y: 60, opacity: 0, duration: 0.25, ease: 'power2.in' }, L.until - 0.25);
    // follow + teaser
    const F = EP.follow;
    tl.fromTo('#follow', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: E, immediateRender: false }, F.from);
    tl.fromTo('#follow .fb', { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, F.from + 0.5);
    tl.fromTo('#follow .fx', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.35, ease: E, immediateRender: false }, F.at);
    gsap.set('#follow .fx', { opacity: 0 });
    // subtitles
    window.PHR.forEach((c, k) => {
      const el = $$('.sub')[k], a = W[c.words[0]][1], last = W[c.words[c.words.length - 1]];
      const nx = window.PHR[k + 1], off = nx ? Math.min(W[nx.words[0]][1] - 0.02, last[2] + 0.5) : Math.min(END - 0.02, last[2] + 0.6);
      gsap.set(el, { xPercent: -50, opacity: 0 });
      tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out', immediateRender: false }, Math.max(0, a - 0.04));
      tl.set(el, { opacity: 0 }, off);
    });
    tl.set({}, {}, END);
    return tl;
  }

  const kimg = $('#kimg'); let cur = 0;
  const frame = async t => {
    const i = Math.max(1, Math.min(KF.n, 1 + Math.floor(t * KF.fps + 1e-6)));
    if (i === cur) return; cur = i;
    kimg.src = `${KF.dir}/${String(i).padStart(4, '0')}.${KF.ext || 'jpg'}`;
    await kimg.decode().catch(() => {});
  };
  window.ready = (async () => {
    layout();
    await document.fonts.ready; await frame(0);
    await Promise.all([...document.images].map(im => im.decode().catch(() => {})));
    window.tl = build(); window.tl.seek(0); return true;
  })();
  window.seek = async t => { window.tl.seek(t, false); await frame(t); };
  window.duration = () => window.tl.duration();
})();
