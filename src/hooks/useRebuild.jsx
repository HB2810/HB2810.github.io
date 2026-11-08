import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const RebuildCtx = createContext(null);

/** Shared state for the "Rebuild" page effect: the header button starts it, the overlay runs it. */
export function RebuildProvider({ children }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [speed, setSpeed] = useState(1);
  const [tour, setTour] = useState(false);
  const engine = useRef(null);

  const start = useCallback(() => {
    if (engine.current && !engine.current.isRunning()) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setProgress({ done: 0, total: 0 });
      setRunning(true);
      engine.current.start();
    }
  }, []);

  const stop = useCallback(() => engine.current?.stop(false), []);

  const value = useMemo(
    () => ({ running, setRunning, progress, setProgress, speed, setSpeed, tour, setTour, start, stop, engine }),
    [running, progress, speed, tour, start, stop],
  );
  return <RebuildCtx.Provider value={value}>{children}</RebuildCtx.Provider>;
}

export function useRebuild() {
  return useContext(RebuildCtx);
}
