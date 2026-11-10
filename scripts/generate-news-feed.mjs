import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import disclosure from '../src/content/news-disclosure.json' with { type: 'json' }
import withdrawnEditions from '../data/news-withdrawn-editions.json' with { type: 'json' }

const site = 'https://dangulea.at'
const aiDisclosure = `${disclosure.label}. ${disclosure.summary} ${disclosure.review} ${disclosure.limits}`

export function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character])
}

function linkedText(text) {
  let result = ''
  let end = 0
  for (const match of text.matchAll(/https?:\/\/[^\s|]+/g)) {
    const trailing = match[0].match(/[.,;:!?)]*$/)?.[0] ?? ''
    const url = match[0].slice(0, match[0].length - trailing.length)
    result += escapeXml(text.slice(end, match.index))
    result += `<a href="${escapeXml(url)}">${escapeXml(url)}</a>${escapeXml(trailing)}`
    end = match.index + match[0].length
  }
  return result + escapeXml(text.slice(end))
}

export function createNewsFeed(items, withdrawnCounts = {}) {
  if (!Array.isArray(items)) throw new Error('News must be an array')
  const dates = new Set()
  for (const item of items) {
    if (!item || !['date', 'title', 'text'].every((key) => typeof item[key] === 'string') ||
        !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
        !Number.isFinite(Date.parse(`${item.date}T00:00:00Z`)) ||
        new Date(`${item.date}T00:00:00Z`).toISOString().slice(0, 10) !== item.date ||
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(item.title + item.text) ||
        dates.has(item.date)) {
      throw new Error('Invalid or duplicate news entry')
    }
    dates.add(item.date)
  }
  const entries = [...items].sort((a, b) => b.date.localeCompare(a.date))
  const itemXml = entries.map((item) => {
    const link = `${site}/news#news-${item.date}`
    const count = withdrawnCounts[item.date] ?? 0
    const guid = count ? `${site}/news/${item.date}/${count + 1}/` : link
    const body = item.text.replace(/^Fakten:/gm, 'Quellenaussagen:').split(/\n{2,}/).filter((block) => block.trim()).map((block) =>
      `<p>${linkedText(block).replace(/\n/g, '<br />')}</p>`).join('\n')
    const html = `<p><strong>Transparenz zur KI-Unterstützung:</strong> ${escapeXml(aiDisclosure)}</p>\n${body}`
    return `    <item>
      <title>${escapeXml(`${disclosure.label} · ${item.date} – ${item.title}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(html)}</description>
    </item>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Claudiu Dangulea – ${disclosure.label}</title>
    <link>${site}/news</link>
    <description>${escapeXml(aiDisclosure)}</description>
    <language>de-at</language>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>
`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const items = JSON.parse(await readFile(new URL('../public/news-updates.json', import.meta.url), 'utf8'))
  await writeFile(new URL('../dist/rss.xml', import.meta.url), createNewsFeed(items, withdrawnEditions))
  console.log(`RSS feed generated with ${items.length} daily editions`)
}
