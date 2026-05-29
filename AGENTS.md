<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-info -->
# Project info

- GitHub: https://github.com/shingo110/mahjong-scorer
- Deploy: Cloudflare Pages (auto-deploy on push to main)
- Build: `npm run build` → `out/` (static export)
- Dev: `npm run dev` (port 30001)
- Can't build from UNC path (`\\wsl.localhost\...`), must copy to `C:\Users\ZL\AppData\Local\Temp\opencode\mahjong-scorer-build`, build there, then copy `out/` back.
<!-- END:project-info -->
