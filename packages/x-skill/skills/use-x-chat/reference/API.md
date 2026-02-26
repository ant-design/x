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
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |

<<<<<<< HEAD | Input | Request parameter type, defines the structure of request parameters | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - | ======= | Input | Request parameter type, defines the structure of request parameters | RequestParams<ChatMessage> | RequestParams<ChatMessage> | - |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8 | Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<<<<<<< HEAD

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider used to convert data and requests of different structures into formats that useXChat can consume. The platform includes built-in `DefaultChatProvider` and `OpenAIChatProvider`, and you can also implement your own Provider by inheriting `AbstractChatProvider`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| conversationKey | Session unique identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error;errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \| Promise\<Message\> | - | - |

======= | Property | Description | Type | Default | Version | | --- | --- | --- | --- | --- | | provider | Data provider, used to convert different data structures and requests into formats consumable by useXChat. The platform includes built-in `DefaultChatProvider` and `OpenAIChatProvider`, you can also implement your own Provider by inheriting `AbstractChatProvider`. Recommended to use XRequest as the default request method, no custom fetch needed. See: [Chat Provider documentation](/x-sdks/chat-provider) | AbstractChatProvider<ChatMessage, Input, Output> | - | - | | conversationKey | Unique session identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - | | defaultMessages | Default display information | MessageInfo<ChatMessage>[] \| (info: { conversationKey?: string }) => MessageInfo<ChatMessage>[] \| (info: { conversationKey?: string }) => Promise<MessageInfo<ChatMessage>[]> | - | - | | parser | Converts ChatMessage into ParsedMessage for consumption, when not set, directly consumes ChatMessage. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - | | requestFallback | Fallback information for failed requests, if not provided, nothing will be displayed | ChatMessage \| (requestParams: Partial<Input>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise<ChatMessage> | - | - | | requestPlaceholder | Placeholder information during requests, if not provided, nothing will be displayed | ChatMessage \| (requestParams: Partial<Input>, info: { messages: Message[] }) => ChatMessage \|Promise<Message> | - | - |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

### XChatConfigReturnType

| Property     | Description                      | Type       | Default | Version |
| ------------ | -------------------------------- | ---------- | ------- | ------- |
| abort        | Cancel request                   | () => void | -       | -       |
| isRequesting | Whether a request is in progress | boolean    | -       | -       |

<<<<<<< HEAD | isDefaultMessagesRequesting | Whether the default message list is requesting | boolean | false | 2.2.0 | | messages | Current managed message list content | MessageInfo\<ChatMessage\>[] | - | - | | parsedMessages | Content translated through `parser` | MessageInfo\<ParsedMessages\>[] | - | - | | onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string \| number, requestParams: Partial\<Input\>, opts: { extra: AnyObject }) => void | - | - | | onRequest | Add a Message and trigger request | (requestParams: Partial\<Input\>, opts: { extra: AnyObject }) => void | - | - | | setMessages | Directly modify messages without triggering requests | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - | | setMessage | Directly modify a single message without triggering requests | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - | | removeMessage | Deleting a single message will not trigger a request | (id: string \| number) => void | - | - | ======= | isDefaultMessagesRequesting | Whether the default message list is being requested | boolean | false | 2.2.0 | | messages | Current managed message list content | MessageInfo<ChatMessage>[] | - | - | | parsedMessages | Content after translation by `parser` | MessageInfo<ParsedMessages>[] | - | - | | onReload | Regenerate, will send request to backend, update the message with new returned data | (id: string \| number, requestParams: Partial<Input>,opts: { extra: AnyObject }) => void | - | - | | onRequest | Add a Message and trigger a request | (requestParams: Partial<Input>,opts: { extra: AnyObject }) => void | - | - | | setMessages | Directly modify messages, will not trigger requests | (messages: Partial<MessageInfo<ChatMessage>>[]) => void | - | - | | setMessage | Directly modify a single message, will not trigger requests | (id: string \| number, info: Partial<MessageInfo<ChatMessage>>) => void | - | - | | removeMessage | Delete a single message, will not trigger requests | (id: string \| number) => void | - | - |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

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
  messages: MessageInfo<MyMessage>[]; // Note this is a MessageInfo array
  setMessages: (messages: MessageInfo<MyMessage>[]) => void;
  setMessage: (id: string, update: Partial<MessageInfo<MyMessage>>) => void;
}
```

#### Dynamic API Documentation

To view complete API documentation and type definitions, it is recommended to:

1. **IDE IntelliSense**: Modern IDEs will automatically display complete API signatures
2. **Source Code Review**: Directly check the type definition files of `@ant-design/x-sdk`
3. **Official Documentation**: [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.md)

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

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
