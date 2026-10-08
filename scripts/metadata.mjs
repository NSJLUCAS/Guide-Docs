export const escapeHtml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export function renderTemplate(template, page, markup, origin) {
  return template.replace('<!--app-html-->', () => markup)
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(page.title)}</title>`)
    .replace(/(<meta name="description" content=").*?(")/, (_, start, end) => start + escapeHtml(page.desc) + end)
    .replace('<!--page-meta-->', () => pageHead(page, origin))
}
export function pageHead(page, origin) {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.desc)
  const indexable = origin && !page.notFound && !page.preview
  return `<meta name="robots" content="${indexable ? 'index,follow' : 'noindex'}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Guide 文档" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />${indexable ? `
    <link rel="canonical" href="${escapeHtml(origin + page.path)}" />
    <meta property="og:url" content="${escapeHtml(origin + page.path)}" />` : ''}`
}
