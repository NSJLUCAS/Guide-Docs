const assert = require('node:assert/strict')
const { chromium } = require(process.env.DOCS_PLAYWRIGHT_MODULE || 'playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto(process.env.DOCS_DEV_URL || 'http://127.0.0.1:5198')
    await page.getByRole('button', { name: '搜索文档', exact: true }).click()
    await page.getByRole('textbox', { name: '搜索文档关键词' }).fill('空白名单')
    await page.getByRole('dialog').getByRole('button', { name: /^登录与安全/ }).waitFor()
    assert.deepEqual(errors, [], 'Development server must mount the empty template without hydration errors')
    console.log('PASS: development template mounts cleanly and fetches Chinese search index')
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
