import { A } from "@/lib/router"
export function NotFound() {
  return <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-24">
    <p className="text-sm text-muted-foreground">404</p><h1 className="mt-4 text-3xl font-semibold">页面未找到</h1>
    <p className="mt-5 text-muted-foreground">地址可能已变更，或链接输入有误。可以返回首页，或从快速开始继续阅读。</p>
    <div className="mt-8 flex gap-6 text-sm underline underline-offset-4"><A to="/">返回首页</A><A to="/guide/quick-start">快速开始</A></div>
  </main>
}
