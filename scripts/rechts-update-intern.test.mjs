import test from 'node:test'
import assert from 'node:assert/strict'
import { rowsToObjects } from '../src/utils/skillRadar.ts'
import {
  offeneRechtsFristen, parseQuellen, rechtsBatchGetUrl, toAusgaben, toBetroffenheit, toMonat, toRechtsFristen, toThemen,
} from '../src/utils/rechtsUpdate.ts'

test('normalises the edition month from text, dates and serial numbers', () => {
  assert.equal(toMonat('2026-11'), '2026-11')
  assert.equal(toMonat('2026-11-21'), '2026-11')
  assert.equal(toMonat('01.12.2026'), '2026-12')
  assert.equal(toMonat('46357'), '2026-12')
  assert.equal(toMonat('November'), '')
})

test('parses one source per line and links only http(s)', () => {
  const q = parseQuellen('EUR-Lex | https://eur-lex.europa.eu/eli/reg/2024/2847/oj\nNur Titel\nBöse | javascript:alert(1)')
  assert.deepEqual(q, [
    { titel: 'EUR-Lex', url: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj' },
    { titel: 'Nur Titel', url: null },
    { titel: 'Böse', url: null },
  ])
})

test('maps the four sheets by header prefix and sorts editions newest first', () => {
  const ausgaben = toAusgaben(rowsToObjects([
    ['Monat', 'Titel', 'Stand', 'Status', 'Kurzüberblick', 'Änderungen gegenüber Vorausgabe', 'Drive-Datei'],
    ['2026-11', 'Ausgabe November 2026', '2026-11-21', 'Entwurf', 'Kurz', 'Erste Ausgabe.', 'https://drive.google.com/x'],
    ['2026-12', 'Ausgabe Dezember 2026', '2026-12-01', 'geprüft', 'Kurz 2', '', 'kein Link'],
  ]))
  assert.deepEqual(ausgaben.map(a => [a.monat, a.status, a.datei]), [['2026-12', 'geprüft', null], ['2026-11', 'Entwurf', 'https://drive.google.com/x']])
  assert.equal(ausgaben[1].stand?.toISOString().slice(0, 10), '2026-11-21')

  const themen = toThemen(rowsToObjects([
    ['Monat', 'Nr', 'Thema', 'Status', 'Was gilt', 'Ab wann', 'Wen betrifft es', 'Was tun', 'Weitere Hinweise', 'Neu seit letzter Ausgabe', 'Quellen'],
    ['2026-11', '2', 'PHG 2026', 'Entwurf', 'a', 'b', 'c', 'd', '', 'e', 'RIS | https://ris.bka.gv.at/'],
    ['2026-11', '1', 'CRA', 'in Kraft', 'a', 'b', 'c', 'd', 'h', 'Erste Ausgabe.', ''],
  ]))
  assert.deepEqual(themen.map(t => [t.nr, t.thema, t.wen, t.quellen.length]), [[1, 'CRA', 'c', 0], [2, 'PHG 2026', 'c', 1]])

  const betroffen = toBetroffenheit(rowsToObjects([
    ['Monat', 'Thema', 'Betroffen?', 'Bezug', 'Nächster Schritt'],
    ['2026-11', 'CRA', 'nein', 'Register', 'Gate'],
  ]))
  assert.deepEqual(betroffen, [{ monat: '2026-11', thema: 'CRA', betroffen: 'nein', bezug: 'Register', schritt: 'Gate' }])
})

test('open deadlines skip past and settled ones and keep one entry per date and topic', () => {
  const fristen = toRechtsFristen(rowsToObjects([
    ['Datum', 'Thema', 'Was passiert', 'Status', 'Ausgabe'],
    ['2026-12-09', 'PHG 2026', 'geplant', 'offen', '2026-11'],
    ['2026-12-09', 'PHG 2026', 'Inkrafttreten bestätigt', 'offen', '2026-12'],
    ['2026-10-01', 'NISG 2026', 'in Kraft', 'offen', '2026-11'],
    ['2027-01-12', 'Data Act', 'Wechselentgelte', 'erledigt', '2026-11'],
    ['2027-09-30', 'NISG 2026', 'Selbstdeklaration', '', '2026-11'],
  ]))
  const offen = offeneRechtsFristen(fristen, new Date(Date.UTC(2026, 10, 22)))
  assert.deepEqual(offen.map(f => [f.datum?.toISOString().slice(0, 10), f.was]), [
    ['2026-12-09', 'Inkrafttreten bestätigt'],
    ['2027-09-30', 'Selbstdeklaration'],
  ])
})

test('builds the batchGet URL for all four sheets, read-only', () => {
  const url = new URL(rechtsBatchGetUrl('abc'))
  assert.equal(url.origin + url.pathname, 'https://sheets.googleapis.com/v4/spreadsheets/abc/values:batchGet')
  assert.deepEqual(url.searchParams.getAll('ranges').map(r => r.split('!')[0]), ['Ausgaben', 'Themen', 'Fristen', 'Betroffenheit'])
})
