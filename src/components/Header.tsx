import { useState } from "react"
import { Menu } from "lucide-react"
import { GithubMark } from "@/components/GithubMark"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Search } from "@/components/Search"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Sidebar } from "@/components/Sidebar"
import { A } from "@/lib/router"
import { REPO_DOC, GUIDE_PREVIEW } from "@/site"

export function Header({ path }: { path: string }) {
  const [menu, setMenu] = useState(false)
  return <>
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[88rem] items-center gap-3 px-4 lg:px-8">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="目录" onClick={() => setMenu(true)}><Menu /></Button>
        <A to="/" className="flex items-baseline gap-2"><span className="font-semibold tracking-tight">Guide</span><span className="hidden text-xs text-muted-foreground sm:inline">文档</span></A>
        <div className="ml-auto flex items-center gap-1.5">
          {GUIDE_PREVIEW && <a href={GUIDE_PREVIEW} target="_blank" rel="noreferrer" className="hidden px-2 text-sm text-muted-foreground hover:text-foreground md:block">预览</a>}
          <Search />
          <Button variant="ghost" size="icon-sm" asChild aria-label="GitHub"><a href={REPO_DOC} target="_blank" rel="noreferrer"><GithubMark className="size-4" /></a></Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
    <Dialog open={menu} onOpenChange={setMenu}>
      <DialogContent className="top-0 left-0 h-dvh max-h-dvh w-72 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-0 sm:max-w-72">
        <div className="sticky top-0 border-b border-border bg-background px-5 py-4"><DialogTitle className="font-semibold">Guide 文档目录</DialogTitle></div>
        <div className="thin-scroll px-2 py-5"><Sidebar path={path} onNavigate={() => setMenu(false)} /></div>
      </DialogContent>
    </Dialog>
  </>
}
