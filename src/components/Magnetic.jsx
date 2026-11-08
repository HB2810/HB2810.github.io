import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMotion } from '../hooks/useMotion.jsx';

/**
 * Gentle magnetic pull toward the cursor on fine-pointer devices only.
 * Purely decorative: the wrapped control works identically without it.
 */
export default function Magnetic({ children, strength = 0.25 }) {
  const { on } = useMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  if (!on || !fine) return children;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      style={{ display: 'inline-block', x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
