// Hilfsfunktionen für den Reiter „Rechts-Update“ im internen Bereich (/intern).
// Die Daten liegen nicht im Repository, sondern im privaten Google Sheet „Rechts-Update Register“.
// Gelesen wird wie beim Skill-Radar nach der Anmeldung mit dem OAuth-Token der angemeldeten Person
// (Bereich spreadsheets.readonly); ohne Leserecht auf das Sheet liefert die Sheets-API nichts.
import { parseDate, pick, safeUrl, type Row } from './skillRadar.ts'

export const RECHTS_RANGES = ['Ausgaben!A1:G300', 'Themen!A1:K3000', 'Fristen!A1:E1000', 'Betroffenheit!A1:E3000']

export type Ausgabe = {
  monat: string
  titel: string
  stand: Date | null
  status: string
  kurz: string
  aenderungen: string
  datei: string | null
}

export type QuellenLink = { titel: string; url: string | null }

export type Thema = {
  monat: string
  nr: number
  thema: string
  status: string
  wasGilt: string
  abWann: string
  wen: string
  wasTun: string
  hinweise: string
  neu: string
  quellen: QuellenLink[]
}

export type RechtsFrist = { datum: Date | null; thema: string; was: string; status: string; monat: string }

export type Betroffenheit = { monat: string; thema: string; betroffen: string; bezug: string; schritt: string }

export type RechtsData = { ausgaben: Ausgabe[]; themen: Thema[]; fristen: RechtsFrist[]; betroffenheit: Betroffenheit[] }

/** „2026-11“, „2026-11-01“, „01.11.2026“ oder eine Seriennummer → „2026-11“; sonst leer. */
export function toMonat(value: string): string {
  const v = value.trim()
  const iso = v.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/)
  if (iso) return `${iso[1]}-${iso[2]}`
  const d = parseDate(v)
  return d ? d.toISOString().slice(0, 7) : ''
}

/** Eine Quelle je Zeile: „Titel | https://…“. Nur http(s) wird verlinkt. */
export function parseQuellen(value: string): QuellenLink[] {
  return value.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const at = line.lastIndexOf('|')
    const titel = (at === -1 ? line : line.slice(0, at)).trim()
    const url = safeUrl((at === -1 ? line : line.slice(at + 1)).trim())
    return { titel: titel || line, url }
  })
}

export function toAusgaben(rows: Row[]): Ausgabe[] {
  return rows.map(r => ({
    monat: toMonat(pick(r, 'Monat')),
    titel: pick(r, 'Titel'),
    stand: parseDate(pick(r, 'Stand')),
    status: pick(r, 'Status') || 'Entwurf',
    kurz: pick(r, 'Kurz'),
    aenderungen: pick(r, 'Änderungen'),
    datei: safeUrl(pick(r, 'Drive')),
  })).filter(a => a.monat).sort((a, b) => b.monat.localeCompare(a.monat))
}

export function toThemen(rows: Row[]): Thema[] {
  return rows.map(r => ({
    monat: toMonat(pick(r, 'Monat')),
    nr: Number.parseInt(pick(r, 'Nr'), 10) || 0,
    thema: pick(r, 'Thema'),
    status: pick(r, 'Status'),
    wasGilt: pick(r, 'Was gilt'),
    abWann: pick(r, 'Ab wann'),
    wen: pick(r, 'Wen'),
    wasTun: pick(r, 'Was tun'),
    hinweise: pick(r, 'Weitere'),
    neu: pick(r, 'Neu'),
    quellen: parseQuellen(pick(r, 'Quellen')),
  })).filter(t => t.monat && t.thema).sort((a, b) => b.monat.localeCompare(a.monat) || a.nr - b.nr)
}

export function toRechtsFristen(rows: Row[]): RechtsFrist[] {
  return rows.map(r => ({
    datum: parseDate(pick(r, 'Datum')),
    thema: pick(r, 'Thema'),
    was: pick(r, 'Was'),
    status: pick(r, 'Status') || 'offen',
    monat: toMonat(pick(r, 'Ausgabe')),
  })).sort((a, b) => (a.datum?.getTime() ?? 0) - (b.datum?.getTime() ?? 0))
}

export function toBetroffenheit(rows: Row[]): Betroffenheit[] {
  return rows.map(r => ({
    monat: toMonat(pick(r, 'Monat')),
    thema: pick(r, 'Thema'),
    betroffen: pick(r, 'Betroffen'),
    bezug: pick(r, 'Bezug'),
    schritt: pick(r, 'Nächster'),
  })).filter(b => b.monat && b.thema)
}

/** Offene Fristen ab heute; dieselbe Frist aus mehreren Ausgaben erscheint nur einmal (jüngste Ausgabe zählt). */
export function offeneRechtsFristen(fristen: RechtsFrist[], today: Date): RechtsFrist[] {
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const seen = new Map<string, RechtsFrist>()
  for (const f of fristen) {
    if (!f.datum || f.datum.getTime() < start || /^(erledigt|entfällt|verschoben)$/i.test(f.status)) continue
    const key = `${f.datum.toISOString().slice(0, 10)}|${f.thema.toLowerCase()}`
    const prev = seen.get(key)
    if (!prev || f.monat > prev.monat) seen.set(key, f)
  }
  return [...seen.values()].sort((a, b) => (a.datum?.getTime() ?? 0) - (b.datum?.getTime() ?? 0))
}

export function rechtsBatchGetUrl(sheetId: string): string {
  const params = new URLSearchParams({ valueRenderOption: 'FORMATTED_VALUE' })
  for (const r of RECHTS_RANGES) params.append('ranges', r)
  return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values:batchGet?${params}`
}
