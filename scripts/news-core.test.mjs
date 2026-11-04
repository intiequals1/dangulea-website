import test from 'node:test'
import assert from 'node:assert/strict'
import { splitEditions, mergeArchive, articleView } from './news-core.mjs'
import { articleHead } from './news-head.mjs'

const edition = { date: '2026-11-04', title: 'Überblick', text: '1. SAP & ERP\n\nFakten: Eine Meldung.\nEinordnung: Kontext.\nQuellen: https://example.org/?a=1&b=2\n\n2. KI\n\nFakten: Zweite Meldung.\nQuellen: https://example.net/\n\nTransparenz zur KI-Unterstützung:\nHinweis.' }
const initial = mergeArchive({ version: 1, articles: [] }, [edition])

test('every numbered story gets its complete body, own permanent URL and own two images', () => {
  const articles = splitEditions([edition]).map(articleView)
  assert.equal(articles.length, 2)
  assert.equal(articles[0].url, 'https://dangulea.at/news/2026-11-04/1/')
  assert.equal(articles[1].url, 'https://dangulea.at/news/2026-11-04/2/')
  assert.ok(articles[0].text.includes('https://example.org/?a=1&b=2'))
  assert.ok(!articles[0].text.includes('Zweite Meldung'))
  assert.ok(!articles[1].text.includes('Hinweis.'))
  assert.notEqual(articles[0].ogImage, articles[1].ogImage)
  assert.notEqual(articles[0].storyImage, articles[1].storyImage)
})

test('future updates preserve archived stories after old editions leave the source', () => {
  const future = { ...edition, date: '2026-11-05' }
  const merged = mergeArchive(initial, [future])
  assert.equal(merged.articles.length, 4)
  assert.deepEqual(merged.articles.filter(article => article.date === edition.date), initial.articles)
  assert.deepEqual(mergeArchive(merged, [future]), merged)
  assert.equal(initial.articles.length, 2)
})

test('rejects changed identities, reordered or removed published stories', () => {
  assert.throws(() => mergeArchive(initial, [{ ...edition, text: edition.text.replace('SAP & ERP', 'Eine andere Story') }]), /Zuordnung/)
  assert.throws(() => mergeArchive(initial, [{ ...edition, text: edition.text.split('\n\n2.')[0] }]), /entfernt/)
  assert.throws(() => mergeArchive({ ...initial, articles: [...initial.articles, initial.articles[0]] }, [edition]), /Doppelte/)
})

test('body corrections keep page URLs and refresh social image cache keys', () => {
  const corrected = mergeArchive(initial, [{ ...edition, text: edition.text.replace('Eine Meldung.', 'Eine korrigierte Meldung.') }])
  const before = articleView(initial.articles[0]), after = articleView(corrected.articles[0])
  assert.equal(after.url, before.url)
  assert.notEqual(after.ogImage, before.ogImage)
})

test('rejects malformed future runs instead of silently skipping news', () => {
  for (const source of [null, [], [{}], [edition, edition], [{ ...edition, date: '2026-02-30' }],
    [{ ...edition, text: 'Unstrukturierter Text' }],
    [{ ...edition, text: edition.text.replace('2. KI', '3. KI') }],
    [{ ...edition, text: edition.text.replace('https://example.net/', 'keine URL') }],
    [{ ...edition, text: edition.text + '\u0000' }]]) {
    assert.throws(() => splitEditions(source))
  }
})

test('metadata escapes untrusted text including script terminators and query strings', () => {
  const article = articleView({ ...initial.articles[0], title: '</script><script>alert("x")</script> & SAP' })
  const html = articleHead(article)
  assert.ok(!html.includes('<script>alert'))
  assert.ok(html.includes('&lt;/script&gt;'))
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(json.headline, article.title)
  assert.equal(json.url, article.url)
  assert.ok(html.includes('og:image:width" content="1200"'))
})
