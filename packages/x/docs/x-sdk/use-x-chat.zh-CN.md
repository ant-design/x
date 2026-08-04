---
category: Components
group:
  title: 数据流
  order: 1
title: useXChat
order: 1
subtitle: 会话数据
packageName: x-sdk
description: 单对话的数据管理。
tag: 2.0.0
---

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-chat/openai.tsx">OpenAI 模型接入</code>
<code src="./demos/x-chat/deepSeek.tsx">DeepSeek 思考模型接入</code>
<code src="./demos/x-chat/agent-provider.tsx">通用 AgentProvider 接入</code>
<code src="./demos/x-chat/defaultMessages.tsx">历史消息设置</code>
<code src="./demos/x-chat/async-defaultMessages.tsx">请求远程历史消息</code>
<code src="./demos/x-chat/developer.tsx">系统提示词设置</code>
<code src="./demos/x-chat/openai-callback.tsx">模型的请求回调</code>
<code src="./demos/x-chat/custom-request-fetch.tsx">自定义 XRequest.fetch </code>
<code src="./demos/x-chat/request-openai-node.tsx"> 自定义 request </code>
<code src="./demos/x-conversations/session-key.tsx">SessionId - ConversationKey</code>

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

AgentProvider 使用同一个 Hook，通过重载推导输入、Chunk 和结构化状态类型：

```tsx | pure
const { messages, agentState, onRequest, abort, isRequesting } = useXChat({ provider });
```

完整契约和实现方式请参阅 [Agent Provider](/x-sdks/agent-provider-cn)。

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ChatMessage | 消息数据类型，定义聊天消息的结构 | object | object | - |
| ParsedMessage | 解析后的消息类型，用于组件消费的消息格式 | ChatMessage | ChatMessage | - |
| Input | 请求参数类型，定义发送请求的参数结构 | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - |
| Output | 响应数据类型，定义接收响应的数据格式 | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| provider | 唯一数据入口。普通聊天使用 `AbstractChatProvider`；结构化 Agent 流使用 `AgentProvider`。详见：[Chat Provider](/x-sdks/chat-provider-cn)、[Agent Provider](/x-sdks/agent-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> \| AgentProvider\<Input, Request, Chunk, Context\> | - | - |
| conversationKey | 会话唯一标识（全局唯一），用于区分不同的会话 | string | Symbol('ConversationKey') | - |
| defaultMessages | 默认展示信息 | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) =>  MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], messageInfo: MessageInfo\<ChatMessage\> }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \|Promise\<Message\>| - | - |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| isRequesting | 是否在请求中 | boolean | - | - |
| isDefaultMessagesRequesting | 默认消息列表是否在请求中 | boolean | false | 2.2.0 |
| messages | 当前管理消息列表的内容 | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | 经过 `parser` 转译过的内容 | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | 重新生成，会发送请求到后台，使用新返回数据更新该条消息 | (id: string \| number, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| onRequest | 添加一条 Message，并且触发请求 | (requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| setMessages | 直接修改 messages，不会触发请求 | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | 直接修改单条 message，不会触发请求 | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |
| removeMessage | 删除单条 message，不会触发请求 | (id: string \| number) => boolean | - | - |
| queueRequest | 会将请求加入队列，等待 conversationKey 初始化完成后再发送 | (conversationKey: string \| symbol, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| agentState | AgentProvider 模式下的完整结构化状态；普通 ChatProvider 模式为 `undefined` | AgentState \| undefined | undefined | - |

### AgentProvider 模式

AgentProvider 模式只接受 `provider`、`conversationKey`、`defaultMessages` 和 `parser`。`requestPlaceholder` 与 `requestFallback` 只属于普通 ChatProvider；Agent 的请求中、失败和取消状态由标准事件驱动。

`messages` 仍可供现有消息组件消费，实际消息为 `AgentMessageState`。推理、工具、审批、任务和 Artifact 等非消息数据保存在 `agentState` 中。

`setMessages`、`setMessage` 和 `removeMessage` 只影响兼容消息层，不会直接修改 `agentState`。AgentProvider 模式下调用 `onReload` 会创建新 Run。

#### MessageInfo

```ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extraInfo?: AnyObject;
}
```

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```
