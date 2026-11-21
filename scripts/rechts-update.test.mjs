import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { assertSource, publicView } from './rechts-update-core.mjs'

const source = JSON.parse(await readFile(new URL('../src/content/rechts-update.json', import.meta.url), 'utf8'))
const clone = () => structuredClone(source)

test('die Quelldatei ist gültig', () => {
  assert.doesNotThrow(() => assertSource(clone()))
})

test('Entwürfe gelangen nicht in den Build, freigegebene schon', () => {
  const data = clone()
  data.editions[0].freigabe = { status: 'entwurf', am: null }
  assert.equal(publicView(data).editions.length, 0)
  data.editions[0].freigabe = { status: 'freigegeben', am: data.editions[0].stand }
  const view = publicView(data)
  assert.equal(view.editions.length, 1)
  assert.equal(view.editions[0].path, `/news/rechts-update/${data.editions[0].month}/`)
  assert.equal(publicView(clone(), { includeDrafts: true }).preview, true)
})

test('Freigabe braucht ein gültiges Datum', () => {
  const data = clone()
  data.editions[0].freigabe = { status: 'freigegeben', am: null }
  assert.throws(() => assertSource(data), /Freigabedatum/)
  data.editions[0].freigabe = { status: 'freigegeben', am: '2026-11-01' }
  assert.throws(() => assertSource(data), /Freigabedatum/)
  data.editions[0].freigabe = { status: 'entwurf', am: '2026-11-30' }
  assert.throws(() => assertSource(data), /Entwurf darf kein Freigabedatum/)
})

test('der interne Anhang darf nicht in die öffentliche Quelle', () => {
  const data = clone()
  data.editions[0].changes.push('Anhang (intern, nicht weitergeben): eigene Betroffenheit')
  assert.throws(() => assertSource(data), /interner Anhang/)
})

test('jede Quelle muss https sein und jedes Thema eine Quelle haben', () => {
  const data = clone()
  data.editions[0].topics[0].sources[0].url = 'http://example.org/'
  assert.throws(() => assertSource(data), /https/)
  const empty = clone()
  empty.editions[0].topics[0].sources = []
  assert.throws(() => assertSource(empty), /ohne Quelle/)
})

test('Hinweise zu Zweck, KI und Rechtsberatung sind Pflicht', () => {
  for (const [key, pattern] of [['grenzen', /Rechtsberatung/], ['erstellung', /KI-Hinweis/], ['zweck', /Zweckangabe/]]) {
    const data = clone()
    data.hinweis[key] = 'Ein anderer Text.'
    assert.throws(() => assertSource(data), pattern)
  }
})

test('Status, Monat und Fristen werden geprüft', () => {
  const status = clone()
  status.editions[0].topics[0].status = 'geplant'
  assert.throws(() => assertSource(status), /Status ungültig/)
  const month = clone()
  month.editions[0].month = '2026-13'
  assert.throws(() => assertSource(month), /ungültiger Monat/)
  const order = clone()
  order.editions[0].deadlines.reverse()
  assert.throws(() => assertSource(order), /sortiert/)
})
