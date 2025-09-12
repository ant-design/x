---
group:
  title: Data Flow
  order: 2
title: useXChat
order: 2
subtitle: Conversation Data
demo:
  cols: 1
---

## When To Use

Manage conversation data via Agent and produce data for page rendering.

## Code Demo

<!-- prettier-ignore -->
<code src="./demos/x-chat/basic.tsx">Basic</code>
<code src="./demos/x-chat/model.tsx">Model Integration</code>

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
| provider | Data provider, used to convert different data structures and requests into a format consumable by useXChat. The platform provides `DefaultChatProvider` and `OpenAIChatProvider` by default, and you can also implement your own Provider by extending `AbstractChatProvider`. See: [Chat Provider Docs](/sdks/chat-provider-en) | AbstractChatProvider<ChatMessage, Input, Output> | - | - |
| defaultMessages | Default display messages | { message: ChatMessage ,status: MessageStatus}[] | - | - |
| parser | Converts ChatMessage to ParsedMessage for consumption. If not set, ChatMessage is consumed directly. Supports converting one ChatMessage to multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback message when request fails. If not provided, nothing will be displayed | ChatMessage \| () => ChatMessage | - | - |
| requestPlaceholder | Placeholder message during request. If not provided, nothing will be displayed | ChatMessage \| () => ChatMessage | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Is requesting | boolean | - | - |
| messages | Current managed message list | ChatMessage[] | - | - |
| parsedMessages | Content converted by `parser` | ParsedMessages[] | - | - |
| onReload | Regenerate, sends a request to the backend and updates the message with new data | (id: string \| number, requestParams: Partial\<Input\>) => void | - | - |
| onRequest | Add a Message and trigger a request | (requestParams: Partial\<Input\>) => void | - | - |
| setMessages | Directly modify messages without triggering a request | (messages: { message: ChatMessage, status:MessageStatus }[]) => void | - | - |
| setMessage | Directly modify a single message without triggering a request | (id: string \| number, data: { message: ChatMessage, status: MessageStatus }) => void | - | - |

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```
