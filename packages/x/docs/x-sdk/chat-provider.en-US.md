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

`Chat Provider` is used to provide unified request management and data format conversion for `useXChat`. By implementing `AbstractChatProvider`, you can convert data from different model providers or agent services into a unified format consumable by `useXChat`, enabling seamless integration and switching between different models and agents.

## Usage Example

To instantiate a `Chat Provider`, you need to pass in an `XRequest` call and set the parameter `manual=true` so that `useXChat` can control the request initiation.

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

`x-sdk` comes with several built-in `Chat Providers` for common model services, which you can use directly.

### DefaultChatProvider

`DefaultChatProvider` is a default `Chat Provider` that does almost no data conversion, directly returning request parameters and response data to `useXChat`. It is compatible with both normal and stream request data formats and can be used directly.

<code src="./demos/x-chat/basic.tsx">DefaultChatProvider Usage</code>

### OpenAIChatProvider

`OpenAIChatProvider` is an `OpenAI`-compatible `Chat Provider` that converts request parameters and response data to formats compatible with the OpenAI interface.

`XModelMessage`, `XModelParams`, and `XModelResponse` are type definitions for the input and output of `OpenAIChatProvider`, which can be used directly in the generics of `useXChat` (`ChatMessage`, `Input`, `Output`).

<code src="./demos/x-chat/model.tsx">OpenAIChatProvider Usage</code>

### DeepSeekChatProvider

`DeepSeekChatProvider` is a `DeepSeek`-compatible `Chat Provider`. It is similar to `OpenAIChatProvider`, with the only difference being that this provider automatically parses the DeepSeek-specific `reasoning_content` field as the model's thinking process output. Combined with the `Think` component, you can quickly display the model's thinking process. For detailed usage examples, refer to the [Independent Template](https://x.ant.design/docs/playground/independent) code.

<code src="./demos/x-chat/deepSeek.tsx">DeepSeekChatProvider</code>

### Custom Request

When using some SDKs (such as `openai-node`, `@openrouter/ai-sdk-provider`) to request models or agents, you need to use the built-in Provider to process data and customize the Request. See the example below.

<code src="../react/demo/openai-node.tsx" title="Integrate openai" description="This example only shows the logic reference for integrating openai with X SDK. Model data is not processed, please fill in the correct apiKey for data debugging." compact iframe="450"></code>

## Custom Provider

### AbstractChatProvider

`AbstractChatProvider` is an abstract class used to define the interface for `Chat Provider`. When you need to use custom data services, you can extend `AbstractChatProvider` and implement its methods. See [Playground TBox](/docs/playground/agent-tbox) for reference.

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
   * Transform the parameters passed to onRequest. You can merge or additionally process them with the params in the Provider's request config.
   * @param requestParams Request parameters
   * @param options Request config from Provider instantiation
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * Convert the parameters passed to onRequest into a local (user-sent) ChatMessage for message rendering
   * @param requestParams Parameters passed to onRequest
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * Optionally transform messages when updating returned data, and update to messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```
