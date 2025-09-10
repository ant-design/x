---
group:
  title: Data Flow
  order: 2
title: Chat Provider
order: 4
subtitle: Data Provider
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

`Chat Provider` provides unified request management and data format conversion for `useXChat`. By implementing `AbstractChatProvider`, you can transform data from different model providers or Agent services into a unified format consumable by `useXChat`, enabling seamless integration and switching between different models and Agents.

## Usage Example

A `Chat Provider` instance requires an `XRequest` call with `manual=true` parameter, allowing `useXChat` to control request initiation.

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

## Built-in Providers

`x-sdk` includes several commonly used `Chat Provider` implementations for popular model services.

### DefaultChatProvider

`DefaultChatProvider` is a default implementation that performs minimal data transformation, directly passing request parameters and response data to `useXChat`. It supports both regular and stream request formats.

<code src="./demos/x-chat/basic.tsx">DefaultChatProvider Usage</code>

### OpenAIChatProvider

`OpenAIChatProvider` is an OpenAI-compatible implementation that transforms request parameters and response data to match OpenAI's interface format.

The type definitions `XModelMessage`, `XModelParams`, and `XModelResponse` can be used directly in `useXChat` generics as `ChatMessage`, `Input`, and `Output` respectively.

<code src="./demos/x-chat/model.tsx">OpenAIChatProvider Usage</code>

### DeepSeekChatProvider

`DeepSeekChatProvider` is compatible with DeepSeek services. The main difference from `OpenAIChatProvider` is its automatic parsing of DeepSeek's unique `reasoning_content` field, which outputs the model's reasoning process. When combined with the `Think` component, it can conveniently display the model's thought process. For detailed examples, refer to the [Independent Playground](https://x.ant.design/docs/playground/independent-cn) code.

## AbstractChatProvider

`AbstractChatProvider` is an abstract class defining the `Chat Provider` interface. When you need to implement custom data services, you can extend `AbstractChatProvider` and implement its methods.

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error';

interface ChatProviderConfig<Input, Output> {
  request: XRequestClass<Input, Output> | (() => XRequestClass<Input, Output>);
}

interface TransformMessage<ChatMessage, Output> {
  originMessage?: ChatMessage;
  chunk: Output;
  chunks: Output[];
  status: MessageStatus;
}

abstract class AbstractChatProvider<ChatMessage, Input, Output> {
  constructor(config: ChatProviderConfig<Input, Output>): void;

  /**
   * Transforms parameters from onRequest, which can be merged with or processed alongside
   * the params in the Provider's request configuration
   * @param requestParams Request parameters
   * @param options Request configuration from Provider initialization
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * Converts parameters from onRequest into local (user-sent) ChatMessage for rendering
   * @param requestParams Parameters from onRequest
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * Transforms messages when updating response data, which will also update the messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```
