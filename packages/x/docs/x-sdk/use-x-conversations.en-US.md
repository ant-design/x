---
category: Components
group:
  title: Data Flow
  order: 1
title: useXConversations
order: 2
description: Manage conversation persistence and CRUD operations for multiple sessions.
tag: 2.0.0
packageName: x-sdk
---

## When To Use

- Use when you need to manage conversation lists, including operations like creating, deleting, and updating conversations.

## Code Demo

<!-- prettier-ignore -->
<code src="./demos/x-conversations/basic.tsx">Basic Usage</code> 
<code src="./demos/x-conversations/operations.tsx">Conversation Operations</code> 
<code src="./demos/x-conversations/multi-instances.tsx">Multiple Instances</code>
<code src="./demos/x-conversations/with-x-chat.tsx">Integration with `useXChat` for message management</code>
<code src="./demos/x-conversations/async-defaultMessages.tsx">Request Remote Historical Messages</code>

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
