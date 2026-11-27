import { HtmlValidate } from 'html-validate'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

export const validator = new HtmlValidate({
  extends: ['html-validate:recommended', 'html-validate:prettier'],
  rules: {
    // Inline React layout styles are valid HTML, not an accessibility failure.
    'no-inline-style': 'off',
    // These are style/SEO advice, not invalid HTML. Preserve full archived titles.
    'long-title': 'warn',
    'no-trailing-whitespace': 'warn',
    'attr-case': 'warn',
    'attribute-boolean-style': 'warn',
  },
})

export async function validateHtml(html, filename) {
  const report = await validator.validateString(html, filename)
  // html-validate does not restrict every http-equiv value. This response-only
  // security header must never return as an ineffective meta element.
  if (/<meta\b[^>]*http-equiv\s*=\s*["']?X-Content-Type-Options\b/i.test(html)) {
    report.valid = false
    report.results.push({ filePath: filename ?? 'inline', messages: [{
      ruleId: 'response-header-as-meta', severity: 2,
      message: 'X-Content-Type-Options requires an HTTP response header, not a meta element',
    }] })
  }
  return report
}

async function htmlFiles(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`
    if (entry.isDirectory()) files.push(...await htmlFiles(path))
    else if (entry.name.endsWith('.html')) files.push(path)
  }
  return files
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const results = []
  for (const path of await htmlFiles('dist')) {
    const report = await validateHtml(await readFile(path, 'utf8'), path)
    if (report.results.length) results.push(...report.results)
  }
  await mkdir('test-results', { recursive: true })
  await writeFile('test-results/html-validation.json', JSON.stringify(results, null, 2) + '\n')
  const errors = results.flatMap(r => r.messages.filter(m => m.severity === 2).map(m => `${r.filePath}: ${m.ruleId}: ${m.message}`))
  if (errors.length) {
    console.error([...new Set(errors)].slice(0, 35).join('\n'))
    console.error(`${errors.length} HTML-Fehler; Details in test-results/html-validation.json`)
    process.exitCode = 1
  } else console.log('HTML-/ARIA-Validierung aller gebauten HTML-Seiten bestanden (lokal, ohne Anfragelimit).')
}
