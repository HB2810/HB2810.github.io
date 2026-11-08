import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ArrowUpRight, Wand2 } from 'lucide-react';
import site from '../config/site.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import { useRebuild } from '../hooks/useRebuild.jsx';

export default function Header({ sections, active }) {
  const { on, toggle } = useMotion();
  const rebuild = useRebuild();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('no-scroll');
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const { displayName } = site.identity;

  const links = sections.map((s) => (
    <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''} aria-current={active === s.id ? 'location' : undefined} onClick={() => setOpen(false)}>
      {s.label}
    </a>
  ));

  return (
    <>
      {on && <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />}
      <header className={`header ${scrolled || open ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#top" className="wordmark" aria-label={`${site.identity.fullName}, back to top`}>
            {displayName}
            <span className="dot" aria-hidden="true" />
          </a>

          <nav className="nav" aria-label="Primary">
            {links}
          </nav>

          <div className="header-actions">
            {on && rebuild && (
              <button
                type="button"
                className="rebuild-btn"
                onClick={() => {
                  setOpen(false);
                  rebuild.start();
                }}
                disabled={rebuild.running}
                title="Wipe the page and watch a cursor swarm rebuild it"
              >
                <Wand2 aria-hidden="true" />
                <span>Rebuild</span>
              </button>
            )}
            <button type="button" className="motion-toggle" aria-pressed={on} onClick={toggle} title="Toggle animations">
              <span className="sw" aria-hidden="true" />
              <span>Motion {on ? 'on' : 'off'}</span>
            </button>
            <a href="#contact" className="btn btn-talk">
              Let&rsquo;s talk <ArrowUpRight />
            </a>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile"
            initial={on ? { opacity: 0, y: -16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={on ? { opacity: 0, y: -16 } : undefined}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {links}
            <div className="mobile-foot">
              <a href="#contact" className="btn btn-primary" onClick={() => setOpen(false)}>
                Let&rsquo;s talk <ArrowUpRight />
              </a>
              <span className="kicker">{site.identity.location}</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
