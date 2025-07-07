---
order: 1
title: 介绍
---

`@ant-design/x-markdown` 旨在提供流式友好、强拓展性和高性能的 Markdown 渲染器。提供流式渲染公式、脚注、代码高亮等能力。

## ✨ 特性

使用 [`marked`](https://github.com/markedjs/marked) 作为基础 markdown 渲染器，具备marked的所有特性。

- 🚀 为速度而生。
- 🤖 流式友好，大模型Markdown渲染解决方案。
- ⬇️ 低级编译器，用于解析 Markdown，无需长时间缓存或阻塞。
- ⚖️ 轻量级，同时实现所有支持的风格和规范的 markdown 功能。
- 🔐 默认安全，无dangerouslySetInnerHTML XSS 攻击。
- 🎨 可自定义组件，传递你自己的组件来代替\<h2\>for## hi。
- 🔧 丰富的插件，有很多插件可供选择。
- 😊 兼容，100% 符合 CommonMark，100% 符合 GFM 插件。

## 兼容环境

与 `marked` 保持一致。为了提高整体markdown对于系统的兼容性支持，可以自定义polyfill，来提高兼容性。

| 兼容模式    | Chrome     | IOS       |
| ----------- | ---------- | --------- |
| ✅ 原生兼容 | Chrome 92+ | iOS 15.2+ |

## 支持的 Markdown 规范

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## 安装

### 使用 npm 或 yarn 或 pnpm 或 bun 安装 或 utoo 安装

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 或 [utoo](https://github.com/umijs/mako/tree/next) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

<InstallDependencies npm='$ npm install @ant-design/x-markdown --save' yarn='$ yarn add @ant-design/x-markdown' pnpm='$ pnpm install @ant-design/x-markdown --save' bun='$ bun add @ant-design/x-markdown' utoo='$ ut install @ant-design/x-markdown --save'></InstallDependencies>

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `XMarkdown`。

我们在 npm 发布包内的 dist 目录下提供了 `x-markdown.js`、`x-markdown.min.js` 和 `x-markdown.min.js.map`。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`x-markdown.js` 和 `x-markdown.min.js` 和 `x-markdown.min.js.map`。依赖 `react`、`react-dom`请确保提前引入这些文件。

## 示例

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x-markdown';
const content = `
# Hello World

### 欢迎使用 XMarkdown！

- 项目1
- 项目2
- 项目3
`;

const App = () => <XMarkdown content={content} />;

export default App;
```

## 插件

`@ant-design/x-markdown` 提供了丰富的插件，你可以通过 `plugins` 属性来使用这些插件。插件详情查看[插件集](/markdowns/plugins-cn)。

## 主题

`@ant-design/x-markdown` 提供了丰富的主题。
