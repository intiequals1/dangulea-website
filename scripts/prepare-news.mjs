import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { mergeArchive, articleView } from './news-core.mjs'
import { validateFactChecks } from './news-factcheck.mjs'

const root = new URL('../', import.meta.url)
const source = JSON.parse(await readFile(new URL('public/news-updates.json', root), 'utf8'))
let archive
try { archive = JSON.parse(await readFile(new URL('data/news-archive.json', root), 'utf8')) }
catch (error) {
  if (error.code !== 'ENOENT') throw error
  if (!process.argv.includes('--sync')) throw new Error('News-Archiv fehlt. Zuerst pnpm news:sync ausführen und Archiv committen.')
  archive = { version: 1, articles: [] }
}
const merged = mergeArchive(archive, source)
const checks = validateFactChecks(merged.articles, JSON.parse(await readFile(new URL('data/news-fact-checks.json', root), 'utf8')))
if (process.argv.includes('--sync')) {
  await writeFile(new URL('data/news-archive.json', root), `${JSON.stringify(merged, null, 2)}\n`)
} else if (JSON.stringify(archive) !== JSON.stringify(merged)) {
  throw new Error('News-Archiv ist nicht synchron. pnpm news:sync ausführen und data/news-archive.json gemeinsam mit der News-Quelle committen. Kein Deployment.')
}
await mkdir(new URL('src/generated/', root), { recursive: true })
await writeFile(new URL('src/generated/news-articles.json', root), `${JSON.stringify(merged.articles.map(article => ({ ...articleView(article), factCheck: checks.get(article.id) })), null, 2)}\n`)
console.log(`News vorbereitet: ${merged.articles.length} dauerhafte Einzelartikel`)
