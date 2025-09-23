<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

打造卓越 AI 界面解决方案，引领智能新体验。

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[更新日志](./CHANGELOG.zh-CN.md) · [报告一个 Bug][github-issues-bug-report] · [想新增特性？][github-issues-feature-request] · [English](./README.md) · 中文

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

## 🌈 开箱即用的大模型企业级组件

`@ant-design/x` 基于 RICH 交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI 应用，详情点击[这里](../x/README-zh_CN.md)。

## ⚡️ 对接模型智能体服务 & 高效管理数据流

`@ant-design/x-sdk` 提供了一系列的工具API，旨在提供开发者开箱即用的管理AI应用数据流，详情点击[这里](../x-sdk/README-zh_CN.md)。

## ✨ Markdown 渲染器

`@ant-design/x-markdown` 旨在提供流式友好、强拓展性和高性能的 Markdown 渲染器。提供流式渲染公式、代码高亮、mermaid 等能力，详情点击[这里](../x-markdown/README-zh_CN.md)。

## 谁在使用

Ant Design X 广泛用于蚂蚁集团内由 AI 驱动的用户交互界面。如果你的公司和产品使用了 Ant Design X，欢迎到 [这里](https://github.com/ant-design/x/issues/126) 留言。

## 本地研发

> antx 通过 [npm-workspace](https://docs.npmjs.com/cli/v11/using-npm/workspaces) 来组织代码，推荐使用 npm 或 [utoo](https://github.com/umijs/mako/tree/next) 进行本地研发。

```bash

# 安装 utoo
$ npm i -g utoo

# 安装项目依赖 (by utoo)
$ ut [install]

# 启动项目
$ ut start # 方式一: 通过主包的 script 启动
$ ut start --workspace packages/x # 方式二: 通过 workspace 参数启动
$ ut start --workspace @ant-design/x # 方式三: 通过 package.name 启动 (utoo only)
$ cd packages/x && ut start # 方式四: 进入子包目录单独启动


# 添加依赖
$ ut install [pkg@version] # 为主包添加依赖
$ ut install [pkg@version] --workspace packages/x # 为子包添加依赖
$ cd packages/x && ut install [pkg@version] # 为子包添加依赖

# 依赖更新
$ ut update # utoo only
```

## 如何贡献

在任何形式的参与前，请先阅读 [贡献者文档](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md)。如果你希望参与贡献，欢迎提交 [Pull Request](https://github.com/ant-design/ant-design/pulls)，或给我们 [报告 Bug](http://new-issue.ant.design/)。

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

## 社区互助

如果您在使用的过程中碰到问题，可以通过下面几个途径寻求帮助，同时我们也鼓励资深用户通过下面的途径给新人提供帮助。

通过 GitHub Discussions 提问时，建议使用 `Q&A` 标签。

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)

<a href="https://openomy.app/github/ant-design/x" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://openomy.app/svg?repo=ant-design/x&chart=bubble&latestMonth=3" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
 </a>
