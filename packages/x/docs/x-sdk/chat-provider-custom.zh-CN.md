---
group:
  title: 数据提供
  order: 2
title: Custom Chat Provider
order: 4
subtitle: 自定义
---

当内置的 Chat Provider 不满足需求时，可以通过实现抽象类 `AbstractChatProvider` (仅包含三个抽象方法)，可以将不同的模型提供商、或者 Agentic 服务数据转换为可被 `useXChat` 消费的格式，从而实现不同模型、Agent之间的无缝接入和切换。

## AbstractChatProvider

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

## 自定义 Provider 完整过程

下面是一个自定义 Provider 示例，用于展示如何自定义 `Chat Provider`，代码示例后有详细解析

### 完整示例

```ts
// 类型定义
type CustomInput = {
  query: string;
};

type CustomOutput = {
  data: string;
};

type CustomMessage = {
  content: string;
  role: 'user' | 'assistant';
};

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
    if (!chunk || !chunk?.data || (chunk?.data && chunk?.data?.includes('[DONE]'))) {
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

### 详细解析

1、`Agentic` 服务流式接口 `https://xxx.agent.com/api/stream`。

接口入参

```json
{
  "query": "帮我总结今天的科技新闻"
}
```

接口出参

```json
id:1
data: "好的，"

id:2
data: "我将为您"

id:3
data: "总结今天"

id:4
data: "的科技新闻，"

```

2、那么根据接口可以明确 `CustomInput` 和 `CustomOutput` 类型。

`CustomInput` 类型如下

```ts
{
  query: string;
}
```

由于输出数据字符串只需要将 data 字符串转为 JSON，然后将内部的 data 字段拼接，那么 `CustomOutput` 类型如下

```ts
{
  data: string;
}
```

3、我们期望 `useXChat` 生产的 messages 数据可以直接给 Bubble.List 消费，那么可以将 `CustomMessage` 定义如下：

```ts
{
  content: string;
  role: 'user' | 'assistant';
}
```

4、然后继承 `AbstractChatProvider` 并实现其方法，得到 `CustomProvider`，`AbstractChatProvider` 内有且仅有三个方法需要实现。

- `transformParams` 用于转换 onRequest 传入的参数，你可以和 Provider 实例化时 request 配置中的 params 进行合并或者额外处理。
- `transformLocalMessage` 将 onRequest 传入的参数转换为本地（用户发送）的 ChatMessage，用于用户发送消息渲染，同时会更新到 messages，用于消息列表渲染。
- `transformMessage` 可在更新返回数据时将数据做转换为 ChatMessage 数据类型，同时会更新到 messages，用于消息列表渲染。

5、最后我们可以将 `CustomProvider` 实例化并传入 `useXChat` 中，即可完成自定义 Provider 的使用。

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

6、发送请求

```tsx
onRequest({
  query: '帮我总结今天的科技新闻',
});
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/chat-provider/custom-provider-width-ui.tsx">基础</code>
