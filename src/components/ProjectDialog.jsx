import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { GithubIcon } from './Icons.jsx';
import { asset, youtubeId, externalProps } from '../lib/utils.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import ProjectCover from './ProjectCover.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])';

function Dialog({ project, onClose }) {
  const { on } = useMotion();
  const box = useRef(null);
  const closeBtn = useRef(null);
  const [playVideo, setPlayVideo] = useState(false);
  const ytId = youtubeId(project.videoUrl);

  useEffect(() => {
    const opener = document.activeElement;
    document.body.classList.add('no-scroll');
    closeBtn.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !box.current) return;
      const items = Array.from(box.current.querySelectorAll(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [onClose]);

  const anim = on
    ? {
        initial: { opacity: 0, y: 28, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.45, ease: EASE },
      }
    : {};

  return (
    <motion.div
      className="backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      initial={on ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={on ? { opacity: 0 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <motion.div ref={box} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" {...anim}>
        <div className="dialog-cover">
          <button ref={closeBtn} type="button" className="dialog-close" onClick={onClose} aria-label="Close project details">
            <X />
          </button>
          {ytId && playVideo ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
              title={`${project.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : ytId ? (
            <button type="button" className="video-poster" onClick={() => setPlayVideo(true)} aria-label={`Play ${project.title} video`}>
              <ProjectCover project={project} big />
              <span className="play" style={{ position: 'absolute' }}>
                <Play />
              </span>
            </button>
          ) : (
            <ProjectCover project={project} big />
          )}
        </div>

        <div className="dialog-body">
          <div>
            <p className="kicker">
              {project.category}
              {project.year && ` / ${project.year}`}
            </p>
            <h2 id="dlg-title" className="display">
              {project.title}
            </h2>
            <p className="desc">{project.description || project.summary}</p>
            {project.gallery?.length > 0 && (
              <div className="gallery">
                {project.gallery.map((g, i) => (
                  <img key={g} src={asset(g)} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" decoding="async" width="400" height="300" />
                ))}
              </div>
            )}
          </div>

          <aside className="dialog-aside">
            {project.role && (
              <div>
                <h3>Role</h3>
                <p>{project.role}</p>
              </div>
            )}
            {project.highlight && (
              <div>
                <h3>Outcome</h3>
                <p>{project.highlight}</p>
              </div>
            )}
            {project.tools?.length > 0 && (
              <div>
                <h3>Stack</h3>
                <ul className="chip-row">
                  {project.tools.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(project.liveUrl || project.sourceUrl) && (
              <div>
                <h3>Links</h3>
                <div className="dialog-links">
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="btn btn-primary" {...externalProps}>
                      Live demo <ExternalLink />
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a href={project.sourceUrl} className="btn" {...externalProps}>
                      <GithubIcon width={16} height={16} /> Source
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectDialog({ project, onClose }) {
  return <AnimatePresence>{project && <Dialog key={project.id} project={project} onClose={onClose} />}</AnimatePresence>;
}
