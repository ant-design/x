---
group:
  title: Data Flow
  order: 2
title: Chat Provider
order: 4
subtitle: Data Provider
demo:
  cols: 1
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

`DefaultChatProvider` is a default `Chat Provider` that performs minimal data transformation, directly returning request parameters and response data to `useXChat`. It supports both regular requests and stream request data formats and can be used directly.

<code src="./demos/x-chat/custom-request.tsx">DefaultChatProvider Usage</code>

### OpenAIChatProvider

`OpenAIChatProvider` is an `OpenAI`-compatible `Chat Provider` that converts request parameters and response data into formats compatible with the OpenAI API.

`XModelMessage`, `XModelParams`, and `XModelResponse` are type definitions for the input and output of `OpenAIChatProvider`, which can be directly used as generic types `ChatMessage`, `Input`, and `Output` in `useXChat`.

<code src="./demos/x-chat/model.tsx">OpenAIChatProvider Usage</code>

### DeepSeekChatProvider

`DeepSeekChatProvider` is a `DeepSeek`-compatible `Chat Provider`, similar to `OpenAIChatProvider` with one key difference: this Provider automatically parses DeepSeek's unique `reasoning_content` field as the model's thinking process output. When used with the `Think` component, it can quickly display the model's thinking process. For detailed usage examples, please refer to the [Independent Playground](https://x.ant.design/docs/playground/independent) code.

<code src="./demos/x-chat/deepSeek.tsx">DeepSeekChatProvider</code>

## Custom Provider

### AbstractChatProvider

`AbstractChatProvider` is an abstract class used to define the interface for `Chat Provider`. When you need to use custom data services, you can inherit from `AbstractChatProvider` and implement its methods. Refer to [Playground - Toolbox](/docs/playground/agent-tbox) for examples.

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
   * Transform parameters passed to onRequest, you can merge or additionally process with params in the request configuration when instantiating the Provider
   * @param requestParams Request parameters
   * @param options Request configuration from the request configuration when instantiating the Provider
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * Convert parameters passed to onRequest into local (user-sent) ChatMessage for message rendering
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

### Custom Provider Example

```ts
class CustomProvider<
  ChatMessage extends CustomMessage = CustomMessage,
  Input extends CustomInput = CustomInput,
  Output extends CustomOutput = CustomOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return {
      content: requestParams.query,
      role: 'user',
    } as unknown as ChatMessage;
  }
  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk) {
      return {
        content: originMessage?.content || '',
        role: 'assistant',
      } as ChatMessage;
    }
    const chunkJson = JSON.parse(chunk.data);
    const content = originMessage?.content || '';
    return {
      content: `${content || ''}${chunkJson.data || ''}`,
      role: 'assistant',
    } as ChatMessage;
  }
}
```

#### Custom Provider Analysis

1. **Agentic** service streaming interface `https://xxx.agent.com/api/stream`.

Interface input parameters:

```json
{
  "query": "Help me summarize today's tech news"
}
```

Interface output:

```json
id:1
data: "Okay,"

id:2
data: "I'll help you"

id:3
data: "summarize today's"

id:4
data: "tech news,"

```

2. Based on the interface, we can define `CustomInput` and `CustomOutput` types. `CustomOutput`:

```ts
{
  query: string;
}
```

Since the output data string only needs to convert the data string to JSON and then concatenate the internal data field, the `CustomOutput` type is as follows:

```ts
{
  data: string;
}
```

3. We expect the messages generated by `useXChat` to be directly consumable by Bubble.List, so we can define `CustomMessage` as follows:

```ts
{
  content: string;
  role: 'user' | 'assistant';
}
```

4. Finally, we can instantiate `CustomProvider` and pass it to `useXChat` to complete the custom Provider usage.

```tsx
const [provider] = React.useState(
  new CustomProvider({
    request: XRequest<CustomInput, CustomOutput>('https://xxx.agent.com/api/stream', {
      manual: true,
    }),
  }),
);

const { onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload } = useXChat({
  provider,
});
```

5.  Send request

```tsx
onRequest({
  query: "Help me summarize today's tech news",
});
```
