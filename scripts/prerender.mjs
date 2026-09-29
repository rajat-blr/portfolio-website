import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(root, 'dist')
const serverBuild = resolve(root, '.prerender')
const htmlPath = resolve(outputDirectory, 'index.html')

const normalizeUrl = (value) => {
  if (!value) return null
  const url = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
  return url.replace(/\/$/, '')
}

const siteUrl = normalizeUrl(
  process.env.SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  process.env.VITE_VERCEL_URL,
)

const { render } = await import(pathToFileURL(resolve(serverBuild, 'entry-server.js')).href)
const appHtml = render()
let html = await readFile(htmlPath, 'utf8')

html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

if (siteUrl) {
  const socialImage = `${siteUrl}/images/ppf.png`
  const socialMetadata = `
    <link rel="canonical" href="${siteUrl}/" />
    <meta property="og:url" content="${siteUrl}/" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:width" content="1254" />
    <meta property="og:image:height" content="1254" />
    <meta property="og:image:alt" content="Portrait of Rajat Varma" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Rajat Varma — Senior Software Engineer" />
    <meta name="twitter:description" content="Senior software engineer building full-stack products, agentic AI, LLMOps, and observability systems." />
    <meta name="twitter:image" content="${socialImage}" />`

  html = html.replace('    <meta property="og:type" content="website" />', `    <meta property="og:type" content="website" />${socialMetadata}`)

  await writeFile(resolve(outputDirectory, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  await writeFile(resolve(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`)
} else {
  console.warn('SITE_URL was not available; canonical, social-image, robots, and sitemap URLs were omitted.')
}

await writeFile(htmlPath, html)
await rm(serverBuild, { recursive: true, force: true })

console.log(`Pre-rendered ${htmlPath}${siteUrl ? ` for ${siteUrl}` : ''}`)
