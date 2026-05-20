# 🀄 麻将计分器

线下打麻将专用记分工具 —— 简单、快速、清晰。

## 功能

- **首页** — 选择人数（2~8人局）、输入昵称 / 🎲 随机中文昵称、自动去重校验
- **记分** — 玩家标签页切换、大分数展示、数字面板（右侧竖排大号 +/−）
- **记分记录** — 每次操作的时间线，按倒序排列
- **结算** — 大赢家 / 大输家 → 最终排名 → 转账说明（最小转账次数算法）
- **深色 / 浅色主题** — 右上角一键切换，自动记忆偏好
- **返回确认** — 返回时弹窗提醒，防止误操作丢失数据

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

## 项目结构

```
src/
├── app/
│   ├── page.tsx            # 首页（昵称设置）
│   ├── layout.tsx          # 布局（主题切换 + GameProvider）
│   ├── globals.css         # 全局样式 + 竹绿色系配色
│   ├── game/
│   │   ├── page.tsx        # 记分页
│   │   └── number-pad.tsx  # 数字面板组件
│   ├── history/
│   │   └── page.tsx        # 记分记录页
│   └── settlement/
│       └── page.tsx        # 结算页
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   └── theme-toggle.tsx    # 深色/浅色切换
└── lib/
    ├── types.ts            # 类型定义
    ├── utils.ts            # cn() 工具函数
    ├── utils/
    │   └── app.ts          # 昵称库、结算算法、本地存储
    └── game-context.tsx    # 游戏状态管理
```

## 开发

```bash
npm run dev      # 启动开发服务器 → :30001
npm run build    # 生产构建
npm run lint     # ESLint 检查
```
