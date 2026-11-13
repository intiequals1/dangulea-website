const icons = ['schloss', 'cloud', 'schild', 'zahnrad', 'dokument', 'kalender', 'warnung']
const fields = ['og_kategorie', 'og_titel', 'og_fakten', 'og_icon', 'og_alt']
const cleanText = (value, limit) => typeof value === 'string' &&
  value === value.trim() && Array.from(value).length > 0 && Array.from(value).length <= limit &&
  !/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]|https?:|www\./iu.test(value)
const hasKeys = (object, keys) => object && typeof object === 'object' &&
  Object.keys(object).length === keys.length && keys.every(key => Object.hasOwn(object, key))

const months = 'Januar Februar März April Mai Juni Juli August September Oktober November Dezember'.split(' ')
const monthDate = new RegExp(`(?<![\\p{L}\\p{N}])(\\d{1,2})\\.\\s+(${months.join('|')})\\s+(\\d{4})(?!\\p{N})`, 'giu')

function comparableFacts(text) {
  return text.replace(/\s+/g, ' ').replace(monthDate, (_, day, month, year) => {
    const monthNumber = months.findIndex(name => name.toLowerCase() === month.toLowerCase()) + 1
    return `${day.padStart(2, '0')}.${String(monthNumber).padStart(2, '0')}.${year}`
  })
}

export function assertPreview(preview, facts, id) {
  if (!hasKeys(preview, fields) ||
      !cleanText(preview.og_kategorie, 30) || !/\p{Lu}/u.test(preview.og_kategorie) ||
      preview.og_kategorie !== preview.og_kategorie.toUpperCase() ||
      !cleanText(preview.og_titel, 70) || /["'„“”‚‘’«»‹›]/u.test(preview.og_titel) ||
      /\p{P}$/u.test(preview.og_titel) || !cleanText(preview.og_alt, 120) ||
      !icons.includes(preview.og_icon) || !Array.isArray(preview.og_fakten) ||
      preview.og_fakten.length > 2) throw new Error(`Ungültige Vorschaugrafik: ${id}`)

  const normalizedFacts = comparableFacts(facts)
  for (const fact of preview.og_fakten) {
    if (!hasKeys(fact, ['datum', 'label']) || !cleanText(fact.datum, 14) ||
        !cleanText(fact.label, 22) || !/\p{Nd}/u.test(fact.datum)) {
      throw new Error(`Ungültiger Fakt für die Vorschaugrafik: ${id}`)
    }
    const value = comparableFacts(fact.datum)
    const literal = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (!new RegExp(`(?<![\\p{L}\\p{N}]|\\d[.,])${literal}(?![\\p{L}\\p{N}]|[.,]\\d)`, 'iu').test(normalizedFacts)) {
      throw new Error(`Wert der Vorschaugrafik fehlt in den Quellenaussagen: ${id} (${fact.datum})`)
    }
  }
}

export function previewClaims(preview) {
  if (!preview) return []
  return [
    { id: 'og-category', text: preview.og_kategorie },
    { id: 'og-headline', text: preview.og_titel },
    ...preview.og_fakten.map(({ datum, label }, index) => ({ id: `og-fact-${index + 1}`, text: `${datum} · ${label}` })),
    { id: 'og-alt', text: preview.og_alt },
  ]
}
