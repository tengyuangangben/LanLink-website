# 澜链 LanLink · 产品宣发页

澜链（LanLink）产品宣发站点。**零构建**：纯静态 HTML + CSS + 原生 JS，
可直接由任意静态服务器托管，无 Node、无打包器、无依赖安装步骤。

## 目录结构

```
website/
├── index.html                 # 单页站点（结构 + 内容 + 语义化标签）
├── assets/
│   ├── css/styles.css         # 设计系统：令牌、氛围层、组件、响应式、动效降级
│   ├── js/main.js             # 交互：入场动画 / 滚动进度 / 平台识别 / 复制校验值
│   └── img/
│       ├── favicon.svg        # 手绘矢量标识（两台显示器 + 链路弧线）
│       ├── app-icon.png       # 应用图标 256×256（导航与 og:image 使用）
│       └── app-icon-128.png   # 应用图标 128×128（apple-touch-icon 使用）
├── render.yaml                # Render 静态站点部署声明
├── .gitignore
└── README.md
```

## 本地预览

任选其一，无需安装依赖：

```bash
# Python
python -m http.server 5173

# Node
npx serve .

# VS Code
# 使用 Live Server 插件打开 index.html
```

浏览器访问 `http://localhost:5173`。

## 部署到 Render

本目录即为一个独立仓库的根目录，可直接推送到 GitHub 后在 Render 创建
**Static Site**：

| 配置项 | 取值 |
| --- | --- |
| Repository | 你新建的 GitHub 仓库（内容为本目录） |
| Build Command | 留空 |
| Publish Path | `.` |
| Instance Type | Free |

仓库根目录已附带 `render.yaml`，用 Render 读取 Blueprint 部署时，
Build Command 同样为空、Publish Path 为 `.`。

> 若改用 Nginx / Apache 等自定义方式托管，保证站点根目录存在 `index.html` 即可。

## 内容维护要点

页面上的下载信息与仓库实现保持一致，升级版本时需同步修改以下位置：

1. `index.html` 中两个下载卡片：
   - `.dl-card__name` 文件名（含版本号）
   - `.dl-card__meta` 文件体积
   - `.dl-card__hash code` SHA-256 校验值
   - `<a href>` 的分享链接
2. `index.html` 首屏 `.eyebrow` 与页脚的版本号 `v1.0.5`
3. `index.html` `#oss` 区块的命令示例文件名

获取下载链接体积与校验值的命令：

```bash
# Windows
certutil -hashfile LanLink_1.0.5_x64-setup.exe SHA256

# macOS
shasum -a 256 LanLink_1.0.5_aarch64.dmg
```

## 定制入口

- **配色**：修改 `assets/css/styles.css` 顶部 `:root` 中的色板令牌
- **字体**：修改 `index.html` 中的 Google Fonts 链接与 `:root` 中的 `--font-*`
- **文案**：全部位于 `index.html`，无内容硬编码在脚本中

## 说明

- 页面不含任何统计、追踪与第三方脚本，仅从 Google Fonts 拉取字体。
- 桌面端下载链接由 Aurora License Server 平台分发，页面仅做跳转，不代理文件流。
