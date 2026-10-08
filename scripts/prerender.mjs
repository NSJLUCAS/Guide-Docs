import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { render, routes, siteOrigin, contentPages, previewBuild } from '../dist-ssr/entry-server.js'
import { renderTemplate, escapeHtml } from './metadata.mjs'
import { validateLinks } from './validate-links.mjs'
import { collectLicenses } from './licenses.mjs'

const dist = join(import.meta.dirname, '../dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const pages = new Map()
const contentPaths = Object.keys(contentPages)
const docs = routes.filter(route => route.path !== '/')
if (docs.length !== contentPaths.length || docs.some(route => !contentPaths.includes(route.path))) throw new Error('Navigation and MDX pages must match exactly')
if (new Set(routes.map(route => route.path)).size !== routes.length) throw new Error('Duplicate route')
const renderPage = page => renderTemplate(template, { ...page, preview: previewBuild }, render(page.path), siteOrigin)

for (const route of routes) {
  const html = renderPage(route)
  const file = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path.slice(1) + '.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
  pages.set(route.path, html)
}
await writeFile(join(dist, '404.html'), renderPage({ path: '/404', title: '页面未找到 — Guide 文档', desc: '这个地址上没有 Guide 文档页面。', notFound: true }))
const preview = previewBuild
await writeFile(join(dist, 'robots.txt'), siteOrigin && !preview ? `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n')
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteOrigin ? routes.map(route => `<url><loc>${escapeHtml(siteOrigin + route.path)}</loc></url>`).join('') : ''}</urlset>\n`)
await writeFile(join(dist, 'LICENSE.txt'), await readFile(join(import.meta.dirname, '../LICENSE')))
await writeFile(join(dist, 'THIRD_PARTY_NOTICES.txt'), await readFile(join(import.meta.dirname, '../THIRD_PARTY_NOTICES.md')))
await collectLicenses(dist)
const broken = validateLinks(pages, dist)
if (broken.length) throw new Error(`Broken in-site links:\n${broken.join('\n')}`)
console.log(`Prerendered ${routes.length} routes; all internal paths and fragments valid; origin: ${siteOrigin || 'local / noindex'}`)
