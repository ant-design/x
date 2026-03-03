<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

Easily build AI-driven interfaces.

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[Changelog](./CHANGELOG.md) · [Report a Bug][github-issues-bug-report] · [Feature Request][github-issues-feature-request] · [中文](./README-zh_CN.md) · English

[npm-image]: https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ant-design/x
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml
[antd-image]: https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square
[antd-url]: https://ant.design
[zhihu-image]: https://img.shields.io/badge/-Ant%20Design-white?logo=zhihu
[zhihu-url]: https://www.zhihu.com/column/c_1564262000561106944

</div>

<img width="100%" src="https://mdn.alipayobjects.com/huamei_35zehm/afts/img/A*DfJHS4rP4SgAAAAAgGAAAAgAejCDAQ/original">

## ✨ Features

- 🌈 **Best practices from enterprise-level AI products**: Based on RICH interaction paradigms, providing excellent AI interaction experience
- 🧩 **Flexible atomic components**: Covering most AI scenarios, helping you quickly build personalized AI interaction pages
- ✨ **Stream-friendly, extensible, and high-performance Markdown renderer**: Supports streaming formulas, code highlighting, mermaid diagrams, etc. [@ant-design/x-markdown](../x-markdown/README.md)
- 🚀 **Out-of-the-box model/agent integration**: Easily connect to OpenAI-compatible model/agent services [@ant-design/x-sdk](../x-sdk/README.md)
- ⚡️ **Efficient management of large model data streams**: Provides handy data stream management features for more efficient development [@ant-design/x-sdk](../x-sdk/README.md)
- 📦 **Rich template support**: Multiple templates for quick LUI app development [Templates](https://github.com/ant-design/x/tree/main/packages/x/docs/playground/)
- 🛡 **Full TypeScript coverage**: Developed with TypeScript, providing complete type support for better experience and reliability
- 🎨 **Deep theme customization**: Fine-grained style adjustments for personalized needs in various scenarios

## 📦 Installation

```bash
npm install @ant-design/x
```

```bash
yarn add @ant-design/x
```

```bash
pnpm add @ant-design/x
```

```bash
ut install @ant-design/x
```

### Browser Usage

Use `script` and `link` tags to directly import files and use the global variable `antdx`.

The npm package's [dist](https://cdn.jsdelivr.net/npm/@ant-design/x@1.0.0/dist/) directory provides `antdx.js`, `antdx.min.js`, and `antdx.min.js.map`.

> **Strongly not recommended to use built files** as they do not support on-demand loading and may not get quick bug fixes for underlying dependencies.

> Note: `antdx.js` and `antdx.min.js` depend on `react`, `react-dom`, `dayjs`, `antd`, `@ant-design/cssinjs`, and `@ant-design/icons`. Please make sure to import these files first.

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide many atomic components for different interaction stages to help you flexibly build your AI application:

- [Component Overview](https://x.ant.design/components/overview)
- [Templates](https://x.ant.design/docs/playground/independent)

Here is a simple example of building a dialog using atomic components:

```tsx
import React from 'react';
import {
  // Message bubble
  Bubble,
  // Sender box
  Sender,
} from '@ant-design/x';

const messages = [
  {
    key: 'message_1',
    content: 'Hello, Ant Design X!',
    role: 'user',
  },
  {
    key: 'x_message_1',
    content: 'Hello, I am Ant Design X!',
    role: 'x',
  },
];

const role = {
  // Bubble position: end
  x: {
    placement: 'end',
  },
};

const App = () => (
  <div>
    <Bubble.List items={messages} role={role} />
    <Sender />
  </div>
);

export default App;
```

## ⚡️ Model/Agent Integration & Efficient Data Stream Management

`@ant-design/x-sdk` provides a series of tool APIs for out-of-the-box management of AI application data streams. See details [here](../x-sdk/README.md).

## ✨ Markdown Renderer

`@ant-design/x-markdown` aims to provide a stream-friendly, extensible, and high-performance Markdown renderer. Supports streaming formulas, code highlighting, mermaid diagrams, etc. See details [here](../x-markdown/README.md).

## On-demand Loading

`@ant-design/x` supports tree shaking based on ES modules by default.

## TypeScript

`@ant-design/x` is written in TypeScript and provides complete definition files.

## Who's Using

Ant Design X is widely used in AI-driven user interfaces within Ant Group. If your company or product uses Ant Design X, feel free to leave a message [here](https://github.com/ant-design/x/issues/126).

## Local Development

> antx uses [npm-workspace](https://docs.npmjs.com/cli/v11/using-npm/workspaces) to organize code. It is recommended to use npm or [utoo](https://github.com/umijs/mako/tree/next) for local development.

```bash
# Install utoo
$ npm i -g utoo

# Install project dependencies (by utoo)
$ ut [install]

# Start project
$ ut start # Method 1: Start via main package script
$ ut start --workspace packages/x # Method 2: Start via workspace parameter
$ ut start --workspace @ant-design/x # Method 3: Start via package.name (utoo only)
$ cd packages/x && ut start # Method 4: Start in subpackage directory

# Add dependencies
$ ut install [pkg@version] # Add dependency to main package
$ ut install [pkg@version] --workspace packages/x # Add dependency to subpackage
$ cd packages/x && ut install [pkg@version] # Add dependency to subpackage

# Update dependencies
$ ut update # utoo only
```

## How to Contribute

Before participating in any form, please read the [Contributor Guide](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md). If you wish to contribute, feel free to submit a [Pull Request](https://github.com/ant-design/ant-design/pulls) or [Report a Bug](http://new-issue.ant.design/).

> Highly recommended reading [How To Ask Questions The Smart Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way), [How to Ask Questions in Open Source Community](https://github.com/seajs/seajs/issues/545), [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs.html), and [How to Submit Unsolvable Issues to Open Source Projects](https://zhuanlan.zhihu.com/p/25795393) for better help.

## Community Support

If you encounter problems during use, you can seek help through the following channels. We also encourage experienced users to help newcomers through these channels.

When asking questions in GitHub Discussions, please use the `Q&A` label.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)

<a href="https://openomy.app/github/ant-design/x" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://openomy.app/svg?repo=ant-design/x&chart=bubble&latestMonth=3" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
 </a>
