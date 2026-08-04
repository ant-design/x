<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X SDK</h1>

高效管理大模型数据流

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow zhihu][zhihu-image]][zhihu-url]

[更新日志](../../CHANGELOG.zh-CN.md) · [报告一个 Bug][github-issues-bug-report] · [想新增特性？][github-issues-feature-request] · [English](./README.md) · 中文

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

## 介绍

`@ant-design/x-sdk` 提供了一系列的工具API，旨在帮助开发人员开箱即用的管理AI对话应用数据流

## 安装

### 使用 npm 或 yarn 或 pnpm 或 bun 安装 或 utoo 安装

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 或 [utoo](https://github.com/umijs/mako/tree/next) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

## 📦 安装

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

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `XSDK`。

我们在 npm 发布包内的 dist 目录下提供了 `x-sdk.js`、`x-sdk.min.js` 和 `x-sdk.min.js.map`。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`x-sdk.js` 和 `x-sdk.min.js` 和 `x-sdk.min.js.map`。依赖 `react`、`react-dom`请确保提前引入这些文件。

## 示例

```tsx
import React from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = React.useState<'string'>('');
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  useEffect(() => {
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

## 实验性 Agent Core

模型无关的 Agent Core 将 Provider 语义归一化与 Headless 状态分离。模型、Agent Runtime 和私有流协议都实现同一套 Provider 契约；状态与 UI 只消费统一事件。

```ts
import { experimentalAgent } from '@ant-design/x-sdk';

const events = experimentalAgent.createAgentEventFactory({
  sessionId: 'session-1',
  runId: 'run-1',
});
const store = experimentalAgent.createAgentStore();

store.batch([
  events.create('run.started', {}),
  events.create('message.started', {
    messageId: 'message-1',
    role: 'assistant',
  }),
  events.create('message.delta', {
    messageId: 'message-1',
    delta: '你好',
  }),
  events.create('message.completed', { messageId: 'message-1' }),
  events.create('run.completed', {}),
]);

const messageKey = experimentalAgent.getAgentEntityKey('run-1', 'message-1');
console.log(store.getSnapshot().messages[messageKey].content);
```

React 应用通过同一个 `useXChat` 接入 AgentProvider。Provider 内部绑定 Transport 并声明协议，不需要给 Hook 增加 `agent`、`mode` 或 `transport` 配置。

```ts
const { messages, agentState, onRequest, abort, isRequesting } = useXChat({ provider });

onRequest({ prompt: '分析这份报告' });
console.log(agentState.toolCalls);
```

`experimentalAgent` 只包含事件协议、Reducer 和 Store；AgentProvider 类型与执行辅助能力归入现有 `chat-providers` 顶层导出。React 内部桥接仍属于 `useXChat`，不会形成第二个 Hook。

在参考 Provider 和官方 Agent Demo 完成前，这些实验性 API 可能继续调整。

完整契约、生命周期规则和可运行的本地 Runtime 示例请参阅 [Agent Provider 文档](../x/docs/x-sdk/agent-provider.zh-CN.md)。

## 🌈 开箱即用的大模型企业级组件

`@ant-design/x` 基于 RICH 交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI 应用，详情点击[这里](packages/x/README-zh_CN.md)。

## ✨ Markdown 渲染器

`@ant-design/x-markdown` 旨在提供流式友好、强拓展性和高性能的 Markdown 渲染器。提供流式渲染公式、代码高亮、mermaid 等能力，详情点击[这里](packages/x-markdown/README-zh_CN.md)。

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
