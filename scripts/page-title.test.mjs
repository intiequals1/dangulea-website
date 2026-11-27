import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pageTitle } from '../src/utils/pageTitle.ts'

const titles = JSON.parse(readFileSync(new URL('../src/content/page-titles.json', import.meta.url)))
test('direct routes and SPA navigation share meaningful titles, including trailing slashes', () => {
  for (const [path, title] of Object.entries(titles)) {
    assert.equal(pageTitle(path, titles, []), title)
    assert.equal(pageTitle(path + '/', titles, []), title)
  }
  assert.notEqual(pageTitle('/news', titles, []), pageTitle('/aktuelle-themen', titles, []))
})
test('article navigation retains individual PoC title and missing articles have a distinct title', () => {
  const articles = [{ path: '/news/2026-11-26/1/', title: 'Fachmeldung', shareTitle: 'News-PoC · Fachmeldung' }]
  assert.equal(pageTitle('/news/2026-11-26/1', titles, articles), 'News-PoC · Fachmeldung · Claudiu Dangulea')
  assert.equal(pageTitle('/news/1900-01-01/99/', titles, articles), 'Seite nicht gefunden · Claudiu Dangulea')
})
