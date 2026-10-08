import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypePrettyCode from "rehype-pretty-code"
import { execFileSync } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { searchText } from "./scripts/content-index.mjs"
import { resolveOrigin } from "./scripts/config.mjs"

// Whitespace between two Chinese characters renders as a gap Chinese text never
// has. It comes from a line break inside a paragraph, which Chrome draws as a
// space with no CSS to turn it off, and from the space kept beside `**` so that
// bold text ending in 。 still closes. Both are removed at build time, after
// parsing. Between a Han character and Latin text or inline code the space
// stays, as the usual gap between the scripts. Beside full-width punctuation it
// goes whatever the other side is: the mark carries its own spacing, so `，` at
// the end of a source line followed by `5 秒` or by inline code would otherwise
// read as a double gap.
const PUNCT = "\\u3000-\\u303f\\uff00-\\uffef"
const CJK = `\\p{Script=Han}${PUNCT}\\u2014\\u2026`
const CJK_GAP = new RegExp(
  `(?<=[${CJK}])[ \\t\\n]+(?=[${CJK}])|(?<=[${PUNCT}])[ \\t\\n]+|[ \\t\\n]+(?=[${PUNCT}])`,
  "gu",
)
// `before` and `after` are the characters just outside `s`, for a break at its
// edge. A whitespace neighbour is dropped, or removing it would shift the slice.
function joinCjk(s: string, before = "", after = "") {
  if (/\s/.test(before)) before = ""
  if (/\s/.test(after)) after = ""
  const t = (before + s + after).replace(CJK_GAP, "")
  return t.slice(before.length, t.length - after.length)
}

// Whitespace at the edge of a text node is decided by its neighbour, so a space
// before a link or bold text looks at the first character inside it.
type Node = { type: string; value?: string; children?: Node[] }
const plain = (n?: Node): string =>
  n?.type === "inlineCode" ? "" : (n?.value ?? n?.children?.map(plain).join("") ?? "")
const remarkJoinCjk = () => {
  const walk = (n: Node): void =>
    n.children?.forEach((c, i, all) => {
      if (c.type === "text") c.value = joinCjk(c.value ?? "", plain(all[i - 1]).slice(-1), plain(all[i + 1])[0])
      else walk(c)
    })
  return walk
}

// The search index, reduced to plain text at build time. Not `?raw`: the mdx
// plugin claims .mdx with any query, so a raw import returns the compiled
// component rather than the source.
function searchIndex(): Plugin {
  const id = "virtual:search-index"
  const resolved = "\0" + id
  const dir = join(import.meta.dirname, "src", "content")
  const indexJson = async () => {
    const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith(".mdx"))
    const entries = await Promise.all(files.map(async (f) => [
      "/" + f.replace(/\.mdx$/, "").replaceAll("\\", "/"),
      searchText(await readFile(join(dir, f), "utf8")),
    ]))
    return JSON.stringify(Object.fromEntries(entries))
  }
  let dev = false
  return {
    name: "search-index",
    configResolved(config) { dev = config.command === "serve" },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== base + "search-index.json") return next()
        try {
          res.setHeader("Content-Type", "application/json; charset=utf-8")
          res.end(await indexJson())
        } catch (error) { next(error) }
      })
    },
    resolveId: (s) => (s === id ? resolved : null),
    async load(i) {
      if (i !== resolved) return
      if (dev) return `export default ${JSON.stringify(base + "search-index.json")}`
      const reference = this.emitFile({ type: "asset", name: "search-index.json", source: await indexJson() })
      return `export default import.meta.ROLLUP_FILE_URL_${reference}`
    },
  }
}

// When each page last changed, read from git at build time. CI must check out
// with fetch-depth: 0, as a shallow clone has no history to date a file by.
function pageDates(): Plugin {
  const id = "virtual:page-dates"
  const resolved = "\0" + id
  const dir = join(import.meta.dirname, "src", "content")
  return {
    name: "page-dates",
    resolveId: (s) => (s === id ? resolved : null),
    async load(i) {
      if (i !== resolved) return
      const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith(".mdx"))
      const out: Record<string, string> = {}
      for (const f of files) {
        try {
          const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", join("src/content", f)], {
            cwd: join(import.meta.dirname), encoding: "utf8",
          }).trim()
          if (iso) out["/" + f.replace(/\.mdx$/, "").replaceAll("\\", "/")] = iso
        } catch { /* no git, or the file is not committed yet */ }
      }
      return `export default ${JSON.stringify(out)}`
    },
  }
}

// Cloudflare Pages serves the project at the root of its own subdomain, so there
// is no path prefix to carry. Moving back under a subdirectory requires changing
// this line alone.
const base = "/"

function bundledPackages(): Plugin {
  return {
    name: "bundled-packages",
    generateBundle(_, bundle) {
      // CSS imports are compiled into an asset and do not appear in JS chunks.
      const packages = new Set<string>(["@fontsource-variable/inter", "tailwindcss", "tw-animate-css"])
      for (const item of Object.values(bundle)) {
        if (item.type !== "chunk") continue
        for (const [id, module] of Object.entries(item.modules)) {
          if (!module.renderedLength) continue
          const match = id.replaceAll("\\", "/").match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)
          if (match) packages.add(match[1])
        }
      }
      this.emitFile({ type: "asset", fileName: "bundled-packages.json", source: JSON.stringify([...packages].sort(), null, 2) })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, import.meta.dirname, ""), ...process.env }
  const site = resolveOrigin(env)
  return {
  base,
  plugins: [
    // Before react(): the JSX mdx emits must still pass through the React
    // plugin's transform.
    { enforce: "pre", ...mdx({
      // Allows MDXProvider to supply <Note>, the code-block wrapper and the link
      // component, so no page needs to import them.
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm, remarkJoinCjk],
      rehypePlugins: [
        rehypeSlug,
        // Highlighting runs here, at build time. The shipped page carries plain
        // spans with inline colours, so no highlighter reaches the browser and
        // code renders identically in the prerendered HTML.
        [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false }],
      ],
    }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    searchIndex(),
    pageDates(),
    bundledPackages(),
  ],
  resolve: { alias: { "@": import.meta.dirname + "/src" } },
  define: { __BASE__: JSON.stringify(base), __SITE_URL__: JSON.stringify(site), __PREVIEW__: JSON.stringify(env.CF_PAGES_BRANCH ? env.CF_PAGES_BRANCH !== "main" : false) },
  build: { chunkSizeWarningLimit: 900 },
}
})
