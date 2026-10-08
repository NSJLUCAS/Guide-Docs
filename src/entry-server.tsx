import { renderToString } from "react-dom/server"
import { App } from "@/App"
import { docs } from "@/nav"

export function render(url: string) {
  return renderToString(<App url={url} />)
}

/** Every URL the build has to emit a file for. */
export const routes = [
  {
    path: "/",
    title: "Guide — 官方文档",
    desc: "Guide 自托管网站与服务导航的官方文档：安装部署、网站管理、在线检测、安全、升级与备份。",
  },
  ...docs.map((d) => ({ path: d.path, title: `${d.label} — Guide 文档`, desc: d.desc })),
]

export { SITE as siteOrigin } from "@/site"
export { PREVIEW as previewBuild } from "@/site"
export { pages as contentPages } from "@/content"
