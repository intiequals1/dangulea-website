/** Extract a short preview from the published text without adding new claims. */
export function shortPreview(text: string, limit = 260): string {
  const clean = text.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim()
  if (clean.length <= limit) return clean
  const cut = clean.slice(0, limit + 1)
  const boundary = cut.lastIndexOf(' ')
  return `${cut.slice(0, boundary > limit / 2 ? boundary : limit).trimEnd()}…`
}

export function newsPreview(text: string): string {
  const headings = [...text.matchAll(/^\s*\d+\.\s+(.+)$/gm)]
    .map((match) => match[1].split(/\s+(?:Fakten|Einordnung|Quellen):/)[0].trim())
  if (headings.length) return shortPreview(headings.join(' · '), 360)
  const facts = text.match(/Fakten:\s*([\s\S]*?)(?:\n\s*\n|Einordnung:|Quellen:|$)/)?.[1]
  return shortPreview(facts || text.split(/Transparenz zur KI-Unterstützung/)[0])
}
