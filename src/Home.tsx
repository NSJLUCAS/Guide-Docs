import { ArrowRight, Folder, Globe, LayoutGrid, ShieldCheck, Activity } from "lucide-react"
import { GithubMark as Github } from "@/components/GithubMark"
import { Button } from "@/components/ui/button"
import { A } from "@/lib/router"
import { REPO, GUIDE_PREVIEW, RELEASE } from "@/site"

const features = [
  { icon: Globe, title: "网站，一处收好", desc: "管理常用网站与服务，搜索、分类与图标让每次访问更直接。", path: "/usage/websites" },
  { icon: Activity, title: "状态，一眼看清", desc: "查看在线状态与响应时间。遇到验证挑战时明确显示检测受限。", path: "/usage/checks" },
  { icon: Folder, title: "分类，按你的顺序", desc: "独立管理分类，保留空分类，按后台顺序组织导航。", path: "/usage/categories" },
  { icon: LayoutGrid, title: "布局，简单而灵活", desc: "标准、紧凑、极简三种卡片密度，适应桌面与手机。", path: "/usage/layout" },
  { icon: ShieldCheck, title: "管理，自己掌握", desc: "独立应急密码、可选 GitHub 登录。数据库和配置由你保管。", path: "/maintenance/security" },
  { icon: Github, title: "版本，下载有据", desc: "从官方发布下载 Guide，查看版本变化和升级注意事项。", path: "/guide/releases" },
]
export function Home() {
  return <main id="main-content" className="flex-1">
    <section className="mx-auto max-w-[88rem] px-4 pt-20 pb-16 text-center lg:px-8 lg:pt-32 lg:pb-24">
      <p className="mb-6 text-sm text-muted-foreground">Guide 官方文档 · 适用版本 {RELEASE}</p>
      <h1 className="mx-auto max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">常用网站，<br className="sm:hidden" />有序抵达。</h1>
      <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-muted-foreground">你的自托管网站与服务导航。用分类整理入口，用状态了解服务，以简洁卡片连接每一次访问。</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg"><A to="/guide/quick-start">快速开始<ArrowRight /></A></Button>
        {GUIDE_PREVIEW && <Button asChild size="lg" variant="outline"><a href={GUIDE_PREVIEW} target="_blank" rel="noreferrer">预览 Guide</a></Button>}
        <Button asChild size="lg" variant="outline"><a href={REPO} target="_blank" rel="noreferrer"><Github className="size-4" />GitHub</a></Button>
      </div>
    </section>
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-4 py-12 sm:grid-cols-3 lg:px-8">
        {[["开始使用", "部署并添加第一个网站", "/guide/quick-start"], ["整理导航", "网站、分类与图标", "/usage/admin"], ["维护实例", "安全、备份与升级", "/maintenance/backup"]].map(([title, desc, path]) => <A key={path} to={path} className="group block"><h2 className="flex items-center gap-2 text-base font-semibold">{title}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></h2><p className="mt-2 text-sm text-muted-foreground">{desc}</p></A>)}
      </div>
    </section>
    <section className="mx-auto max-w-[88rem] px-4 py-16 lg:px-8 lg:py-24">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">从入口到日常，保持简单。</h2>
      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{features.map(({icon: Icon, title, desc, path}) => <A key={path} to={path} className="border-t border-border pt-5"><Icon className="mb-4 size-5 text-muted-foreground" /><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 text-[0.9375rem] leading-[1.7] text-muted-foreground">{desc}</p></A>)}</div>
    </section>
    <section className="border-t border-border bg-muted/20"><div className="mx-auto flex max-w-[88rem] flex-col gap-5 px-4 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div><h2 className="text-xl font-semibold">准备好建立你的导航了吗？</h2><p className="mt-2 text-sm text-muted-foreground">先了解支持平台，再按官方指南校验并安装。</p></div><Button asChild><A to="/install/deployment">阅读安装指南<ArrowRight /></A></Button></div></section>
  </main>
}
