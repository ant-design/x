### useXChat

```tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
```

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| ChatMessage | 消息数据类型，定义聊天消息的结构 | object | object | - |
| ParsedMessage | 解析后的消息类型，用于组件消费的消息格式 | ChatMessage | ChatMessage | - |
| Input | 请求参数类型，定义发送请求的参数结构 | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - |
| Output | 响应数据类型，定义接收响应的数据格式 | SSEOutput | SSEOutput | - |

### XChatConfig

<<<<<<< HEAD

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| provider | 数据提供方，用于将不同结构的数据及请求转换为useXChat能消费的格式，平台内置了`DefaultChatProvider`和`OpenAIChatProvider`，你也可以通过继承`AbstractChatProvider`实现自己的Provider。详见：[Chat Provider文档](/x-sdks/chat-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | 会话唯一标识（全局唯一），用于区分不同的会话 | string | Symbol('ConversationKey') | - |
| defaultMessages | 默认展示信息 | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) =>  MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \|Promise\<Message\>| - | - |

======= | 属性 | 说明 | 类型 | 默认值 | 版本 | | --- | --- | --- | --- | --- | | provider | 数据提供方，用于将不同结构的数据及请求转换为useXChat能消费的格式，平台内置了`DefaultChatProvider`和`OpenAIChatProvider`，你也可以通过继承`AbstractChatProvider`实现自己的Provider。推荐使用 XRequest 作为默认请求方式，无需自定义 fetch。详见：[Chat Provider文档](/x-sdks/chat-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - | | conversationKey | 会话唯一标识（全局唯一），用于区分不同的会话 | string | Symbol('ConversationKey') | - | | defaultMessages | 默认展示信息 | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - | | parser | 将 ChatMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 ChatMessage。支持将一条 ChatMessage 转换成多条 ParsedMessage | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - | | requestFallback | 请求失败的兜底信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - | | requestPlaceholder | 请求中的占位信息，不提供则不会展示 | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \|Promise\<Message\> | - | - |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| abort | 取消请求 | () => void | - | - |
| isRequesting | 是否在请求中 | boolean | - | - |
| isDefaultMessagesRequesting | 默认消息列表是否在请求中 | boolean | false | 2.2.0 |
| messages | 当前管理消息列表的内容 | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | 经过 `parser` 转译过的内容 | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | 重新生成，会发送请求到后台，使用新返回数据更新该条消息 | (id: string \| number, requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| onRequest | 添加一条 Message，并且触发请求 | (requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| setMessages | 直接修改 messages，不会触发请求 | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | 直接修改单条 message，不会触发请求 | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |
| removeMessage | 删除单条 message，不会触发请求 | (id: string \| number) => void | - | - |

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

# <<<<<<< HEAD

#### 消息数据结构

```ts
// MessageInfo 包装结构 - 这是实际使用的类型
interface MessageInfo<MessageType> {
  id: string | number;
  message: MessageType; // 这里才是你的实际消息数据
  status: 'loading' | 'success' | 'error';
  extraInfo?: Record<string, any>;
}

// 使用示例
interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
}

// 实际返回类型
interface UseXChatReturn {
  messages: MessageInfo<MyMessage>[]; // 注意是 MessageInfo 数组
  setMessages: (messages: MessageInfo<MyMessage>[]) => void;
  setMessage: (id: string, update: Partial<MessageInfo<MyMessage>>) => void;
}
```

#### 动态API文档

如需查看完整的API文档和类型定义，建议：

1. **IDE智能提示**：现代IDE会自动显示完整的API签名
2. **源码查看**：直接查看 `@ant-design/x-sdk` 的类型定义文件
3. **官方文档**：[useXChat 官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.zh-CN.md)

#### 使用示例

```tsx
// 实际使用中的类型推断
const { messages, onRequest } = useXChat({
  provider: myProvider,
  // 所有配置项都会有完整的类型提示
});

// messages 会自动推断为 MessageInfo<YourMessageType>[]
// onRequest 会自动推断参数类型
```

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
