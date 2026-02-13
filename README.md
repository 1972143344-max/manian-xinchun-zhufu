# 马年新春祝福 Web App

一个以 2026 马年为主题的互动祝福网页，支持烟花、红包掉落、场景动画和祝福卡片展示。

## 项目现状（重要）
- 当前前端默认使用本地祝福库：`services/geminiService.ts`
- 因此项目可作为纯静态站点部署（不依赖后端也能用）
- 仓库中保留了可选后端：`server/api-server.mjs`（用于 Gemini 代理）

## 技术栈
- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- 可选后端：Node.js HTTP + `@google/genai`

## 本地开发

### 1) 安装依赖
```bash
npm install
```

### 2) 只跑前端（推荐，纯静态模式）
```bash
npm run dev
```
默认访问：`http://127.0.0.1:3000`

### 3) 前后端一起跑（可选）
```bash
npm run dev:all
```
该命令会同时启动：
- 前端 Vite dev server
- 后端 API server（`server/api-server.mjs`）

## 生产构建与预览
```bash
npm run build
npm run preview
```

## 环境变量
参考：`.env.example`

主要字段：
- `GEMINI_API_KEY`：仅后端模式需要
- `VITE_API_BASE_URL`：前端请求远端 API 时可配置
- `API_PROXY_TARGET`：Vite 开发代理目标
- `API_HOST` / `API_PORT`：后端监听地址
- `GEMINI_MODEL`：后端使用模型
- `ALLOWED_ORIGINS`：后端 CORS 白名单

## 部署方式

### A) GitHub Pages（已内置工作流）
仓库已包含：`.github/workflows/deploy-pages.yml`

流程：
1. 推送到 `main`
2. GitHub Actions 自动构建并发布 `dist`
3. 在仓库 `Settings -> Pages` 里将 Source 设为 `GitHub Actions`

说明：
- `vite.config.ts` 已处理 `base` 路径，适配仓库子路径部署

### B) Cloudflare Workers 静态资源部署（Wrangler）
仓库已包含：`wrangler.jsonc`

直接部署：
```bash
npm run deploy:cf
```
等价于：
```bash
npm run build
npx wrangler deploy
```

### C) 任意静态托管平台（Vercel / Netlify / Zeabur 静态服务）
只需上传 `dist` 目录即可。

## 后端接口（可选）
当启用 `server/api-server.mjs` 时提供：
- `GET /api/health`
- `POST /api/blessing`

后端包含基础防护：
- 请求体大小限制（4KB）
- IP 限流（每分钟 30 次）
- 基础安全响应头
- 可选来源白名单（`ALLOWED_ORIGINS`）

## 常见问题

### 1) GitHub Pages 白屏
通常是 `base` 路径或缓存问题：
- 确认工作流发布的是 `dist`
- 强制刷新页面（`Ctrl + F5`）

### 2) `git push` 连接 GitHub 失败（443）
如果环境变量里有错误代理（如 `127.0.0.1:9`），会导致推送失败。请清理：
```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY",$null,"User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY",$null,"User")
[Environment]::SetEnvironmentVariable("ALL_PROXY",$null,"User")
[Environment]::SetEnvironmentVariable("GIT_HTTP_PROXY",$null,"User")
[Environment]::SetEnvironmentVariable("GIT_HTTPS_PROXY",$null,"User")
```
重开终端后再推送。

## 可用脚本
- `npm run dev`：前端开发
- `npm run dev:api`：后端开发
- `npm run dev:all`：前后端同时开发
- `npm run build`：生产构建
- `npm run preview`：本地预览构建产物
- `npm run deploy:cf`：构建并部署到 Cloudflare（Wrangler）
