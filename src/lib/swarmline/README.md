# swarmline (hero cursor swarm)

A small, dependency-free canvas effect: coloured pointer arrows flock around the
visitor's pointer (or a drifting point) behind the hero. Mounted by
`src/components/Swarm.jsx` only while the header **Motion** toggle is on and
`prefers-reduced-motion` is not set.

## Provenance

This is an **original implementation** written for this site on 2026-11-08.
It takes its *idea* (a swarm of multiplayer-style cursors) from
[Swarmline](https://github.com/imperfec-t/swarmline), which credits
[Swarm Rebuild](https://github.com/DhvanilPatel/swarm-cursors) by Dhvanil Patel and
[Swarm](https://califa.github.io/swarm-site/) by Joel Califa.
**No code, constants, paths or structure were copied from any of them.**

Swarmline's script was reviewed and deliberately not vendored:

- it is a whole-page takeover (hides the page, blocks clicks, captures keys and scroll,
  plays audio), not a background effect, so it cannot meet this site's
  "purely decorative, never blocks input" requirement; and
- the only parts a decorative layer would want (cursor motion and flocking) are carved
  out of Swarmline's MIT grant and come from two upstream repositories that carry no
  license at all.

The full review is in `SECURITY-REVIEW.md` next to this file.

## Guarantees

- No network, storage, globals or DOM reads other than its own canvas.
- The canvas is `aria-hidden` with `pointer-events: none`; it never captures input.
- No keyboard listeners. One passive `pointermove` listener on `window` (in `Swarm.jsx`)
  supplies the focus point; touch pointers are ignored.
- Paused when the tab is hidden or the hero is scrolled out of view.
- Not mounted at all when Motion is off or `prefers-reduced-motion: reduce` matches.
