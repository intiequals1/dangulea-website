// Erzeugt src/generated/rechts-update.json mit den freigegebenen Ausgaben des Rechts-Updates.
// Lokale Vorschau mit Entwürfen: RECHTS_UPDATE_VORSCHAU=1 (in CI verboten).
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { publicView } from './rechts-update-core.mjs'

const root = new URL('../', import.meta.url)
const preview = process.env.RECHTS_UPDATE_VORSCHAU === '1'
if (preview && process.env.CI) throw new Error('Rechts-Update: Vorschau mit Entwürfen ist in CI nicht erlaubt')
const source = JSON.parse(await readFile(new URL('src/content/rechts-update.json', root), 'utf8'))
const view = publicView(source, { includeDrafts: preview })
await mkdir(new URL('src/generated/', root), { recursive: true })
await writeFile(new URL('src/generated/rechts-update.json', root), `${JSON.stringify(view, null, 2)}\n`)
const drafts = source.editions.filter(edition => edition.freigabe.status !== 'freigegeben').map(edition => edition.month)
console.log(`Rechts-Update vorbereitet: ${view.editions.length} Ausgabe(n) im Build${preview ? ' (VORSCHAU mit Entwürfen)' : ''}; Entwürfe im Repository: ${drafts.join(', ') || 'keine'}`)
