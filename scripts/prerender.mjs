// Rendert jede Route beim Build zu statischem HTML (dist/<route>.html).
// So sehen Suchmaschinen und Link-Vorschauen den Inhalt ohne JavaScript,
// und GitHub Pages liefert die Unterseiten mit Status 200 statt über 404.html aus.
import { readFile, writeFile, rm } from 'node:fs/promises'

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

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const route of routes) {
  const url = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
  if (route.noindex) html = html.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
  const app = render(route.path)
  if (!app) throw new Error(`Leeres Rendering für ${route.path}`)
  html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
  if (!html.includes(app)) throw new Error(`#root nicht gefunden für ${route.path}`)
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`
  await writeFile(new URL(file, dist), html)
  console.log(`vorgerendert: ${route.path} → dist/${file}`)
}

await rm(ssrDir, { recursive: true, force: true })
