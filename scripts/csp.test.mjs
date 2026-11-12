import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] ?? ''
const scriptSrc = csp.split(';').map(d => d.trim()).find(d => d.startsWith('script-src')) ?? ''

test('script-src erlaubt keine beliebigen Inline-Skripte', () => {
  assert.ok(scriptSrc, 'script-src fehlt')
  assert.ok(!scriptSrc.includes("'unsafe-inline'"))
  assert.ok(!scriptSrc.includes("'unsafe-eval'"))
})

test('jedes ausführbare Inline-Skript in index.html ist per Hash freigegeben', () => {
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(m => !m[1].includes('application/ld+json'))
  assert.ok(inline.length > 0)
  for (const [, , body] of inline) {
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`
    assert.ok(scriptSrc.includes(hash), `Hash ${hash} fehlt in script-src`)
  }
})
