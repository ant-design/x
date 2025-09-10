---
group:
  title: 数据流
  order: 2
title: useXChat
order: 2
subtitle: 会话数据
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-chat/basic.tsx">基本</code>
<code src="./demos/x-chat/model.tsx">模型接入</code>

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
| provider | 数据提供方，用于将不同结构的数据及请求转换为useXChat能消费的格式，平台内置了`DefaultChatProvider`和`OpenAIChatProvider`，你也可以通过继承`AbstractChatProvider`实现自己的Provider。详见：[Chat Provider文档](/sdks/chat-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| defaultMessages | 默认展示信息 | { message: ChatMessage ,status: MessageStatus}[] | - | - |
| parser | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | ChatMessage \| () => ChatMessage | - | - |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | ChatMessage \| () => ChatMessage | - | - |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| isRequesting | 是否在请求中 | boolean | - | - |
| messages | 当前管理消息列表的内容 | ChatMessage[] | - | - |
| parsedMessages | 经过 `parser` 转译过的内容 | ParsedMessages[] | - | - |
| onReload | 重新生成，会发送请求到后台，使用新返回数据更新该条消息 | (id: string \| number, requestParams: Partial\<Input\>) => void | - | - |
| onRequest | 添加一条 Message，并且触发请求 | (requestParams: Partial\<Input\>) => void | - | - |
| setMessages | 直接修改 messages，不会触发请求 | (messages: { message: ChatMessage, status: MessageStatus }[]) => void | - | - |
| setMessage | 直接修改单条 message，不会触发请求 | (id: string \| number, data: { message: ChatMessage, status: MessageStatus }) => void | - | - |

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```
