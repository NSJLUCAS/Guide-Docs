const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const { chromium } = require(process.env.DOCS_PLAYWRIGHT_MODULE || 'playwright')

;(async () => {
  const base = process.env.DOCS_PREVIEW_URL || 'http://127.0.0.1:4186'
  const browser = await chromium.launch({ headless: true })
  const failures = []
  const check = async (name, action) => {
    try { await action(); console.log('PASS: ' + name) }
    catch (error) { failures.push(name + ': ' + error.message); console.error('FAIL: ' + name) }
  }
  try {
    await check('encoded route survives hydration and refresh; malformed encoding is safe', async () => {
      const context = await browser.newContext()
      try {
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        assert.equal((await page.goto(base + '/%75sage/categories')).status(), 200)
        await page.waitForTimeout(300)
        assert.equal(await page.locator('main h1').innerText(), '分类管理')
        assert.equal((await page.reload()).status(), 200)
        await page.waitForTimeout(300)
        assert.equal(await page.locator('main h1').innerText(), '分类管理')
        await page.evaluate(() => {
          history.pushState(null, '', '/%ZZ')
          dispatchEvent(new PopStateEvent('popstate'))
        })
        await page.getByRole('heading', { name: '页面未找到', exact: true }).waitFor()
        assert.deepEqual(errors, [])
      } finally { await context.close() }
    })
    await check('search retry performs a new request after the first index request fails', async () => {
      const context = await browser.newContext()
      try {
        let requests = 0
        await context.route(/(?:_virtual_search-index[^/]*\.js|search-index[^/]*\.json)(?:\?.*)?$/, async route => {
          requests++
          if (requests === 1) await route.fulfill({ status: 503, body: 'temporary failure' })
          else await route.continue()
        })
        const page = await context.newPage()
        await page.goto(base + '/')
        await page.getByRole('button', { name: '搜索文档', exact: true }).click()
        await page.getByRole('alert').waitFor()
        await page.getByRole('button', { name: '重试', exact: true }).click()
        await page.getByRole('textbox', { name: '搜索文档关键词' }).fill('空白名单')
        await page.getByRole('dialog').getByRole('button', { name: /^登录与安全/ }).waitFor({ timeout: 5000 })
        assert.equal(requests, 2)
        assert.equal(await page.getByRole('alert').count(), 0)
      } finally { await context.close() }
    })
    await check('static distribution retains CSS dependency copyrights', async () => {
      const notices = await fs.readFile(path.join(__dirname, '../dist/DEPENDENCY_LICENSES.txt'), 'utf8')
      assert.ok(notices.includes('Copyright (c) Tailwind Labs, Inc.'), 'Missing Tailwind copyright')
      assert.ok(notices.includes('Copyright (c) 2025 Wombosvideo'), 'Missing animation CSS copyright')
    })
    assert.deepEqual(failures, [])
  } finally { await browser.close() }
})().catch(error => { console.error(error); process.exitCode = 1 })
