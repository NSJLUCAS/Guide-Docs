# Guide 官方文档站

独立中文文档站，16 篇正文及首页。内容基线为正式 Guide v1.2.0，正式版本与更新说明以 [Releases](https://github.com/NSJLUCAS/Guide/releases) 为准。架构与 UI 基于 [Monitor Document](https://github.com/monitor-probe/monitor-document)，原 MIT 版权完整保留，见 [LICENSE](LICENSE) 与 [来源说明](THIRD_PARTY_NOTICES.md)。

## 本地开发与检查

需要 Node.js 24/npm。在本目录执行：
正文更新时间来自本仓库文件的 Git 历史，使用完整 clone；CI 已设置 `fetch-depth: 0`。

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

预览地址为 `http://127.0.0.1:4186`，可通过 `npm run preview -- --port 4187` 修改端口。`npm run dev` 用于开发；刷新验收使用静态预览，按 Pages 的 `.html` 去扩展名方式解析路由，不以 Vite 开发服务器回写首页作为验收。

可选 `npm run test:browser` 使用 Playwright 在隔离 Chromium 中运行全部页面刷新、搜索、目录、手机和主题检查。先通过 build 和 preview，测试默认连接上述4186端口；用 `DOCS_PREVIEW_URL` 配置其他地址。若环境没有 Playwright，单独安装测试工具，或用 `DOCS_PLAYWRIGHT_MODULE` 指向已安装模块，不需要加入生产依赖。截图用 `DOCS_TEST_OUTPUT` 指向私有目录。

开发入口回归可用 `npm run test:dev`，默认连接 `http://127.0.0.1:5198`（先启动 `npm run dev -- --port 5198`），也可用 `DOCS_DEV_URL` 修改地址。

## Cloudflare Pages 配置

创建独立 **Pages** GitHub 集成项目，连接独立仓库 `NSJLUCAS/Guide-Docs`：

| 项目 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | None / Vite |
| 根目录 | 留空（仓库根） |
| 构建命令 | `npm ci && npm run build` |
| 输出目录 | `dist`（相对于根目录） |
| Node 版本 | `NODE_VERSION=24.14.1` |
| 构建监视路径 | `**`（本仓库全部路径） |
| 生产 URL | `VITE_SITE_URL=https://你的文档域名` |
| 自建 Guide 预览地址（可选） | `VITE_GUIDE_PREVIEW_URL`，确认真实地址后再设置 |

使用已提交 package-lock.json；显式构建命令执行 npm ci。如需避免自动重复安装，设置 `SKIP_DEPENDENCY_INSTALL=1`。文档站构建无需 Rust Hub、数据库、Functions、Workers API 或 API token。Cloudflare Pages 托管静态文档；Guide 实例需在自己的服务器上运行。

`VITE_SITE_URL` 必须是无凭据、无路径/query/fragment 的 HTTP(S) origin；生产请用 HTTPS。缺省使用 `CF_PAGES_URL`；普通本地构建未提供域名时省略 canonical、生成禁止索引的 robots，避免编造官方域名。正式自定义域名务必设置此变量。Pages 分支预览使用可用的构建 URL，均禁止索引。

`VITE_GUIDE_PREVIEW_URL` 可选填真实的自建 Guide 地址，只接受无凭据 HTTP(S) 地址，生产请用 HTTPS。未配置时隐藏首页和顶栏预览入口。文档编辑链接指向 `NSJLUCAS/Guide-Docs/edit/main/src/content`；产品、安装器与正式 Release 链接仍指向 `NSJLUCAS/Guide`。

在 Pages 的 Custom domains 中绑定用户控制的独立域名，按 Cloudflare 提示配置 DNS；然后设置生产 `VITE_SITE_URL` 并重新构建。操作说明见 [构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[Monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/) 和 [自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)。本项目不自动创建或部署远端站点。

## 静态产物与路由

`npm run build` 执行类型检查、客户端打包、构建期 SSR 和预渲染。最终只发布 `dist`；`dist-ssr` 是构建中间文件，不发布。产物包含17个独立页面、真正的404、资产、sitemap、robots、MIT和依赖许可。

例如 `dist/usage/categories.html` 对应 `/usage/categories`，刷新可直接读取正文。根404保留未知URL的404状态，不添加 `/* /index.html 200` 回写规则。路径与锚点校验在构建时自动执行，错误会使构建失败。Pages 行为见 [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

## 维护内容

页面元数据和排序在 `src/nav.ts`，正文在 `src/content/**/*.mdx`。内部链接使用稳定绝对文档路径；命令块也进入全文搜索。新增或删除页面时同步导航，构建会检查一一对应及内部锚点。

不复制私有项目记忆、内部计划、测试日志或服务器资料。每次内容更新核对正式 Release 和公开源码，开发中功能明确标注；维护文档不另外复制完整 Release Notes。依赖原许可从锁定安装包生成，修改依赖后重建并检查来源声明。

## 仓库边界与历史

本仓库根目录可独立安装、测试和构建，不依赖 Guide checkout 或 Hub。[Guide](https://github.com/NSJLUCAS/Guide) 负责正式产品业务、主题、后台和发布工具；[Guide-Docs](https://github.com/NSJLUCAS/Guide-Docs) 负责页面、MDX、搜索及文档 UI。文档内容核对正式 Guide v1.2.0，未发布功能不得写为正式功能。两仓库分别验证；本仓库 GitHub Actions 负责检查，Cloudflare Pages Git 集成负责文档部署，产品 Release 不自动触发文档发布。

历史从原 sites/docs 导出，保留每次站点提交的作者、时间、消息和顺序，Guide 原历史未改写。来源及提交映射见 [MIGRATION.md](MIGRATION.md)。私有项目记忆、内部计划、验证日志不进入公开仓库。Cloudflare Pages 仅用于静态站，不提供 Guide Hub 后端。
