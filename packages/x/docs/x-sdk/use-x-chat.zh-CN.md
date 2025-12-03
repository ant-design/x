---
group:
  title: 数据流
  order: 1
title: useXChat
order: 1
subtitle: 会话数据
demo:
  cols: 1
---

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-chat/openai.tsx">OpenAI 模型接入</code>
<code src="./demos/x-chat/deepSeek.tsx">DeepSeek 思考模型接入</code>
<code src="./demos/x-chat/defaultMessages.tsx">历史消息设置</code>
<code src="./demos/x-chat/developer.tsx">系统提示词设置</code>
<code src="./demos/x-chat/custom-request-fetch.tsx">自定义 XRequest.fetch </code>
<code src="./demos/x-chat/request-openai-node.tsx"> 自定义 request </code>

## API

### useXChat

```tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
```

### XChatConfig

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| provider | 数据提供方，用于将不同结构的数据及请求转换为useXChat能消费的格式，平台内置了`DefaultChatProvider`和`OpenAIChatProvider`，你也可以通过继承`AbstractChatProvider`实现自己的Provider。详见：[Chat Provider文档](/x-sdks/chat-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| defaultMessages | 默认展示信息 | { message: ChatMessage ,status: MessageStatus}[] | - | - |
| parser | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>, info: { error: Error; messagesInfo: { id: string \| number; message: ChatMessage; status: MessageStatus; }, message: ChatMessage }) => ChatMessage \|Promise<\Message\>| - | - |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| isRequesting | 是否在请求中 | boolean | - | - |
| messages | 当前管理消息列表的内容 | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | 经过 `parser` 转译过的内容 | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | 重新生成，会发送请求到后台，使用新返回数据更新该条消息 | (id: string \| number, requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| onRequest | 添加一条 Message，并且触发请求 | (requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| setMessages | 直接修改 messages，不会触发请求 | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | 直接修改单条 message，不会触发请求 | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |

#### MessageInfo

```ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extra?: AnyObject;
}
```

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```
