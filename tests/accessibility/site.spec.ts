import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'

const article = JSON.parse(readFileSync('dist/news-manifest.json', 'utf8'))[0]
for (const path of ['/', '/person', '/projekte', '/news', '/aktuelle-themen', '/ressourcen', '/impressum', '/intern', article.path]) {
  test(`WCAG A/AA automated checks: ${path}`, async ({ page }) => {
    await page.goto(path)
    if (path === '/aktuelle-themen') await expect(page.getByRole('status')).toHaveCount(0)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(result.violations).toEqual([])
  })
}

test('modal menu contains focus, Escape restores trigger and navigation updates title/focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/news')
  const trigger = page.getByRole('button', { name: 'Menü öffnen', exact: true })
  const dialog = page.getByRole('dialog', { name: 'Navigation' })
  const close = dialog.getByRole('button', { name: 'Menü schließen' })
  await trigger.click()
  await expect(close).toBeFocused()
  await close.press('Shift+Tab')
  await expect(dialog.getByRole('link', { name: 'Privater Bereich' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole('link', { name: 'Aktuelle Themen', exact: true }).click()
  await expect(page).toHaveTitle('Aktuelle Themen · Claudiu Dangulea')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.goBack()
  await expect(page).toHaveTitle('News · Claudiu Dangulea')
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(result.violations).toEqual([])
})

test('low-height menu scrolls to all controls without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menü öffnen', exact: true }).click()
  const dialog = page.getByRole('dialog')
  const last = dialog.getByRole('link', { name: 'Privater Bereich' })
  await last.focus()
  await expect(last).toBeInViewport()
  const dimensions = await dialog.evaluate(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  expect(result.violations).toEqual([])
})

test('resource filter announces empty and restored results without moving focus', async ({ page }) => {
  await page.goto('/ressourcen')
  const search = page.getByRole('searchbox', { name: 'Suche' })
  await search.fill('keine-treffer-xyz-123')
  await expect(page.getByRole('status')).toHaveText(/^0 von \d+ Ressourcen$/)
  await expect(search).toBeFocused()
  await search.fill('SAP')
  await expect(page.getByRole('status')).not.toHaveText(/^0 von/)
  await expect(search).toBeFocused()
})

test('news hash opens the target and skip link reaches main', async ({ page }) => {
  await page.goto(`/news#news-${article.date}`)
  await expect(page.locator(`#news-${article.date} > details`)).toHaveAttribute('open', '')
  await expect(page.locator(`#news-${article.date}`)).toBeFocused()
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Zum Inhalt', exact: true })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('menu remains reachable with enlarged text and WCAG text spacing', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  await page.addStyleTag({ content: 'html { font-size: 200% !important; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' })
  await page.getByRole('button', { name: 'Menü öffnen', exact: true }).click()
  const dialog = page.getByRole('dialog')
  const last = dialog.getByRole('link', { name: 'Privater Bereich' })
  await last.focus()
  await expect(last).toBeInViewport()
  const dimensions = await dialog.evaluate(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
  await last.press('Escape')
  await expect(dialog).not.toBeVisible()
})
