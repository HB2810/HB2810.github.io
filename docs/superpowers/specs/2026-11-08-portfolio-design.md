# Het Bhatt Portfolio — Design Spec (2026-11-08)

Source brief: `Website_portfolio_details.md` (universal premium portfolio builder), with
https://touquirakhtar.com/ as the visual reference only. This file records the filled-in
configuration and the decisions taken so the build can be reproduced or changed later.

## Configuration (section 0 of the brief, filled in)

| Key | Value | Source |
| --- | --- | --- |
| referenceWebsite | https://touquirakhtar.com/ | brief |
| websiteUrl | https://hb2810.github.io/ | existing `package.json` homepage |
| fullName / displayName | Het Bhatt / HET | existing site |
| profession / roleLine2 | AI / ML Engineer · Computer Vision · AI Officer | user (2026-11-08) |
| location | Ahmedabad, India | existing site |
| headline / intro | "Making machines see, learn, and reason." + GitHub bio | GitHub profile |
| portrait | chroma-keyed cut-out of `public/profile.jpg` → `assets/portrait.webp` | existing site |
| resume | `assets/Het-Bhatt-Resume.pdf` | existing site |
| contact | hetbhatt10@gmail.com, +91 97142 34634, LinkedIn, GitHub | existing site, resume |
| projects | Deepfake Detection, Gujarati Caption Generator, ResolveIT, Plant Disease Detection, Virtual Piano | existing site, GitHub |
| experience | AI Officer @ Stavya Spine Hospital (2026–now), Research Intern @ SAC-ISRO (May–Jul 2024) | user, resume |
| education | B.E. IT, LDRP-ITR KSV University, 2022–2026, CGPA 7.28 | resume |
| awards | Mission CHANDRA 1st runner-up, SIH/SSIP team lead, ICDSA 2025 Springer paper | resume |
| metrics | 91% accuracy, 1 Springer paper, 20 public repos | resume, GitHub API (2026-11-08) |
| appearance | default tokens from brief (#090909 / #f2efeb / #e32b3c / #a09c9a, Anton / Manrope / Caveat) | brief |

Hidden (no verified data): WhatsApp, Instagram, YouTube, client logos, testimonials,
before/after. Chakshya is left as a commented template in `src/data/projects.js` because
its description was still a placeholder.

## Observed on the reference (desktop, 2026-11-08)

Sticky header with wordmark, four anchors, "Motion on" toggle and a "Let's talk" pill.
Hero: profession lines top-left, availability top-right, giant accent-red "PORTFOLIO"
wordmark with a cut-out portrait overlapping it, then "Hello, I'm NAME." + role, intro,
CTA, location on the left and a handwritten quote + three large stats on the right; a
bottom strip with "view featured", "scroll to discover" and "selected work / years".
Sections are numbered 01–04: Selected Work (filter tabs, search, 3-col cards with
category tag, number, title, "CATEGORY / YEAR"), Behind the Craft (bio, expertise,
education, toolkit chips, 5-step process, red quote panel), The Journey (accordion
timeline + numbered milestones), Your Next Project (contact list + CTA + form row).
Footer: wordmark, copyright line, social icons.

## Decisions

- Vite + React 19 + Framer Motion 12 + lucide-react, vanilla CSS with tokens. Vite kept
  because the existing deploy pipeline is `vite build` + `gh-pages`.
- All personal content in `src/config/site.js`, `src/data/projects.js`,
  `src/data/experience.js`. Components never hard-code the owner.
- Project covers: generated abstract SVG per project until real screenshots are added.
- Motion toggle in the header persists under `hb-portfolio-motion`; `prefers-reduced-motion`
  sets the default. Motion off disables Framer and CSS transitions.
- Contact form is a `mailto:` composer (static site, no backend).
- Swarmline / "Swarm Rebuild" code is **not** vendored (unlicensed upstream, see
  `docs/swarmline-security-review.md`). An original rebuild effect lives in
  `src/lib/rebuild/engine.js`, started from the header "Rebuild" button, gated by Motion.
- 2026-11-08: role at Stavya Spine Hospital changed from IT Executive to AI Officer
  (multi-role: AI-driven digital transformation of operations, AI research, AI apps).
- 2026-11-08: user confirmed they have graduated (B.E. IT, class of 2026) and are a working
  professional; bio and education copy no longer say "student" or "graduating".
- `npm run check` validates the config for placeholders and broken links, then builds.
