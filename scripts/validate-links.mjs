import { statSync } from 'node:fs'
import { resolve, sep } from 'node:path'

export function validateLinks(pages, dist) {
  const ids = new Map([...pages].map(([path, html]) => [path, new Set([...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]))]))
  const broken = []
  for (const [path, html] of pages) {
    for (const [, href] of html.matchAll(/ href="([^"]+)"/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue
      try {
        const url = new URL(href.replaceAll('&amp;', '&'), 'https://local.invalid' + path)
        const page = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/'
        const fragment = decodeURIComponent(url.hash.slice(1))
        const file = resolve(dist, '.' + page)
        const inDist = file.startsWith(resolve(dist) + sep)
        const found = ids.has(page) ? !fragment || ids.get(page).has(fragment) : inDist && statSync(file, { throwIfNoEntry: false })?.isFile()
        if (!found) broken.push(`${path}: ${href}`)
      } catch { broken.push(`${path}: ${href}`) }
    }
  }
  return broken
}
