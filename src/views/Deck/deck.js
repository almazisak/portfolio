(() => {
  const stage = document.getElementById('stage');
  const track = document.getElementById('track');
  const slides = [...stage.querySelectorAll('.slide')];
  const navBtns = [...document.querySelectorAll('#nav button')];
  const countEl = document.getElementById('count');
  const progress = document.getElementById('progress');
  const live = document.getElementById('live');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // Each slide owns `steps` integer positions on the scroll track.
  let N = 0;
  slides.forEach((s, i) => {
    s.start = N; s.steps = +s.dataset.steps || 1; s.end = N + s.steps - 1; s.idx = i;
    N += s.steps;
    s.counters = [...s.querySelectorAll('[data-count]')];
  });
  const chapterStart = {};
  slides.forEach(s => { if (!(s.dataset.ch in chapterStart)) chapterStart[s.dataset.ch] = s.start; });

  const MIN_W = 768;
  let vh = innerHeight, target = 0, disp = 0, active = -1, raf = 0;

  function layout() {
    vh = innerHeight;
    track.style.height = (N * vh) + 'px';
    track.innerHTML = Array.from({length: N}, (_, i) => `<i style="top:${i * vh}px"></i>`).join('');
    const portrait = false; // phone layout disabled: desktop/tablet only (min width 768px)
    const W = portrait ? 440 : 1920, H = portrait ? 880 : 1080;
    const topPad = 0, s = Math.min(Math.max(innerWidth, MIN_W) / W, (innerHeight - topPad) / H);
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    stage.classList.toggle('P', portrait);
    readScroll(); disp = reduce.matches ? Math.round(target) : target; render();
  }

  function readScroll() { target = clamp(scrollY / vh, 0, N - 1); }

  function render() {
    const p = disp;
    let best = 0, bestVis = -1;
    for (const s of slides) {
      const inn = s.start === 0 ? 1 : clamp((p - (s.start - 1)) * 1.7 - 0.7, 0, 1);
      const out = s.end === N - 1 ? 0 : clamp((p - s.end) * 1.7, 0, 1);
      const vis = inn * (1 - out);
      if (vis <= 0.001) { if (s.style.visibility !== 'hidden') s.style.visibility = 'hidden'; }
      else {
        s.style.visibility = 'visible';
        const k = clamp(p - s.start, 0, s.steps - 1);
        s.style.setProperty('--in', inn.toFixed(4));
        s.style.setProperty('--out', out.toFixed(4));
        s.style.setProperty('--k', k.toFixed(4));
        for (const c of s.counters) {
          const at = +c.dataset.at, v = clamp((k - at + 1) * 2, 0, 1);
          if (c.hasAttribute('data-from-fixed')) continue;
          const val = +c.dataset.from + (+c.dataset.to - +c.dataset.from) * v;
          c.textContent = val.toFixed(+c.dataset.dec) + (c.dataset.suffix || '');
        }
      }
      if (vis > bestVis) { bestVis = vis; best = s.idx; }
    }
    progress.style.width = (N > 1 ? (p / (N - 1)) * 100 : 0) + '%';
    if (best !== active) setActive(best);
  }

  function setActive(i) {
    active = i;
    const s = slides[i];
    slides.forEach((el, j) => { const on = j === i; el.inert = !on; el.setAttribute('aria-hidden', on ? 'false' : 'true'); });
    navBtns.forEach(b => b.setAttribute('aria-current', b.dataset.go === s.dataset.ch ? 'true' : 'false'));
    countEl.textContent = `${i + 1} / ${slides.length}`;
    live.textContent = `Slide ${i + 1} of ${slides.length}: ${s.getAttribute('aria-label')}`;
    const h = '#' + s.dataset.ch;
    if (location.hash !== h) { try { history.replaceState(null, '', h); } catch { /* ignore */ } }
  }

  function tick() {
    raf = 0;
    if (reduce.matches) disp = Math.round(target);
    else if (anim) disp = target;
    else {
      const d = target - disp;
      if (Math.abs(d) > 2.2) disp = target - Math.sign(d) * 1.2; // long jumps: skip the fly-through
      disp += (target - disp) * 0.12;
      if (Math.abs(target - disp) < 0.0008) disp = target;
    }
    render();
    if (disp !== target && !reduce.matches) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  // Smooth, eased travel of the scroll position itself (keys, settle, short jumps)
  let anim = null;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function cancelAnim() { if (anim) { cancelAnimationFrame(anim.raf); anim = null; } }
  // Plays a chain of eased segments: [{to, dur, hold}]. Positions are in steps.
  function animateSeq(segs, dest) {
    cancelAnim();
    anim = {raf: 0, dest};
    let i = 0, from = scrollY / vh, t0 = performance.now();
    const step = now => {
      if (!anim) return;
      const s = segs[i];
      const p = Math.min(1, (now - t0) / s.dur);
      const pos = from + (s.to - from) * ease(p);
      window.scrollTo({top: pos * vh, behavior: 'instant'});
      readScroll(); disp = target; render();
      if (now - t0 >= s.dur + (s.hold || 0)) {
        i++; from = s.to; t0 = now;
        if (i >= segs.length) { anim = null; target = s.to; disp = s.to; render(); return; }
      }
      anim.raf = requestAnimationFrame(step);
    };
    anim.raf = requestAnimationFrame(step);
  }
  function animateTo(pos) {
    const dist = Math.abs(pos - scrollY / vh);
    if (dist < 0.002) return;
    animateSeq([{to: pos, dur: 360 + Math.min(dist, 1.5) * 260}], pos);
  }
  function jumpTo(pos) {
    window.scrollTo({top: clamp(pos, 0, N - 1) * vh, behavior: 'instant'});
    readScroll(); disp = target; render();
  }
  // Keyboard / nav: go to a whole slide. Forward plays its steps by itself to the final state;
  // backward lands on the previous slide already in its final state.
  function currentSlide() {
    if (anim && anim.slide != null) return anim.slide;
    const p = Math.round(target);
    return slides.findIndex(s => p >= s.start && p <= s.end);
  }
  function playSlide(i, back) {
    i = clamp(i, 0, slides.length - 1);
    const s = slides[i];
    cancelAnim();
    if (reduce.matches) { jumpTo(s.end); target = s.end; return; }
    if (back) {
      jumpTo(Math.min(N - 1, s.end + 0.55));
      animateSeq([{to: s.end, dur: 480}], s.end);
    } else {
      if (s.start > 0) jumpTo(s.start - 0.55);
      const segs = [{to: s.start, dur: 480, hold: s.steps > 1 ? 220 : 0}];
      for (let k = 1; k < s.steps; k++) segs.push({to: s.start + k, dur: 650, hold: k < s.steps - 1 ? 180 : 0});
      animateSeq(segs, s.end);
    }
    if (anim) anim.slide = i;
  }
  function goTo(pos) {
    pos = clamp(Math.round(pos), 0, N - 1);
    if (reduce.matches || Math.abs(pos - target) > 2) {
      cancelAnim();
      window.scrollTo({top: pos * vh, behavior: 'instant'});
      target = pos; kick();
    } else animateTo(pos);
  }
  addEventListener('wheel', cancelAnim, {passive: true});
  addEventListener('touchstart', cancelAnim, {passive: true});
  const goChapter = ch => { if (ch in chapterStart) playSlide(slides.findIndex(s => s.dataset.ch === ch)); };

  // Settle: after scrolling stops, finish the move to the nearest step in the direction of travel
  let lastY = scrollY, dir = 0, settleT = 0, pointerDown = false;
  function settle() {
    if (pointerDown) return;
    const base = Math.floor(target + 1e-6), frac = target - base;
    if (frac < 0.002 || frac > 0.998) return;
    const dest = dir > 0 ? (frac > 0.12 ? base + 1 : base) : dir < 0 ? (frac < 0.88 ? base : base + 1) : Math.round(target);
    goTo(dest);
  }
  addEventListener('pointerdown', () => { pointerDown = true; }, {passive: true});
  addEventListener('pointerup', () => { pointerDown = false; clearTimeout(settleT); settleT = setTimeout(settle, 120); }, {passive: true});
  addEventListener('scroll', () => {
    if (anim) { lastY = scrollY; return; }
    if (scrollY !== lastY) dir = Math.sign(scrollY - lastY);
    lastY = scrollY;
    readScroll(); kick();
    clearTimeout(settleT); settleT = setTimeout(settle, 140);
  }, {passive: true});
  addEventListener('resize', () => { const keep = Math.round(target); layout(); goTo(keep); });

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const next = ['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'];
    const prev = ['ArrowLeft', 'ArrowUp', 'PageUp'];
    if (e.key === 'Enter' && (tag === 'button' || tag === 'a')) return;
    if (next.includes(e.key) && !(e.key === ' ' && e.shiftKey)) { e.preventDefault(); playSlide(currentSlide() + 1); }
    else if (prev.includes(e.key) || (e.key === ' ' && e.shiftKey)) { e.preventDefault(); playSlide(currentSlide() - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
    else if (/^[1-5]$/.test(e.key)) { goChapter(['intro', 'checkout', 'pim', 'system', 'outro'][+e.key - 1]); }
    else if (e.key === 'h' || e.key === 'H') document.body.classList.toggle('clean');
    else if (e.key === 'r' || e.key === 'R') stage.classList.toggle('rec');
    else if (e.key === 't' || e.key === 'T') { const t = document.getElementById('tune'); t.hidden = !t.hidden; }
    else if (e.key === 'f' || e.key === 'F') {
      try { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); } catch { /* ignore */ }
    }
  });

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (b) { e.preventDefault(); goChapter(b.dataset.go); }
  });

  const copy = document.getElementById('copy');
  copy.addEventListener('click', () => {
    const t = document.getElementById('email').textContent;
    const done = () => { copy.textContent = 'Copied'; setTimeout(() => copy.textContent = 'Copy', 1600); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('email')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(t).then(done, fallback); } catch { fallback(); }
  });

  // Hide the hint after first interaction
  const hint = document.getElementById('hint');
  const hideHint = () => { hint.style.opacity = '0'; removeEventListener('scroll', hideHint); };
  setTimeout(() => addEventListener('scroll', hideHint, {passive: true}), 600);

  // ---------- Design controls (key T) ----------
  const flow = document.querySelector('.flow5'), root = document.documentElement;
  function placeArrows() { // arrows span tag to tag, 6px short of each
    const cols = [...flow.querySelectorAll('.fs')];
    flow.querySelectorAll('.arr .seam').forEach((a, i) => {
      const A = cols[i], B = cols[i + 1]; if (!A || !B) return;
      const oa = A.querySelector('.owner'), ob = B.querySelector('.owner');
      const x1 = A.offsetLeft + oa.offsetLeft + oa.offsetWidth + 6, x2 = B.offsetLeft + ob.offsetLeft - 6;
      a.style.left = x1 + 'px'; a.style.width = Math.max(12, x2 - x1) + 'px';
      a.style.top = (A.offsetTop + oa.offsetTop + oa.offsetHeight / 2 - 12) + 'px';
    });
  }
  const CONTROLS = [
    ['Type · headings', [['--fs-h1','Intro heading',60,180,1],['--fs-h2','Slide heading',36,110,1],['--lh-h2','Heading line height',.85,1.4,.01,''],['--fs-eyebrow','Eyebrow',10,32,1]]],
    ['Type · text', [['--fs-sub','Lead paragraph',16,44,1],['--fs-ctx','Context paragraph',14,40,1],['--fs-meta','Subtitle',14,40,1],['--fs-finding','Conclusion line',28,96,1]]],
    ['Type · numbers', [['--fs-metric','Cover metric',28,100,1],['--fs-metric-label','Metric label',12,36,1],['--fs-bar-num','Bar values',16,60,1],['--fs-hero','+4.6 pp (hero)',48,180,1],['--fs-delta','+4.6 pp (old)',24,80,1],['--fs-donut','−20% (time)',48,180,1],['--fs-fu','Follow-up text',16,48,1],['--fs-result-label','Result labels',12,32,1],['--fs-result-value','Result values',16,48,1]]],
    ['Type · details', [['--fs-chapter','Chapter titles',24,64,1],['--fs-chapter-meta','Chapter meta',12,30,1],['--fs-screen-label','Screen labels',12,32,1],['--fs-tag','Tags',10,24,1],['--fs-note','Footnote',12,30,1],['--fs-cap-title','Caption title',10,28,1],['--fs-cap-desc','Caption text',12,32,1],['--fs-sticky','Sticky notes',12,28,1]]],
    ['Spacing · slide', [['--pad-top','Top padding',60,240,2],['--pad-x','Side padding',40,240,2],['--pad-bottom','Bottom padding',40,200,2],['--col-text','Text column',400,900,10],['--gap-col','Text ↔ visual',24,200,2],['--gap-wide','Heading ↔ visual',16,160,2],['--gap-txt','Text blocks gap',8,64,1],['--gap-head','Heading ↔ subtitle',4,48,1]]],
    ['Problem slide', [['--gap-problem','Subtitle ↔ screens',24,160,2],['--inset','Text inset',0,48,1],['--tag-gap','Tags ↓ screen',0,48,1],['--note-gap','Footnote ↓ tag',0,40,1],['--shot-h','Screen height',360,600,2],['--shot-h-rec','Screen height (rec)',320,560,2]]],
    ['Result slide · spacing', [['--r-card-w','Card width',420,800,10],['--r-col-gap','Card ↔ right side',24,200,2],['--r-card-pad','Card padding',16,80,2],['--r-card-gap','Card label ↔ +4.6',0,60,1],['--r-plot-top','+4.6 ↔ chart',-40,120,2],['--r-side-gap','Clock ↔ survey',0,120,2],['--r-label-gap','Survey label ↔ avatars',0,48,1],['--r-clock-gap','Clock ↔ −20%',8,120,2],['--r-pct-gap','−20% ↔ its label',0,40,1],['--r-leg-top','Label ↔ legend',0,48,1],['--r-leg-gap','Legend rows',0,32,1],['--r-av-gap','Avatar gap',0,40,1],['--r-nps-inner','5 of 6 ↔ caption',0,60,1],['--r-roll-gap','Blocks ↔ bottom line',0,80,1],['--clock-w','Clock size',200,420,2]]],
    ['Three stories · list', [['--ch-x','Left',0,480,4],['--ch-y','Top',0,320,4],['--ch-w','Width',800,1680,10]]]
  ];
  const DEF = {}, CUR = {}, UNIT = {}, ROWS = {};
  const cs = getComputedStyle(root);
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('prtfl-design') || '{}'); } catch { /* ignore */ }
  const body = document.getElementById('tuneBody'), out = document.getElementById('tuneOut');
  CONTROLS.forEach(([group, items], gi) => {
    const d = document.createElement('details'); if (gi === 0) d.open = true;
    d.innerHTML = '<summary>' + group + '</summary>'; body.appendChild(d);
    items.forEach(([v, label, min, max, step, unit = 'px']) => {
      UNIT[v] = unit; DEF[v] = parseFloat(cs.getPropertyValue(v));
      const id = 'tc' + v.replace(/[^a-z0-9]/gi, '');
      const row = document.createElement('div'); row.className = 'row';
      row.innerHTML = `<label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}"><input type="number" id="${id}n" min="${min}" max="${max}" step="${step}" aria-label="${label} value">`;
      d.appendChild(row); ROWS[v] = row;
      const r = row.children[1], n = row.children[2];
      const set = x => { x = +x; CUR[v] = x; r.value = x; n.value = x; root.style.setProperty(v, x + unit); row.classList.toggle('chg', x !== DEF[v]); };
      set(v in saved ? saved[v] : DEF[v]);
      const onIn = x => { set(x); persist(); placeArrows(); };
      r.addEventListener('input', () => onIn(r.value)); n.addEventListener('change', () => onIn(n.value));
      ROWS[v].set = set;
    });
  });
  function diff() { const o = {}; for (const v in CUR) if (CUR[v] !== DEF[v]) o[v] = CUR[v]; return o; }
  function persist() {
    const o = diff(); try { localStorage.setItem('prtfl-design', JSON.stringify(o)); } catch { /* ignore */ }
    out.value = Object.keys(o).length ? Object.entries(o).map(([v, x]) => `${v}: ${x}${UNIT[v]};`).join('\n') : 'No changes yet';
  }
  persist();
  document.getElementById('tuneReset').addEventListener('click', () => { for (const v in ROWS) ROWS[v].set(DEF[v]); persist(); placeArrows(); });
  const copyBtn = document.getElementById('tuneCopy');
  copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = 'Copied'; setTimeout(() => copyBtn.textContent = 'Copy changes', 1500); };
    const fb = () => { out.focus(); out.select(); };
    try { navigator.clipboard.writeText(out.value).then(done, fb); } catch { fb(); }
  });
  placeArrows(); if (document.fonts) document.fonts.ready.then(placeArrows); addEventListener('load', placeArrows);
  // Re-place whenever the geometry changes (rec toggle, image load, tune sliders)
  const ro = new ResizeObserver(placeArrows);
  [flow, ...flow.querySelectorAll('.fs')].forEach(el => ro.observe(el));

  const params = new URLSearchParams(location.search);
  if (params.has('record')) { stage.classList.add('rec'); document.body.classList.add('clean'); }

  // Read the deep link before layout(): render() rewrites the hash to the current chapter.
  const h = location.hash.slice(1);
  layout();
  if (h && h in chapterStart) { goTo(chapterStart[h]); disp = target; render(); }
  else render();
  reduce.addEventListener?.('change', kick);
})();
