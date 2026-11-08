/**
 * REBUILD ENGINE (original implementation)
 * --------------------------------------------------------------
 * Wipes the page to a blank canvas, then a swarm of named cursors
 * rebuilds it block by block: boxes are dragged out with a crosshair
 * and a live size badge, text is wiped in behind a caret, section
 * headings get a ruler guide, the swarm prefers blocks near the
 * viewport (so it chases your scroll), and an optional "tour" keeps
 * the window scrolled to where the swarm is working.
 *
 * Only behaviour is borrowed from the "Swarm Rebuild" idea; the code
 * here is written from scratch for this site. No network, no storage.
 */

const BLOCK_SELECTOR = [
  '.hero-word',
  '.hero-portrait',
  '.hero-top .role',
  '.availability',
  'h1',
  'h2',
  'h3',
  '.hero-greet',
  '.hero-role',
  '.hero-headline',
  '.hero-intro',
  '.hero-loc',
  '.hero-side .hand',
  '.metric',
  '.hero-foot > *',
  '.kicker',
  '.section-aside',
  '.tab',
  '.search',
  '.card',
  '.tools-strip .chip-row',
  '.bio p',
  '.skill-group',
  '.edu-item',
  '.interests',
  '.toolkit .chip-row',
  '.process li',
  '.quote-panel',
  '.tl-item',
  '.milestones',
  '.contact-grid .lead',
  '.contact-grid .hero-cta',
  '.contact-list li',
  '.resume-card',
  '.form-toggle',
  '.footer .wordmark',
  '.footer .copy',
  '.footer .socials',
  '.btn',
].join(',');

