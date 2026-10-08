import type { ComponentType } from "react"
import indexUrl from "virtual:search-index"

// One eager glob constitutes the whole page table: the pages together weigh less
// than a screenshot, and eager loading means navigation never waits.
const mods = import.meta.glob("./content/**/*.mdx", { eager: true }) as Record<
  string,
  { default: ComponentType }
>

export const pages: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(mods).map(([file, m]) => [file.replace(/^\.\/content|\.mdx$/g, ""), m.default]),
)

/** Fetch the static index only when search opens. Fetch can retry a failed
 *  request, unlike an import whose first rejection is cached by the browser. */
export async function loadIndex(): Promise<Record<string, string>> {
  const response = await fetch(indexUrl)
  if (!response.ok) throw new Error(`Search index: HTTP ${response.status}`)
  return response.json()
}
