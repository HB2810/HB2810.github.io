import React, { useEffect, useRef, useState } from 'react';
import { useMotion } from '../hooks/useMotion.jsx';
import { createSwarm } from '../lib/swarmline/swarm.js';

const REDUCED = '(prefers-reduced-motion: reduce)';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(REDUCED).matches);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Decorative cursor swarm behind the hero. Mounted only while the Motion toggle is on
 * and the visitor has not asked for reduced motion; otherwise renders nothing at all.
 */
export default function Swarm() {
  const { on } = useMotion();
  const reduced = useReducedMotion();
  if (!on || reduced) return null;
  return <SwarmCanvas />;
}

function SwarmCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const swarm = createSwarm(canvas, {
      colors: [accent || '#e32b3c', '#3b82f6', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#06b6d4', '#f97316'],
    });

    // size follows the host (the canvas is absolutely positioned over it)
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      swarm.resize(r.width, r.height);
    });
    ro.observe(canvas);
    const r0 = canvas.getBoundingClientRect();
    swarm.resize(r0.width, r0.height);

    // run only while the tab is visible and the hero is on screen
    let visible = !document.hidden;
    let onScreen = true;
    const sync = () => swarm.setPaused(!(visible && onScreen));
    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener('visibilitychange', onVisibility);
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    sync();

    // the visitor's pointer, when it is over the hero, is the swarm's focus
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) swarm.clearPointer();
      else swarm.setPointer(x, y);
    };
    const onLeave = () => swarm.clearPointer();
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      ro.disconnect();
      swarm.destroy();
    };
  }, []);

  return <canvas ref={ref} className="hero-swarm" aria-hidden="true" />;
}
