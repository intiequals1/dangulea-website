import test from 'node:test'
import assert from 'node:assert/strict'
import { contentHash, claimsFor, validateReview, validateFactChecks, reviewDraft, assertLegacyBaselineUnchanged } from './news-factcheck.mjs'

const article = { id: '2026-11-04-1', date: '2026-11-04', number: 1, title: 'Anbieter meldet eine neue Funktion', text: 'Fakten: Der Anbieter kündigte am 3. November eine Funktion an. Sie ist laut Anbieter verfügbar.\nEinordnung: Nur Herstellerangaben.\nQuellen: https://example.org/announcement' }
const now = new Date('2026-11-04T15:00:00Z')
function complete() {
  const result = reviewDraft(article)
  for (const [i, stage] of result.stages.entries()) {
    Object.assign(stage, { status: 'passed', checkedAt: `2026-11-04T14:0${i}:00Z`, reviewer: i ? 'Getrennter Gegenprüfungsdurchgang' : 'Quellenbasierter Recherche-Durchgang' })
    for (const claim of stage.claims) Object.assign(claim, { verdict: 'supported', reason: 'Testbeleg deckt die konkrete Aussage ab.', sourceUrls: ['https://example.org/announcement'] })
  }
  Object.assign(result.stages[1], {
    searches: [
      { query: 'Anbieter neue Funktion Gegenbelege', finding: 'Die Aussage wurde auf Gegenbelege geprüft.', sourceUrls: ['https://example.net/assessment'] },
      { query: 'Anbieter Funktionsumfang Einschränkungen', finding: 'Keine darüber hinausgehende Zusage ist belegt.', sourceUrls: ['https://example.org/announcement'] },
    ],
    checks: Object.fromEntries(['datesAndNumbers', 'scopeAndQualifications', 'sourceIndependence', 'contradictions'].map(key => [key, 'Konkreter Testbefund zu diesem Prüfkriterium.'])),
  })
  return result
}
const ledger = () => ({ version: 1, legacyUnreviewed: {}, reviews: [complete()] })

test('requires two different, ordered strategies and complete headline/sentence coverage', () => {
  const review = complete()
  assert.equal(claimsFor(article)[0].id, 'headline')
  assert.ok(claimsFor(article).length >= 3)
  assert.ok(claimsFor(article)[1].text.includes('3. November'))
  assert.equal(validateReview(article, review, now).status, 'reviewed')
  review.stages[1].method = review.stages[0].method
  assert.throws(() => validateReview(article, review, now), /Prüfstufe/)
})

test('a draft never grants publication permission', () => {
  assert.throws(() => validateReview(article, reviewDraft(article), now), /Prüfstufe/)
  assert.throws(() => validateFactChecks([article], { version: 1, legacyUnreviewed: {}, reviews: [] }, now), /ohne zwei/)
})

test('old unreviewed content stays explicitly unreviewed; edits require new review', () => {
  const old = { version: 1, legacyUnreviewed: { [article.id]: contentHash(article) }, reviews: [] }
  assert.equal(validateFactChecks([article], old, now).get(article.id).status, 'unreviewed')
  assert.throws(() => validateFactChecks([{ ...article, text: article.text.replace('3. November', '4. November') }], old, now), /ohne zwei/)
  assert.throws(() => assertLegacyBaselineUnchanged(old, { ...old, legacyUnreviewed: { ...old.legacyUnreviewed, '2026-11-05-1': 'a'.repeat(64) } }), /nicht erweitert/)
})

test('changed facts invalidate a previous successful check', () => {
  assert.throws(() => validateReview({ ...article, text: article.text + '\nZusatzbehauptung.' }, complete(), now), /anderem Text/)
})

test('missing claims, counter-search, dates, reviewer or source evidence block publication', () => {
  const mutations = [
    r => r.stages.pop(), r => r.stages[0].claims.pop(),
    r => { r.stages[0].claims[0].sourceUrls = [] },
    r => { r.stages[0].claims[0].sourceUrls = ['https://unrelated.example/'] },
    r => { r.stages[1].searches = [] }, r => { r.stages[1].checks.contradictions = '' },
    r => { r.stages[1].reviewer = '' }, r => { r.stages[1].checkedAt = '2026-11-05T00:00:00Z' },
    r => { r.stages[1].checkedAt = '2026-11-04T13:00:00Z' },
  ]
  for (const mutate of mutations) {
    const review = complete(); mutate(review)
    assert.throws(() => validateReview(article, review, now))
  }
})

test('contradictions and unresolved claims cannot pass; qualified claims need visible limitations', () => {
  for (const verdict of ['unresolved', 'contradicted']) {
    const review = complete(); review.stages[1].claims[0].verdict = verdict
    assert.throws(() => validateReview(article, review, now), /Aussage offen/)
  }
  const review = complete(); review.stages[1].claims[0].verdict = 'qualified'
  assert.throws(() => validateReview(article, review, now), /Quellenvorbehalt/)
  review.stages[1].limitations = ['Nur Anbieterangaben; keine unabhängige Bestätigung der Wirksamkeit.']
  assert.ok(validateReview(article, review, now).limitations.length)
})

test('rejects duplicate reports and reports without corresponding article', () => {
  assert.throws(() => validateFactChecks([article], { ...ledger(), reviews: [complete(), complete()] }, now), /Doppelte Prüfung/)
  assert.throws(() => validateFactChecks([], ledger(), now), /ohne Artikel/)
})
