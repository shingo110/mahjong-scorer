# 🀄 麻将计分器

线下打麻将专用记分工具 —— 简单、快速、清晰。

## 功能

- **首页** — 选择人数（2~8人局）、输入昵称 / 🎲 随机中文昵称、自动去重校验
- **记分** — 玩家标签页切换、大分数展示、数字面板
- **记分记录** — 每次操作的时间线，按倒序排列
- **结算** — 大赢家 / 大输家 → 最终排名 → 转账说明
- **10 套主题配色** — 可拖动悬浮球，展开主题选择面板，包含亮原色、暗原色及 8 套自定义配色，切换即刻生效
- **返回确认** — 返回时弹窗提醒并清空状态

## 快速开始

```bash
cd mahjong-scorer
npm install
npm run dev
```

打开 **http://localhost:30001** 即可使用。

## 技术栈

| 技术 | 用途 |
|------|------|
| [Next.js](https://nextjs.org) (App Router) | 框架 |
| [TypeScript](https://www.typescriptlang.org) | 类型安全 |
| [Tailwind CSS v4](https://tailwindcss.com) | 样式 |
| [shadcn/ui](https://ui.shadcn.com) | UI 组件（基于 @base-ui/react） |
| [React Context](https://react.dev) | 游戏状态管理 |

## 主题配色

| 主题 | 主色 | 次色 | 文字色 |
|------|------|------|--------|
| 亮原色 | `#5BBFBA` | — | 深色 |
| 暗原色 | `#40916C` | — | 浅色 |
| 高级灰紫 | `#2B2D42` | `#8D99AE` | `#EDF2F4` |
| 极简黑白 | `#0A0A0A` | `#A3A3A3` | `#F5F5F5` |
| 科技蓝灰 | `#0F172A` | `#334155` | `#38BDF8` |
| 冷调蓝绿 | `#1B4332` | `#40916C` | `#D8F3DC` |
| 暖调米灰 | `#4A4A48` | `#B7B7A4` | `#F5F3EF` |
| 品牌红黑 | `#1F1F1F` | `#B91C1C` | `#E5E5E5` |
| 商务蓝色 | `#1D3557` | `#457B9D` | `#F1FAEE` |
| 质感棕色 | `#3E2C23` | `#A68A64` | `#F2E8CF` |

## 项目结构

```
src/
├── app/
│   ├── page.tsx            # 首页（昵称设置）
│   ├── layout.tsx          # 布局（主题切换 + GameProvider）
│   ├── globals.css         # 全局样式 + 10 套主题配色
│   ├── game/
│   │   ├── page.tsx        # 记分页
│   │   └── number-pad.tsx  # 数字面板组件
│   ├── history/
│   │   └── page.tsx        # 记分记录页
│   └── settlement/
│       └── page.tsx        # 结算页
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   └── theme-toggle.tsx    # 主题切换悬浮球（可拖动，展开选择面板）
└── lib/
    ├── types.ts            # 类型定义
    ├── utils.ts            # cn() 工具函数
    ├── utils/
    │   └── app.ts          # 昵称库、结算算法、本地存储
    └── game-context.tsx    # 游戏状态管理
```

## 部署

```bash
npm run build     # 生产构建，输出到 out/
```

构建产物在 `out/` 目录，可直接部署到 Cloudflare Pages、Vercel 等静态托管平台。

## 开发

```bash
npm run dev      # 启动开发服务器 → :30001
npm run build    # 生产构建
npm run lint     # ESLint 检查
```
