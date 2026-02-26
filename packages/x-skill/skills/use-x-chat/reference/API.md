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
| Input | Request parameter type, defines the structure of request parameters | RequestParams<ChatMessage> | RequestParams<ChatMessage> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider, used to convert different structured data and requests into formats that useXChat can consume. The platform has built-in `DefaultChatProvider` and `OpenAIChatProvider`, you can also implement your own Provider by inheriting `AbstractChatProvider`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider<ChatMessage, Input, Output> | - | - |
| conversationKey | Conversation unique identifier (globally unique), used to distinguish different conversations | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display information | MessageInfo<ChatMessage>[] \| (info: { conversationKey?: string }) => MessageInfo<ChatMessage>[] \| (info: { conversationKey?: string }) => Promise<MessageInfo<ChatMessage>[]> | - | - |
| parser | Convert ChatMessage to ParsedMessage for consumption, when not set, directly consume ChatMessage. Supports converting one ChatMessage to multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback information when request fails, if not provided, will not display | ChatMessage \| (requestParams: Partial<Input>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise<ChatMessage> | - | - |
| requestPlaceholder | Placeholder information during request, if not provided, will not display | ChatMessage \| (requestParams: Partial<Input>, info: { messages: Message[] }) => ChatMessage \|Promise<Message> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether in request | boolean | - | - |
| isDefaultMessagesRequesting | Whether default message list is in request | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo<ChatMessage>[] | - | - |
| parsedMessages | Content after translation by `parser` | MessageInfo<ParsedMessages>[] | - | - |
| onReload | Regenerate, will send request to backend, update this message with new returned data | (id: string \| number, requestParams: Partial<Input>,opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial<Input>,opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages, will not trigger request | (messages: Partial<MessageInfo<ChatMessage>>[]) => void | - | - |
| setMessage | Directly modify single message, will not trigger request | (id: string \| number, info: Partial<MessageInfo<ChatMessage>>) => void | - | - |
| removeMessage | Delete single message, will not trigger request | (id: string \| number) => void | - | - |
| queueRequest | Will add request to queue, wait for conversationKey initialization to complete before sending | (conversationKey: string \| symbol, requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => void | - | - |

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
