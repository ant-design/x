---
group:
  title: 迁移
  order: 5
order: 0
tag: New
title: 从 v1 到 v2
---

本文档将帮助你从 `@ant-design/x 1.x` 版本升级到 `@ant-design/x 2.x` 版本。

## 升级准备

1. 请先将项目中依赖的 antd 升级到 6.x 的最新版本，按照控制台 warning 信息移除/修改相关的 API。

## 2.0 有哪些不兼容的变化

### 运行时相关工具迁移到 `@ant-design/x-sdk`，并进行了全面重构

1. 删除了 `useXAgent` 用于模型调度的 Agent 钩子，同时升级了 `useXChat` 作为会话数据管理的钩子工具，用于产出供页面渲染需要的数据，整个实现逻辑都做了重构需要根据新的文档对代码进行修改。
2. 新增 `useXConversations` 会话列表管理的钩子，提供包括会话创建、删除、更新等操作，多会话保持等能力。
3. 新增 `Chat Provider` 接口实现为 useXChat 提供统一的请求管理和数据格式转换。

### Bubble

1. `messageRender` 替换为 `contentRender`，并支持接收扩展参数。

### Bubble.List

1. 实现滚动托管需要明确 Bubble.List 高度。

### Sender

1. 移除了 focus 时的边框样式。
2. 删除 `actions` 属性，新增 `suffix` 属性，后缀内容默认展示操作按钮，当不需要默认操作按钮时，可以设为 suffix={false}。
3. onPasteFile 默认回调方法参数为文件列表 `(files: FileList) => void`。

### Attachments.FileCard

1. 移除了 Attachments.FileCard 的实现，升级为 FileCard 组件。
2. 同时原 `size` 更名为 `byte` 用于文件大小（字节）的展示。
3. `size` 作为卡片的大小配置，可选值 `'small' | 'default'`。

### ThoughtChain

1. 整体视觉做了较大升级，更贴近长任务执行的过程。
2. `items` 列表移除了 extra 属性。

## 遇到问题

如果您在升级过程中遇到了问题，请到 [GitHub issues](https://github.com/ant-design/x/issues) 进行反馈。我们会尽快响应和相应改进这篇文档。
