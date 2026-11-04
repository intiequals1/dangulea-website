// Run after the production build. Damage real output, assert that the release
// gate fails, and restore every file even when a test assertion fails.
import assert from 'node:assert/strict'
import { readFile, writeFile, unlink } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const root = new URL('../', import.meta.url)
const [article] = JSON.parse(await readFile(new URL('src/generated/news-articles.json', root), 'utf8'))
const page = new URL(`dist${article.path}index.html`, root)
const image = new URL(`dist${article.ogImage}`, root)
const originalPage = await readFile(page)
const originalImage = await readFile(image)
const news = new URL('public/news-updates.json', root)
const originalNews = await readFile(news)

function rejected(command, args, expected) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 3_000_000 })
  assert.equal(result.error, undefined)
  assert.notEqual(result.status, 0, 'Defektes Artefakt wurde akzeptiert')
  assert.match(result.stdout + result.stderr, expected)
}

try {
  await unlink(page)
  rejected('python3', ['scripts/validate-news.py'], /2026-|No such file/)
  console.log('OK: fehlende Artikelseite stoppt Veröffentlichung')
  await writeFile(page, originalPage.toString().replace('property="og:type" content="article"', 'property="og:type" content="profile"'))
  rejected('python3', ['scripts/validate-news.py'], /og:type/)
  console.log('OK: falsche Metadaten stoppen Veröffentlichung')
  await writeFile(page, originalPage.toString().replace(`data-share-url="${article.url}"`, 'data-share-url="https://dangulea.at/news"'))
  rejected('python3', ['scripts/validate-news.py'], /Share-Button/)
  console.log('OK: falscher Share-Link stoppt Veröffentlichung')
  await writeFile(page, originalPage.toString().replace(`data-story-url="${article.url}"`, 'data-story-url="https://dangulea.at/news"'))
  rejected('python3', ['scripts/validate-news.py'], /Story-Teilen-Button/)
  console.log('OK: falscher Story-Artikellink stoppt Veröffentlichung')
  await writeFile(page, originalPage)
  await writeFile(image, originalImage.subarray(0, 100))
  rejected('python3', ['scripts/validate-news.py'], /2026-|PNG|truncated/)
  console.log('OK: beschädigtes PNG stoppt Veröffentlichung')
  await writeFile(image, originalImage)
  const editions = JSON.parse(originalNews)
  editions[0].text = editions[0].text.replace('Fakten:', 'Fakten: Testkorrektur.')
  await writeFile(news, JSON.stringify(editions))
  rejected('node', ['scripts/prepare-news.mjs'], /Archiv ist nicht synchron/)
  console.log('OK: nicht archivierter News-Lauf stoppt Build')
} finally {
  await writeFile(page, originalPage)
  await writeFile(image, originalImage)
  await writeFile(news, originalNews)
}
console.log('Alle 6 Fehlerfälle wurden vom verpflichtenden Release-Gate zurückgewiesen; Originaldateien wiederhergestellt.')
