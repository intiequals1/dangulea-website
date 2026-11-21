// Typisierter Zugriff auf die beim Build erzeugte Datei mit den freigegebenen Ausgaben.
// Die Quelle ist src/content/rechts-update.json; Entwürfe werden in scripts/prepare-rechts-update.mjs entfernt.
import generated from '../generated/rechts-update.json'

export type RechtsUpdateHinweis = {
  label: string
  title: string
  kurz: string
  zweck: string
  erstellung: string
  grenzen: string
  abgrenzung: string
  korrekturen: string
  persistent: string
}

export type RechtsUpdateTopic = {
  id: string
  title: string
  status: string
  items: { label: string; text: string }[]
  sources: { title: string; url: string }[]
}

export type RechtsUpdateEdition = {
  month: string
  title: string
  stand: string
  freigabe: { status: 'entwurf' | 'freigegeben'; am: string | null }
  summary: string
  topics: RechtsUpdateTopic[]
  deadlines: { date: string; topic: string; what: string }[]
  later?: string
  changes: string[]
  path: string
  url: string
}

export type RechtsUpdateData = { hinweis: RechtsUpdateHinweis; preview: boolean; editions: RechtsUpdateEdition[] }

export const rechtsUpdate = generated as unknown as RechtsUpdateData

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}
