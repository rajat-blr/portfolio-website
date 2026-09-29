# Rajat Varma portfolio

A static React portfolio built with Vite. It has no server or paid service dependencies and can deploy on Vercel's free tier.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
SITE_URL=https://your-domain.example npm run build
```

The build pre-renders the React homepage into `dist/index.html`, so its content is available to crawlers without JavaScript. `SITE_URL` is used for canonical, Open Graph, robots, and sitemap URLs. On Vercel it falls back to the production URL exposed by Vercel's system environment variables, so an explicit value is only needed when using a custom domain or building elsewhere.

## Deploy on Vercel

Import this folder as a Vercel project. Vercel should detect Vite automatically. The build command is `npm run build` and the output directory is `dist`. Set `SITE_URL` to the canonical public URL when using a custom domain.

## Project media

The three screenshots in `public/images/` appear in the featured project's slideshow. The slides and their captions are configured in the `screenshots` array in `src/main.jsx`. The slideshow advances every 6.5 seconds, pauses while hovered or focused, and supports arrows and slide dots. Automatic advance is disabled when a visitor prefers reduced motion.

The hero portrait uses `public/images/ppf.png`.

The content and links are in `src/main.jsx`; colors and layout are in `src/styles.css`.
