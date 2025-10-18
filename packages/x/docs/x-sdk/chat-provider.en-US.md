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

`Chat Provider` is used to provide unified request management and data format conversion for `useXChat`. By implementing `AbstractChatProvider`, you can convert data from different model providers or Agent services into a unified format that `useXChat` can consume, enabling seamless integration and switching between different models and Agents.

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

## Built-in Providers

`x-sdk` includes built-in `Chat Provider` implementations for common model service providers that you can use directly.

### DefaultChatProvider

`DefaultChatProvider` is a default `Chat Provider` that performs minimal data transformation, directly returning request parameters and response data to `useXChat`. It supports both regular requests and stream request data formats, and can be used directly.

<code src="./demos/x-chat/custom-request.tsx">DefaultChatProvider</code>

### OpenAIChatProvider

`OpenAIChatProvider` is an `OpenAI`-compatible `Chat Provider` that converts request parameters and response data into formats compatible with the OpenAI API.

`XModelMessage`, `XModelParams`, and `XModelResponse` are type definitions for `OpenAIChatProvider` input and output, which can be directly used in the generic types `ChatMessage`, `Input`, and `Output` of `useXChat`.

<code src="./demos/x-chat/model.tsx">Using OpenAIChatProvider</code>

### DeepSeekChatProvider

`DeepSeekChatProvider` is a `DeepSeek`-compatible `Chat Provider` that is very similar to `OpenAIChatProvider`. The only difference is that this Provider automatically parses DeepSeek's unique `reasoning_content` field as the model's thought process output. When used with the `Think` component, it can quickly display the model's thinking process. For detailed usage examples, please refer to the [independent showcase](https://x.ant.design/docs/playground/independent-en) code.

<code src="./demos/x-chat/deepSeek.tsx">DeepSeekChatProvider</code>

## Custom Provider

### AbstractChatProvider

`AbstractChatProvider` is an abstract class used to define the interface for `Chat Provider`. When you need to use custom data services, you can inherit from `AbstractChatProvider` and implement its methods. Please refer to [showcase - toolbox](/docs/playground/agent-tbox-en).

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
   * Transform parameters passed to onRequest. You can merge them with params in the request configuration during Provider instantiation or perform additional processing
   * @param requestParams Request parameters
   * @param options Request configuration from the request configuration during Provider instantiation
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * Convert parameters passed to onRequest into a local (user-sent) ChatMessage for message rendering
   * @param requestParams Parameters passed to onRequest
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * Can transform messages when updating return data, and will also update to messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```
