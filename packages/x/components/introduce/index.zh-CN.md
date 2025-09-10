---
category: Components
order: 0
title: 介绍
showImport: false
---

`@ant-design/x` 是基于 Ant Design 设计体系的 React UI 库、专为 AI 驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面。

---

## ✨ 特性

- 🌈 **源自企业级 AI 产品的最佳实践**：基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 **灵活多样的原子组件**：覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ **开箱即用的模型对接能力**：配合[X SDK](/sdks/introduce-cn) 轻松对接模型和智能体服务
- 📦 **丰富的样板间支持**：提供多种模板，快速启动 LUI 应用开发
- 🛡 **TypeScript 全覆盖**：采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 **深度主题定制能力**：支持细粒度的样式调整，满足各种场景的个性化需求

## 安装

### 使用 npm 或 yarn 或 pnpm 或 bun 安装 或 utoo 安装

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 或 [utoo](https://github.com/umijs/mako/tree/next) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x' utoo='$ ut install @ant-design/x --save'></InstallDependencies>

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `antdx`。

我们在 npm 发布包内的 dist 目录下提供了 `antdx.js`、`antdx.min.js` 和 `antdx.min.js.map`。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`antdx.js` 和 `antdx.min.js` 依赖 `react`、`react-dom`、`dayjs` `antd` `@ant-design/cssinjs` `@ant-design/icons`，请确保提前引入这些文件。

## 🧩 组件

我们基于 RICH 交互范式，在不同的交互阶段提供了大量的原子组件，帮助你灵活搭建你的 AI 对话应用：

- 通用: `Bubble` - 消息气泡、`Conversations` - 会话管理、`Notification` - 系统通知
- 唤醒: `Welcome` - 欢迎、`Prompts` - 提示集
- 表达: `Sender` - 发送框、`Attachment` - 输入附件、`Suggestion` - 快捷指令
- 确认: `Think` - 思考过程、 `ThoughtChain` - 思维链
- 反馈: `Actions` - 操作列表、`FileCard` - 文件卡片
- 其他: `XProvider` - 全局配置：主题、国际化等

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

## ⚡️ 对接模型/智能体服务，AI 对话数据流管理

我们通过提供 [X SDK](/sdks/introduce-cn)，帮助你开箱即用的对接模型和智能体服务，更有好用的基础工具。

## ✨ Markdown 高性能流式渲染引擎

我们提供专为流式内容优化的 [X Markdown](/markdowns/introduce-cn) 渲染解决方案、强大的扩展能力，支持公式、代码高亮、mermaid 图表等、极致性能表现，确保流畅的内容展示体验。

## 按需加载

`@ant-design/x` 默认支持基于 ES modules 的 tree shaking。

## TypeScript

`@ant-design/x` 使用 TypeScript 进行书写并提供了完整的定义文件。
