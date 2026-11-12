// Hilfsfunktionen für den internen Bereich (/intern).
// Die Daten liegen nicht im Repository, sondern im privaten Google Sheet „Skill-Radar Register“.
// Die Seite liest es nach der Google-Anmeldung mit dem Token der angemeldeten Person;
// ohne Leserecht auf das Sheet liefert die Sheets-API nichts.

export type Row = Record<string, string>

export type Skill = {
  id: string
  bereich: string
  skill: string
  beleg: string
  einsatz: string
  abhaengigkeiten: string
  anzeichen: string
  eigenregie: string
  quellen: string[]
  suchbegriffe: string
  status: string
  geprueft: string
  notiz: string
}

export type Meldung = {
  id: string
  datum: Date | null
  skills: string[]
  einordnung: string
  meldung: string
  einschaetzung: string
  frist: string
  vorschlag: string
  quelle: string
  entscheidung: string
  massnahme: string
  erledigt: string
}

export type Frist = {
  datum: Date | null
  ereignis: string
  skills: string[]
  einordnung: string
  quelle: string
  status: string
  notiz: string
}

export type Quelle = {
  id: string
  art: string
  name: string
  url: string
  skills: string[]
  hinweis: string
}

export type NachfragePunkt = { datum: Date | null; suchbegriff: string; treffer: number | null; skill: string }

export const SHEET_RANGES = ['Register!A1:M500', 'Meldungen!A1:L2000', 'Fristen!A1:G500', 'Quellen!A1:G200', 'Nachfrage!A1:H3000']
export const OAUTH_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'

/** Wandelt die Werte eines Blatts (erste Zeile = Spaltenköpfe) in Objekte um; Zeilen ohne ersten Wert entfallen. */
export function rowsToObjects(values: unknown[][] | undefined): Row[] {
  if (!values || values.length < 2) return []
  const head = values[0].map(v => String(v ?? '').trim())
  return values.slice(1)
    .filter(r => String(r?.[0] ?? '').trim() !== '')
    .map(r => Object.fromEntries(head.map((h, i) => [h, String(r[i] ?? '').trim()])))
}

/** Liest eine Spalte über den Anfang ihres Spaltenkopfs, damit kleine Umbenennungen im Sheet nichts brechen. */
export function pick(row: Row, prefix: string): string {
  const key = Object.keys(row).find(k => k.toLowerCase().startsWith(prefix.toLowerCase()))
  return key ? row[key] : ''
}

/** Akzeptiert 2026-12-31, 31.12.2026 und Google-Seriennummern (Tage seit 30.12.1899). */
export function parseDate(value: string): Date | null {
  const v = value.trim()
  let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  m = v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
  if (/^\d{5}(\.\d+)?$/.test(v)) return new Date(Date.UTC(1899, 11, 30) + Math.floor(+v) * 86400000)
  return null
}

/** „S05, S06“ und „S05–S11“ (auch mit Bindestrich) → einzelne IDs. */
export function splitIds(value: string): string[] {
  const out: string[] = []
  for (const part of value.split(/[,;]/).map(p => p.trim()).filter(Boolean)) {
    const range = part.match(/^([A-Z])(\d+)\s*[–-]\s*\1?(\d+)$/)
    if (range) {
      const width = range[2].length
      for (let n = +range[2]; n <= +range[3]; n++) out.push(`${range[1]}${String(n).padStart(width, '0')}`)
    } else if (/^[A-Z]\d+$/.test(part)) out.push(part)
  }
  return out
}

export function toSkills(rows: Row[]): Skill[] {
  return rows.map(r => ({
    id: pick(r, 'ID'),
    bereich: pick(r, 'Bereich'),
    skill: pick(r, 'Skill'),
    beleg: pick(r, 'Beleg'),
    einsatz: pick(r, 'Einsatz'),
    abhaengigkeiten: pick(r, 'Hängt ab'),
    anzeichen: pick(r, 'Anzeichen'),
    eigenregie: pick(r, 'Eigenregie'),
    quellen: splitIds(pick(r, 'Quellen')),
    suchbegriffe: pick(r, 'Suchbegriffe'),
    status: pick(r, 'Status') || 'aktiv',
    geprueft: pick(r, 'Zuletzt'),
    notiz: pick(r, 'Notiz'),
  }))
}

export function toMeldungen(rows: Row[]): Meldung[] {
  return rows.map(r => ({
    id: pick(r, 'ID'),
    datum: parseDate(pick(r, 'Datum')),
    skills: splitIds(pick(r, 'Skill')),
    einordnung: pick(r, 'Einordnung'),
    meldung: pick(r, 'Meldung'),
    einschaetzung: pick(r, 'Einschätzung'),
    frist: pick(r, 'Frist'),
    vorschlag: pick(r, 'Vorschlag'),
    quelle: pick(r, 'Quelle'),
    entscheidung: pick(r, 'Entscheidung') || 'offen',
    massnahme: pick(r, 'Maßnahme'),
    erledigt: pick(r, 'Erledigt'),
  })).sort((a, b) => (b.datum?.getTime() ?? 0) - (a.datum?.getTime() ?? 0) || b.id.localeCompare(a.id))
}

