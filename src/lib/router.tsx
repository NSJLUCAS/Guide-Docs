import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// The site may be served under a path prefix (`base` in vite.config.ts), which
// every href carries while the routes matched against do not. Both conversions
// live here and nowhere else.
export const BASE = __BASE__
export const href = (p: string) => (p === "/" ? BASE : BASE + p.replace(/^\//, ""))
export const toPath = (loc: string) => {
  let decoded: string
  try { decoded = decodeURIComponent(loc) }
  catch { return loc } // malformed escapes remain an unmatched route
  const p = decoded.startsWith(BASE) ? "/" + decoded.slice(BASE.length) : decoded
  return p.replace(/\/+$/, "") || "/"
}

export function navigate(path: string) {
  history.pushState(null, "", href(path))
  dispatchEvent(new PopStateEvent("popstate"))
  if (location.hash) requestAnimationFrame(() => requestAnimationFrame(() => {
    try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" }) }
    catch { /* malformed fragment is an invalid link, not a navigation crash */ }
  }))
}

/** Current route. `initial` is what the server rendered, so hydration matches. */
export function usePath(initial: string) {
  const [path, setPath] = useState(initial)
  useEffect(() => {
    const sync = () => setPath(toPath(location.pathname))
    sync()
    addEventListener("popstate", sync)
    return () => removeEventListener("popstate", sync)
  }, [])
  return path
}

/** An <a> that stays on the page. External and modified clicks fall through. */
export function A({ to, className, children, onClick, ...rest }: { to: string } & React.ComponentProps<"a">) {
  // A .txt is a real file beside the pages rather than a route: it keeps the base
  // prefix but leaves the SPA.
  const away = /^(https?:)?\/\//.test(to) || to.endsWith(".txt")
  return (
    <a
      href={/^(https?:)?\/\//.test(to) ? to : href(to)}
      className={cn(className)}
      {...(away ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || away || rest.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
        if (!location.hash) scrollTo({ top: 0, behavior: "instant" })
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
