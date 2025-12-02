---
group:
  title: Chat Provider
  order: 2
title: DeepSeekChatProvider
order: 3
---

`DeepSeekChatProvider` is a `Chat Provider` compatible with `DeepSeek`. It's very similar to `OpenAIChatProvider`, with the only difference being that this Provider automatically parses DeepSeek's unique `reasoning_content` field as the model's thought process output. When used with the `Think` component, it can quickly display the model's thinking process. For detailed usage examples, please refer to the [Independent Playground](https://x.ant.design/docs/playground/independent) code.

<code src="./demos/x-chat/deepSeek.tsx">Basic</code>
