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
  { path: '/impressum', title: `Impressum · ${NAME}`, noindex: true },
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
  if (route.noindex) html = html.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
  const app = render(route.path)
  if (!app) throw new Error(`Leeres Rendering für ${route.path}`)
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  if (!html.includes(app)) throw new Error(`#root nicht gefunden für ${route.path}`)
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`
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
