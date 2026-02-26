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
| ChatMessage | Message data type, defines the structure of chat messages | object | object | - |
| ParsedMessage | Parsed message type, message format used for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines the structure of request parameters | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider, used to convert data and requests of different structures into formats that useXChat can consume. Platform has built-in `DefaultChatProvider` and `OpenAIChatProvider`, you can also implement your own Provider by inheriting `AbstractChatProvider`. Recommended to use XRequest as the default request method, no need for custom fetch. See: [Chat Provider documentation](/x-sdks/chat-provider-cn) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | Conversation unique identifier (globally unique), used to distinguish different conversations | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display information | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | Convert ChatMessage to ParsedMessage for consumption, when not set, directly consume ChatMessage. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback information for request failure, won't display if not provided | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | Placeholder information during request, won't display if not provided | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \|Promise\<Message\> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether in request | boolean | - | - |
| isDefaultMessagesRequesting | Whether default message list is in request | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | Content after `parser` translation | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | Regenerate, will send request to backend, update this message with new returned data | (id: string \| number, requestParams: Partial\<Input\>,opts: { extra: AnyObject }) => void | - | - |
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
  messages: MessageInfo<MyMessage>[]; // Note it's MessageInfo array
  setMessages: (messages: MessageInfo<MyMessage>[]) => void;
  setMessage: (id: string, update: Partial<MessageInfo<MyMessage>>) => void;
}
```

#### Dynamic API Documentation

To view complete API documentation and type definitions, recommend:

1. **IDE IntelliSense**: Modern IDEs will automatically display complete API signatures
2. **Source Code View**: Directly check type definition files in `@ant-design/x-sdk`
3. **Official Documentation**: [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.en-US.md)

#### Usage Example

```tsx
// Type inference in actual use
const { messages, onRequest } = useXChat({
  provider: myProvider,
  // All configuration items will have complete type hints
});

// messages will automatically infer as MessageInfo<YourMessageType>[]
// onRequest will automatically infer parameter types
```
