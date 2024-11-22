<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

构建 Copilot 应用的好搭档。

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url]

[Changelog](./CHANGELOG.zh-US.md) · [Report Bug][github-issues-bug-report] · [Request Feature][github-issues-feature-request] · [English](./README.md) · 中文

[npm-image]: https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ant-design/x
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml

</div>

![demos](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*F_anQ55UdUoAAAAAAAAAAAAADgCCAQ/fmt.webp)

## ✨ 特性

- 🌈 **源自企业级 AI 产品的最佳实践**：基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 **灵活多样的原子组件**：覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ **开箱即用的模型对接能力**：轻松对接符合 OpenAI 标准的模型推理服务
- 🔄 **高效管理对话数据流**：提供好用的数据流管理功能，让开发更高效
- 📦 **丰富的样板间支持**：提供多种模板，快速启动 LUI 应用开发
- 🛡 **TypeScript 全覆盖**：采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 **深度主题定制能力**：支持细粒度的样式调整，满足各种场景的个性化需求

## 📦 安装

```bash
npm install @ant-design/x --save
```

```bash
yarn add @ant-design/x
```

```bash
pnpm add @ant-design/x
```

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antdx`。

我们在 npm 发布包内的 dist 目录下提供了 `antdx.js`、`antdx.min.js` 和 `antdx.min.js.map`。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`antdx.js` 和 `antdx.min.js` 依赖 `react`、`react-dom`、`dayjs`，请确保提前引入这些文件。

## 🧩 原子组件

我们基于 RICH 交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI 对话应用：

- 通用: `Bubble` - 消息气泡、`Conversations` - 会话管理
- 唤醒: `Welcome` - 欢迎、`Prompts` - 提示集
- 表达: `Sender` - 发送框、`Attachment` - 附件、`Suggestion` - 快捷指令
- 确认: `ThoughtChain` - 思维链

下面是使用原子组件搭建一个最简单的对话框的代码示例:

```tsx
import React from 'react';
import {
  // 消息气泡
  Bubble,
  // 发送框
  Sender,
} from '@ant-design/x';

const messages = [
  {
    content: 'Hello, Ant Design X!',
    role: 'user',
  },
];

const App = () => (
  <div>
    <Bubble.List items={messages} />
    <Sender />
  </div>
);

export default App;
```

## ⚡️ 对接模型推理服务

我们通过提供 `useXAgent` 运行时工具，帮助你开箱即用的对接符合 OpenAI 标准的模型推理服务。

下面是如何使用 `useXAgent` 的代码示例:

```tsx
import React from 'react';
import { useXAgent, Sender } from '@ant-design/x';

const App = () => {
  const [agent] = useXAgent({
    // 模型推理服务地址
    baseURL: 'https://your.api.host',
    // 模型名称
    model: 'gpt-3.5',
  });

  function chatRequest(text: string) {
    agent.request({
      // 消息
      messages: [
        {
          content: text,
          role: 'user',
        },
      ],
      // 开启流式
      stream: true,
    });
  }

  return <Sender onSubmit={chatRequest} />;
};

export default App;
```

## 🔄 高效管理数据流

我们通过提供 `useXChat` 运行时工具，帮助你开箱即用的管理 AI 对话应用的数据流:

```tsx
import React from 'react';
import { useXChat, useXAgent } from '@ant-design/x';

const App = () => {
  const [agent] = useXAgent({
    // 模型推理服务地址
    baseURL: 'https://your.api.host',
    // 模型名称
    model: 'gpt-3.5',
  });

  const {
    // 发起聊天请求
    onRequest,
    // 消息列表
    messages,
  } = useXChat({ agent });

  return (
    <div>
      <Bubble.List items={messages} />
      <Sender onSubmit={onRequest} />
    </div>
  );
};

export default App;
```

## 按需加载

`@ant-design/x` 默认支持基于 ES modules 的 tree shaking。

## TypeScript

`@ant-design/x` 使用 TypeScript 进行书写并提供了完整的定义文件。

## 谁在使用

Ant Design X 广泛用于蚂蚁集团内由 AI 驱动的用户交互界面。如果你的公司和产品使用了 Ant Design X，欢迎到 [这里](https://github.com/ant-design/x/issues/126) 留言。

## 如何贡献

在任何形式的参与前，请先阅读 [贡献者文档](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md)。如果你希望参与贡献，欢迎提交 [Pull Request](https://github.com/ant-design/ant-design/pulls)，或给我们 [报告 Bug](http://new-issue.ant.design/)。

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

## 社区互助

如果您在使用的过程中碰到问题，可以通过下面几个途径寻求帮助，同时我们也鼓励资深用户通过下面的途径给新人提供帮助。

通过 GitHub Discussions 提问时，建议使用 `Q&A` 标签。

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)
