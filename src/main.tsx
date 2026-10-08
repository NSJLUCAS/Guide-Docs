import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { App } from "@/App"
import { toPath } from "@/lib/router"
import "@/index.css"

const root = document.getElementById("root")!
const path = toPath(location.pathname)
const app = <StrictMode><App url={path} /></StrictMode>

// Static pages (including 404) have rendered elements. The dev template only
// has a comment placeholder, which is a firstChild but cannot be hydrated.
if (root.childElementCount) hydrateRoot(root, app)
else createRoot(root).render(app)
