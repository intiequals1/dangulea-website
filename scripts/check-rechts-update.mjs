// Prüft nach dem Build, dass das Rechts-Update vollständig und nur mit freigegebenen Ausgaben ausgeliefert wird.
import { readFile, readdir, access } from 'node:fs/promises'
import { assertSource, editionPath } from './rechts-update-core.mjs'

const root = new URL('../', import.meta.url)
const dist = new URL('dist/', root)
const source = assertSource(JSON.parse(await readFile(new URL('src/content/rechts-update.json', root), 'utf8')))
const generated = JSON.parse(await readFile(new URL('src/generated/rechts-update.json', root), 'utf8'))

function require(condition, message) { if (!condition) throw new Error(`Rechts-Update-Prüfung: ${message}`) }
const exists = (url) => access(url).then(() => true, () => false)
// Sichtbarer Text des eigenen Build-Ergebnisses, nur zum Vergleich. Zeichenweise statt per Regex,
// damit Kommentare, Skripte und Tags vollständig übersprungen werden (keine Ausgabe in HTML).
const ENTITIES = { '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>', '&amp;': '&' }
function visible(html) {
  const lower = html.toLowerCase()
  let out = ''
  let i = 0
  while (i < html.length) {
    if (lower.startsWith('<!--', i)) {
      const end = lower.indexOf('-->', i + 4)
      i = end === -1 ? html.length : end + 3
    } else if (lower.startsWith('<script', i) || lower.startsWith('<style', i)) {
      const close = lower.startsWith('<script', i) ? '</script' : '</style'
      const end = lower.indexOf(close, i)
      const tagEnd = end === -1 ? -1 : lower.indexOf('>', end)
      i = tagEnd === -1 ? html.length : tagEnd + 1
    } else if (html[i] === '<') {
      const end = html.indexOf('>', i)
      i = end === -1 ? html.length : end + 1
    } else {
      out += html[i]
      i += 1
    }
  }
  return out.replace(/&(?:quot|#x27|#39|lt|gt|amp);/g, entity => ENTITIES[entity]).replace(/\s+/g, ' ')
}
const norm = (value) => value.replace(/\s+/g, ' ').trim()

require(!generated.preview, 'Build enthält die lokale Vorschau mit Entwürfen')
const approved = source.editions.filter(edition => edition.freigabe.status === 'freigegeben').map(edition => edition.month).sort().reverse()
const drafts = source.editions.filter(edition => edition.freigabe.status !== 'freigegeben')
require(JSON.stringify(generated.editions.map(edition => edition.month)) === JSON.stringify(approved), 'Build-Ausgaben stimmen nicht mit den freigegebenen Ausgaben überein')

const hinweisTexts = ['zweck', 'erstellung', 'grenzen', 'abgrenzung', 'korrekturen'].map(key => norm(source.hinweis[key]))
const overviewHtml = await readFile(new URL('news.html', dist), 'utf8')
const overview = visible(overviewHtml)
require(overviewHtml.includes('data-rechts-update="segment"') && overviewHtml.includes('id="rechts-update"'), 'Segment fehlt auf /news')
for (const value of hinweisTexts) require(overview.includes(value), `Hinweis fehlt auf /news: ${value.slice(0, 40)}…`)

const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8')
for (const edition of generated.editions) {
  require(edition.path === editionPath(edition.month) && edition.url === `https://dangulea.at${edition.path}`, `falscher Pfad ${edition.month}`)
  require(overviewHtml.includes(`href="${edition.path}"`), `Ausgabe fehlt in der Übersicht: ${edition.month}`)
  const file = new URL(`.${edition.path}index.html`, dist)
  require(await exists(file), `Seite fehlt: ${edition.path}`)
  const html = await readFile(file, 'utf8')
  const text = visible(html)
  require(html.includes(`<link rel="canonical" href="${edition.url}"`), `Canonical falsch: ${edition.month}`)
  require(html.includes('data-rechts-update="ausgabe"') && html.includes('data-rechts-update="persistent"'), `Kennzeichnung fehlt: ${edition.month}`)
  require(!html.includes('data-news-poc='), `PoC-Kennzeichnung auf Rechts-Update-Seite: ${edition.month}`)
  require(!html.includes('noindex'), `Ausgabe ist noindex: ${edition.month}`)
  for (const value of hinweisTexts) require(text.includes(value), `Hinweis fehlt in ${edition.month}: ${value.slice(0, 40)}…`)
  require(text.includes(norm(edition.summary)), `Kurzüberblick fehlt: ${edition.month}`)
  require(text.includes('geprüft und freigegeben am'), `Freigabevermerk fehlt: ${edition.month}`)
  for (const topic of edition.topics) {
    require(text.includes(norm(topic.title)), `Thema fehlt: ${edition.month}/${topic.id}`)
    for (const item of topic.items) require(text.includes(norm(item.text)), `Abschnitt fehlt: ${edition.month}/${topic.id}/${item.label}`)
    for (const sourceLink of topic.sources) require(html.includes(`href="${sourceLink.url.replace(/&/g, '&amp;')}"`), `Quelle fehlt: ${sourceLink.url}`)
  }
  require(sitemap.split(`<loc>${edition.url}</loc>`).length === 2, `Sitemap-Eintrag fehlt oder doppelt: ${edition.month}`)
}

// Entwürfe dürfen weder als Seite noch im ausgelieferten JavaScript oder HTML auftauchen.
const assetFiles = (await readdir(new URL('assets/', dist))).filter(name => name.endsWith('.js'))
const bundles = await Promise.all(assetFiles.map(name => readFile(new URL(`assets/${name}`, dist), 'utf8')))
for (const draft of drafts) {
  require(!(await exists(new URL(`.${editionPath(draft.month)}index.html`, dist))), `Entwurf als Seite ausgeliefert: ${draft.month}`)
  require(!overviewHtml.includes(editionPath(draft.month)), `Entwurf in der Übersicht verlinkt: ${draft.month}`)
  require(!sitemap.includes(editionPath(draft.month)), `Entwurf in der Sitemap: ${draft.month}`)
  const marker = draft.summary.slice(0, 80)
  require(!bundles.some(bundle => bundle.includes(marker)) && !overview.includes(marker), `Entwurfstext im Build: ${draft.month}`)
}
console.log(`RECHTS-UPDATE OK: ${generated.editions.length} freigegebene Ausgabe(n), ${drafts.length} Entwurf/Entwürfe nicht ausgeliefert`)
