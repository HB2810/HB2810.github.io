# Swarmline security and license review

Reviewed 2026-11-08 for the Het Bhatt portfolio (`personal_software/portfolio`).
Source: https://github.com/imperfec-t/swarmline, commit `d498935` ("Version 1.0.1", 2026-11-07).
Read in full: `extension/swarmline.js` (3,785 lines, 151 KB), `extension/background.js`, `extension/manifest.json`, `LICENSE`, `NOTICE.md`, `PRIVACY.md`, `README.md`, `package.json`. The repo has no submodules and no install hooks.

## Verdict

**Do not vendor or inject `swarmline.js`.** Nothing in it is malicious, but it is the wrong kind of thing for this site, and the parts that would be useful are not licensed to us.

An original, dependency-free cursor-swarm engine was written instead (`src/lib/swarmline/swarm.js`), with no code copied from Swarmline, Swarm Rebuild or Swarm. See "What was built" below.

## 1. What the script is

Swarmline is a Chrome extension content script (Manifest V3, `activeTab` + `scripting`). When injected it:

1. Appends a `<swarmline-layer>` host at `z-index: 2147483647` with a **closed** shadow root containing a full-viewport `<canvas>` (`pointer-events: auto`), a draggable toolbar ("HUD") and a toast.
2. Injects a stylesheet `html[data-swarmline] body *:not([data-swarmline-v]) { visibility: hidden !important }` so the **entire page disappears**, then rebuilds it element by element by toggling a marker attribute.
3. Walks the DOM (including open shadow roots) and records every box, text run, image, control and icon, measuring **per-character rects** for up to 9,000 characters.
4. Writes inline `!important` styles on the page's own elements: `clip-path`, `position`, `left`, `top`, `translate`, `scale`, `transform-origin`; clones elements as "ghosts" and inserts them into the DOM; runs `element.animate()` on them.
5. **Auto-scrolls the page** (`window.scrollTo` / scroller `scrollTo` every frame during the "tour").
6. Listens on `window` for `keydown` in the **capture phase** (Esc, T, F, H, M), `pointermove` (capture), `wheel`, `pointerdown` (capture), `resize`, `pagehide`; the canvas itself intercepts `wheel` with `preventDefault` when an inner scroller is used.
7. Creates an **AudioContext** on start and plays a synthesized soundtrack, on by default.
8. Reads the page's favicon (`link[rel=icon]` or `/favicon.ico`, same origin, `referrerPolicy="no-referrer"`) into an `<img>` for the HUD.
9. Exposes `window.__swarmline` (toggle/start/stop/app) and reads `window.__swarmSfxLog` if the page defines it (test hook).

The README is explicit: "The page can't be clicked while it's being built."

## 2. Security checklist

| Check | Result |
| --- | --- |
| Network requests (`fetch`, XHR, WebSocket, `sendBeacon`) | **None.** |
| Remote assets / remote code | **None** loaded by the script. The only `src` assignment is the current site's own favicon URL. No `http(s)://` strings in the script. |
| `eval`, `new Function`, dynamic `<script>` insertion, `import()` | **None.** |
| `innerHTML` | Used only for its own static HUD markup inside the closed shadow root and for its own toast strings. No page or user data is interpolated into HTML. |
| Storage / cookies (`localStorage`, `sessionStorage`, IndexedDB, `document.cookie`, `chrome.storage`) | **None.** Toolbar position is kept in a module-level object only. |
| `chrome.*` / `browser.*` APIs in the content script | **None** (only `background.js` uses `chrome.scripting` / `chrome.action`). |
| Obfuscation, encoded strings (`atob`, `\x..`, `fromCharCode`) | **None.** Code is readable and commented throughout. |
| Globals written | `window.__swarmline`. Reads `window.__swarmSfxLog` (test hook, harmless). |
| DOM mutation of the host page | **Extensive** (see §1 items 2, 4). Restored on exit or on any thrown error. |
| Input interception | **Yes**: full-viewport canvas with `pointer-events: auto` during the build, capture-phase `keydown` on `window`, `wheel` interception, programmatic scrolling. |
| Audio | **Yes**, on by default via Web Audio (no audio files). |
| Dependencies | None at runtime. Dev-only: eslint, puppeteer-core. |

Conclusion on safety: **not malicious, no exfiltration, no persistence.** It is, however, a page-takeover demo, not a background effect.

## 3. Why it cannot meet the integration brief

The brief requires the effect to be purely decorative: a canvas behind the hero, `aria-hidden`, no pointer capture over interactive elements, never blocking keyboard navigation, paused when the tab is hidden, honouring the Motion toggle and `prefers-reduced-motion`.

Swarmline's design contradicts every one of those:

- It hides the whole page and blocks all clicks while it runs (requirement: decorative, non-blocking).
- It captures keyboard shortcuts on `window` (Esc, T, F, H, M) in the capture phase (requirement: never blocks keyboard navigation).
- It scrolls the page itself (hostile to `useActiveSection`, the Framer `useScroll` progress bar and the hero parallax).
- It rewrites inline styles on React-rendered elements with `!important` and inserts cloned nodes beside them. React and Framer Motion own those elements' `style` attributes; a re-render mid-build would either undo Swarmline's clip or fight it. Swarmline assumes a static page.
- It plays sound by default.
- With `prefers-reduced-motion` it still runs (at 3x with fewer cursors) rather than not mounting.
- It has no pause-on-hidden-tab; it relies on `requestAnimationFrame` throttling and `pagehide`.

Stripping all of that leaves only the cursor flocking and cursor glyph drawing, which brings us to licensing.

## 4. License

- `LICENSE` is MIT **"for Swarmline's own code"** and states that the parts adapted from Swarm Rebuild (Dhvanil Patel) and Swarm (Joel Califa) "are used with their authors' permission and remain theirs."
- `NOTICE.md` lists exactly which parts those are: **how a cursor moves** (timing, easing, bend, tempo, spare cursors wandering/leaving/returning), **the boids orbit (`follow()`)**, the build gestures, the drawing layer (rulers, guides) and the structure of the sound engine.
- Upstream **Swarm Rebuild** (https://github.com/DhvanilPatel/swarm-cursors, cloned 2026-11-08): **no LICENSE file**, no `license` field. Its README says "Large parts of the animation engine here are adapted directly from" Joel Califa's site.
- Upstream **Swarm** (https://github.com/califa/swarm-site, cloned 2026-11-08): **no LICENSE file**.

So the only code that is licensed to third parties under MIT is Swarmline's page scanner, HUD, sound design and cursor glyph paths. The cursor motion and flocking, which is the only part a decorative hero layer would want, is "all rights reserved" by default through two unlicensed upstreams, and the permission Swarmline's author obtained does not transfer to us. **Vendoring that code would be a license violation.**

## 5. What was built instead

`src/lib/swarmline/swarm.js` is an original implementation written for this site on 2026-11-08: a small Reynolds-style flocking loop (orbit a focus point, separate, align, avoid the real pointer, occasional wander) drawing an original pointer-arrow glyph on a 2D canvas. No lines, constants, paths or structure were copied from any of the three repositories; the folder README credits them as design inspiration only. `src/components/Swarm.jsx` mounts it behind the hero only while the Motion toggle is on and `prefers-reduced-motion` is not set, with `aria-hidden`, `pointer-events: none`, no keyboard listeners, a passive `pointermove` listener for the focus point, and pausing on `visibilitychange` and when the hero is off screen.

If the owner specifically wants Swarmline's full "watch the page build itself" experience, the correct route is the Chrome extension itself, run by the visitor, not a script on the site.
