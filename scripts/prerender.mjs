// Rendert jede Route beim Build zu statischem HTML (dist/<route>.html).
// So sehen Suchmaschinen und Link-Vorschauen den Inhalt ohne JavaScript,
// und GitHub Pages liefert die Unterseiten mit Status 200 statt über 404.html aus.
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { articleHead } from './news-head.mjs'

const SITE = 'https://dangulea.at'
const NAME = 'Claudiu Dangulea'
const routes = [
  { path: '/', title: NAME },
  { path: '/person', title: `Person · ${NAME}` },
  { path: '/projekte', title: `Projekte & Vorhaben · ${NAME}` },
  { path: '/news', title: `News · ${NAME}` },
  { path: '/aktuelle-themen', title: `Aktuelle Themen · ${NAME}` },
  { path: '/ressourcen', title: `Ressourcen · ${NAME}` },
  {
    path: '/ressourcen/wissensinfrastruktur',
    title: `Von Chat-Verläufen zur Wissensinfrastruktur · ${NAME}`,
    description: 'Visueller Forschungszwischenbericht über meine 3.173 eigenen ChatGPT-Unterhaltungen (2022-2026). Mit ChatGPT (OpenAI) erstellt. PDF, 17 Seiten; vorläufige Ergebnisse mit Rechenprüfung und methodischen Grenzen.',
    image: `${SITE}/ressourcen/wissensinfrastruktur-2026-11-27.png`,
    imageAlt: 'Eigene ChatGPT-Daten von Claudiu Dangulea: 3.173 Unterhaltungen. Forschungszwischenbericht, mit ChatGPT (OpenAI) erstellt.',
    report: { name: 'Von Chat-Verläufen zur Wissensinfrastruktur', datePublished: '2026-11-27', pdf: '/ressourcen/wissensinfrastruktur-2026-11-27.pdf' },
  },
  {
    path: '/ressourcen/vom-dialog-zur-werkzeugarbeit',
    title: `Vom Dialog zur Werkzeugarbeit · ${NAME}`,
    description: 'Visueller Forschungszwischenbericht über meine 983 eigenen Claude-Gespräche (2024-2026). KI-generiert mit Claude (Anthropic). PDF, 13 Seiten; Arbeitsmodi, Werkzeuge, grobe Themenfelder und Informationsarchitektur mit Rechenprüfung und methodischen Grenzen.',
    image: `${SITE}/ressourcen/vom-dialog-zur-werkzeugarbeit-2026-11-27.png`,
    imageAlt: 'Eigene Claude-Daten von Claudiu Dangulea: 983 Gespräche. Forschungszwischenbericht, KI-generiert mit Claude (Anthropic).',
    report: { name: 'Vom Dialog zur Werkzeugarbeit', datePublished: '2026-11-27', pdf: '/ressourcen/vom-dialog-zur-werkzeugarbeit-2026-11-27.pdf' },
  },
  { path: '/impressum', title: `Impressum · ${NAME}`, noindex: true },
  { path: '/intern', title: `Intern · ${NAME}`, noindex: true },
]

const dist = new URL('../dist/', import.meta.url)
const ssrDir = new URL('../dist-ssr/', import.meta.url)
const { render } = await import(new URL('entry-server.js', ssrDir))
const template = await readFile(new URL('index.html', dist), 'utf8')
const articles = JSON.parse(await readFile(new URL('../src/generated/news-articles.json', import.meta.url), 'utf8'))

// Datum dieser Veröffentlichung (Build-Datum in Wien). Die Seite wird durch die News täglich neu gebaut.
const builtOn = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date())
const dateTags = `    <meta name="publish_date" property="og:publish_date" content="${builtOn}" />\n` +
  `    <meta property="og:updated_time" content="${builtOn}" />\n`

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const route of routes) {
  const url = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
  html = html.replace(/\n\s*<\/head>/, `\n${dateTags}  </head>`)
  if (route.description) {
    html = html
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
      .replace(/(<meta property="og:type" content=")[^"]*(")/, '$1article$2')
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(route.image)}$2`)
      .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${esc(route.imageAlt)}$2`)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Report', name: route.report.name,
          url, description: route.description, inLanguage: 'de', datePublished: route.report.datePublished,
          isAccessibleForFree: true, creator: { '@type': 'Person', name: NAME },
          encoding: { '@type': 'MediaObject', encodingFormat: 'application/pdf', contentUrl: `${SITE}${route.report.pdf}` },
        })}</script>`)
  }
  if (route.noindex) html = html.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
  const app = render(route.path)
  if (!app) throw new Error(`Leeres Rendering für ${route.path}`)
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  if (!html.includes(app)) throw new Error(`#root nicht gefunden für ${route.path}`)
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`
  await mkdir(new URL('.', new URL(file, dist)), { recursive: true })
  await writeFile(new URL(file, dist), html)
  console.log(`vorgerendert: ${route.path} → dist/${file}`)
}

for (const article of articles) {
  // Replace generic profile metadata completely. Crawlers receive article data
  // and content in the first HTTP response, with no JavaScript requirement.
  const head = template.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/\s*<title>[\s\S]*?<\/title>/g, '')
    .replace(/\s*<meta\s+(?:name="(?:description|author|twitter:[^"]+)"|property="(?:og:[^"]+|article:[^"]+)")[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  const app = render(article.path)
  if (!app || !app.includes('data-share-url=')) throw new Error(`Artikel-Rendering unvollständig: ${article.id}`)
  const html = template.replace(/<head>[\s\S]*?<\/head>/, `<head>${head}\n${articleHead(article)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  const directory = new URL(`.${article.path}`, dist)
  await mkdir(directory, { recursive: true })
  await writeFile(new URL('index.html', directory), html)
}
await writeFile(new URL('news-manifest.json', dist), `${JSON.stringify(articles, null, 2)}\n`)
const sitemapPath = new URL('sitemap.xml', dist)
const sitemap = await readFile(sitemapPath, 'utf8')
await writeFile(sitemapPath, sitemap.replace('</urlset>', articles.map(article =>
  `  <url><loc>${esc(article.url)}</loc><lastmod>${article.date}</lastmod></url>`).join('\n') + '\n</urlset>'))
console.log(`Einzelartikel vorgerendert: ${articles.length}, einschließlich Metadaten, Manifest und Sitemap`)
await rm(ssrDir, { recursive: true, force: true })
