---
name: x-components
version: 2.7.0
description: 使用 @ant-design/x 组件库构建 AI 对话 UI 时使用 —— 涵盖 Bubble、Sender、Conversations、Prompts、ThoughtChain、Actions、Welcome、Attachments、Sources、Suggestion、Think、FileCard、CodeHighlighter、Mermaid、Folder、XProvider 和 Notification。
---

# 🎯 Skill 定位

**本 Skill 覆盖 `@ant-design/x` 中所有 UI 组件** —— 这是一个基于 RICH 交互范式，用于构建 AI 驱动对话界面的 React 组件库。

涵盖组件选型、API 使用、组合模式及常见反模式。

> **前提说明**：本 Skill 仅处理 UI 层。数据流和流式处理请参考 `use-x-chat`、`x-chat-provider`、`x-request` Skill。

## 目录

- [📦 包概述](#-包概述)
- [🗂️ 组件分组](#-组件分组)
- [🚀 快速选型指南](#-快速选型指南)
- [🛠 推荐工作流](#-推荐工作流)
- [🚨 开发规则](#-开发规则)
- [🤝 Skill 协作](#-skill-协作)
- [🔗 参考资源](#-参考资源)

# 📦 包概述

| 包名                     | 职责                                                 |
| ------------------------ | ---------------------------------------------------- |
| `@ant-design/x`          | 本 Skill 覆盖的所有 UI 组件                          |
| `@ant-design/x-sdk`      | 数据 Provider、请求、流式状态 —— 不在本 Skill 范围内 |
| `@ant-design/x-markdown` | Bubble 内 Markdown 渲染 —— 参见 `x-markdown` Skill   |

```bash
npm install @ant-design/x
```

> `@ant-design/x` 扩展了 `antd`。如果你已经在用 `ConfigProvider`，请将其替换为 `XProvider`。

# 🗂️ 组件分组

基于 RICH 交互范式：

| 阶段     | 组件                                                                     |
| -------- | ------------------------------------------------------------------------ |
| **通用** | `Bubble`、`Bubble.List`、`Conversations`、`Notification`                 |
| **唤醒** | `Welcome`、`Prompts`                                                     |
| **表达** | `Sender`、`Attachments`、`Suggestion`                                    |
| **确认** | `Think`、`ThoughtChain`                                                  |
| **反馈** | `Actions`、`FileCard`、`Sources`、`CodeHighlighter`、`Mermaid`、`Folder` |
| **全局** | `XProvider`                                                              |

# 🚀 快速选型指南

| 需求 | 优先阅读 |
| --- | --- |
| 渲染对话气泡 | [COMPONENTS.md → Bubble](reference/COMPONENTS.md#bubble) |
| 构建聊天输入框 | [COMPONENTS.md → Sender](reference/COMPONENTS.md#sender) |
| 会话列表与切换 | [COMPONENTS.md → Conversations](reference/COMPONENTS.md#conversations) |
| 展示 AI 思考过程 | [COMPONENTS.md → ThoughtChain / Think](reference/COMPONENTS.md#thoughtchain--think) |
| 在消息下方添加操作按钮 | [COMPONENTS.md → Actions](reference/COMPONENTS.md#actions) |
| 构建欢迎/引导页面 | [COMPONENTS.md → Welcome + Prompts](reference/COMPONENTS.md#welcome--prompts) |
| 输入框中展示文件附件 | [COMPONENTS.md → Attachments](reference/COMPONENTS.md#attachments) |
| 展示来源引用 | [COMPONENTS.md → Sources](reference/COMPONENTS.md#sources) |
| 添加快捷命令建议 | [COMPONENTS.md → Suggestion](reference/COMPONENTS.md#suggestion) |
| 展示层级文件/文件夹树 | [COMPONENTS.md → Folder](reference/COMPONENTS.md#folder) |
| 组合完整聊天页面 | [PATTERNS.md](reference/PATTERNS.md) |
| 查询具体属性 | [API.md](reference/API.md) |

# 🛠 推荐工作流

1. 从 [COMPONENTS.md](reference/COMPONENTS.md) 为每个交互阶段选择对应组件。
2. 使用 [PATTERNS.md](reference/PATTERNS.md) 了解组件如何组合成完整页面。
3. 在应用根节点用 `XProvider` 包裹（替代 `antd` 的 `ConfigProvider`），配置国际化、主题和快捷键。
4. 使用 [API.md](reference/API.md) 确认精确的属性名 —— 不要靠猜测。

## 最小完整示例

```tsx
import { XProvider, Welcome, Prompts, Bubble, Sender } from '@ant-design/x';

export default () => (
  <XProvider>
    <Welcome title="你好！" description="有什么可以帮助你的？" />
    <Prompts
      items={[{ key: '1', label: '你能做什么？' }]}
      onItemClick={(info) => console.log(info.data.label)}
    />
    <Bubble.List items={[{ key: '1', content: 'Hello World', placement: 'end' }]} />
    <Sender onSubmit={(msg) => console.log(msg)} />
  </XProvider>
);
```

# 🚨 开发规则

- **始终在应用根节点使用 `XProvider`** —— 它替代了 `antd` 的 `ConfigProvider`，并启用国际化、方向以及 x 专属快捷键。
- **在循环中用 `Bubble.List` 而非 `Bubble`** —— `Bubble.List` 处理滚动锚定、自动滚动和基于角色的布局；手动 map `Bubble` 会丢失这些能力。
- **保持 `Bubble` 和 `Bubble.List` 的 `components` 属性稳定** —— 内联对象创建会导致重渲染并重置打字动画。
- **流式期间设置 `streaming={true}`，最终 chunk 时设置 `streaming={false}`** —— 永久保持 `true` 会破坏完成状态。
- **`ThoughtChain` vs `Think`**：多步工具/Agent 调用链用 `ThoughtChain`；单块可折叠的推理展示用 `Think`。
- **`Actions.Copy`、`Actions.Feedback`、`Actions.Audio`** 是预设子组件 —— 优先使用它们，不要自己重新实现。
- **`Sender` 的 `onSubmit` vs `onChange`**：`onSubmit` 在发送按钮或 Enter 键时触发；`onChange` 在每次按键时触发 —— 不要混淆。
- **不要在 `Bubble` 的 `content` 字符串中直接渲染 `Mermaid` 或 `CodeHighlighter`** —— 请使用 `contentRender` 或 `components` 映射。

# 🤝 Skill 协作

| 场景 | Skill 组合 |
| --- | --- |
| 完整 AI 聊天应用 | `x-chat-provider` → `x-request` → `use-x-chat` → `x-components` → `x-markdown` |
| 只构建 UI 结构 | 仅 `x-components` |
| Bubble 回复中展示 Markdown | `x-components` + `x-markdown` |
| 只处理流式数据流 | `use-x-chat` + `x-request` |

# 🔗 参考资源

- [COMPONENTS.md](reference/COMPONENTS.md) —— 逐组件指南，包含使用方法、核心属性和示例
- [PATTERNS.md](reference/PATTERNS.md) —— 完整页面组合模式和集成方案
- [API.md](reference/API.md) —— 从官方组件文档自动生成的属性参考，覆盖全部 17 个组件

## 官方文档

- [Ant Design X 概览](https://github.com/ant-design/x/blob/main/packages/x/components/overview/index.zh-CN.md)
- [Bubble](https://github.com/ant-design/x/blob/main/packages/x/components/bubble/index.zh-CN.md)
- [Sender](https://github.com/ant-design/x/blob/main/packages/x/components/sender/index.zh-CN.md)
- [Conversations](https://github.com/ant-design/x/blob/main/packages/x/components/conversations/index.zh-CN.md)
- [ThoughtChain](https://github.com/ant-design/x/blob/main/packages/x/components/thought-chain/index.zh-CN.md)
- [Actions](https://github.com/ant-design/x/blob/main/packages/x/components/actions/index.zh-CN.md)
- [Welcome](https://github.com/ant-design/x/blob/main/packages/x/components/welcome/index.zh-CN.md)
- [Prompts](https://github.com/ant-design/x/blob/main/packages/x/components/prompts/index.zh-CN.md)
- [Attachments](https://github.com/ant-design/x/blob/main/packages/x/components/attachments/index.zh-CN.md)
- [Sources](https://github.com/ant-design/x/blob/main/packages/x/components/sources/index.zh-CN.md)
- [Suggestion](https://github.com/ant-design/x/blob/main/packages/x/components/suggestion/index.zh-CN.md)
- [Think](https://github.com/ant-design/x/blob/main/packages/x/components/think/index.zh-CN.md)
- [Folder](https://github.com/ant-design/x/blob/main/packages/x/components/folder/index.zh-CN.md)
- [XProvider](https://github.com/ant-design/x/blob/main/packages/x/components/x-provider/index.zh-CN.md)
