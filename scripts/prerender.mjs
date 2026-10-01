import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const serverBuild = resolve(root, '.prerender')
const template = await readFile(resolve(dist, 'index.html'), 'utf8')
const normalize = (value) => value ? (value.startsWith('http') ? value : `https://${value}`).replace(/\/$/, '') : null
const siteUrl = normalize(process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL) || 'https://rajat-portfolio-iota.vercel.app'
const { render } = await import(pathToFileURL(resolve(serverBuild, 'entry-server.js')).href)
const pages = [
  { path: '/', title: 'Rajat Varma — Senior Software Engineer', description: 'Senior software engineer at Microsoft, previously at Flipkart, building reliable AI infrastructure, backend systems, observability and developer tooling.', type: 'profile' },
  { path: '/work/incidentlab/', title: 'IncidentLab case study — Rajat Varma', description: 'How IncidentLab separates evidence, human approval, repair policy and independent sandbox verification in an AI-assisted incident workflow.', type: 'article' },
  { path: '/work/agent-workbench/', title: 'Agent Workbench case study — Rajat Varma', description: 'A local-first desktop workspace for persistent Codex conversations, codebase maps, per-run diffs and explicit accept or revert controls.', type: 'article' },
  { path: '/writing/', title: 'Writing — Rajat Varma', description: 'Practical writing about reliable AI systems, independent verification, evidence-backed incident response and developer tooling.', type: 'website' },
  { path: '/writing/why-an-ai-agent-should-not-verify-its-own-repair/', title: 'Why an AI agent should not verify its own repair', description: 'Why generation and verification need different authority, evidence and failure modes.', type: 'article' },
  { path: '/writing/designing-an-evidence-backed-incident-workflow/', title: 'Designing an evidence-backed incident investigation workflow', description: 'A practical architecture for evidence, citations, approval, fail-closed repair policy and independent verification.', type: 'article' },
]
const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Rajat Varma', jobTitle: 'Senior Software Engineer', worksFor: { '@type': 'Organization', name: 'Microsoft' }, sameAs: ['https://github.com/rajat-blr', 'https://www.linkedin.com/in/rajatvarma2709'], knowsAbout: ['Backend systems', 'AI agent infrastructure', 'Observability', 'Developer tooling'] }
const software = (name, url, category, operatingSystem) => ({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name, url, applicationCategory: category, operatingSystem, author: { '@type': 'Person', name: 'Rajat Varma' } })

for (const page of pages) {
  const canonical = `${siteUrl}${page.path}`
  const image = `${siteUrl}/images/og-card.png`
  const schema = page.path === '/' ? person : page.path.includes('incidentlab') ? software('IncidentLab', canonical, 'DeveloperApplication', 'Web, Docker') : page.path.includes('agent-workbench') ? software('Agent Workbench', canonical, 'DeveloperApplication', 'macOS') : { '@context': 'https://schema.org', '@type': 'Article', headline: page.title, author: { '@type': 'Person', name: 'Rajat Varma' }, url: canonical }
  const metadata = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:type" content="${page.type}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Rajat Varma — reliable AI and backend systems" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`
  let html = template
    .replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/\s*<meta property="og:(title|description|type)"[^>]*>/g, '')
    .replace('</head>', `${metadata}\n  </head>`)
  const out = page.path === '/' ? resolve(dist, 'index.html') : resolve(dist, page.path.slice(1), 'index.html')
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html)
}

await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${siteUrl}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`)
await rm(serverBuild, { recursive: true, force: true })
console.log(`Pre-rendered ${pages.length} routes for ${siteUrl}`)
