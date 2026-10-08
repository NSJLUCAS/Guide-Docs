/// <reference types="vite/client" />
declare const __BASE__: string
declare const __SITE_URL__: string
declare const __PREVIEW__: boolean
declare module "virtual:search-index" {
  const url: string
  export default url
}
declare module "virtual:page-dates" {
  const dates: Record<string, string>
  export default dates
}
