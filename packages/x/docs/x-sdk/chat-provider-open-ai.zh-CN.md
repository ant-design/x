---
group:
  title: 数据提供
  order: 2
title: OpenAIChatProvider
order: 2
subtitle: 内置数据提供
---

`OpenAIChatProvider` 是 `OpenAI` 兼容的 `Chat Provider`，它会将请求参数和响应数据转换为 `OpenAI` 接口兼容的格式。

`XModelMessage` `XModelParams` `XModelResponse` 是 `OpenAIChatProvider` 输入、输出的类型定义，可以在 `useXChat` 的泛型`ChatMessage` `Input` `Output` 中直接使用。

## 使用示例

<code src="./demos/x-chat/model.tsx">基本</code>
