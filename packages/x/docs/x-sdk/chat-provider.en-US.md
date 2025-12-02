---
group:
  title: Chat Provider
  order: 2
title: Chat Provider
order: 1
---

`Chat Provider` is used to provide unified request management and data format conversion for `useXChat`. Currently, it includes built-in `Chat Provider` implementations for `OpenAI` and `DeepSeek` model service providers that you can use directly.

If the built-in Chat Provider does not meet your needs, you can implement the abstract class `AbstractChatProvider` (which only contains three abstract methods) to convert data from different model providers or Agentic services into a unified format that `useXChat` can consume, enabling seamless integration and switching between different models and Agents.

## Usage Example

Instantiating `Chat Provider` requires passing an `XRequest` call and setting the parameter `manual=true` so that `useXChat` can control the initiation of requests.

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

`DefaultChatProvider` is a default `Chat Provider` that performs minimal data transformation, directly returning request parameters and response data to `useXChat`. It is compatible with both regular requests and stream requests (you need to handle stream concatenation) data formats and can be used directly.

<code src="./demos/chat-provider/default-chat-provider.tsx">Basic</code> <code src="./demos/chat-provider/default-chat-provider_width_ui.tsx">With Components</code>
