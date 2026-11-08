# Het Bhatt — Portfolio

Premium single-page portfolio built with React 19, Vite, Framer Motion 12 and vanilla CSS.
Design direction follows the brief in `Website_portfolio_details.md` (reference: touquirakhtar.com)
and is documented in `docs/superpowers/specs/2026-11-08-portfolio-design.md`.

## Commands

```bash
npm install        # once
npm run dev        # local dev server (http://localhost:5173/)
npm run check      # validates content (no placeholders / broken links) then builds
npm run build      # production build → dist/
npm run preview    # serve the production build locally
npm run deploy     # build and publish dist/ to the gh-pages branch
```

## Where to edit your details

| What | File |
| --- | --- |
| Name, roles, headline, bio, location, contact links, metrics, skills, tools, process, colours, fonts, section toggles | `src/config/site.js` |
| Projects (title, description, stack, links, cover image) | `src/data/projects.js` |
| Experience, education, awards | `src/data/experience.js` |
| Portrait, résumé, project screenshots | `public/assets/` |
| Favicon | `public/favicon.svg` |

Components never hard-code personal information; everything is read from those files.
Leave any string empty (`""`) or set a `preferences.show…` flag to `false` to hide its UI.

### Adding a project screenshot

1. Export a landscape image (ideally 1600×1200 WebP) to `public/assets/projects/`.
2. Set `cover: 'assets/projects/your-file.webp'` on that project in `src/data/projects.js`.
   Until then the site renders an abstract generated cover for that project.

### Deploying elsewhere (Vercel, Netlify, custom domain)

`vite.config.js` defaults to `base: '/'` (the site is a GitHub Pages user site at the root). On a host that serves
from a sub-path, set the environment variable `VITE_BASE=/sub-path/` in that host's project settings
(build command `npm run build`, output directory `dist`) and update `websiteUrl` in
`src/config/site.js` to the final address so canonical and Open Graph tags are right.

## Rebuild effect

The header **Rebuild** button wipes the page blank and a swarm of named cursors rebuilds it:
boxes are dragged out with a crosshair and size badge, text is wiped in behind a caret,
section headings get a ruler guide, the swarm works nearest to where you have scrolled, and
the floating bar offers 1×/2×/3× speed, a **Tour** auto-scroll and **Skip**. It is an original
implementation in `src/lib/rebuild/engine.js` and only runs while Motion is on. By default it
also plays automatically on every visit (`rebuild.autoStart` in `src/config/site.js`, with
`autoSpeed`, `autoTour` and `autoDelay`); visitors with reduced motion or Motion off never see it. The review of the upstream "Swarm Rebuild" code it was inspired by is in
`docs/swarmline-security-review.md`.

## Accessibility & motion

- Skip link, semantic landmarks, one `h1`, labelled controls, visible focus rings, 44 px targets.
- The header **Motion** toggle turns all non-essential animation off and persists the choice
  under the `hb-portfolio-motion` storage key. `prefers-reduced-motion` sets the default.
- Project dialog: Escape / backdrop / close button, focus trapped inside, focus returned on close.

## Contact form

The form is a `mailto:` composer. It validates input, then opens the visitor's email app with the
message pre-filled. Nothing is sent from the page itself (static site, no backend).
