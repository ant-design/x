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
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ChatMessage | Message data type, defines chat message structure | object | object | - |
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines parameter structure for sending requests | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - |
| Output | Response data type, defines data format for receiving responses | SSEOutput | SSEOutput | - |

### XChatConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider, used to convert different data structures and requests into formats consumable by useXChat. Platform includes built-in `DefaultChatProvider` and `OpenAIChatProvider`, you can also implement your own Provider by inheriting `AbstractChatProvider`. Recommend using XRequest as default request method, no custom fetch needed. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | Unique session identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | Converts ChatMessage into consumable ParsedMessage, when not set directly consumes ChatMessage. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests, won't display if not provided | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | Placeholder message during request, won't display if not provided | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \|Promise\<Message\> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether request is in progress | boolean | - | - |
| isDefaultMessagesRequesting | Whether default message list is requesting | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | Content after `parser` translation | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | Regenerate, will send request to backend, update message with new returned data | (id: string \| number, requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages, won't trigger request | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | Directly modify single message, won't trigger request | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |
| removeMessage | Delete single message, won't trigger request | (id: string \| number) => void | - | - |

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

#### Message Data Structure

```ts
// MessageInfo wrapper structure - this is the actual type used
interface MessageInfo<MessageType> {
  id: string | number;
  message: MessageType; // This is your actual message data
  status: 'loading' | 'success' | 'error';
  extraInfo?: Record<string, any>;
}

// Usage example
interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
}

// Actual return type
interface UseXChatReturn {
  messages: MessageInfo<MyMessage>[]; // Note: MessageInfo array
  setMessages: (messages: MessageInfo<MyMessage>[]) => void;
  setMessage: (id: string, update: Partial<MessageInfo<MyMessage>>) => void;
}
```

#### Dynamic API Documentation

For complete API documentation and type definitions, recommend:

1. **IDE IntelliSense**: Modern IDEs automatically display complete API signatures
2. **Source Code**: Directly check `@ant-design/x-sdk` type definition files
3. **Official Documentation**: Visit [useXChat API](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.zh-CN.md)

#### Usage Example

```tsx
// Type inference in actual use
const { messages, onRequest } = useXChat({
  provider: myProvider,
  // All configuration items have complete type hints
});

// messages automatically inferred as MessageInfo<YourMessageType>[]
// onRequest automatically inferred parameter types
```
