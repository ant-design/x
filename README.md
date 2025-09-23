<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

Build excellent AI interfaces and pioneer intelligent new experiences.

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[Changelog](./CHANGELOG.md) · [Report a Bug][github-issues-bug-report] · [Request a Feature][github-issues-feature-request] · English · [中文](./README-zh_CN.md)

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

<img width="100%" src="https://github.com/user-attachments/assets/1a44d1dd-5c7b-41a1-b617-7b9594581aeb">

## 🌈 Enterprise-level LLM Components Out of the Box

`@ant-design/x` provides a rich set of atomic components for different interaction stages based on the RICH interaction paradigm, helping you flexibly build your AI applications. See details [here](../x/README.md).

## ⚡️ Connect to Model Agents & Efficiently Manage Data Streams

`@ant-design/x-sdk` provides a set of utility APIs to help developers manage AI application data streams out of the box. See details [here](../x-sdk/README.md).

## ✨ Markdown Renderer

`@ant-design/x-markdown` aims to provide a streaming-friendly, highly extensible, and high-performance Markdown renderer. It supports streaming rendering of formulas, code highlighting, mermaid, and more. See details [here](../x-markdown/README.md).

## Who's using

Ant Design X is widely used in AI-driven user interfaces within Ant Group. If your company or product uses Ant Design X, feel free to leave a message [here](https://github.com/ant-design/x/issues/126).

## Local Development

> antx uses [npm-workspace](https://docs.npmjs.com/cli/v11/using-npm/workspaces) to organize code. We recommend using npm or [utoo](https://github.com/umijs/mako/tree/next) for local development.

```bash
# Install utoo
$ npm i -g utoo

# Install project dependencies (by utoo)
$ ut [install]

# Start project
$ ut start # Method 1: Start via main package script
$ ut start --workspace packages/x # Method 2: Start via workspace param
$ ut start --workspace @ant-design/x # Method 3: Start via package.name (utoo only)
$ cd packages/x && ut start # Method 4: Enter subpackage dir and start

# Add dependency
$ ut install [pkg@version] # Add to main package
$ ut install [pkg@version] --workspace packages/x # Add to subpackage
$ cd packages/x && ut install [pkg@version] # Add to subpackage

# Update dependencies
$ ut update # utoo only
```

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
