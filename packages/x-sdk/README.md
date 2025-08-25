<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X SDK</h1>

Efficiently manage large model data streams

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[Changelog](./CHANGELOG.md) · [Report a Bug][github-issues-bug-report] · [Request a Feature][github-issues-feature-request] · English · [中文](./README-zh_CN.md)

[npm-image]: https://img.shields.io/npm/v/@ant-design/x-sdk.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ant-design/x-sdk
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x-sdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x-sdk
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x-sdk?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x-sdk
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml
[antd-image]: https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square
[antd-url]: https://ant.design
[zhihu-image]: https://img.shields.io/badge/-Ant%20Design-white?logo=zhihu
[zhihu-url]: https://www.zhihu.com/column/c_1564262000561106944

</div>

## Introduction

`@ant-design/x-sdk` provides a set of tool APIs designed to help developers manage AI conversation application data flows out of the box.

## 📦 Installation

```bash
npm install @ant-design/x-sdk
```

```bash
yarn add @ant-design/x-sdk
```

```bash
pnpm add @ant-design/x-sdk
```

```bash
ut install @ant-design/x-sdk
```

### Browser Import

Use `script` and `link` tags to directly import files in the browser, and use the global variable `XSDK`.

We provide `x-sdk.js`, `x-sdk.min.js`, and `x-sdk.min.js.map` in the dist directory of the npm package.

> **Strongly not recommended to use built files**, as this prevents on-demand loading and makes it difficult to get quick bug fixes for underlying dependency modules.

> Note: `x-sdk.js`, `x-sdk.min.js`, and `x-sdk.min.js.map` depend on `react` and `react-dom`. Please ensure these files are imported in advance.

## Example

```tsx
import React from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = React.useState('');
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  React.useEffect(() => {
    setStatus('pending');

    XRequest('https://api.example.com/chat', {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      callbacks: {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
    });
  }, []);

  return (
    <div>
      <div>Status: {status}</div>
      <div>Lines: {lines.length}</div>
    </div>
  );
};
```

## 🌈 Enterprise-level LLM Components Out of the Box

`@ant-design/x` provides a rich set of atomic components for different interaction stages based on the RICH interaction paradigm, helping you flexibly build your AI applications. See details [here](../x/README.md).

## ✨ Markdown Renderer

`@ant-design/x-markdown` aims to provide a streaming-friendly, highly extensible, and high-performance Markdown renderer. It supports streaming rendering of formulas, code highlighting, mermaid, and more. See details [here](../x-markdown/README.md).

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
