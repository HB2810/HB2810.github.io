import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, MapPin, Play } from 'lucide-react';
import site from '../config/site.js';
import projects from '../data/projects.js';
import { asset } from '../lib/utils.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import Magnetic from './Magnetic.jsx';

const fade = (on, delay) => (on ? { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } } : {});

export default function Hero({ onOpenProject }) {
  const { on } = useMotion();
  const { identity, contact, metrics, preferences } = site;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', on ? '18%' : '0%']);
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', on ? '-10%' : '0%']);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const years = projects.map((p) => Number(p.year)).filter(Boolean);
  const range = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';
  const hasPortrait = Boolean(identity.portrait);

  return (
    <section id="top" className="hero" ref={ref} aria-label="Introduction">
      <div className="container hero-top">
        <motion.p className="role" {...fade(on, 0)}>
          <span>{identity.profession}</span>
          {identity.roleLine2 && <span className="second">{identity.roleLine2}</span>}
        </motion.p>
        {identity.availability && (
          <motion.p className="availability" {...fade(on, 0.1)}>
            <span className="pulse" aria-hidden="true" />
            {identity.availability}
          </motion.p>
        )}
      </div>

      <div className="container">
        <div className={`hero-stage ${hasPortrait ? '' : 'typographic'}`}>
          <motion.div
            className={`hero-word display ${hasPortrait ? '' : 'no-portrait'}`}
            aria-hidden="true"
            style={{ y: wordY }}
            initial={on ? { opacity: 0, scale: 0.96 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            Portfolio
          </motion.div>
          {hasPortrait && (
            <motion.img
              className="hero-portrait"
              src={asset(identity.portrait)}
              srcSet={identity.portraitSmall ? `${asset(identity.portraitSmall)} 640w, ${asset(identity.portrait)} 1110w` : undefined}
              sizes="(max-width: 600px) 90vw, 60vw"
              width="1110"
              height="958"
              alt={identity.portraitAlt || identity.fullName}
              fetchPriority="high"
              decoding="async"
              style={{ x: '-50%', y: portraitY }}
              initial={on ? { opacity: 0, y: 40 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            />
          )}
        </div>
      </div>

      <div className="container hero-body">
        <div>
          <motion.p className="hero-greet hand" {...fade(on, 0.2)}>
            Hello, I&rsquo;m
          </motion.p>
          <motion.h1 className="hero-name display" {...fade(on, 0.28)}>
            <span className="accent-dot">{identity.displayName}</span>
          </motion.h1>
          <motion.p className="hero-role display" {...fade(on, 0.36)}>
            <b>{identity.profession}</b>
            {identity.roleLine2 && (
              <>
                <br />
                {identity.roleLine2}
              </>
            )}
          </motion.p>
          <motion.p className="hero-headline" {...fade(on, 0.44)}>
            {identity.headline}
          </motion.p>
          <motion.p className="hero-intro" {...fade(on, 0.5)}>
            {identity.intro}
          </motion.p>
          <motion.div className="hero-cta" {...fade(on, 0.58)}>
            <Magnetic>
              <a href="#work" className="btn btn-primary">
                View work <ArrowRight />
              </a>
            </Magnetic>
            <a href="#contact" className="btn">
              Contact
            </a>
            {preferences.showDownloadResume && identity.resume && (
              <a href={asset(identity.resume)} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                <span className="ico">
                  <Download />
                </span>
                Resume
              </a>
            )}
          </motion.div>
          {identity.location && (
            <motion.p className="hero-loc" {...fade(on, 0.64)}>
              <MapPin /> {identity.location}
            </motion.p>
          )}
        </div>

        <motion.aside className="hero-side" {...fade(on, 0.5)} aria-label="Highlights">
          {identity.quote && (
            <p className="hand">
              <span className="star" aria-hidden="true">
                ✳{' '}
              </span>
              {identity.quote}
            </p>
          )}
          {metrics.length > 0 && (
            <ul>
              {metrics.map((m) => (
                <li className="metric" key={m.label}>
                  <span className="val">{m.value}</span>
                  <span className="lab">{m.label}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.aside>
      </div>

      <div className="container">
        <div className="hero-foot">
          {featured ? (
            <button type="button" className="featured-link" onClick={() => onOpenProject(featured)}>
              <span className="play" aria-hidden="true">
                <Play />
              </span>
              View featured project <span className="cat">{featured.category}</span>
            </button>
          ) : (
            <span />
          )}
          <span className="scroll-hint">
            Scroll to discover <i aria-hidden="true" />
          </span>
          <span className="right">
            Selected work {range && `/ ${range}`}
            {contact.githubHandle && ` · @${contact.githubHandle}`}
          </span>
        </div>
      </div>
    </section>
  );
}
