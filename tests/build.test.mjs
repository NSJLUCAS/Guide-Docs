import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validateLinks } from '../scripts/validate-links.mjs'
import { resolveOrigin } from '../scripts/config.mjs'
import { searchText } from '../scripts/content-index.mjs'
import { pageHead } from '../scripts/metadata.mjs'

test('rejects a missing route and fragment, accepts encoded heading and static file', async () => {
  const dist = await mkdtemp(join(tmpdir(), 'guide-docs-links-'))
  try {
    await writeFile(join(dist, 'LICENSE.txt'), 'MIT')
    const pages = new Map([
      ['/', '<a href="/usage/categories#%E7%A9%BA%E5%88%86%E7%B1%BB">ok</a><a href="/missing">bad</a><a href="/usage/categories#wrong">bad</a><a href="/LICENSE.txt">license</a>'],
      ['/usage/categories', '<h2 id="空分类">空分类</h2><a href="#空分类">ok</a>'],
    ])
    assert.deepEqual(validateLinks(pages, dist), ['/: /missing', '/: /usage/categories#wrong'])
  } finally { await rm(dist, { recursive: true, force: true }) }
})

test('link validation handles query, trailing slash, protocol relative and malformed escapes', () => {
  const pages = new Map([['/', '<a href="/usage/categories/?from=home#空分类">ok</a><a href="//example.com/">external</a><a href="/%ZZ">bad</a>'], ['/usage/categories', '<h2 id="空分类">空分类</h2>']])
  assert.deepEqual(validateLinks(pages, tmpdir()), ['/: /%ZZ'])
})

test('production origin rejects credentials, paths and unsupported protocols', () => {
  for (const value of ['javascript:alert(1)', 'https://user:pass@example.com', 'https://docs.example.com/path', 'https://docs.example.com?x=1']) {
    assert.throws(() => resolveOrigin({ VITE_SITE_URL: value }), /origin/)
  }
  assert.equal(resolveOrigin({ VITE_SITE_URL: 'https://docs.example.com/' }), 'https://docs.example.com')
  assert.equal(resolveOrigin({ CF_PAGES_URL: 'https://preview.example.pages.dev' }), 'https://preview.example.pages.dev')
  assert.equal(resolveOrigin({}), '')
})

test('full text search keeps commands inside fences and joins Chinese prose', () => {
  const text = searchText('## 数据\n\n完整\n快照\n\n```sh\nsudo guide-update --check\n```')
  assert.ok(text.includes('sudo guide-update --check'))
  assert.ok(text.includes('完整快照'))
})

test('SEO uses real configured origin and escaped per-page text', () => {
  const head = pageHead({ path: '/usage/categories', title: '分类 & Guide', desc: '说明"内容' }, 'https://docs.example.com')
  assert.match(head, /rel="canonical" href="https:\/\/docs.example.com\/usage\/categories"/)
  assert.match(head, /分类 &amp; Guide/)
  assert.match(head, /说明&quot;内容/)
  assert.match(head, /content="index,follow"/)
})

test('404 and unconfigured local build cannot become indexable production pages', () => {
  const page = { path: '/', title: 'Guide', desc: 'Docs' }
  assert.match(pageHead(page, ''), /content="noindex"/)
  assert.doesNotMatch(pageHead(page, ''), /canonical|og:url/)
  const head = pageHead({ ...page, path: '/404', notFound: true }, 'https://docs.example.com')
  assert.match(head, /content="noindex"/)
  assert.doesNotMatch(head, /canonical|og:url/)
  assert.match(pageHead({ ...page, preview: true }, 'https://preview.example.pages.dev'), /content="noindex"/)
})
