<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 马年新春祝福 - 本地运行与手机访问

这是一个前端 + 后端代理的版本：
- 前端负责页面交互。
- 后端代理负责调用 Gemini，`GEMINI_API_KEY` 不会暴露到浏览器。

## 环境准备
- Node.js 18+
- 在 `.env.local` 中配置：
  - `GEMINI_API_KEY=你的密钥`
  - 可选：`API_PROXY_TARGET=http://127.0.0.1:8787`（默认已可用）

## 本地开发（推荐）
1. 安装依赖：
   - `npm install`
2. 终端 A 启动后端代理：
   - `npm run dev:api`
3. 终端 B 启动前端：
   - `npm run dev`
4. 浏览器打开：
   - `http://127.0.0.1:3000`

## 手机访问（同一 Wi-Fi）
1. 保持上面两个服务运行中。
2. 用 `ipconfig` 查电脑局域网 IP（例如 `192.168.1.23`）。
3. 手机浏览器访问：
   - `http://192.168.1.23:3000`

## 安全说明
- 浏览器端不再直接读取 `GEMINI_API_KEY`。
- 后端接口含基础防护：
  - 请求体大小限制（4KB）
  - 简易限流（每 IP 每分钟 30 次）
  - 常见安全响应头
  - 可选来源白名单（`ALLOWED_ORIGINS`）
- `.env.local` 已被 `.gitignore` 忽略，不会被正常提交。

## 生产构建
- `npm run build`
- `npm run preview`
