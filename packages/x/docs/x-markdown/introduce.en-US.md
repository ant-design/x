---
order: 1
title: Introduction
---

`@ant-design/x-markdown` aims to provide a streaming-friendly, high-performance, and highly extensible Markdown renderer. It offers capabilities like streaming rendering of formulas, footnotes, and code highlighting.

## ✨ Features

Using [`marked`](https://github.com/markedjs/marked) as the base markdown renderer, it inherits all the features of marked.

- 🚀 Built for speed.
- 🤖 Streaming-friendly, a Markdown rendering solution for large models.
- ⬇️ Low-level compiler for parsing Markdown without long caching or blocking.
- ⚖️ Lightweight, while implementing all supported markdown features of various styles and specifications.
- 🔐 Secure by default, no `dangerouslySetInnerHTML` XSS attacks.
- 🎨 Customizable components, pass your own components to replace `<h2>` for `## hi`.
- 🔧 Rich plugins, with many plugins to choose from.
- 😊 Compatible, 100% compliant with CommonMark, 100% compliant with GFM plugins.

## Compatibility

To improve the overall compatibility of markdown with the system, you can customize polyfills to enhance compatibility.

| Compatibility Mode             | Chrome     | iOS        | Android | HarmonyOS |
| :----------------------------- | :--------- | :--------- | :------ | :-------- |
| ✅ Native Compatibility        | Chrome 92+ | iOS 15.2+  | -       | -         |
| 🧥 Retro Mode: Before polyfill | Chrome 92  | iOS 15.2   | -       | -         |
| 🧥 Retro Mode: After polyfill  | Chrome 92  | iOS 11.2.5 | 7.1.1   | 5.0+      |

## Supported Markdown Specifications

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## Installation

### Install with npm, yarn, pnpm, bun, or utoo

**We recommend using [npm](https://www.npmjs.com/), [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/), or [utoo](https://github.com/umijs/mako/tree/next) for development.** This not only allows for easy debugging in the development environment but also enables confident packaging and deployment in the production environment, enjoying the many benefits of the entire ecosystem and toolchain.

<InstallDependencies npm='$ npm install @ant-design/x-markdown --save' yarn='$ yarn add @ant-design/x-markdown' pnpm='$ pnpm install @ant-design/x-markdown --save' bun='$ bun add @ant-design/x-markdown' utoo='$ ut install @ant-design/x-markdown --save'></InstallDependencies>

If you have a poor network environment, it is recommended to use [cnpm](https://github.com/cnpm/cnpm).

### Browser Import

Use `script` and `link` tags to directly import files in the browser and use the global variable `XMarkdown`.

We provide `x-markdown.js`, `x-markdown.min.js`, and `x-markdown.min.js.map` in the `dist` directory of the npm package.

> **It is strongly not recommended to use the built files.** This prevents on-demand loading and makes it difficult to get quick bug fixes for underlying dependencies.

> Note: `x-markdown.js`, `x-markdown.min.js`, and `x-markdown.min.js.map` depend on `react` and `react-dom`. Please make sure to import these files beforehand.

## Example

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x-markdown';
const content = `
# Hello World

### Welcome to XMarkdown!

- Item 1
- Item 2
- Item 3
`;

const App = () => <XMarkdown content={content} />;

export default App;
```

## Plugins

`@ant-design/x-markdown` provides a rich set of plugins, which you can use through the `plugins` property. For details on plugins, see [Plugins](/markdowns/plugins).

## Themes

`@ant-design/x-markdown` provides a rich set of themes.

## TypeScript

`@ant-design/x-markdown` Written in TypeScript and provided with a complete definition file.
