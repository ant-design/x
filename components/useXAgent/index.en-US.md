---
category: Components
group: Runtime
title: useXChat
description: Work with agent hook for data management.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

Use with Bubble.List and Sender to quickly build a conversational LUI.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/suggestions.tsx">Multiple Suggestion</code>

## API

```tsx | pure
type useXChat<Message> = (config: XAgentConfig<Message>) => XAgentConfigReturnType;

type MessageStatus = 'local' | 'loading' | 'success' | 'error';

type MessageInfo<Message> = {
  id: number | string;
  message: Message;
  status: MessageStatus;
};

type RequestResultObject<Message> = {
  message: Message | Message[];
  status: MessageStatus;
};

type RequestResult<Message> =
  | Message
  | Message[]
  | RequestResultObject<Message>
  | RequestResultObject<Message>[];
```

### XAgentConfig

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultMessages | default messages | MessageInfo[] | - |  |
| request | Trigger when user initiates a conversation. Supports returning multiple messages with different statuses. | (msg: Message, info: { messages: MessageInfo[] }) => Promise\<RequestResult> | - |  |
| requestFallback | Request failed fallback information, not provided will not be displayed | RequestResult \| (msg: Message, info: { error: Error, messages: MessageInfo[] }) => Message | - |  |
| requestPlaceholder | Request placeholder information, not provided will not be displayed | Message \| (msg: Message, info: { messages: MessageInfo[] }) => Message | - |  |

### XAgentConfigReturnType

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| messages | Current managed messages content | Message[] |  |
| requesting | Whether a request is in progress | boolean |  |
| onRequest | Add a message and trigger a request | (message: Message) => void |  |
| setMessages | Modify messages directly without triggering requests | (messages: MessageInfo[]) => void |  |
