// Monatliches Rechts-Update: Prüfung der Quelldatei und Auswahl der freigegebenen Ausgaben.
// Nur Ausgaben mit freigabe.status "freigegeben" gelangen in den Build. Entwürfe bleiben im Repository,
// werden aber weder gerendert noch ins JavaScript-Bundle übernommen.

export const SITE = 'https://dangulea.at'
export const STATUS = ['in Kraft', 'beschlossen', 'Entwurf', 'in Verhandlung']
const HINWEIS_KEYS = ['label', 'title', 'kurz', 'zweck', 'erstellung', 'grenzen', 'abgrenzung', 'korrekturen', 'persistent']
// Der interne Anhang der Drive-Fassung („eigene Betroffenheit“) darf nie in die öffentliche Quelle gelangen.
const FORBIDDEN = /eigene Betroffenheit|nicht weitergeben|\(intern|Anhang \(intern/i
const controls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u

const text = (value) => typeof value === 'string' && value.trim() !== '' && !controls.test(value)
const isoDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value

function fail(message) { throw new Error(`Rechts-Update: ${message}`) }

export function assertSource(data) {
  if (!data || typeof data !== 'object') fail('Quelldatei fehlt oder ist kein Objekt')
  const raw = JSON.stringify(data)
  if (FORBIDDEN.test(raw)) fail('interner Anhang oder interne Vermerke in der öffentlichen Quelle')
  for (const key of HINWEIS_KEYS) if (!text(data.hinweis?.[key])) fail(`Hinweistext fehlt: ${key}`)
  if (!/Keine Rechtsberatung/.test(data.hinweis.grenzen)) fail('Hinweis „Keine Rechtsberatung“ fehlt')
  if (!/KI-Unterstützung/.test(data.hinweis.erstellung)) fail('KI-Hinweis fehlt')
  if (!/Studium/.test(data.hinweis.zweck)) fail('Zweckangabe fehlt')
  if (!Array.isArray(data.editions)) fail('editions muss ein Array sein')
  const months = new Set()
  for (const edition of data.editions) {
    const id = edition?.month
    if (typeof id !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(id)) fail(`ungültiger Monat: ${id}`)
    if (months.has(id)) fail(`doppelte Ausgabe: ${id}`)
    months.add(id)
    if (!text(edition.title) || !text(edition.summary)) fail(`${id}: Titel oder Kurzüberblick fehlt`)
    if (!isoDate(edition.stand) || !edition.stand.startsWith(id)) fail(`${id}: Stand muss ein Datum im Ausgabemonat sein`)
    const freigabe = edition.freigabe
    if (!freigabe || !['entwurf', 'freigegeben'].includes(freigabe.status)) fail(`${id}: Freigabestatus fehlt`)
    if (freigabe.status === 'freigegeben' && (!isoDate(freigabe.am) || freigabe.am < edition.stand)) {
      fail(`${id}: freigegebene Ausgabe braucht ein Freigabedatum ab dem Stand`)
    }
    if (freigabe.status === 'entwurf' && freigabe.am !== null) fail(`${id}: Entwurf darf kein Freigabedatum haben`)
    if (!Array.isArray(edition.topics) || edition.topics.length === 0) fail(`${id}: keine Themen`)
    const topicIds = new Set()
    for (const topic of edition.topics) {
      if (!/^[a-z0-9-]+$/.test(topic?.id ?? '') || topicIds.has(topic.id)) fail(`${id}: ungültige oder doppelte Themen-ID ${topic?.id}`)
      topicIds.add(topic.id)
      if (!text(topic.title) || !STATUS.includes(topic.status)) fail(`${id}/${topic.id}: Titel oder Status ungültig`)
      if (!Array.isArray(topic.items) || topic.items.length === 0) fail(`${id}/${topic.id}: keine Inhalte`)
      for (const item of topic.items) if (!text(item?.label) || !text(item?.text)) fail(`${id}/${topic.id}: leerer Abschnitt`)
      if (!Array.isArray(topic.sources) || topic.sources.length === 0) fail(`${id}/${topic.id}: ohne Quelle keine Veröffentlichung`)
      for (const source of topic.sources) {
        if (!text(source?.title)) fail(`${id}/${topic.id}: Quellentitel fehlt`)
        let url
        try { url = new URL(source.url) } catch { fail(`${id}/${topic.id}: ungültige Quelle ${source.url}`) }
        if (url.protocol !== 'https:' || url.username || url.password) fail(`${id}/${topic.id}: nur https-Quellen ohne Zugangsdaten`)
      }
    }
    if (!Array.isArray(edition.deadlines)) fail(`${id}: Fristen fehlen`)
    let previous = ''
    for (const deadline of edition.deadlines) {
      if (!isoDate(deadline?.date) || !text(deadline.topic) || !text(deadline.what)) fail(`${id}: ungültige Frist`)
      if (deadline.date < previous) fail(`${id}: Fristen nicht nach Datum sortiert`)
      previous = deadline.date
    }
    if (edition.later !== undefined && !text(edition.later)) fail(`${id}: Feld „later“ leer`)
    if (!Array.isArray(edition.changes) || !edition.changes.every(text)) fail(`${id}: Änderungen fehlen`)
  }
  return data
}

export function editionPath(month) { return `/news/rechts-update/${month}/` }

// includeDrafts nur für die lokale Vorschau (RECHTS_UPDATE_VORSCHAU=1), nie im Deployment.
export function publicView(data, { includeDrafts = false } = {}) {
  assertSource(data)
  const editions = data.editions
    .filter(edition => includeDrafts || edition.freigabe.status === 'freigegeben')
    .sort((a, b) => b.month.localeCompare(a.month))
    .map(edition => ({ ...edition, path: editionPath(edition.month), url: `${SITE}${editionPath(edition.month)}` }))
  return { hinweis: data.hinweis, preview: includeDrafts, editions }
}

export function formatDate(iso) {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}
