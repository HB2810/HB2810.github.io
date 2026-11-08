/**
 * Decorative cursor swarm.
 *
 * A handful of coloured pointer arrows flock around a focus point: the visitor's
 * own pointer while it is over the host, otherwise a slowly drifting point. Pure
 * canvas drawing, no DOM reads beyond the canvas itself, no listeners of its own:
 * the host component feeds it size, pointer position and pause state.
 *
 * Original implementation for this site (see README.md in this folder).
 */

const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rand = (a, b) => a + Math.random() * (b - a);

// A simple pointer arrow in a 13x18 box; hotspot (tip) at 1,1.
const ARROW_PATH = 'M1 1 L1 15.5 L4.8 12.2 L7.4 18 L10.2 16.7 L7.6 11 L12.6 10.8 Z';

export const DEFAULT_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];

/** How many cursors fit a given width without feeling crowded. */
export function countFor(width) {
  if (width < 600) return 7;
  if (width < 1000) return 10;
  return 14;
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ colors?: string[], count?: number, alpha?: number }} [options]
 */
export function createSwarm(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  const arrow = new Path2D(ARROW_PATH);
  const colors = options.colors && options.colors.length ? options.colors : DEFAULT_COLORS;
  const alpha = options.alpha ?? 0.85;

  const S = {
    w: 0,
    h: 0,
    dpr: 1,
    t: 0,
    last: 0,
    raf: 0,
    running: false,
    paused: false,
    destroyed: false,
    agents: [],
    pointer: null, // { x, y } in canvas px, or null
    pointerAt: -1e9, // S.t when the pointer was last seen over the host
    focus: { x: 0, y: 0 },
    swirl: 1, // orbit direction, flips now and then
    swirlAt: 0,
  };

  function makeAgents(n) {
    S.agents = [];
    for (let i = 0; i < n; i += 1) {
      const quick = Math.random() < 0.3;
      S.agents.push({
        x: S.w / 2 + rand(-40, 40),
        y: S.h * 0.4 + rand(-30, 30),
        vx: 0,
        vy: 0,
        color: colors[i % colors.length],
        orbit: rand(70, 180),
        phase: rand(0, TAU),
        speed: quick ? rand(520, 760) : rand(260, 440),
        agility: quick ? 5.5 : 3.5,
        lean: 0,
        vis: 0,
        born: 0.2 + i * 0.07,
        mode: 'orbit',
        to: null,
        until: 0,
      });
    }
  }

  function resize(w, h) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    S.w = Math.max(1, Math.round(w));
    S.h = Math.max(1, Math.round(h));
    S.dpr = dpr;
    canvas.width = Math.round(S.w * dpr);
    canvas.height = Math.round(S.h * dpr);
    const n = options.count ?? countFor(S.w);
    if (!S.agents.length) {
      S.focus = { x: S.w / 2, y: S.h * 0.4 };
      makeAgents(n);
    } else {
      for (const a of S.agents) {
        a.x = clamp(a.x, 0, S.w);
        a.y = clamp(a.y, 0, S.h);
      }
      while (S.agents.length > n) S.agents.pop();
    }
    if (!S.running) draw();
  }

  function setPointer(x, y) {
    S.pointer = { x, y };
    S.pointerAt = S.t;
  }
  function clearPointer() {
    S.pointer = null;
  }

  // Where the swarm gathers: the pointer while it is over the host, else a slow drift.
  function focusTarget() {
    if (S.pointer && S.t - S.pointerAt < 2.5) return S.pointer;
    const t = S.t;
    return {
      x: S.w * (0.5 + 0.28 * Math.sin(t * 0.23)),
      y: S.h * (0.32 + 0.14 * Math.sin(t * 0.17 + 1.1)), // stays over the upper stage, clear of the intro copy
    };
  }

  function step(dt) {
    S.t += dt;
    const { agents, w, h } = S;

    // the focus eases toward its target so a leaving pointer never makes the swarm jump
    const target = focusTarget();
    const k = 1 - Math.exp(-dt * 4);
    S.focus.x += (target.x - S.focus.x) * k;
    S.focus.y += (target.y - S.focus.y) * k;

    // orbit direction flips every so often
    if (S.t > S.swirlAt) {
      S.swirlAt = S.t + rand(6, 14);
      S.swirl = -S.swirl;
    }

    const fx = S.focus.x;
    const fy = S.focus.y;
    const wanderers = agents.filter((a) => a.mode === 'wander').length;

    for (let i = 0; i < agents.length; i += 1) {
      const a = agents[i];
      a.vis = S.t < a.born ? 0 : Math.min(1, a.vis + dt / 0.4);
      if (a.vis === 0) continue;

      // now and then a spare cursor wanders off to look at something else
      if (a.mode === 'orbit' && wanderers < 3 && agents.length > 5 && Math.random() < dt * 0.08) {
        a.mode = 'wander';
        a.to = { x: rand(w * 0.1, w * 0.9), y: rand(h * 0.12, h * 0.88) };
        a.until = S.t + rand(2.5, 5);
      } else if (a.mode === 'wander' && S.t > a.until) {
        a.mode = 'orbit';
        a.to = null;
      }

      let dx = 0;
      let dy = 0;
      if (a.mode === 'wander') {
        // seek the chosen spot, slowing on approach, then hover with a little jitter
        const tx = a.to.x - a.x;
        const ty = a.to.y - a.y;
        const d = Math.hypot(tx, ty) || 0.001;
        const sp = Math.min(a.speed * 0.55, d * 3);
        dx = (tx / d) * sp + Math.sin(S.t * 3.1 + a.phase) * 12;
        dy = (ty / d) * sp + Math.cos(S.t * 2.7 + a.phase) * 12;
      } else {
        // orbit the focus at this cursor's preferred radius, breathing slightly
        const vx = a.x - fx;
        const vy = a.y - fy;
        const d = Math.hypot(vx, vy) || 0.001;
        const nx = vx / d;
        const ny = vy / d;
        const r = a.orbit * (1 + 0.15 * Math.sin(S.t * 0.6 + a.phase));
        const radial = clamp((r - d) * 3, -900, 600);
        const tangent = S.swirl * (150 + a.speed * 0.25);
        dx = nx * radial - ny * tangent;
        dy = ny * radial + nx * tangent;
      }

      // separation and alignment with nearby cursors
      let sx = 0;
      let sy = 0;
      let ax = 0;
      let ay = 0;
      let near = 0;
      for (let j = 0; j < agents.length; j += 1) {
        if (j === i) continue;
        const b = agents[j];
        const ox = a.x - b.x;
        const oy = a.y - b.y;
        const d = Math.hypot(ox, oy);
        if (d < 34 && d > 0.001) {
          const push = (34 - d) / 34;
          sx += (ox / d) * push * 420;
          sy += (oy / d) * push * 420;
        }
        if (d < 90) {
          ax += b.vx;
          ay += b.vy;
          near += 1;
        }
      }
      dx += sx;
      dy += sy;
      if (near) {
        dx = dx * 0.8 + (ax / near) * 0.2;
        dy = dy * 0.8 + (ay / near) * 0.2;
      }

      // never sit on top of the visitor's own pointer
      if (S.pointer) {
        const ox = a.x - S.pointer.x;
        const oy = a.y - S.pointer.y;
        const d = Math.hypot(ox, oy);
        if (d < 56 && d > 0.001) {
          dx += (ox / d) * ((56 - d) / 56) * 900;
          dy += (oy / d) * ((56 - d) / 56) * 900;
        }
      }

      // keep inside the host with a soft margin
      const m = 24;
      if (a.x < m) dx += (m - a.x) * 12;
      if (a.x > w - m) dx -= (a.x - (w - m)) * 12;
      if (a.y < m) dy += (m - a.y) * 12;
      if (a.y > h - m) dy -= (a.y - (h - m)) * 12;

      const L = Math.hypot(dx, dy);
      if (L > a.speed) {
        dx *= a.speed / L;
        dy *= a.speed / L;
      }
      const g = Math.min(1, dt * a.agility);
      a.vx += (dx - a.vx) * g;
      a.vy += (dy - a.vy) * g;
      a.x += a.vx * dt;
      a.y += a.vy * dt;

      // lean a little into the heading while moving
      const sp = Math.hypot(a.vx, a.vy);
      const want = sp > 40 ? clamp(a.vx / a.speed, -1, 1) * 22 : 0;
      a.lean += (want - a.lean) * Math.min(1, dt * 6);
    }
  }

  function draw() {
    const { w, h, dpr } = S;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    for (const a of S.agents) {
      if (a.vis <= 0.01) continue;
      const s = 0.85 + 0.15 * a.vis;
      ctx.save();
      ctx.globalAlpha = alpha * a.vis;
      ctx.translate(a.x, a.y);
      ctx.rotate((a.lean * Math.PI) / 180);
      ctx.scale(s, s);
      ctx.translate(-1, -1);
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = a.color;
      ctx.fill(arrow);
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.4;
      ctx.stroke(arrow);
      ctx.restore();
    }
  }

  function frame(now) {
    if (!S.running || S.destroyed) return;
    const dt = clamp((now - S.last) / 1000, 0, 0.05);
    S.last = now;
    step(dt);
    draw();
    S.raf = requestAnimationFrame(frame);
  }

  function start() {
    if (S.running || S.destroyed) return;
    S.running = true;
    S.last = performance.now();
    S.raf = requestAnimationFrame(frame);
  }
  function stop() {
    S.running = false;
    cancelAnimationFrame(S.raf);
  }
  function setPaused(paused) {
    S.paused = paused;
    if (paused) stop();
    else start();
  }
  function destroy() {
    stop();
    S.destroyed = true;
    S.agents = [];
  }

  return { resize, setPointer, clearPointer, setPaused, start, stop, destroy };
}