const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'P']);
const COLORS = ['#e32b3c', '#f5b700', '#2dd4bf', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c'];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Collect the blocks to rebuild, skipping anything nested in a chosen block. */
function collectBlocks(root) {
  const all = Array.from(root.querySelectorAll(BLOCK_SELECTOR));
  const chosen = [];
  for (const el of all) {
    if (el.closest('.header, .mobile-nav, .backdrop, .rb-ui')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    if (chosen.some((c) => c !== el && c.contains(el))) continue;
    chosen.push(el);
  }
  // Drop blocks that contain an earlier-chosen block (keep the inner ones).
  return chosen.filter((el) => !chosen.some((c) => c !== el && el.contains(c)));
}

function docRect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

function isText(el) {
  return TEXT_TAGS.has(el.tagName) || el.classList.contains('kicker') || el.classList.contains('hand');
}

export function createRebuild({ canvas, root, cursorCount = 5, names = [], getSpeed = () => 1, getTour = () => false, onProgress = () => {}, onDone = () => {} }) {
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let blocks = [];
  let pending = [];
  let done = 0;
  let raf = 0;
  let last = 0;
  let running = false;
  let guides = [];
  let tourY = null;
  const cursors = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeCursor(i) {
    const label = names[i % names.length] || `cursor ${i + 1}`;
    return {
      id: i,
      label,
      color: COLORS[i % COLORS.length],
      // viewport-space position
      x: window.innerWidth * (0.2 + 0.6 * Math.random()),
      y: -40 - Math.random() * 80,
      task: null,
      phase: 'idle',
      t: 0,
      from: null,
      to: null,
      dur: 0,
      wait: 0.1 + i * 0.12,
    };
  }

  /** Pick the pending block closest to the viewport centre: the swarm chases the reader. */
  function pickTask() {
    if (!pending.length) return null;
    const centre = window.scrollY + window.innerHeight * 0.45;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < pending.length; i += 1) {
      const r = docRect(pending[i].el);
      const d = Math.abs(r.y + r.h / 2 - centre) + (r.x + r.w / 2) * 0.05;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const [task] = pending.splice(best, 1);
    task.rect = docRect(task.el);
    return task;
  }

  function reveal(task) {
    const { el } = task;
    el.classList.add('rb-shown');
    if (task.text) {
      const chars = (el.textContent || '').length;
      const dur = clamp(chars * 0.014, 0.25, 2.2) / getSpeed();
      el.style.setProperty('--rb-dur', `${dur}s`);
      el.classList.add('rb-wipe');
      task.wipeDur = dur;
    } else {
      el.classList.add('rb-pop');
    }
    done += 1;
    onProgress(done, blocks.length);
  }

  function finishBlock(task) {
    const { el } = task;
    el.classList.remove('rb-wipe', 'rb-pop');
    el.style.removeProperty('--rb-dur');
  }

  function stepCursor(c, dt) {
    const speed = getSpeed();
    if (c.phase === 'idle') {
      c.wait -= dt;
      if (c.wait > 0) return;
      const task = pickTask();
      if (!task) {
        c.phase = 'leaving';
        c.from = { x: c.x, y: c.y };
        c.to = { x: c.x + (Math.random() - 0.5) * 300, y: -80 };
        c.t = 0;
        c.dur = 0.8;
        return;
      }
      c.task = task;
      c.from = { x: c.x, y: c.y };
      c.to = { x: task.rect.x - window.scrollX, y: task.rect.y - window.scrollY };
      const dist = Math.hypot(c.to.x - c.from.x, c.to.y - c.from.y);
      c.dur = clamp(dist / 1500, 0.18, 0.9) / speed;
      c.t = 0;
      c.phase = 'travel';
      if (task.el.tagName === 'H2') {
        guides.push({ y: task.rect.y, life: 1.6 / speed, max: 1.6 / speed, color: c.color });
      }
      return;
    }

    if (c.phase === 'travel') {
      c.t += dt;
      const p = easeInOut(clamp(c.t / c.dur, 0, 1));
      // re-anchor to the element each frame so scrolling doesn't leave the cursor behind
      c.to = { x: c.task.rect.x - window.scrollX, y: c.task.rect.y - window.scrollY };
      c.x = c.from.x + (c.to.x - c.from.x) * p;
      c.y = c.from.y + (c.to.y - c.from.y) * p;
      if (p >= 1) {
        c.phase = c.task.text ? 'type' : 'drag';
        c.t = 0;
        const { w, h } = c.task.rect;
        c.dur = c.task.text ? 0 : clamp(Math.hypot(w, h) / 900, 0.22, 0.8) / speed;
        if (c.task.text) {
          reveal(c.task);
          c.dur = c.task.wipeDur;
        }
      }
      return;
    }

    if (c.phase === 'drag') {
      c.t += dt;
      const p = easeOut(clamp(c.t / c.dur, 0, 1));
      const r = c.task.rect;
      c.x = r.x - window.scrollX + r.w * p;
      c.y = r.y - window.scrollY + r.h * p;
      c.task.dragP = p;
      if (p >= 1) {
        reveal(c.task);
        c.phase = 'settle';
        c.t = 0;
        c.dur = 0.35 / speed;
      }
      return;
    }

    if (c.phase === 'type') {
      c.t += dt;
      const p = clamp(c.t / Math.max(c.dur, 0.01), 0, 1);
      const r = c.task.rect;
      c.x = r.x - window.scrollX + r.w * p;
      c.y = r.y - window.scrollY + r.h * 0.5;
      c.task.typeP = p;
      if (p >= 1) {
        c.phase = 'settle';
        c.t = 0;
        c.dur = 0.25 / speed;
      }
      return;
    }

    if (c.phase === 'settle') {
      c.t += dt;
      if (c.t >= c.dur) {
        finishBlock(c.task);
        c.task = null;
        c.phase = 'idle';
        c.wait = 0.05;
      }
      return;
    }

    if (c.phase === 'leaving') {
      c.t += dt;
      const p = easeInOut(clamp(c.t / c.dur, 0, 1));
      c.x = c.from.x + (c.to.x - c.from.x) * p;
      c.y = c.from.y + (c.to.y - c.from.y) * p;
      if (p >= 1) c.phase = 'gone';
    }
  }

  function drawCursor(c) {
    const { x, y, color } = c;
    ctx.save();
    ctx.translate(x, y);
    // arrow
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(4.2, 12.4);
    ctx.lineTo(7.4, 18.6);
    ctx.lineTo(10.2, 17.3);
    ctx.lineTo(7, 11.2);
    ctx.lineTo(12.4, 11);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#090909';
    ctx.stroke();
    // name tag
    ctx.font = '600 11px Manrope, system-ui, sans-serif';
    const w = ctx.measureText(c.label).width + 14;
    ctx.fillStyle = color;
    roundRect(14, 14, w, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#0b0b0b';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.label, 21, 24.5);
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawTask(c) {
    const t = c.task;
    if (!t) return;
    const r = t.rect;
    const vx = r.x - window.scrollX;
    const vy = r.y - window.scrollY;
    ctx.save();
    if (c.phase === 'drag') {
      const p = t.dragP || 0;
      const w = r.w * p;
      const h = r.h * p;
      // crosshair
      ctx.strokeStyle = 'rgba(242,239,235,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, c.y + 0.5);
      ctx.lineTo(window.innerWidth, c.y + 0.5);
      ctx.moveTo(c.x + 0.5, 0);
      ctx.lineTo(c.x + 0.5, window.innerHeight);
      ctx.stroke();
      // dashed box
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(vx + 0.5, vy + 0.5, w, h);
      ctx.setLineDash([]);
      ctx.fillStyle = hexA(c.color, 0.08);
      ctx.fillRect(vx, vy, w, h);
      // size badge
      const label = `${Math.round(w)} × ${Math.round(h)}`;
      ctx.font = '600 11px Manrope, system-ui, sans-serif';
      const bw = ctx.measureText(label).width + 14;
      ctx.fillStyle = '#f2efeb';
      roundRect(c.x + 14, c.y - 26, bw, 20, 5);
      ctx.fill();
      ctx.fillStyle = '#090909';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, c.x + 21, c.y - 15.5);
    } else if (c.phase === 'type') {
      // caret at the wipe edge
      const blink = Math.floor(performance.now() / 260) % 2 === 0;
      if (blink) {
        ctx.fillStyle = c.color;
        ctx.fillRect(Math.round(c.x), vy, 2, r.h);
      }
    } else if (c.phase === 'settle') {
      const p = 1 - clamp(c.t / c.dur, 0, 1);
      ctx.globalAlpha = p;
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(vx + 0.5, vy + 0.5, r.w, r.h);
    }
    ctx.restore();
  }

  function drawGuides(dt) {
    guides = guides.filter((g) => (g.life -= dt) > 0);
    for (const g of guides) {
      const p = 1 - g.life / g.max;
      const y = g.y - window.scrollY;
      const grow = easeOut(clamp(p * 2.5, 0, 1));
      ctx.save();
      ctx.globalAlpha = p > 0.7 ? (1 - p) / 0.3 : 1;
      ctx.strokeStyle = hexA(g.color, 0.7);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(0, Math.round(y) - 6.5);
      ctx.lineTo(window.innerWidth * grow, Math.round(y) - 6.5);
      ctx.stroke();
      ctx.restore();
    }
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function tour() {
    if (!getTour()) {
      tourY = null;
      return;
    }
    const active = cursors.filter((c) => c.task);
    if (!active.length) return;
    const ys = active.map((c) => c.task.rect.y + c.task.rect.h / 2);
    const target = Math.min(...ys) - window.innerHeight * 0.4;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const goal = clamp(target, 0, max);
    tourY = tourY === null ? window.scrollY : tourY + (goal - tourY) * 0.08;
    if (Math.abs(tourY - window.scrollY) > 0.5) window.scrollTo({ top: tourY, behavior: 'instant' });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawGuides(dt);
    for (const c of cursors) {
      stepCursor(c, dt);
      drawTask(c);
    }
    for (const c of cursors) if (c.phase !== 'gone') drawCursor(c);
    tour();
    if (cursors.every((c) => c.phase === 'gone')) {
      stop(true);
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    resize();
    window.addEventListener('resize', resize);
    blocks = collectBlocks(root).map((el) => ({ el, text: isText(el) }));
    pending = blocks.slice();
    done = 0;
    guides = [];
    tourY = null;
    cursors.length = 0;
    for (let i = 0; i < cursorCount; i += 1) cursors.push(makeCursor(i));
    document.body.classList.add('rebuilding');
    running = true;
    last = performance.now();
    onProgress(0, blocks.length);
    raf = requestAnimationFrame(frame);
  }

  function stop(finished = false) {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const b of blocks) {
      b.el.classList.remove('rb-shown', 'rb-wipe', 'rb-pop');
      b.el.style.removeProperty('--rb-dur');
    }
    document.body.classList.remove('rebuilding');
    pending = [];
    cursors.length = 0;
    onDone(finished);
  }

  return { start, stop, isRunning: () => running };
}
