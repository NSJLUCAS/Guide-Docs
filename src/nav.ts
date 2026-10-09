export type Item = { path: string; label: string; desc: string; keywords?: string }
export type Section = { title: string; items: Item[] }
export const nav: Section[] = [
  {
    "title": "开始",
    "items": [
      {
        "path": "/guide/introduction",
        "label": "产品介绍",
        "desc": "了解 Guide 网站与服务导航、正式功能和适用范围。"
      },
      {
        "path": "/guide/quick-start",
        "label": "快速开始",
        "desc": "从部署或已有实例开始，登录后台并添加第一个网站。"
      },
      {
        "path": "/guide/releases",
        "label": "版本与预览",
        "desc": "以正式 Releases 为准，了解版本范围和自建 Guide 访客预览。"
      }
    ]
  },
  {
    "title": "部署",
    "items": [
      {
        "path": "/install/deployment",
        "label": "安装部署",
        "desc": "官方安装器、SHA-256 校验、支持平台、默认目录与手工部署。"
      },
      {
        "path": "/install/reverse-proxy",
        "label": "域名与 HTTPS",
        "desc": "本机监听、HTTPS 反向代理及域名访问的验证原则。"
      }
    ]
  },
  {
    "title": "使用",
    "items": [
      {
        "path": "/usage/admin",
        "label": "后台使用",
        "desc": "服务、分类、主题、安全和设置五个后台入口。"
      },
      {
        "path": "/usage/websites",
        "label": "网站管理",
        "desc": "添加、编辑、排序网站，设置可见性、启用和在线检测。"
      },
      {
        "path": "/usage/categories",
        "label": "分类管理",
        "desc": "新增、更名、排序与空分类，了解计数及删除保护。"
      },
      {
        "path": "/usage/icons",
        "label": "图标库与 favicon",
        "desc": "HTTPS 图标库 JSON、浏览器 CORS、手动 favicon 和通用图标。"
      },
      {
        "path": "/usage/checks",
        "label": "在线检测",
        "desc": "在线、离线、检测受限、未知和未检测状态及响应时间。"
      },
      {
        "path": "/usage/layout",
        "label": "卡片布局与主题",
        "desc": "标准、紧凑和极简三种卡片布局，全站保存与深浅色切换。"
      }
    ]
  },
  {
    "title": "维护",
    "items": [
      {
        "path": "/maintenance/security",
        "label": "登录与安全",
        "desc": "独立应急密码、GitHub OAuth 白名单、会话和账号恢复。"
      },
      {
        "path": "/maintenance/upgrade",
        "label": "升级与回退",
        "desc": "guide-update、旧实例接入、schema 迁移及完整快照恢复。"
      },
      {
        "path": "/maintenance/backup",
        "label": "数据备份",
        "desc": "管理员一致性备份、WAL/SHM、恢复限制及敏感数据保护。"
      }
    ]
  },
  {
    "title": "参考",
    "items": [
      {
        "path": "/reference/faq",
        "label": "常见问题",
        "desc": "面板访问、网站可见性、图标、检测、分类和升级问题。"
      },
      {
        "path": "/reference/licenses",
        "label": "许可与来源",
        "desc": "上游 MIT 版权、文档站来源与 Guide 第三方授权披露。"
      }
    ]
  }
]
export const docs = nav.flatMap(s => s.items)
export const sectionOf = (path: string) => nav.find(s => s.items.some(i => i.path === path))?.title ?? ""
