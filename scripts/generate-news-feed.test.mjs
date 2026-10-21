import test from 'node:test'
import assert from 'node:assert/strict'
import { createNewsFeed } from './generate-news-feed.mjs'

const entry = { date: '2026-10-21', title: 'KI & ERP', text: 'Fakten: <script>alert("x")</script>\n\nQuellen: https://example.org/?a=1&b=2\n\nTransparenz zur KI-Unterstützung: automatisiert' }

test('sorts editions without changing input and keeps stable date permalinks', () => {
  const items = [{ ...entry, date: '2026-10-20' }, entry]
  const xml = createNewsFeed(items)
  assert.ok(xml.indexOf('2026-10-21 –') < xml.indexOf('2026-10-20 –'))
  assert.equal(items[0].date, '2026-10-20')
  assert.ok(xml.includes('<guid isPermaLink="true">https://dangulea.at/news#news-2026-10-21</guid>'))
  assert.ok(xml.includes('Wed, 21 Oct 2026 00:00:00 GMT'))
  assert.equal(createNewsFeed([{ ...entry, text: 'Korrektur' }]).match(/<guid.*<\/guid>/)[0], xml.match(/<guid.*<\/guid>/)[0])
})

test('escapes XML and HTML but preserves clickable source links and disclosure', () => {
  const xml = createNewsFeed([entry])
  assert.ok(xml.includes('KI &amp; ERP'))
  assert.ok(xml.includes('&amp;lt;script&amp;gt;'))
  assert.ok(xml.includes('&lt;a href=&quot;https://example.org/?a=1&amp;amp;b=2&quot;&gt;'))
  assert.ok(xml.includes('Transparenz zur KI-Unterstützung'))
  assert.ok(!xml.includes('<script>'))
})

test('rejects malformed data, invalid dates and duplicate editions', () => {
  for (const items of [null, [{}], [{ ...entry, date: '2026-02-30' }], [entry, entry], [{ ...entry, text: '\u0000' }]]) {
    assert.throws(() => createNewsFeed(items))
  }
  assert.ok(createNewsFeed([]).includes('<channel>'))
})
