import withdrawnEditions from '../data/news-withdrawn-editions.json' with { type: 'json' }
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { mergeArchive } from './news-core.mjs'

export const METHODS = ['source-evidence-v1', 'counter-check-v1']
const root = new URL('../', import.meta.url)
const fail = message => { throw new Error(`Faktencheck: ${message}`) }
const text = value => typeof value === 'string' && value.trim().length >= 12
const validUrl = value => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password }
  catch { return false }
}

export function contentHash(article) {
  return createHash('sha256').update(JSON.stringify([article.id, article.date, article.number, article.title, article.text])).digest('hex')
}

export function claimsFor(article) {
  const facts = article.text.match(/Fakten:\s*([\s\S]*?)(?:\n\s*(?:Einordnung|Quellen):|$)/)?.[1]?.trim()
  if (!facts) fail(`Keine Quellenaussagen: ${article.id}`)
  // Keep the review contract deterministic across Node/ICU versions and avoid
  // treating German dates such as "3. November" as separate assertions.
  const protectedText = facts.replace(/(\d)\.(?=\s+(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b)/g, '$1\uE000')
    .replace(/\b(z|u|d)\.\s*(B|a|h)\./g, '$1\uE000 $2\uE000')
  const sentences = protectedText.split(/(?<=[.!?])\s+(?=[„“"'«(]?[A-ZÄÖÜ0-9])/u)
    .map(item => item.replace(/\uE000/g, '.').trim()).filter(Boolean)
  return [{ id: 'headline', text: article.title }, ...sentences.map((value, i) => ({ id: `fact-${i + 1}`, text: value }))]
}

export function validateReview(article, review, now = new Date()) {
  if (!review || review.id !== article.id || review.contentHash !== contentHash(article)) fail(`Prüfung fehlt oder gehört zu anderem Text: ${article.id}`)
  const expected = claimsFor(article)
  const sources = new Set([...article.text.matchAll(/https?:\/\/[^\s<>|]+/g)].map(match => match[0].replace(/[.,;:!?)]*$/, '')))
  if (!Array.isArray(review.stages) || review.stages.length !== 2) fail(`Beide Prüfstufen erforderlich: ${article.id}`)
  let previousTime = 0
  for (const [index, stage] of review.stages.entries()) {
    const time = Date.parse(stage.checkedAt)
    if (stage.method !== METHODS[index] || stage.status !== 'passed' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(stage.checkedAt) || !Number.isFinite(time) ||
        time < Date.parse(`${article.date}T00:00:00Z`) || time > now.getTime() + 300_000 || time < previousTime) fail(`Prüfstufe ${index + 1} offen/ungültig: ${article.id}`)
    previousTime = time
    if (!text(stage.reviewer)) fail(`Prüferrolle fehlt: ${article.id}`)
    if (!Array.isArray(stage.claims) || stage.claims.length !== expected.length) fail(`Nicht alle Aussagen geprüft: ${article.id}`)
    for (const claim of expected) {
      const matches = stage.claims.filter(item => item.id === claim.id)
      const check = matches[0]
      if (matches.length !== 1 || check.text !== claim.text || !['supported', 'qualified'].includes(check.verdict) || !text(check.reason)) fail(`Aussage offen/verändert: ${article.id}/${claim.id}`)
      if (!Array.isArray(check.sourceUrls) || !check.sourceUrls.length || !check.sourceUrls.every(validUrl)) fail(`Belege fehlen: ${article.id}/${claim.id}`)
      if (index === 0 && !check.sourceUrls.some(url => sources.has(url))) fail(`Kein Artikel-Originalbeleg: ${article.id}/${claim.id}`)
      if (check.verdict === 'qualified' && !stage.limitations?.some(text)) fail(`Quellenvorbehalt fehlt: ${article.id}/${claim.id}`)
    }
    if (!Array.isArray(stage.limitations) || !stage.limitations.every(text)) fail(`Ungültige Einschränkungen: ${article.id}`)
    if (index === 1) {
      if (!Array.isArray(stage.searches) || stage.searches.length < 2 || new Set(stage.searches.map(item => item.query)).size < 2 ||
          !stage.searches.every(item => text(item.query) && text(item.finding) && Array.isArray(item.sourceUrls) && item.sourceUrls.length && item.sourceUrls.every(validUrl))) fail(`Eigenständige Gegenrecherche fehlt: ${article.id}`)
      for (const check of ['datesAndNumbers', 'scopeAndQualifications', 'sourceIndependence', 'contradictions']) {
        if (!text(stage.checks?.[check])) fail(`Gegenprüfung ${check} fehlt: ${article.id}`)
      }
    }
  }
  return { status: 'reviewed', checkedAt: review.stages[1].checkedAt, limitations: [...new Set(review.stages.flatMap(stage => stage.limitations))] }
}

export function assertLegacyBaselineUnchanged(previous, current) {
  const ordered = value => JSON.stringify(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
  if (ordered(previous.legacyUnreviewed) !== ordered(current.legacyUnreviewed)) fail('Die Ausnahme für ungeprüfte Bestandsartikel darf nicht erweitert oder verändert werden.')
}

export function validateFactChecks(articles, ledger, now = new Date()) {
  if (ledger.version !== 1 || !ledger.legacyUnreviewed || !Array.isArray(ledger.reviews)) fail('Ungültiges Prüfprotokoll')
  const byId = new Map()
  for (const review of ledger.reviews) {
    if (byId.has(review.id)) fail(`Doppelte Prüfung: ${review.id}`)
    if (!articles.some(article => article.id === review.id)) fail(`Prüfung ohne Artikel: ${review.id}`)
    byId.set(review.id, review)
  }
  return new Map(articles.map(article => {
    const review = byId.get(article.id)
    if (review) return [article.id, validateReview(article, review, now)]
    if (ledger.legacyUnreviewed[article.id] !== contentHash(article)) fail(`Neue/geänderte Meldung ohne zwei abgeschlossene Prüfungen: ${article.id}`)
    return [article.id, { status: 'unreviewed', checkedAt: null, limitations: [] }]
  }))
}

export function reviewDraft(article) {
  return { id: article.id, contentHash: contentHash(article), stages: METHODS.map(method => ({
    method, status: 'pending', checkedAt: '', reviewer: '', limitations: [],
    claims: claimsFor(article).map(claim => ({ ...claim, verdict: 'unresolved', reason: '', sourceUrls: [] })),
    ...(method === METHODS[1] ? { searches: [], checks: { datesAndNumbers: '', scopeAndQualifications: '', sourceIndependence: '', contradictions: '' } } : {}),
  })) }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const archive = JSON.parse(await readFile(new URL('data/news-archive.json', root), 'utf8'))
  const source = JSON.parse(await readFile(new URL('public/news-updates.json', root), 'utf8'))
  const articles = mergeArchive(archive, source, withdrawnEditions).articles
  const ledger = JSON.parse(await readFile(new URL('data/news-fact-checks.json', root), 'utf8'))
  if (process.argv.includes('--draft')) {
    const dateIndex = process.argv.indexOf('--date')
    const selectedDate = dateIndex >= 0 ? process.argv[dateIndex + 1] : null
    if (dateIndex >= 0 && !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate ?? '')) fail('Für --date ist YYYY-MM-DD erforderlich')
    const pending = articles.filter(article => selectedDate ? article.date === selectedDate :
      !ledger.reviews.some(review => review.id === article.id && review.contentHash === contentHash(article)) && ledger.legacyUnreviewed[article.id] !== contentHash(article))
    await writeFile(new URL('data/news-fact-checks.pending.json', root), JSON.stringify(pending.map(reviewDraft), null, 2) + '\n')
    console.log(`${pending.length} offene Prüfvorlagen erzeugt; keine Freigaben erteilt.`)
  } else {
    const checks = validateFactChecks(articles, ledger)
    const passed = [...checks.values()].filter(value => value.status === 'reviewed').length
    console.log(`Faktencheck-Protokolle OK: ${passed} zweistufig geprüft; ${articles.length - passed} unveränderte Altmeldungen ausdrücklich ungeprüft.`)
  }
}
