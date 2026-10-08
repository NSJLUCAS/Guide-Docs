export function resolveOrigin(env) {
  const value = (env.VITE_SITE_URL || env.CF_PAGES_URL || '').trim()
  if (!value) return ''
  let url
  try { url = new URL(value) } catch { throw new Error('VITE_SITE_URL must be an HTTP(S) origin') }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment')
  }
  return url.origin
}
