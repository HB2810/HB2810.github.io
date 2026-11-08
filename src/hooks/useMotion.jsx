import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import site from '../config/site.js';

const MotionCtx = createContext({ on: true, toggle: () => {} });

function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStored() {
  try {
    const v = localStorage.getItem(site.storageKey);
    if (v === 'on') return true;
    if (v === 'off') return false;
  } catch {
    /* storage unavailable */
  }
  return null;
}

export function MotionProvider({ children }) {
  const [on, setOn] = useState(() => {
    const stored = readStored();
    return stored === null ? !prefersReduced() : stored;
  });

  useEffect(() => {
    document.documentElement.dataset.motion = on ? 'on' : 'off';
    try {
      localStorage.setItem(site.storageKey, on ? 'on' : 'off');
    } catch {
      /* ignore */
    }
  }, [on]);

  const value = useMemo(() => ({ on, toggle: () => setOn((v) => !v) }), [on]);
  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}

export function useMotion() {
  return useContext(MotionCtx);
}

export const EASE = [0.22, 1, 0.36, 1];

const intensity = { subtle: 0.6, balanced: 1, expressive: 1.4 }[site.appearance.animationIntensity] ?? 1;

export const revealVariants = {
  hidden: { opacity: 0, y: 32 * intensity },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};
