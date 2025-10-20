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
---

## When To Use

- Use when you need to manage conversation lists, including operations like creating, deleting, and updating conversations.

## Code Demo

<!-- prettier-ignore -->
<code src="./demos/x-conversations/basic.tsx">Basic Usage</code> 
<code src="./demos/x-conversations/operations.tsx">Conversation Operations</code> 
<code src="./demos/x-conversations/multi-instances.tsx">Multiple Instances</code>
<code src="./demos/x-conversations/with-x-chat.tsx">Integration with `useXChat` for message management</code>

## API

### useXConversations

```tsx | pure
type useXConversations = (config: XConversationConfig) => {
  conversations: ConversationData[];
  activeConversationKey: string;
  setActiveConversationKey: (key: string) => boolean;
  addConversation: (conversation: ConversationData, placement?: 'prepend' | 'append') => boolean;
  removeConversation: (key: string) => boolean;
  setConversation: (key: string, conversation: ConversationData) => boolean;
  getConversation: (key: string) => ConversationData;
  setConversations: (conversations: ConversationData[]) => boolean;
  getMessages: (conversationKey: string) => any[];
};
```

### XConversationConfig

```tsx | pure
interface XConversationConfig {
  defaultConversations?: ConversationData[];
  defaultActiveConversationKey?: string;
}
```

### ConversationData

```tsx | pure
interface ConversationData extends AnyObject {
  key: string;
  label?: string;
}
```
