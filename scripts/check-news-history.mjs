import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { assertLegacyBaselineUnchanged } from './news-factcheck.mjs'

const base = process.env.NEWS_BASE_SHA
if (!base || /^0+$/.test(base)) {
  console.log('Kein Vorgängerstand angegeben; Archivstruktur wird im Build geprüft.')
} else {
  if (!/^[0-9a-f]{40}$/.test(base)) throw new Error('NEWS_BASE_SHA muss eine vollständige Commit-ID sein')
  const path = 'data/news-archive.json'
  const tracked = execFileSync('git', ['ls-tree', base, '--', path], { encoding: 'utf8' }).trim()
  if (tracked) {
    const old = JSON.parse(execFileSync('git', ['show', `${base}:${path}`], { encoding: 'utf8', maxBuffer: 20_000_000 }))
    const current = JSON.parse(await readFile(new URL('../data/news-archive.json', import.meta.url), 'utf8'))
    const byId = new Map(current.articles.map(article => [article.id, article]))
    for (const article of old.articles) {
      const next = byId.get(article.id)
      if (!next || ['id', 'date', 'number', 'title'].some(key => article[key] !== next[key])) {
        throw new Error(`Bestehende Artikel-URL entfernt oder neu zugeordnet: ${article.id}`)
      }
    }
    console.log(`Archivschutz OK: ${old.articles.length} bestehende Artikel-URLs erhalten`)
  } else {
    console.log('Erstmalige Einführung des dauerhaften Artikelarchivs.')
  }
  const checksPath = 'data/news-fact-checks.json'
  if (execFileSync('git', ['ls-tree', base, '--', checksPath], { encoding: 'utf8' }).trim()) {
    const previous = JSON.parse(execFileSync('git', ['show', `${base}:${checksPath}`], { encoding: 'utf8', maxBuffer: 20_000_000 }))
    const current = JSON.parse(await readFile(new URL('../data/news-fact-checks.json', import.meta.url), 'utf8'))
    assertLegacyBaselineUnchanged(previous, current)
    console.log('Faktencheck: Ausnahme für ungeprüften Bestand unverändert.')
  }
}
