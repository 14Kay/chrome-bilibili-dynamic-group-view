![banner](https://github.com/14Kay/chrome-bilibili-dynamic-group-view/raw/master/public/assets/banner.png)

# Bilibili Dynamic Group View (B站动态分组浏览)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Download-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/bilibili-group-view-b%E7%AB%99%E5%8A%A8%E6%80%81%E5%88%86/edicmfdnmplcjddfegpeikeipfgabili)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)

这是一个 Chrome 扩展，旨在为 Bilibili 动态页面 (`t.bilibili.com`) 添加**分组浏览**功能。它会自动同步你的关注分组，并在动态页顶部生成标签栏，让你能快速筛选特定分组的动态。

## ✨ 主要功能

-   **分组筛选**: 在动态页面顶部注入分组标签栏，点击即可只看该分组 UP 主的动态。
-   **自动同步**:
    -   插件会在后台每 **12 小时** 自动静默同步一次你的分组数据。
    -   即使不打开 B 站页面，数据也能保持最新。
-   **手动刷新**: 点击扩展图标，在弹出的窗口中可以查看上次同步时间，并强制手动刷新数据。
-   **无感集成**: 完美融入 B 站原生 UI 风格，支持夜间模式。
-   **极致性能**: 采用 React + TypeScript 构建，通过 MutationObserver 智能监听 DOM 变化，资源占用极低。

## 🚀 安装指南

### 商店安装 (推荐)

1.  访问 [Chrome Web Store](https://chromewebstore.google.com/detail/bilibili-group-view-b%E7%AB%99%E5%8A%A8%E6%80%81%E5%88%86/edicmfdnmplcjddfegpeikeipfgabili)。
2.  点击 **"Add to Chrome"** 按钮即可一键安装。

### 开发环境安装

1.  **克隆项目**
    ```bash
    git clone https://github.com/14Kay/chrome-bilibili-dynamic-group-view.git
    cd chrome-bilibili-dynamic-group-view
    ```

2.  **安装依赖**
    ```bash
    npm install
    # 或者使用 pnpm
    pnpm install
    ```

3.  **构建项目**
    ```bash
    npm run build
    ```
    构建完成后，会在根目录生成 `dist` 文件夹。

4.  **加载扩展**
    -   打开 Chrome 浏览器，访问 `chrome://extensions/`。
    -   开启右上角的 **"开发者模式" (Developer mode)**。
    -   点击左上角的 **"加载已解压的扩展程序" (Load unpacked)**。
    -   选择项目目录下的 `dist` 文件夹。

## 🛠️ 开发说明

如果你想参与开发或修改代码：

-   **启动监听模式**:
    ```bash
    npm run watch
    ```
    该命令会监听文件变化并自动重新构建。

-   **项目结构**:
    -   `src/background`: 后台服务 Worker (处理定时任务和数据同步)。
    -   `src/dynamic`: Content Script (负责注入 UI 和页面交互)。
    -   `src/popup`: 扩展图标点击后的弹窗 UI。
    -   `public`: 静态资源 (图标、Manifest 等)。

## 📝 常见问题

**Q: 为什么刚安装完没有分组标签？**
A: 首次安装后，插件会自动在后台获取数据，这可能需要几秒钟。如果没有出现，请尝试刷新动态页面，或者点击插件图标手动点击“立即同步”。

**Q: 点击标签后动态没有变化？**
A: 请确保你当前在“全部”动态 Tab 下。如果在“视频”或“投稿”等子 Tab 下，B 站原生的筛选逻辑可能会覆盖插件的筛选。

## 📄 License

MIT License © 2023-PRESENT [14K](https://github.com/14Kay)
