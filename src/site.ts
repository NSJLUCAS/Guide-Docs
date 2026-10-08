export const REPO = "https://github.com/NSJLUCAS/Guide"
export const REPO_DOC = REPO
export const DOC_SOURCE = `${REPO}/tree/main/sites/docs`
export const SITE = __SITE_URL__
export const PREVIEW = __PREVIEW__
export const RELEASE = "v1.2.0"
const demo = import.meta.env.VITE_DEMO_URL?.trim() ?? ""
if (demo) {
  const url = new URL(demo)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('VITE_DEMO_URL must be a credential-free HTTP(S) URL')
}
export const DEMO = demo || "/guide/releases#演示站"
