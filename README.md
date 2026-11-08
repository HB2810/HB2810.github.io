# Het Bhatt — Portfolio

Premium single-page portfolio built with React 19, Vite, Framer Motion 12 and vanilla CSS.
Design direction follows the brief in `Website_portfolio_details.md` (reference: touquirakhtar.com)
and is documented in `docs/superpowers/specs/2026-11-08-portfolio-design.md`.

## Commands

```bash
npm install        # once
npm run dev        # local dev server (http://localhost:5173/HB-Portfolio/)
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

### Changing the deploy path

`vite.config.js` sets `base: '/HB-Portfolio/'` for GitHub Pages. For a custom domain or a
root deploy change it to `'/'` and update `websiteUrl` in `src/config/site.js`.

## Accessibility & motion

- Skip link, semantic landmarks, one `h1`, labelled controls, visible focus rings, 44 px targets.
- The header **Motion** toggle turns all non-essential animation off and persists the choice
  under the `hb-portfolio-motion` storage key. `prefers-reduced-motion` sets the default.
- Project dialog: Escape / backdrop / close button, focus trapped inside, focus returned on close.

## Contact form

The form is a `mailto:` composer. It validates input, then opens the visitor's email app with the
message pre-filled. Nothing is sent from the page itself (static site, no backend).
