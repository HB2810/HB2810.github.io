import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import site from '../config/site.js';
import { experience, education, awards } from '../data/experience.js';
import { pad } from '../lib/utils.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import Reveal from './Reveal.jsx';

export default function Journey() {
  const { on } = useMotion();
  const { preferences } = site;
  const items = [
    ...(preferences.showExperience ? experience : []),
    ...(preferences.showEducation ? education : []),
  ];
  const [openId, setOpenId] = useState(items[0]?.id ?? null);
  const showAwards = preferences.showAwards && awards.length > 0;

  if (!items.length && !showAwards) return null;

  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="kicker">
              <span className="num">03</span> / The journey
            </p>
            <h2 id="journey-title" className="section-title display">
              Keep learning. <span className="accent-dot">Keep shipping</span>
            </h2>
          </div>
          <p className="section-aside kicker">Experience &amp; milestones</p>
        </Reveal>

        <div className="journey-grid">
          {items.length > 0 && (
            <Reveal className="timeline" as="ul" delay={0.05}>
              {items.map((it) => {
                const open = openId === it.id;
                const panelId = `tl-${it.id}`;
                return (
                  <li key={it.id} className="tl-item">
                    <button type="button" className="tl-head" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenId(open ? null : it.id)}>
                      <span className="period">{it.period}</span>
                      <span className="title">
                        {it.title}
                        <span className="org">{it.organization}</span>
                      </span>
                      <span className="tog" aria-hidden="true">
                        {open ? <Minus /> : <Plus />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={panelId}
                          className="tl-body"
                          initial={on ? { height: 0, opacity: 0 } : false}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={on ? { height: 0, opacity: 0 } : undefined}
                          transition={{ duration: 0.45, ease: EASE }}
                        >
                          <p>{it.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </Reveal>
          )}

          {showAwards && (
            <Reveal className="milestones" delay={0.1}>
              <p className="kicker">A few milestones</p>
              <h3 className="display">
                Recognised.
                <br />
                <span className="accent">Published.</span>
              </h3>
              <ol>
                {awards.map((a, i) => (
                  <li key={a.id}>
                    <span className="n">{pad(i + 1)}</span>
                    <div>
                      <b>{a.title}</b>
                      <span>{a.meta}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
