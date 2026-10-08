// Adapted upstream shadcn styles. Native dialog supplies modal focus/inert
// behavior without distributing the scroll-bar dependency's missing license.
import { createContext, useContext, useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Context = createContext({ open: false, onOpenChange: (_open: boolean) => {}, titleId: '' })
export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  const titleId = useId()
  return <Context.Provider value={{ open, onOpenChange, titleId }}>{children}</Context.Provider>
}
export function DialogTitle({ children, ...props }: React.ComponentProps<"h2">) {
  return <h2 id={useContext(Context).titleId} {...props}>{children}</h2>
}
export function DialogContent({ children, className, showCloseButton = true, onOpenAutoFocus, ...props }: React.ComponentProps<"dialog"> & { showCloseButton?: boolean; onOpenAutoFocus?: (event: Event) => void }) {
  const { open, onOpenChange, titleId } = useContext(Context)
  const ref = useRef<HTMLDialogElement>(null)
  const autoFocus = useRef(onOpenAutoFocus)
  autoFocus.current = onOpenAutoFocus
  useEffect(() => {
    if (!open) return
    const dialog = ref.current
    if (!dialog) return
    const before = document.body.style.overflow
    const focusBefore = document.activeElement
    document.body.style.overflow = "hidden"
    dialog.showModal()
    autoFocus.current?.(new Event("autofocus", { cancelable: true }))
    return () => {
      dialog.close()
      document.body.style.overflow = before
      if (focusBefore instanceof HTMLElement && focusBefore.isConnected) focusBefore.focus()
    }
  }, [open])
  if (!open || typeof document === "undefined") return null
  return createPortal(<dialog ref={ref} aria-labelledby={titleId}
    className={cn("fixed top-[50%] left-[50%] m-0 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none backdrop:bg-black/50 max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg", className)}
    onCancel={event => { event.preventDefault(); onOpenChange(false) }}
    onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onOpenChange(false) } }}
    {...props}>
    {children}
    {showCloseButton && <button type="button" aria-label="关闭" onClick={() => onOpenChange(false)} className="absolute top-4 right-4 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline"><X className="size-4" /></button>}
  </dialog>, document.body)
}
