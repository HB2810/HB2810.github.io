import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import site from '../config/site.js';
import projects from '../data/projects.js';
import { pad } from '../lib/utils.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import Reveal from './Reveal.jsx';
import ProjectCover from './ProjectCover.jsx';

const PAGE = 6;

export default function ProjectGrid({ onOpen }) {
  const { on } = useMotion();
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], []);

  const ordered = useMemo(() => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordered.filter((p) => {
      if (filter !== 'All' && p.category !== filter) return false;
      if (!q) return true;
      const hay = [p.title, p.category, p.summary, p.year, ...(p.tools ?? [])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [ordered, filter, query]);

  const shown = visible.slice(0, limit);

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="kicker">
              <span className="num">01</span> / Selected work
            </p>
            <h2 id="work-title" className="section-title display">
              <span className="accent-dot">Work that speaks</span>
            </h2>
          </div>
          <p className="section-aside kicker">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </p>
        </Reveal>

        <Reveal className="filters" delay={0.1}>
          <LayoutGroup id="filters">
            <div className="tabs" role="tablist" aria-label="Filter projects by category">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={filter === c}
                  onClick={() => {
                    setFilter(c);
                    setLimit(PAGE);
                  }}
                >
                  {c}
                  {filter === c && (on ? <motion.span layoutId="tab-underline" className="underline" transition={{ duration: 0.4, ease: EASE }} /> : <span className="underline" />)}
                </button>
              ))}
            </div>
          </LayoutGroup>
          <label className="search">
            <Search aria-hidden="true" />
            <span className="visually-hidden">Search projects</span>
            <input
              type="search"
              placeholder="Search title, tool or year…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE);
              }}
            />
          </label>
        </Reveal>

        {shown.length === 0 ? (
          <div className="empty" role="status">
            <b>Nothing matches yet.</b>
            {projects.length === 0 ? 'Projects will appear here once added to src/data/projects.js.' : 'Try another category or clear the search.'}
          </div>
        ) : (
          <ul className="grid" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((p, i) => {
                const index = ordered.indexOf(p) + 1;
                const card = (
                  <button type="button" className="card" onClick={() => onOpen(p)} aria-label={`Open ${p.title}`}>
                    <span className="cover">
                      <ProjectCover project={p} />
                      <span className="tag">{p.category}</span>
                      {p.highlight && <span className="tag hl">{p.highlight}</span>}
                      <span className="open" aria-hidden="true">
                        <ArrowUpRight />
                      </span>
                    </span>
                    <span className="body">
                      <span className="num">{pad(index)}</span>
                      <span>
                        <span className="title">{p.title}</span>
                        <span className="meta">
                          {p.category}
                          {p.year && ` / ${p.year}`}
                        </span>
                        <span className="summary">{p.summary}</span>
                      </span>
                    </span>
                  </button>
                );
                return on ? (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    {card}
                  </motion.li>
                ) : (
                  <li key={p.id}>{card}</li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        {visible.length > limit && (
          <div className="grid-foot">
            <button type="button" className="btn" onClick={() => setLimit((l) => l + PAGE)}>
              Load more ({visible.length - limit} remaining)
            </button>
          </div>
        )}

        {site.tools.length > 0 && (
          <Reveal className="tools-strip">
            <div>
              <p className="kicker">Built with</p>
              <h3 className="display">
                The tools I <span className="accent">trust.</span>
              </h3>
            </div>
            <ul className="chip-row" aria-label="Tools">
              {site.tools.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
