# 澜链 LanLink · 产品宣发页

澜链（LanLink）产品宣发站点。**零构建**：纯静态 HTML + CSS + 原生 JS，
可直接由任意静态服务器托管，无 Node、无打包器、无依赖安装步骤。

## 目录结构

```
website/
├── index.html                 # 单页站点（结构 + 内容 + 语义化标签）
├── assets/
│   ├── css/
│   │   ├── fonts.css          # 本地自托管字体声明（11 个字面，@font-face）
│   │   └── styles.css         # 设计系统：令牌、氛围层、组件、响应式、动效降级
│   ├── js/main.js             # 交互：入场动画 / 滚动进度 / 平台识别 / 复制校验值 / 视频章节
│   ├── img/
│   │   ├── favicon.svg        # 手绘矢量标识（两台显示器 + 链路弧线）
│   │   ├── app-icon.png       # 应用图标 256×256（导航与 og:image 使用）
│   │   ├── app-icon-128.png   # 应用图标 128×128（apple-touch-icon 使用）
│   │   └── video-poster.jpg   # 演示视频封面帧（1280×720，取自视频第 4 秒）
│   ├── video/
│   │   └── lanlink-ui-walkthrough.mp4   # 操作演示视频（1920×1080 / H.264 / 31.6s / 6.5MB）
│   └── fonts/                 # 按页面实际字符裁剪的 woff2 字面（11 个，共约 136 KB）
├── render.yaml                # Render 静态站点部署声明
├── .gitignore
└── README.md
```

> 视频体积较大（6.5 MB），页面使用 `preload="metadata"`，浏览器只预取元信息，
> 用户点击播放后才拉流；同时保留「下载视频」直链供离线观看。

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

## 操作演示视频

页面 `02 / WALKTHROUGH` 区块内嵌一段真实界面录制的操作演示：

| 项 | 值 |
| --- | --- |
| 文件 | `assets/video/lanlink-ui-walkthrough.mp4` |
| 规格 | 1920×1080 / H.264 (High, yuv420p) / 30 fps / 1716 kb/s / 6.5 MB |
| 时长 | 31.6 秒，无音轨（画面本身已含全部说明文字） |
| 封面 | `assets/img/video-poster.jpg`（取自第 4 秒的真实界面帧） |
| 章节 | 10 个，右侧列表可点击跳转，播放时自动高亮当前章节 |

视频由真实界面截图逐帧合成：左侧是软件真实截图，青绿高亮框 + 箭头 + 编号徽章
精确标注目标控件，右侧为该步骤的文字说明。相比 AI 生成，中文文案 100% 准确、
标注不会画错控件。

### 章节时间点

| 编号 | 章节 | 起点 |
| --- | --- | --- |
| 00 | 开场 · 澜链是什么 | 00:00 |
| 01 | 联系人主界面 | 00:03 |
| 02 | 扫描局域网 | 00:06 |
| 03 | 手动添加设备 | 00:09 |
| 04 | 多选群发 | 00:13 |
| 05 | 主题与可见性 | 00:16 |
| 06 | 通知与端口 | 00:19 |
| 07 | 存储与更新 | 00:22 |
| 08 | 设备详情与校验码 | 00:25 |
| 09 | 开箱即用 | 00:29 |

> 修改视频后需要同步三处：`index.html` 中 `<video>` 的 `poster` 与 `<source src>`、
> `assets/img/video-poster.jpg` 封面图、以及 `.demo__chapter` 中的 `data-time` 章节时间点。

## 字体自托管说明

站点**不使用 Google Fonts**，全部字体已本地化到 `assets/fonts/`，避免国内网络对
`fonts.googleapis.com` / `fonts.gstatic.com` 不可达或高延迟导致标题回退闪烁。

- 共 11 个字面（Noto Sans SC 300/500、Noto Serif SC 500/700/900、
  Chakra Petch 500/600/700、IBM Plex Mono 400/500/600），总体积约 **136 KB**
- 每个字面按页面**实际渲染的字符集**精确裁剪，只保留用到的字形
- 声明文件为 `assets/css/fonts.css`，`index.html` 中已无任何外部字体引用

### 增删文案后如何重新裁剪

若页面文案有改动，需要重新收集字符集并重新裁剪，否则新增的汉字会回退到系统字体。
流程如下（依赖 Node 与 Playwright）：

1. 用 Playwright 打开页面，遍历所有元素，导出每个 `(字体族, 字重)` 上下文实际渲染的字符集
   - 汉字只计入 **CJK 字体**（Noto Sans SC / Noto Serif SC）；拉丁字体（Chakra Petch /
     IBM Plex Mono）不含汉字，汉字会沿字体栈回落到同字重的 CJK 字体
   - 字重按 CSS 匹配规则落到已声明字面上（如 Noto Sans SC 只有 300/500，
     700 的请求会使用 500 字面并由浏览器合成加粗）
2. 按字面合并字符集，得到每个 `(字体族, 字重)` 的字符列表
3. 调用 Google Fonts 的 `text=` 接口取回仅含这些字符的 woff2：
   `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300&text=<URL 编码字符集>`
   （注意直链形如 `fonts.gstatic.com/l/font?kit=...`，**无 `.woff2` 扩展名**）
4. 落到 `assets/fonts/`，文件名保持 `<族名>-<字重>.woff2`，并同步更新 `assets/css/fonts.css`
5. 用 `document.fonts.check('<字重> 16px "<族名>"', 字符)` 逐字校验，确认无缺字

> 备选方案：用旧版 User-Agent（IE6）请求会得到 **EOT** 包装格式而非 TTF，
> 真 sfnt 头位于文件中部，需先剥离包装再用 `pyftsubset` 裁剪。

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
- **字体**：修改 `assets/css/styles.css` 顶部 `:root` 中的 `--font-*`，
  并在 `assets/css/fonts.css` 中声明对应字面（本地化，无外链）
- **文案**：全部位于 `index.html`，无内容硬编码在脚本中
- **视频**：替换 `assets/video/` 下的 mp4，并按上文同步封面图与章节时间点

## 说明

- 页面不含任何统计、追踪与第三方脚本，运行期**零外部请求**（含字体）。
- 桌面端下载链接由 Aurora License Server 平台分发，页面仅做跳转，不代理文件流。
