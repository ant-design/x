---
name: use-x-chat
version: 2.6.0
description: Focus on explaining how to use the useXChat Hook, including custom Provider integration, message management, error handling, multi-conversation management, and more
---

# 🎯 Skill Positioning

> **Core Positioning**: Use the `useXChat` Hook to build professional AI conversation applications. **Prerequisite**: Already have a custom Chat Provider (refer to [x-chat-provider skill](../x-chat-provider))

## Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🧩 Core Concepts](#-core-concepts)
  - [Data Model](#data-model)
  - [Configuration Options](#usexchat-configuration-options)
  - [Return Values](#usexchat-return-values)
- [🔧 Core Function Details](#-core-function-details)
- [🗂️ Multi-conversation Management](#️-multi-conversation-management)
- [📋 Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)

# 🚀 Quick Start

## 1. Dependency Management

- **@ant-design/x-sdk**: 2.2.2+
- **@ant-design/x**: latest version (UI components)

```bash
npm install @ant-design/x-sdk@latest @ant-design/x@latest
```

## 2. Three-step Integration

### Step 1: Prepare Provider

Handled by the x-chat-provider skill. Note `XRequest` must pass `manual: true`:

```ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// ⚠️ manual: true is required
const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', { manual: true }),
});
```

### Step 2: Basic Usage

```tsx
import { useXChat } from '@ant-design/x-sdk';

const ChatComponent = () => {
  const { messages, onRequest, isRequesting } = useXChat({
    provider,
    requestPlaceholder: (_, { messages }) => ({
      content: 'Thinking...',
      role: 'assistant',
    }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || 'Reply cancelled', role: 'assistant' };
      }
      return { content: 'Network error, please try again later', role: 'assistant' };
    },
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.message.role}: {msg.message.content}
        </div>
      ))}
      <button onClick={() => onRequest({ query: 'Hello' })}>Send</button>
    </div>
  );
};
```

### Step 3: UI Integration

> ⚠️ `messages` is `MessageInfo<ChatMessage>[]` and cannot be passed directly to `Bubble.List`. It must be mapped to `{ key, role, content, loading }` format. **`Bubble.List` uses the `role` prop** (not `roles`) to configure role styles.

```tsx
import { Bubble, Sender } from '@ant-design/x';

const ChatUI = () => {
  const { messages, onRequest, isRequesting, abort } = useXChat({ provider });

  return (
    <div style={{ height: 600 }}>
      <Bubble.List
        // ✅ Correct: use role (not roles)
        role={{
          user: { placement: 'end' },
          assistant: { placement: 'start' },
        }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role, // matches role config key
          content: message.content, // message content
          loading: status === 'loading', // loading animation
        }))}
      />
      <Sender
        loading={isRequesting}
        onSubmit={(content) => onRequest({ query: content })}
        onCancel={abort}
      />
    </div>
  );
};
```

#### When ChatMessage is an object type (not string)

When `ChatMessage` is a complex object (e.g., with `content`, `attachments` fields), use `contentRender`:

```tsx
<Bubble.List
  role={{
    assistant: {
      placement: 'start',
      // contentRender receives content param, which is the message field itself
      contentRender(content: MyMessage) {
        return (
          <div>
            <div>{content.content}</div>
            {content.attachments?.map((a) => (
              <FileCard key={a.url} name={a.name} />
            ))}
          </div>
        );
      },
    },
    user: {
      placement: 'end',
      contentRender(content: MyMessage) {
        return content.content;
      },
    },
  }}
  items={messages.map(({ id, message, status }) => ({
    key: id,
    role: message.role,
    content: message, // ⚠️ Pass the entire message object; contentRender handles rendering
    loading: status === 'loading',
  }))}
/>
```

# 🧩 Core Concepts

## Data Model

> ⚠️ **Important**: `messages` type is `MessageInfo<ChatMessage>[]`; message content is in `msg.message`

```ts
interface MessageInfo<ChatMessage> {
  id: number | string; // Message unique identifier
  message: ChatMessage; // Actual message content (your ChatMessage type)
  status: MessageStatus; // Message status
  extraInfo?: AnyObject; // Extended info (note: extraInfo, not extra)
}

type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
// local: locally sent user message
// loading: AI reply placeholder (corresponds to requestPlaceholder)
// updating: AI streaming output in progress
// success: AI reply complete
// error: request failed
// abort: user actively cancelled
```

## useXChat Configuration Options

| Option | Type | Description |
| --- | --- | --- |
| `provider` | `AbstractChatProvider<ChatMessage, Input, Output>` | **Required**, Provider instance |
| `conversationKey` | `string` | Conversation unique identifier, required for multi-conversation |
| `defaultMessages` | `DefaultMessageInfo[] \| () => ... \| async () => ...` | Default display messages, supports async loading |
| `requestPlaceholder` | `ChatMessage \| (requestParams, { messages }) => ChatMessage` | Placeholder message during request |
| `requestFallback` | `ChatMessage \| (requestParams, { error, errorInfo, messages, messageInfo }) => ChatMessage \| Promise<ChatMessage>` | Fallback message on request failure/abort |
| `parser` | `(message: ChatMessage) => BubbleMessage \| BubbleMessage[]` | Convert ChatMessage to component-consumable format, supports one-to-many |

> `requestFallback`'s `messageInfo` type is `MessageInfo<ChatMessage>`, the message being updated when the request fails. `requestFallback` handles both network errors (`error`) and user abort (`error.name === 'AbortError'`).

## useXChat Return Values

| Return Value | Type | Description |
| --- | --- | --- |
| `messages` | `MessageInfo<ChatMessage>[]` | Message list; must be mapped before passing to `Bubble.List` |
| `parsedMessages` | `MessageInfo<ParsedMessage>[]` | Message list after `parser` transform (use this when parser is set) |
| `onRequest` | `(params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | Add message and trigger request |
| `isRequesting` | `boolean` | Whether request is in progress |
| `abort` | `() => void` | Abort current request |
| `setMessages` | `(messages: Partial<MessageInfo<ChatMessage>>[]) => void` | Directly modify message list, no request triggered |
| `setMessage` | `(id: string \| number, info: Partial<MessageInfo<ChatMessage>>) => void` | Modify single message, no request triggered |
| `removeMessage` | `(id: string \| number) => boolean` | Delete a message, returns whether deletion was successful |
| `onReload` | `(id: string \| number, params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | Regenerate an AI reply |
| `queueRequest` | `(conversationKey: string \| symbol, params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | Queue request, sent after conversation initializes |
| `isDefaultMessagesRequesting` | `boolean` | Whether default messages are async loading |

# 🔧 Core Function Details

Core functionality reference: [CORE.md](reference/CORE.md)

# 🗂️ Multi-conversation Management

### useXConversations Hook

`useXConversations` is a conversation list management Hook provided by `@ant-design/x-sdk`, used together with `useXChat` for multi-conversation:

```ts
import { useXConversations } from '@ant-design/x-sdk';
import type { ConversationData } from '@ant-design/x-sdk';

const {
  conversations, // ConversationData[]: conversation list
  activeConversationKey, // string: currently active conversation key
  setActiveConversationKey, // (key: string) => void: switch conversation
  addConversation, // (ConversationData, placement?) => boolean
  removeConversation, // (key: string) => boolean
  setConversation, // (key: string,  ConversationData) => boolean
  getConversation, // (key: string) => ConversationData | undefined
  setConversations, // (list: ConversationData[]) => void
  getMessages, // (key: string) => MessageInfo[] | undefined (read messages across components)
} = useXConversations({
  defaultConversations: [
    { key: 'conv-1', label: 'Conversation 1' },
    { key: 'conv-2', label: 'Conversation 2' },
  ],
  defaultActiveConversationKey: 'conv-1',
});
```

### Multi-conversation Full Pattern

```tsx
import { useXChat, useXConversations } from '@ant-design/x-sdk';
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import React, { useEffect, useRef } from 'react';

// ⚠️ Each conversation must have its own Provider instance, otherwise state mixes
const providerCache = new Map<string, OpenAIChatProvider>();

function getProvider(key: string): OpenAIChatProvider {
  if (!providerCache.has(key)) {
    providerCache.set(
      key,
      new OpenAIChatProvider({
        request: XRequest(BASE_URL, { manual: true, params: { model: 'gpt-4o', stream: true } }),
      }),
    );
  }
  return providerCache.get(key)!;
}

const App = () => {
  const senderRef = useRef<any>(null);

  const { conversations, activeConversationKey, setActiveConversationKey, addConversation } =
    useXConversations({
      defaultConversations: [{ key: 'conv-1', label: 'New Conversation' }],
      defaultActiveConversationKey: 'conv-1',
    });

  const { messages, onRequest, isRequesting, abort, queueRequest } = useXChat({
    provider: getProvider(activeConversationKey),
    conversationKey: activeConversationKey,
    // Async load default messages
    defaultMessages: async ({ conversationKey }) => {
      // Load history from server based on conversationKey
      return [];
    },
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' };
      }
      return { content: 'Request failed', role: 'assistant' };
    },
  });

  // Clear input on conversation switch
  useEffect(() => {
    senderRef.current?.clear?.();
  }, [activeConversationKey]);

  const handleNewConversation = () => {
    const newKey = `conv-${Date.now()}`;
    addConversation({ key: newKey, label: `New Conversation ${conversations.length + 1}` });
    setActiveConversationKey(newKey);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Conversations
        items={conversations}
        activeKey={activeConversationKey}
        onActiveChange={setActiveConversationKey}
        creation={{ onClick: handleNewConversation }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Bubble.List
          role={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
          items={messages.map(({ id, message, status }) => ({
            key: id,
            role: message.role,
            content: message.content,
            loading: status === 'loading',
          }))}
        />
        <Sender
          ref={senderRef}
          loading={isRequesting}
          onCancel={abort}
          onSubmit={(val) => {
            onRequest({ messages: [{ role: 'user', content: val }] });
          }}
        />
      </div>
    </div>
  );
};
```

### queueRequest: Delayed Send After Conversation Switch

```tsx
// Scenario: user switches to a new conversation and triggers an initial message simultaneously
// queueRequest waits for defaultMessages async loading to complete, then sends the request

const handleNewConversationWithFirstMessage = () => {
  const newKey = `conv-${Date.now()}`;
  addConversation({ key: newKey, label: 'New Conversation' });
  setActiveConversationKey(newKey);

  // Queue the message; sent automatically after newKey conversation's defaultMessages finish loading
  queueRequest(newKey, {
    messages: [{ role: 'user', content: 'Hello! Please introduce yourself.' }],
  });
};
```

# 📋 Prerequisites and Dependencies

| Usage Scenario | Required Skill/Provider | Order |
| --- | --- | --- |
| **Private API Adaptation** | x-chat-provider → use-x-chat | Create Provider first |
| **Standard API** | Built-in Provider + use-x-chat | Direct use |
| **Multi-conversation** | Provider factory + useXConversations + useXChat | Use together |

# 🚨 Development Rules

Before using use-x-chat, confirm:

- [ ] **Has Provider** (custom or built-in Provider)
- [ ] Provider's XRequest is configured with `manual: true`
- [ ] Understands `MessageInfo` data structure (message content is in `msg.message`)
- [ ] `Bubble.List` uses `role` prop (**not `roles`**)
- [ ] Multi-conversation scenario: each conversation has its own Provider instance

### Test Case Rules

- **If the user does not explicitly need test cases, do not add test files**

### Code Quality Rules

- **After completion, must check types**: Run `tsc --noEmit` to ensure no type errors
- **Keep code clean**: Remove all unused variables and imports

# 🔗 Reference Resources

## 📚 Core Reference Documentation

- [API.md](reference/API.md) - Complete API reference documentation
- [CORE.md](reference/CORE.md) - Core function details
- [EXAMPLES.md](reference/EXAMPLES.md) - Practical example code

## 🌐 SDK Official Documentation

- [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.en-US.md)
- [XRequest Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.en-US.md)
- [Chat Provider Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.en-US.md)

## 💻 Example Code

- [with-x-chat.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-conversations/with-x-chat.tsx) - Multi-conversation full example
- [openai-callback.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-chat/openai-callback.tsx) - callbacks + removeMessage example
- [developer.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-chat/developer.tsx) - System prompt with developer role
- [custom-provider-width-ui.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx) - Custom Provider full example
