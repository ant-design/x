---
group:
  title: 数据提供
  order: 2
title: Chat Provider
subtitle: 数据提供
order: 1
---

`Chat Provider` 用于为 `useXChat` 提供统一的请求管理和数据格式转换，目前内置了 `OpenAI` 和 `DeepSeek` 两种模型服务商的 `Chat Provider`，你可以直接使用。

如果内置的 Chat Provider 不满足使用可以通过实现抽象类 `AbstractChatProvider` (仅包含三个抽象方法)，可以将不同的模型提供商、或者 Agentic 服务数据转换为统一的 `useXChat` 可消费的格式，从而实现不同模型、Agent之间的无缝接入和切换。

## 使用示例

`Chat Provider` 实例化需要传入一个 `XRequest` 调用，并且需要设置参数 `manual=true`，以便 `useXChat` 可以控制请求的发起。

```tsx | pure
import { DefaultChatProvider, useXChat, XRequest, XRequestOptions } from '@ant-design/x-sdk';

interface ChatInput {
  query: string;
}

const [provider] = React.useState(
  new DefaultChatProvider<string, ChatInput, string>({
    request: XRequest('https://api.example.com/chat', {
      manual: true,
    }),
  }),
);

const { onRequest, messages, isRequesting } = useXChat({
  provider,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
});
```

## DefaultChatProvider

`DefaultChatProvider` 是一个默认的 `Chat Provider`，几乎没有对数据进行转换，直接将请求参数和响应数据返回给 `useXChat`。它兼容了普通请求和stream请求的数据格式，你可以直接使用。

<code src="./demos/x-chat/custom-request.tsx">基本</code>
