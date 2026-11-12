import test from 'node:test'
import assert from 'node:assert/strict'
import {
  daysUntil, parseDate, rowsToObjects, safeUrl, splitIds,
  toFristen, toMeldungen, toSkills, trends, upcoming,
} from '../src/utils/skillRadar.ts'

test('turns sheet values into objects and skips rows without first value', () => {
  const rows = rowsToObjects([['ID', 'Skill'], ['S01', 'Buchhaltung'], ['', 'leer'], ['S02']])
  assert.deepEqual(rows, [{ ID: 'S01', Skill: 'Buchhaltung' }, { ID: 'S02', Skill: '' }])
  assert.deepEqual(rowsToObjects(undefined), [])
})

test('parses ISO, Austrian and serial dates', () => {
  assert.equal(parseDate('2027-12-31')?.toISOString().slice(0, 10), '2027-12-31')
  assert.equal(parseDate('2.12.2026')?.toISOString().slice(0, 10), '2026-12-02')
  assert.equal(parseDate('46358')?.toISOString().slice(0, 10), '2026-12-02')
  assert.equal(parseDate('12/2026'), null)
})

test('expands skill id lists and ranges', () => {
  assert.deepEqual(splitIds('S05, S06; S07'), ['S05', 'S06', 'S07'])
  assert.deepEqual(splitIds('S05–S08'), ['S05', 'S06', 'S07', 'S08'])
  assert.deepEqual(splitIds('alle mit Suchbegriff'), [])
})

test('maps sheet columns by header prefix', () => {
  const [s] = toSkills(rowsToObjects([
    ['ID', 'Bereich', 'Skill', 'Hängt ab von', 'Eigenregie / KI-Ersatz (Einschätzung Claude, zu prüfen)', 'Quellen (IDs)', 'Status'],
    ['S12', 'Daten & BI', 'Power BI', 'Fabric', 'hoch', 'Q05, Q06', ''],
  ]))
  assert.equal(s.eigenregie, 'hoch')
  assert.deepEqual(s.quellen, ['Q05', 'Q06'])
  assert.equal(s.status, 'aktiv')
})

test('sorts reports newest first and filters deadlines to the next 12 weeks', () => {
  const m = toMeldungen(rowsToObjects([['ID', 'Datum', 'Skill-ID'], ['M001', '2026-11-12', 'S02'], ['M002', '2026-11-16', 'S12']]))
  assert.deepEqual(m.map(x => x.id), ['M002', 'M001'])
  const f = toFristen(rowsToObjects([
    ['Datum', 'Ereignis', 'Betrifft (Skill-IDs)', 'Einordnung', 'Quelle', 'Status'],
    ['2026-12-02', 'Art. 50(2)', 'S21', 'Chance', '', 'offen'],
    ['2026-07-01', 'USt 4,9 %', 'S02', 'erneuern', '', 'in Kraft'],
    ['2027-12-31', 'SolMan', 'S08', 'erneuern', '', 'offen'],
  ]))
  const today = new Date(2026, 10, 12)
  assert.deepEqual(upcoming(f, today).map(x => x.ereignis), ['Art. 50(2)'])
  assert.equal(daysUntil(f[1].datum, today), 20)
})

test('computes demand trends per search term', () => {
  const [t] = trends([
    { datum: parseDate('2026-12-07'), suchbegriff: 'Power BI Wien', treffer: 80, skill: 'S12' },
    { datum: parseDate('2027-01-04'), suchbegriff: 'Power BI Wien', treffer: 60, skill: 'S12' },
  ])
  assert.deepEqual(t.werte, [80, 60])
  assert.equal(t.veraenderung, -25)
})

test('only links http(s) sources', () => {
  assert.equal(safeUrl('https://example.org/x'), 'https://example.org/x')
  assert.equal(safeUrl('javascript:alert(1)'), null)
  assert.equal(safeUrl('Blatt Kundenfragen, Zeile 3'), null)
})