export function toFristen(rows: Row[]): Frist[] {
  return rows.map(r => ({
    datum: parseDate(pick(r, 'Datum')),
    ereignis: pick(r, 'Ereignis'),
    skills: splitIds(pick(r, 'Betrifft')),
    einordnung: pick(r, 'Einordnung'),
    quelle: pick(r, 'Quelle'),
    status: pick(r, 'Status'),
    notiz: pick(r, 'Notiz'),
  })).sort((a, b) => (a.datum?.getTime() ?? 0) - (b.datum?.getTime() ?? 0))
}

export function toQuellen(rows: Row[]): Quelle[] {
  return rows.map(r => ({
    id: pick(r, 'ID'),
    art: pick(r, 'Art'),
    name: pick(r, 'Quelle'),
    url: pick(r, 'URL'),
    skills: splitIds(pick(r, 'Betrifft')),
    hinweis: pick(r, 'Worauf'),
  }))
}

export function toNachfrage(rows: Row[]): NachfragePunkt[] {
  return rows.map(r => {
    const t = pick(r, 'Treffer').replace(/[^\d]/g, '')
    return { datum: parseDate(pick(r, 'Datum')), suchbegriff: pick(r, 'Suchbegriff'), treffer: t ? +t : null, skill: pick(r, 'Skill') }
  })
}

/** Ganze Tage von heute bis zum Datum (UTC-Mitternacht), negativ für Vergangenes. */
export function daysUntil(date: Date, today: Date): number {
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((date.getTime() - t) / 86400000)
}

/** Offene Fristen der nächsten `days` Tage (Status nicht erledigt/entfällt/in Kraft). */
export function upcoming(fristen: Frist[], today: Date, days = 84): Frist[] {
  return fristen.filter(f => {
    if (!f.datum || /^(erledigt|entfällt|in kraft)$/i.test(f.status)) return false
    const d = daysUntil(f.datum, today)
    return d >= 0 && d <= days
  })
}

export type Trend = { suchbegriff: string; skill: string; werte: number[]; letzter: number | null; veraenderung: number | null }

/** Verlauf je Suchbegriff (zeitlich sortiert) mit prozentualer Veränderung gegenüber dem vorigen Wert. */
export function trends(points: NachfragePunkt[]): Trend[] {
  const groups = new Map<string, NachfragePunkt[]>()
  for (const p of points) {
    if (!p.suchbegriff) continue
    groups.set(p.suchbegriff, [...(groups.get(p.suchbegriff) ?? []), p])
  }
  return [...groups.entries()].map(([suchbegriff, list]) => {
    const werte = list.sort((a, b) => (a.datum?.getTime() ?? 0) - (b.datum?.getTime() ?? 0))
      .map(p => p.treffer).filter((v): v is number => v !== null)
    const letzter = werte.at(-1) ?? null
    const vorher = werte.length > 1 ? werte[werte.length - 2] : null
    const veraenderung = letzter !== null && vorher ? Math.round(((letzter - vorher) / vorher) * 100) : null
    return { suchbegriff, skill: list[0].skill, werte, letzter, veraenderung }
  }).sort((a, b) => a.suchbegriff.localeCompare(b.suchbegriff, 'de'))
}

export function buildAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: OAUTH_SCOPE,
    include_granted_scopes: 'true',
    prompt: 'select_account',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export type AuthResult = { accessToken?: string; expiresIn?: number; state?: string; error?: string }

/** Liest die Antwort von Google aus dem URL-Fragment (#access_token=…&state=…). */
export function parseAuthHash(hash: string): AuthResult | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!/(^|&)(access_token|error)=/.test(raw)) return null
  const p = new URLSearchParams(raw)
  return {
    accessToken: p.get('access_token') ?? undefined,
    expiresIn: p.has('expires_in') ? Number(p.get('expires_in')) : undefined,
    state: p.get('state') ?? undefined,
    error: p.get('error') ?? undefined,
  }
}

export function sheetUrl(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/edit`
}

export function batchGetUrl(sheetId: string): string {
  const params = new URLSearchParams({ valueRenderOption: 'FORMATTED_VALUE' })
  for (const r of SHEET_RANGES) params.append('ranges', r)
  return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values:batchGet?${params}`
}

/** Nur http(s)-Links werden als Link dargestellt. */
export function safeUrl(value: string): string | null {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null
  } catch {
    return null
  }
}
