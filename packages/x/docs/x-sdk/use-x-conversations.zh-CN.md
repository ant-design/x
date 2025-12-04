---
group:
  title: 数据流
  order: 1
title: useXConversations
order: 2
subtitle: 会话管理
description:
demo:
  cols: 1
---

## 何时使用

- 需要进行会话列表管理，包括会话创建、删除、更新等操作时使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-conversations/basic.tsx">基础使用</code> 
<code src="./demos/x-conversations/operations.tsx">会话操作</code> 
<code src="./demos/x-conversations/multi-instances.tsx">多实例</code>
<code src="./demos/x-conversations/with-x-chat.tsx">配合 useXChat 对话消息管理</code>

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
