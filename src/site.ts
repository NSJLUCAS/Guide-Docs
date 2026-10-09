import { resolveGuidePreview } from '../scripts/config.mjs'

export const REPO = "https://github.com/NSJLUCAS/Guide"
export const REPO_DOC = "https://github.com/NSJLUCAS/Guide-Docs"
export const DOC_SOURCE = `${REPO_DOC}/tree/main/src/content`
export const SITE = __SITE_URL__
export const PREVIEW = __PREVIEW__
export const RELEASE = "v1.2.0"
export const GUIDE_PREVIEW = resolveGuidePreview(import.meta.env)
