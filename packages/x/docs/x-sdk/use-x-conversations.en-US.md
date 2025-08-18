---
group:
  title: Data Flow
  order: 2
title: useXConversations
order: 3
subtitle: Conversation Management
description:
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- Use when you need to manage conversation lists, including operations like creating, deleting, and updating conversations.

## Code Demo

<code src="./demos/x-conversations/basic.tsx">Basic Usage</code> <code src="./demos/x-conversations/operations.tsx">Conversation Operations</code> <code src="./demos/x-conversations/multi-instances.tsx">Multiple Instances</code>

## API

### useXConversations

```tsx | pure
type useXConversations = (config: XConversationConfig) => {
  conversations: ConversationData[];
  addConversation: (conversation: ConversationData) => boolean;
  removeConversation: (key: string) => boolean;
  setConversation: (key: string, conversation: ConversationData) => boolean;
  getConversation: (key: string) => ConversationData;
  setConversations: (conversations: ConversationData[]) => boolean;
};
```

### XConversationConfig

```tsx | pure
interface XConversationConfig {
  defaultConversations?: ConversationData[];
}
```

### ConversationData

```tsx | pure
interface ConversationData extends AnyObject {
  key: string;
  label?: string;
}
```
