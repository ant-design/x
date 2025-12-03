---
group:
  title: Data Flow
  order: 1
title: useXChat
order: 1
demo:
  cols: 1
---

## When to Use

Manage conversation data through Agent and produce data for page rendering.

## Code Examples

<!-- prettier-ignore -->
<code src="./demos/x-chat/openai.tsx">OpenAI Model Integration</code>
<code src="./demos/x-chat/deepSeek.tsx">Thinking Model Integration</code>
<code src="./demos/x-chat/defaultMessages.tsx">Historical Messages Setup</code>
<code src="./demos/x-chat/developer.tsx">System Prompt Setup</code>
<code src="./demos/x-chat/custom-request-fetch.tsx">Custom XRequest.fetch</code>
<code src="./demos/x-chat/request-openai-node.tsx">Custom request</code>

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
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider used to convert data and requests of different structures into formats that useXChat can consume. The platform includes built-in `DefaultChatProvider` and `OpenAIChatProvider`, and you can also implement your own Provider by inheriting `AbstractChatProvider`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> | - | - |
| defaultMessages | Default display messages | { message: ChatMessage, status: MessageStatus }[] | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error;errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \| Promise\<Message\> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether a request is in progress | boolean | - | - |
| messages | Current managed message list content | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | Content translated through `parser` | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string \| number, requestParams: Partial\<Input\>, opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial\<Input\>, opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages without triggering requests | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | Directly modify a single message without triggering requests | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |

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
