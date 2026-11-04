import { createHash } from 'node:crypto'
import disclosure from '../src/content/news-disclosure.json' with { type: 'json' }

export const SITE = 'https://dangulea.at'
// Increment when changing image composition, so social crawlers see a new URL.
export const IMAGE_VERSION = 2
const controls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u

export function assertArticle(article) {
  if (!article || !['id', 'date', 'title', 'text'].every(key => typeof article[key] === 'string' && article[key].trim()) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(article.date) ||
      !Number.isFinite(Date.parse(`${article.date}T00:00:00Z`)) ||
      new Date(`${article.date}T00:00:00Z`).toISOString().slice(0, 10) !== article.date ||
      !Number.isSafeInteger(article.number) || article.number < 1 ||
      article.id !== `${article.date}-${article.number}` || controls.test(article.title + article.text) ||
      article.title.length > 300 || !/Fakten:\s*\S/.test(article.text) ||
      !/Quellen:[\s\S]*?https?:\/\/[^\s<>]+/.test(article.text)) {
    throw new Error(`Ungültiger Artikel: ${article?.id ?? 'ohne ID'}`)
  }
}

export function splitEditions(editions) {
  if (!Array.isArray(editions) || editions.length === 0) throw new Error('News-Quelle muss ein nicht leeres Array sein')
  const dates = new Set()
  return editions.flatMap(edition => {
    if (!edition || typeof edition.text !== 'string' || typeof edition.title !== 'string' || controls.test(edition.text + edition.title) || dates.has(edition.date)) {
      throw new Error('Ungültige oder doppelte Tagesausgabe')
    }
    dates.add(edition.date)
    const text = edition.text.replace(/\r\n?/g, '\n')
    const headings = [...text.matchAll(/^(\d+)\.\s+([^\n]+)(?:\n|$)/gm)]
    if (!headings.length || text.slice(0, headings[0].index).trim()) throw new Error(`Keine eindeutige Artikelstruktur: ${edition.date}`)
    return headings.map((heading, index) => {
      if (Number(heading[1]) !== index + 1) throw new Error(`Lückenhafte/doppelte Nummerierung: ${edition.date}`)
      const body = text.slice(heading.index + heading[0].length, headings[index + 1]?.index ?? text.length)
        .split(/\n+Transparenz zur KI-Unterstützung:/)[0].trim()
      const article = { id: `${edition.date}-${index + 1}`, date: edition.date, number: index + 1, title: heading[2].trim(), text: body }
      assertArticle(article)
      return article
    })
  })
}

export function mergeArchive(archive, editions) {
  if (archive.version !== 1 || !Array.isArray(archive.articles)) throw new Error('Ungültiges News-Archiv')
  const articles = new Map()
  for (const article of archive.articles) {
    assertArticle(article)
    if (articles.has(article.id)) throw new Error(`Doppelte Archiv-ID: ${article.id}`)
    articles.set(article.id, article)
  }
  const incoming = splitEditions(editions)
  const incomingIds = new Set(incoming.map(article => article.id))
  const incomingDates = new Set(incoming.map(article => article.date))
  for (const old of articles.values()) {
    if (incomingDates.has(old.date) && !incomingIds.has(old.id)) throw new Error(`Artikel aus bestehender Ausgabe entfernt: ${old.id}`)
  }
  for (const article of incoming) {
    const old = articles.get(article.id)
    // Published date + number are permanent identities. Never silently point an
    // old shared link at a different story when an edition is replaced/reordered.
    if (old && old.title !== article.title) throw new Error(`Titel/Zuordnung einer veröffentlichten URL geändert: ${article.id}. Siehe docs/news-sharing.md.`)
    articles.set(article.id, article)
  }
  return { version: 1, articles: [...articles.values()].sort((a, b) => b.date.localeCompare(a.date) || a.number - b.number) }
}

export function articleView(article) {
  const facts = article.text.match(/Fakten:\s*([\s\S]*?)(?:\n\s*(?:Einordnung|Quellen):|$)/)?.[1] ?? article.text
  const clean = facts.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim()
  const short = clean.length <= 220 ? clean : `${clean.slice(0, 217).replace(/\s+\S*$/, '')}…`
  const revision = createHash('sha256').update(JSON.stringify([IMAGE_VERSION, disclosure, article])).digest('hex').slice(0, 16)
  const path = `/news/${article.date}/${article.number}/`
  return { ...article, description: short, shareTitle: `${disclosure.label} · ${article.title}`, shareDescription: `${disclosure.socialPrefix} ${short}`, path, url: `${SITE}${path}`, ogImage: `/news-media/${article.id}-${revision}-og.png`, storyImage: `/news-media/${article.id}-${revision}-story.png` }
}
