import React from 'react';
import { motion } from 'framer-motion';
import { useMotion, revealVariants } from '../hooks/useMotion.jsx';

/**
 * Scroll-reveal wrapper. Renders a plain element when motion is off so the
 * page is fully usable without animation.
 */
export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const { on } = useMotion();
  const Tag = as;
  if (!on) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }
  const M = motion[as] ?? motion.div;
  return (
    <M
      className={`reveal-wrap ${className}`.trim()}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      custom={delay}
      {...rest}
    >
      {children}
    </M>
  );
}
