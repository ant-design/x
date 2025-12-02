---
group:
  title: 数据提供
  order: 2
title: DeepSeekChatProvider
order: 3
---

`DeepSeekChatProvider` 是 `DeepSeek` 兼容的 `Chat Provider`，和`OpenAIChatProvider` 相差不大，唯一的差异点是，该Provider会自动解析DeepSeek特有的 `reasoning_content` 字段，作为模型思考过程的输出，配合 `Think` 组件可以快捷展示模型思考过程。详细的使用示例，可以参考[独立式样板间](https://x.ant.design/docs/playground/independent-cn)代码。

## 使用示例

<code src="./demos/chat-provider/deep-seek-chat-provider.tsx">基础</code> <code src="./demos/x-chat/deepSeek.tsx">配合组件</code>
