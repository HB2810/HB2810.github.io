import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import site from '../config/site.js';
import { createRebuild } from '../lib/rebuild/engine.js';
import { useRebuild } from '../hooks/useRebuild.jsx';
import { useMotion } from '../hooks/useMotion.jsx';

/**
 * Canvas overlay + floating controls for the page rebuild effect.
 * Mounted once in App; started from the header "Rebuild" button.
 */
export default function Rebuild() {
  const rb = useRebuild();
  const { on } = useMotion();
  const canvasRef = useRef(null);
  const speedRef = useRef(rb.speed);
  const tourRef = useRef(rb.tour);
  speedRef.current = rb.speed;
  tourRef.current = rb.tour;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const names = (site.tools.length ? site.tools : ['builder']).slice(0, 6).map((t) => t.toLowerCase().replace(/\s*\(.*\)/, ''));
    const engine = createRebuild({
      canvas,
      root: document.getElementById('main')?.parentElement ?? document.body,
      cursorCount: 5,
      names,
      getSpeed: () => speedRef.current,
      getTour: () => tourRef.current,
      onProgress: (done, total) => rb.setProgress({ done, total }),
      onDone: () => rb.setRunning(false),
    });
    rb.engine.current = engine;
    return () => {
      engine.stop(false);
      rb.engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-start on page load (once per visit), unless the visitor opted out of motion.
  const autoRan = useRef(false);
  useEffect(() => {
    const cfg = site.rebuild || {};
    if (!cfg.autoStart || autoRan.current || !on) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let timer = 0;
    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled || autoRan.current) return;
        autoRan.current = true;
        rb.setSpeed([1, 2, 3].includes(cfg.autoSpeed) ? cfg.autoSpeed : 1);
        rb.setTour(Boolean(cfg.autoTour));
        rb.start();
      }, cfg.autoDelay ?? 350);
    };
    const ready = document.fonts?.ready ?? Promise.resolve();
    if (document.readyState === 'complete') ready.then(go);
    else window.addEventListener('load', () => ready.then(go), { once: true });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  // Motion switched off mid-build: finish immediately.
  useEffect(() => {
    if (!on && rb.running) rb.stop();
  }, [on, rb]);

  // Escape cancels the build.
  useEffect(() => {
    if (!rb.running) return undefined;
    const onKey = (e) => e.key === 'Escape' && rb.stop();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rb]);

  return (
    <>
      <canvas ref={canvasRef} className={`rb-canvas ${rb.running ? 'active' : ''}`} aria-hidden="true" />
      {rb.running && (
        <div className="rb-ui" role="status" aria-live="polite">
          <span className="rb-progress">
            Rebuilding <b>{rb.progress.done}</b> / {rb.progress.total}
          </span>
          <span className="rb-speeds" role="group" aria-label="Build speed">
            {[1, 2, 3].map((s) => (
              <button key={s} type="button" aria-pressed={rb.speed === s} onClick={() => rb.setSpeed(s)}>
                {s}×
              </button>
            ))}
          </span>
          <button type="button" className="rb-tour" aria-pressed={rb.tour} onClick={() => rb.setTour((v) => !v)}>
            Tour
          </button>
          <button type="button" className="rb-skip" onClick={rb.stop} aria-label="Skip rebuild">
            Skip <X />
          </button>
        </div>
      )}
    </>
  );
}
