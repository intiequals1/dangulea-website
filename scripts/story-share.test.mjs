import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { StoryImageCache, handOffStory } from '../src/utils/storyShare.ts'

const png = execFileSync('python3', ['-c', 'from PIL import Image; import sys; Image.new("RGB", (1080, 1920), "#1a1714").save(sys.stdout.buffer, "PNG")'])
const imagePath = '/news-media/2026-11-04-1-example-story.png'
const article = { title: 'SAP & KI', url: 'https://dangulea.at/news/2026-11-04/1/', storyImage: imagePath }
const file = new File([png], 'story.png', { type: 'image/png' })
const response = () => new Response(png, { headers: { 'content-type': 'image/png' } })

test('preloads one hosted image, deduplicates concurrent requests and reuses its file', async () => {
  let calls = 0
  const cache = new StoryImageCache(async (path, options) => {
    calls++
    assert.equal(path, imagePath)
    assert.equal(options.cache, 'force-cache')
    return response()
  })
  const [a, b] = await Promise.all([cache.prepare(imagePath), cache.prepare(imagePath)])
  assert.equal(a, b)
  assert.equal(a, await cache.prepare(imagePath))
  assert.equal(a.type, 'image/png')
  assert.equal(a.size, png.length)
  assert.equal(calls, 1)
})

test('limits memory while allowing the browser HTTP cache to serve older images', async () => {
  let calls = 0
  const cache = new StoryImageCache(async () => { calls++; return response() }, 1)
  await cache.prepare(imagePath)
  await cache.prepare(imagePath.replace('-1-', '-2-'))
  await cache.prepare(imagePath)
  assert.equal(calls, 3)
})

test('rejects broken image responses and retries instead of caching a failure', async () => {
  for (const badResponse of [new Response('missing', { status: 404 }), new Response('<html>fallback</html>', { headers: { 'content-type': 'text/html' } }), new Response('not a png', { headers: { 'content-type': 'image/png' } })]) {
    let calls = 0
    const cache = new StoryImageCache(async () => ++calls === 1 ? badResponse : response())
    await assert.rejects(cache.prepare(imagePath))
    assert.equal((await cache.prepare(imagePath)).type, 'image/png')
    assert.equal(calls, 2)
  }
  const badDimensions = Buffer.from(png)
  badDimensions.writeUInt32BE(1200, 16)
  const cache = new StoryImageCache(async () => new Response(badDimensions, { headers: { 'content-type': 'image/png' } }))
  await assert.rejects(cache.prepare(imagePath), /Ungültiges/)
  await assert.rejects(cache.prepare('https://example.com/story.png'), /Bildpfad/)
})

test('hands off the prepared PNG AND canonical URL synchronously from the click', async () => {
  let shared, resolveCopy
  const pendingCopy = new Promise(resolve => { resolveCopy = resolve })
  const result = handOffStory(article, file, {
    canShare: () => true,
    clipboard: { writeText: url => { assert.equal(url, article.url); return pendingCopy } },
    share: payload => { shared = payload; return Promise.resolve() },
  })
  // Crucial on Safari: no awaited fetch or clipboard access before share().
  assert.equal(shared.files[0], file)
  assert.equal(shared.url, article.url)
  assert.equal(shared.title, article.title)
  resolveCopy()
  assert.deepEqual(await result, { outcome: 'shared', copied: true })
})

test('clipboard denial does not block native image and link sharing', async () => {
  let calls = 0
  const result = await handOffStory(article, file, {
    canShare: () => true,
    clipboard: { writeText: () => Promise.reject(new Error('denied')) },
    share: async () => { calls++ },
  })
  assert.deepEqual(result, { outcome: 'shared', copied: false })
  assert.equal(calls, 1)
})

test('never drops the image or URL silently when a device rejects the combination', async () => {
  let shared = false
  const result = await handOffStory(article, file, {
    canShare: payload => !payload.url,
    share: async () => { shared = true },
  })
  assert.deepEqual(result, { outcome: 'unsupported', copied: false })
  assert.equal(shared, false)
})

test('cancellation stays cancellation and device failures are not reported as successful', async () => {
  for (const [name, outcome] of [['AbortError', 'cancelled'], ['DataError', 'failed']]) {
    const result = await handOffStory(article, file, {
      canShare: () => true,
      share: () => Promise.reject(new DOMException('test', name)),
    })
    assert.deepEqual(result, { outcome, copied: false })
  }
})

test('capability errors and missing sharing support produce an explicit fallback', async () => {
  assert.equal((await handOffStory(article, file, {})).outcome, 'unsupported')
  assert.equal((await handOffStory(article, file, { share: async () => {}, canShare: () => { throw new Error('blocked') } })).outcome, 'unsupported')
})
