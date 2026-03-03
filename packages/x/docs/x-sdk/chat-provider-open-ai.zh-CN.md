---
category: Components
group:
  title: 数据提供
  order: 2
title: OpenAIChatProvider
tag: 2.0.0
packageName: x-sdk
order: 2
---

`OpenAIChatProvider` 是兼容 `OpenAI` 接口的 `Chat Provider`，它会自动将请求参数和响应数据转换为 `OpenAI` 接口格式。

`XModelParams` 定义了 `OpenAIChatProvider` 的请求参数类型，`XModelResponse` 定义了响应数据的类型，`XModelMessage` 定义了完整的消息数据类型。这些类型可以直接在 `useXChat` 的泛型 `ChatMessage`、`Input`、`Output` 中使用。

## 使用示例

<!-- prettier-ignore -->
<code src="./demos/chat-providers/open-ai-chat-provider.tsx">基本</code> 
<code src="./demos/x-chat/openai.tsx">配合组件</code>
