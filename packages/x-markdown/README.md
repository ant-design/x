<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X Markdown</h1>

Streaming-friendly, highly extensible, and high-performance Markdown renderer

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[Changelog](./CHANGELOG.md) · [Report a Bug][github-issues-bug-report] · [Request a Feature][github-issues-feature-request] · English · [中文](./README-zh_CN.md)

[npm-image]: https://img.shields.io/npm/v/@ant-design/x-markdown.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ant-design/x-markdown
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x-markdown.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x-markdown
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x-markdown?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x-markdown
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml
[antd-image]: https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square
[antd-url]: https://ant.design
[zhihu-image]: https://img.shields.io/badge/-Ant%20Design-white?logo=zhihu
[zhihu-url]: https://www.zhihu.com/column/c_1564262000561106944

</div>

## ✨ Features

Uses [`marked`](https://github.com/markedjs/marked) as the base markdown renderer, with all features of marked.

- 🚀 Born for speed.
- 🤖 Streaming-friendly, LLM Markdown rendering solution.
- ⬇️ Low-level compiler for parsing Markdown, no long-term caching or blocking.
- ⚖️ Lightweight, implements all supported styles and markdown specs.
- 🔐 Secure by default, no dangerouslySetInnerHTML XSS attacks.
- 🎨 Customizable components, pass your own components to replace \<h2\> for ## hi.
- 🔧 Rich plugins, many plugins available.
- 😊 Compatible, 100% CommonMark, 100% GFM plugin support.

## Compatibility

Consistent with [`marked`](https://github.com/markedjs/marked). For better overall markdown compatibility, you can customize polyfills as needed.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /> Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /> Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /> Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /> Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /> Opera |
| --- | --- | --- | --- | --- |
| >= 92 | >= 90 | >= 92 | >= 15.4 | >= 78 |

## Supported Markdown Specs

- [Markdown 1.0.0](https://daringfireball.net/projects/markdown/)
- [CommonMark](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors)
- [GitHub Flavored Markdown (GFM)](https://github.github.com/gfm/)

## 📦 Installation

### Using npm, yarn, pnpm, bun, or utoo

**We recommend using [npm](https://www.npmjs.com/), [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/), or [utoo](https://github.com/umijs/mako/tree/next) for development.** This allows for easy debugging in development and safe production deployment, enjoying the benefits of the entire ecosystem and toolchain. If your network is slow, try [cnpm](https://github.com/cnpm/cnpm).

```bash
npm install @ant-design/x-markdown
```

```bash
yarn add @ant-design/x-markdown
```

```bash
pnpm add @ant-design/x-markdown
```

```bash
ut install @ant-design/x-markdown
```

### Browser Import

Use `script` and `link` tags to directly import files in the browser, and use the global variable `XMarkdown`.

We provide `x-markdown.js`, `x-markdown.min.js`, and `x-markdown.min.js.map` in the dist directory of the npm package.

> **Strongly not recommended to use built files**, as this prevents on-demand loading and makes it difficult to get quick bug fixes for underlying dependency modules.

> Note: `x-markdown.js`, `x-markdown.min.js`, and `x-markdown.min.js.map` depend on `react` and `react-dom`. Please ensure these files are imported in advance.

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

`@ant-design/x-markdown` provides a rich set of plugins. You can use them via the `plugins` prop. See [Plugins Collection](../x/docs/x-markdown/plugins.md) for details.

## Themes

`@ant-design/x-markdown` provides several themes. See [Themes](../x/docs/x-markdown/themes.md) for details.

## 🌈 Enterprise-level LLM Components Out of the Box

`@ant-design/x` provides a rich set of atomic components for different interaction stages based on the RICH interaction paradigm, helping you flexibly build your AI applications. See details [here](../x/README.md).

## ⚡️ Connect to Model Agents & Efficiently Manage Data Streams

`@ant-design/x-sdk` provides a set of utility APIs to help developers manage AI application data streams out of the box. See details [here](../x-sdk/README.md).

## How to Contribute

Before participating in any form, please read the [Contributor Guide](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md). If you wish to contribute, feel free to submit a [Pull Request](https://github.com/ant-design/ant-design/pulls) or [report a Bug](http://new-issue.ant.design/).

> We highly recommend reading [How To Ask Questions The Smart Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way), [How to Ask Questions in Open Source Community](https://github.com/seajs/seajs/issues/545), [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs.html), and [How to Submit Unanswerable Questions to Open Source Projects](https://zhuanlan.zhihu.com/p/25795393). Better questions are more likely to get help.

## Community Support

If you encounter problems during use, you can seek help through the following channels. We also encourage experienced users to help newcomers through these channels.

When asking questions on GitHub Discussions, it is recommended to use the `Q&A` tag.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)

<a href="https://openomy.app/github/ant-design/x" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://openomy.app/svg?repo=ant-design/x&chart=bubble&latestMonth=3" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
 </a>
