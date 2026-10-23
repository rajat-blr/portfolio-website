# Rajat Varma portfolio

A static React portfolio built with Vite. It has no server or paid service dependencies and can deploy on Vercel's free tier.

## Pages

- `/` — homepage, experience, featured work, writing, and contact
- `/work/incidentlab/` — IncidentLab case study
- `/work/agent-workbench/` — Agent Workbench case study
- `/work/juniper/` — Juniper voice appointment receptionist case study
- `/writing/` — article index
- `/writing/why-an-ai-agent-should-not-verify-its-own-repair/`
- `/writing/designing-an-evidence-backed-incident-workflow/`

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
SITE_URL=https://your-domain.example npm run build
```

The build pre-renders every route, so content is available to crawlers without JavaScript. `SITE_URL` is used for canonical, Open Graph, robots, and sitemap URLs. On Vercel it falls back to the production URL exposed by Vercel's system environment variables.

## Deploy on Vercel

Import this folder as a Vercel project. Vercel should detect Vite automatically. The build command is `npm run build` and the output directory is `dist`. Set `SITE_URL` to the canonical public URL when using a custom domain.

## Résumé

The downloadable résumé is stored at `public/Rajat_Varma_Resume.pdf` and linked from the homepage hero and contact section. Replace that file to update the résumé.

## Project media and analytics

Optimized WebP screenshots live in `public/images/incidentlab/`, `public/images/workbench3/`, and `public/images/juniper/`. The slideshow advances every 6.5 seconds, pauses while hovered or focused, and supports labelled arrows and slide dots. Automatic advance is disabled when a visitor prefers reduced motion.

Vercel Analytics records only career-relevant actions: `resume_downloaded`, `email_clicked`, `linkedin_clicked`, `twitter_clicked`, `demo_launched`, `github_opened`, `case_study_opened`, and `case_study_completed`.

Pages, links, and routes are in `src/main.jsx`; article text is in `src/articles.js`. Shared styles are in `src/styles.css`, reading layouts in `src/reading.css`, and the project carousel in `src/projects.css`. Route metadata and structured data are in `scripts/prerender.mjs`.
