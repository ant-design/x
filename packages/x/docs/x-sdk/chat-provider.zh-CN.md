---
group:
  title: 数据流
  order: 2
title: Chat Provider
order: 4
subtitle: 数据提供
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

`Chat Provider` 用于为 `useXChat` 提供统一的请求管理和数据格式转换，通过实现`AbstractChatProvider`，你可以将不同的模型提供商、或者Agent服务数据转换为统一的 `useXChat` 可消费的格式，从而实现不同模型、Agent之间的无缝接入和切换。

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

## 内置Provider

`x-sdk` 内置了一些常用模型服务商的 `Chat Provider`，你可以直接使用。

### DefaultChatProvider

`DefaultChatProvider` 是一个默认的 `Chat Provider`，几乎没有对数据进行转换，直接将请求参数和响应数据返回给 `useXChat`。它兼容了普通请求和stream请求的数据格式，你可以直接使用。

<code src="./demos/x-chat/basic.tsx">DefaultChatProvider使用</code>

### OpenAIChatProvider

`OpenAIChatProvider` 是 `OpenAI` 兼容的 `Chat Provider`，它会将请求参数和响应数据转换为 `OpenAI` 接口兼容的格式。

`XModelMessage` `XModelParams` `XModelResponse` 是 `OpenAIChatProvider` 输入、输出的类型定义，可以在 `useXChat` 的泛型`ChatMessage` `Input` `Output` 中直接使用。

<code src="./demos/x-chat/model.tsx">OpenAIChatProvider使用</code>

### DeepSeekChatProvider

`DeepSeekChatProvider` 是 `DeepSeek` 兼容的 `Chat Provider`，和`OpenAIChatProvider`相差不大，唯一的差异点是，该Provider会自动解析DeepSeek特有的`reasoning_content`字段，作为模型思考过程的输出，配合`Think`组件可以快捷展示模型思考过程。详细的使用示例，可以参考[独立式样板间](https://x.ant.design/docs/playground/independent-cn)代码。

<code src="./demos/x-chat/deepSeek.tsx">DeepSeekChatProvider</code>

### 自定义Request

当使用一些sdk（例如：`openai-node`,`@openrouter/ai-sdk-provider`）请求模型或者智能体时需要使用内置的Provider处理数据，需要自定义Request，可参考。

<code src="../react/demo/openai-node.tsx" title="接入 openai" description="此示例仅展示使用X SDK接入 openai 的逻辑参考，并未对模型数据进行处理，需填写正确的apiKey再进行数据调试" compact iframe="450"></code>

## 自定义 Provider

### AbstractChatProvider

`AbstractChatProvider` 是一个抽象类，用于定义 `Chat Provider` 的接口。当你需要使用自定义的数据服务时，你可以继承 `AbstractChatProvider` 并实现其方法，可参考[样板间-百宝箱](/docs/playground/agent-tbox-cn)。

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
   * 转换onRequest传入的参数，你可以和Provider实例化时request配置中的params进行合并或者额外处理
   * @param requestParams 请求参数
   * @param options 请求配置，从Provider实例化时request配置中来
   */
  abstract transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output>,
  ): Input;

  /**
   * 将onRequest传入的参数转换为本地（用户发送）的ChatMessage，用于消息渲染
   * @param requestParams onRequest传入的参数
   */
  abstract transformLocalMessage(requestParams: Partial<Input>): ChatMessage;

  /**
   * 可在更新返回数据时对messages做转换，同时会更新到messages
   * @param info
   */
  abstract transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage;
}
```
