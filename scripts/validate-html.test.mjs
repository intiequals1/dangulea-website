import test from 'node:test'
import assert from 'node:assert/strict'
import { validateHtml } from './validate-html.mjs'

const document = body => `<!doctype html><html lang="de"><head><title>Prüfung</title></head><body><main><h1>Prüfung</h1>${body}</main></body></html>`
test('HTML gate rejects the original generic aria-label and invalid security meta', async () => {
  const badGroup = await validateHtml(document('<div aria-label="Teilen"><button type="button">Teilen</button></div>'))
  assert.ok(badGroup.results.flatMap(r => r.messages).some(m => m.ruleId === 'aria-label-misuse' && m.severity === 2))
  const badMeta = await validateHtml(document('').replace('</head>', '<meta http-equiv="X-Content-Type-Options" content="nosniff"></head>'))
  assert.equal(badMeta.valid, false)
  const good = await validateHtml(document('<div role="group" aria-label="Teilen"><button type="button">Teilen</button></div>'))
  assert.equal(good.valid, true)
})
