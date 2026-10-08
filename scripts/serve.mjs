// Local static preview of Pages' extensionless HTML routing. No production server.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const dist = resolve(import.meta.dirname, '../dist')
const args = process.argv.slice(2)
const port = Number(args[args.indexOf('--port') + 1]) || 4186
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' }
const isFile = async file => (await stat(file).catch(() => null))?.isFile()
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    const pathname = decodeURIComponent(url.pathname)
    const path = resolve(dist, '.' + pathname)
    if (path !== dist && !path.startsWith(dist + sep)) { res.writeHead(400); res.end('Bad path'); return }
    const clean = pathname.replace(/\/+$/, '') || '/'
    const html = clean === '/' ? resolve(dist, 'index.html') : resolve(dist, '.' + clean + '.html')
    const file = pathname === '/' ? html : await isFile(path) ? path : await isFile(html) ? html : resolve(dist, '404.html')
    if ((pathname.endsWith('/') && clean !== '/' || pathname.endsWith('.html') && await isFile(path)) && file !== resolve(dist, '404.html')) {
      res.writeHead(308, { Location: (pathname.endsWith('.html') ? clean.slice(0, -5) || '/' : clean) + url.search }); res.end(); return
    }
    const status = file === resolve(dist, '404.html') ? 404 : 200
    res.writeHead(status, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : await readFile(file))
  } catch { res.writeHead(400); res.end('Bad request') }
})
server.listen(port, '127.0.0.1', () => console.log(`Guide docs static preview: http://127.0.0.1:${port}`))
