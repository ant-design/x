---
order: 1
title: Introduction
---

`@ant-design/x-markdown` aims to provide a streaming-friendly, highly extensible and high-performance Markdown renderer. It offers capabilities such as streaming rendering of formulas, code highlighting, mermaid etc.

## ✨ Features

Built on [`marked`](https://github.com/markedjs/marked) as the base Markdown renderer, inheriting all features of marked.

- 🚀 Built for speed.
- 🤖 Streaming-friendly, a Markdown rendering solution for large models.
- ⬇️ Low-level compiler for parsing Markdown without long-term caching or blocking.
- ⚖️ Lightweight while implementing all supported Markdown styles and specifications.
- 🔐 Secure by default, no dangerouslySetInnerHTML XSS attacks.
- 🎨 Customizable components - pass your own components to replace default ones like \<h2\> for ## hi.
- 🔧 Rich plugin ecosystem with many plugins to choose from.
- 😊 Compatible - 100% CommonMark compliant, 100% GFM plugin compliant.

## Compatibility

Aligned with [`marked`](https://github.com/markedjs/marked). To improve overall Markdown compatibility with systems, custom polyfills can be added.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| >= 92 | >= 92 | >= 90 | >= 15.4 | >= 78 |

## Supported Markdown Specifications

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## Installation

### Using npm or yarn or pnpm or bun or utoo

**We recommend using [npm](https://www.npmjs.com/) or [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) or [utoo](https://github.com/umijs/mako/tree/next) for development**, which allows easy debugging in development environments and safe production deployment, enjoying the benefits of the entire ecosystem and toolchain.

<InstallDependencies npm='$ npm install @ant-design/x-markdown --save' yarn='$ yarn add @ant-design/x-markdown' pnpm='$ pnpm install @ant-design/x-markdown --save' bun='$ bun add @ant-design/x-markdown' utoo='$ ut install @ant-design/x-markdown --save'></InstallDependencies>

If your network environment is poor, we recommend using [cnpm](https://github.com/cnpm/cnpm).

### Browser Usage

Include files directly in the browser using `script` and `link` tags, and use the global variable `XMarkdown`.

We provide `x-markdown.js`, `x-markdown.min.js` and `x-markdown.min.js.map` in the dist directory of the npm package.

> **Strongly not recommended to use built files directly**, as this prevents on-demand loading and makes it difficult to get quick bug fixes for underlying dependencies.

> Note: `x-markdown.js`, `x-markdown.min.js` and `x-markdown.min.js.map` depend on `react` and `react-dom`. Please ensure these are included first.

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

`@ant-design/x-markdown` provides a rich set of plugins that can be used via the `plugins` property. See [Plugin Collection](/markdowns/plugins) for details.

## Themes

`@ant-design/x-markdown` offers a variety of themes to choose from. See [Themes](/markdowns/themes) for details.
