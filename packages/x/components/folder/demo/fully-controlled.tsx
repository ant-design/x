import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import { Button, Card, Flex, Space } from 'antd';
import React, { useState } from 'react';

const treeData: FolderProps['treeData'] = [
  {
    title: 'use-x-chat',
    path: 'use-x-chat',
    children: [
      {
        title: 'SKILL.md',
        path: 'SKILL.md',
        content: `---
name: use-x-chat
version: 2.3.0
description: Focus on explaining how to use the useXChat Hook, including custom Provider integration, message management, error handling, etc.
---

# 🎯 Skill Positioning

> **Core Positioning**: Use the \`useXChat\` Hook to build professional AI conversation applications **Prerequisites**: Already have a custom Chat Provider (refer to [x-chat-provider skill](../x-chat-provider))

## Table of Contents

- [🚀 Quick Start](#-quick-start)
  - [Dependency Management](#1-dependency-management)
  - [Three-step Integration](#2-three-step-integration)
- [🧩 Core Concepts](#-core-concepts)
  - [Technology Stack Architecture](#technology-stack-architecture)
  - [Data Model](#data-model)
- [🔧 Core Function Details](#-core-function-details)
  - [Message Management](#1-message-management)
  - [Request Control](#2-request-control)
  - [Error Handling](#3-error-handling)
  - [Complete Example Project](#-complete-example-project)
- [📋 Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [📚 Core Reference Documentation](#-core-reference-documentation)
  - [🌐 SDK Official Documentation](#-sdk-official-documentation)
  - [💻 Example Code](#-example-code)

# 🚀 Quick Start

## 1. Dependency Management

### 🎯 Automatic Dependency Handling

### 📋 System Requirements

- **@ant-design/x-sdk**: 2.2.2+ (automatically installed)
- **@ant-design/x**: latest version (UI components, automatically installed)

### ⚠️ Version Issue Auto-fix

If version mismatch is detected, the skill will automatically:

- ✅ Prompt current version status
- ✅ Provide fix suggestions
- ✅ Use relative paths to ensure compatibility

#### 🎯 Built-in Version Check

The use-x-chat skill has built-in version checking functionality, automatically checking version compatibility on startup:

**🔍 Auto-check Function** The skill will automatically check if the \`@ant-design/x-sdk\` version meets requirements (≥2.2.2) on startup:

**📋 Check Contents:**

- ✅ Currently installed version
- ✅ Whether it meets minimum requirements (≥2.2.2)
- ✅ Automatically provide fix suggestions
- ✅ Friendly error prompts

**🛠️ Version Issue Fix** If version mismatch is detected, the skill will provide specific fix commands:

\`\`\`bash
# Auto-prompted fix commands
npm install @ant-design/x-sdk@^2.2.2

# Or install latest version
npm install @ant-design/x-sdk@latest
\`\`\`

## 2. Three-step Integration

### Step 1: Prepare Provider

This part is handled by the x-chat-provider skill

\`\`\`ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// Recommended to use XRequest as the default request method
const provider = new MyChatProvider({
  // Default use XRequest, no need for custom fetch
  request: XRequest('https://your-api.com/chat'),
  // When requestPlaceholder is set, placeholder message will be displayed before request starts
  requestPlaceholder: {
    content: 'Thinking...',
    role: 'assistant',
    timestamp: Date.now(),
  },
  // When requestFallback is set, fallback message will be displayed when request fails
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    }
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
      timestamp: Date.now(),
    };
  },
});
\`\`\`

### Step 2: Basic Usage

\`\`\`tsx
import { useXChat } from '@ant-design/x-sdk';

const ChatComponent = () => {
  const { messages, onRequest, isRequesting } = useXChat({ provider });

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
\`\`\`

### Step 3: UI Integration

\`\`\`tsx
import { Bubble, Sender } from '@ant-design/x';

const ChatUI = () => {
  const { messages, onRequest, isRequesting, abort } = useXChat({ provider });

  return (
    <div style={{ height: 600 }}>
      <Bubble.List items={messages} />
      <Sender
        loading={isRequesting}
        onSubmit={(content) => onRequest({ query: content })}
        onCancel={abort}
      />
    </div>
  );
};`,
      },
      {
        title: 'reference',
        path: 'reference',
        children: [
          {
            title: 'API.md',
            path: 'API.md',
            content: `### useXChat

\`\`\`tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
\`\`\`

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ChatMessage | Message data type, defines the structure of chat messages | object | object | - |
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines the structure of request parameters | RequestParams<ChatMessage> | RequestParams<ChatMessage> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider used to convert data and requests of different structures into formats that useXChat can consume. The platform includes built-in \`DefaultChatProvider\` and \`OpenAIChatProvider\`, and you can also implement your own Provider by inheriting \`AbstractChatProvider\`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider<ChatMessage, Input, Output> | - | - |
| conversationKey | Session unique identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => Promise<MessageInfo<ChatMessage>[]> | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage | BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage|Promise<ChatMessage> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>, info: { messages: Message[] }) => ChatMessage | Promise<Message> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether a request is in progress | boolean | - | - |
| isDefaultMessagesRequesting | Whether the default message list is requesting | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo<ChatMessage>[] | - | - |
| parsedMessages | Content translated through \`parser\` | MessageInfo<ParsedMessages>[] | - | - |
| onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string | number, requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages without triggering requests | (messages: Partial<MessageInfo<ChatMessage>>[]) => void | - | - |
| setMessage | Directly modify a single message without triggering requests | (id: string | number, info: Partial<MessageInfo<ChatMessage>>) => void | - | - |
| removeMessage | Deleting a single message will not trigger a request | (id: string | number) => void | - | - |
| queueRequest | Will add the request to a queue, waiting for the conversationKey to be initialized before sending | (conversationKey: string | symbol, requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => void | - | - |

#### MessageInfo

\`\`\`ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extra?: AnyObject;
}
\`\`\`

#### MessageStatus

\`\`\`ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
\`\`\``,
          },
          {
            title: 'CORE.md',
            path: 'CORE.md',
            content: `### 1. Message Management

#### Get Message List

\`\`\`ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<MessageType>[]
// Actual message data is in msg.message
\`\`\`

#### Manually Set Messages

\`\`\`ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message - note it's MessageInfo structure
setMessages([
  {
    id: 'welcome',
    message: {
      content: 'Welcome to AI Assistant',
      role: 'assistant',
    },
    status: 'success',
  },
]);
\`\`\`

#### Update Single Message

\`\`\`ts
const { setMessage } = useXChat({ provider });

// Update message content - need to update message object
setMessage('msg-id', {
  message: { content: 'New content', role: 'assistant' },
});

// Mark as error - update status
setMessage('msg-id', { status: 'error' });
\`\`\`

### 2. Request Control

#### Send Message

\`\`\`ts
const { onRequest } = useXChat({ provider });

// Basic usage
onRequest({ query: 'User question' });

// With additional parameters
onRequest({
  query: 'User question',
  context: 'Previous conversation content',
  userId: 'user123',
});
\`\`\`

#### Abort Request

\`\`\`tsx
const { abort, isRequesting } = useXChat({ provider });

// Abort current request
<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>;
\`\`\`

#### Resend

The resend feature allows users to regenerate replies for specific messages, which is very useful when AI answers are unsatisfactory or errors occur.

#### Basic Usage

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onReload } = useXChat({ provider });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <span>{msg.message.content}</span>
          {msg.message.role === 'assistant' && (
            <button onClick={() => onReload(msg.id)}>Regenerate</button>
          )}
        </div>
      ))}
    </div>
  );
};
\`\`\`

#### Resend Notes

1. **Can only regenerate AI replies**: Usually can only use resend on messages with \`role === 'assistant'\`
2. **Status management**: Resend will set the corresponding message status to \`loading\`
3. **Parameter passing**: Can pass additional information to Provider through \`extra\` parameter
4. **Error handling**: It is recommended to use \`requestFallback\` to handle resend failures

### 3. Error Handling

#### Unified Error Handling

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
        content: 'Network connection failed, please check network',
        role: 'assistant' as const,
      };
    }

    // User interruption
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
      };
    }

    // Server error
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
    };
  },
});
\`\`\`

### 4. Message Display During Request

Generally no configuration is needed, default use with Bubble component's loading state. For custom loading content, refer to:

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onRequest } = useXChat({ provider });
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
\`\`\`

#### Custom Request Placeholder

When requestPlaceholder is set, placeholder messages will be displayed before the request starts, used with Bubble component's loading state.

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      content: 'Generating...',
      role: 'assistant',
    };
  },
});
\`\`\``,
          },
          {
            title: 'EXAMPLES.md',
            path: 'EXAMPLES.md',
            content: `# Complete Example Projects

## Project with Conversation Management

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';
import { Bubble, Sender, Conversations, type ConversationsProps } from '@ant-design/x';
import { GetRef } from 'antd';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: 'New Conversation' }]);
  const [activeKey, setActiveKey] = useState('1');
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  // Create new conversation
  const handleNewConversation = () => {
    const newKey = Date.now().toString();
    const newConversation = {
      key: newKey,
      label: \`Conversation \${conversations.length + 1}\`,
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveKey(newKey);
  };

  // Delete conversation
  const handleDeleteConversation = (key: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      if (filtered.length === 0) {
        // If no conversations left, create a new one
        const newKey = Date.now().toString();
        return [{ key: newKey, label: 'New Conversation' }];
      }
      return filtered;
    });

    // If deleted current active conversation, switch to first one
    if (activeKey === key) {
      setActiveKey(conversations[0]?.key || '1');
    }
  };

  const { messages, onRequest, isRequesting, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    conversationKey: activeKey,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: 'Cancelled', role: 'assistant' as const, timestamp: Date.now() };
      }
      return { content: 'Request failed', role: 'assistant' as const, timestamp: Date.now() };
    },
  });

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Delete',
        key: 'delete',
        danger: true,
      },
    ],
    onClick: ({ key: menuKey }) => {
      if (menuKey === 'delete') {
        handleDeleteConversation(conversation.key);
      }
    },
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation List */}
      <div
        style={{
          width: 240,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Conversations
          creation={{
            onClick: handleNewConversation,
          }}
          items={conversations}
          activeKey={activeKey}
          menu={menuConfig}
          onActiveChange={setActiveKey}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ padding: 16, borderBottom: '1px solid #f0f0f0', fontSize: 16, fontWeight: 500 }}
        >
          {conversations.find((c) => c.key === activeKey)?.label || 'Conversation'}
        </div>

        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          <Bubble.List
            role={{
              assistant: {
                placement: 'start',
              },
              user: {
                placement: 'end',
              },
            }}
            items={messages.map((msg) => ({
              key: msg.id,
              content: msg.message.content,
              role: msg.message.role,
              loading: msg.status === 'loading',
            }))}
          />
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Sender
            loading={isRequesting}
            ref={senderRef}
            onSubmit={(content: string) => {
              onRequest({ query: content });
              senderRef.current?.clear?.();
            }}
            onCancel={abort}
            placeholder="Enter message..."
          />
        </div>
      </div>
    </div>
  );
};
export default App;
\`\`\`

## With State Management Resend

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Sender } from '@ant-design/x';
import { Button, type GetRef } from 'antd';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';

const ChatWithRegenerate: React.FC = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const { messages, onReload, isRequesting, onRequest, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    requestPlaceholder: {
      content: 'Thinking...',
      role: 'assistant',
      timestamp: Date.now(),
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || 'Reply cancelled',
          role: 'assistant' as const,
          timestamp: Date.now(),
        };
      }
      return {
        content: errorInfo?.error?.message || 'Network error, please try again later',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    },
  });

  // Track message ID being regenerated
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const handleRegenerate = (messageId: string | number): void => {
    setRegeneratingId(messageId);
    onReload(
      messageId,
      {},
      {
        extraInfo: { regenerate: true },
      },
    );
  };

  return (
    <div>
      <Bubble.List
        role={{
          assistant: {
            placement: 'start',
          },
          user: {
            placement: 'end',
          },
        }}
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message.content,
          role: msg.message.role,
          loading: msg.status === 'loading',
          footer: msg.message.role === 'assistant' && (
            <Button
              type="text"
              size="small"
              loading={regeneratingId === msg.id && isRequesting}
              onClick={() => handleRegenerate(msg.id)}
              disabled={isRequesting && regeneratingId !== msg.id}
            >
              {regeneratingId === msg.id ? 'Generating...' : 'Regenerate'}
            </Button>
          ),
        }))}
      />
      <div>
        <Sender
          loading={isRequesting}
          onSubmit={(content: string) => {
            onRequest({ query: content });
            senderRef.current?.clear?.();
          }}
          onCancel={abort}
          ref={senderRef}
          placeholder="Enter message..."
          allowSpeech
          prefix={
            <Sender.Header
              title="AI Assistant"
              open={false}
              styles={{
                content: { padding: 0 },
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default ChatWithRegenerate;
\`\`\``,
          },
        ],
      },
    ],
  },
];

export default () => {
  const [selectedFile, setSelectedFile] = useState<string[]>(['use-x-chat', 'SKILL.md']);
  const [expandedPaths, setExpandedPaths] = useState<string[]>(['use-x-chat']);

  const handleReset = () => {
    setSelectedFile(['use-x-chat', 'SKILL.md']);
    setExpandedPaths(['use-x-chat']);
  };

  const handleExpandAll = () => {
    setExpandedPaths(['use-x-chat', 'use-x-chat/reference']);
  };

  const handleCollapseAll = () => {
    setExpandedPaths([]);
  };

  const handleSelectPackage = () => {
    setSelectedFile(['use-x-chat', 'reference', 'API.md']);
    setExpandedPaths(['use-x-chat', 'use-x-chat/reference']);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleReset}>
          Reset State
        </Button>
        <Button onClick={handleExpandAll}>Expand All</Button>
        <Button onClick={handleCollapseAll}>Collapse All</Button>
        <Button onClick={handleSelectPackage}>Select API.md</Button>
      </Space>
      <Card style={{ marginBottom: 16 }}>
        <Space vertical>
          <div>
            <strong>Current Selected File:</strong>{' '}
            {selectedFile && selectedFile.length > 0 ? selectedFile.join('/') : 'None'}
          </div>
          <div>
            <strong>Expanded Nodes:</strong> {expandedPaths.join(', ') || 'None'}
          </div>
        </Space>
      </Card>

      <Folder
        style={{ height: 500 }}
        treeData={treeData}
        directoryTitle={
          <Flex
            style={{
              whiteSpace: 'nowrap',
              paddingInline: 16,
              width: '100%',
              paddingBlock: 8,
              borderBottom: '1px solid #f0f0f0',
            }}
            align="center"
          >
            File Browser
          </Flex>
        }
        selectedFile={selectedFile}
        onSelectedFileChange={({ path }) => setSelectedFile(path)}
        expandedPaths={expandedPaths}
        onExpandedPathsChange={setExpandedPaths}
      />
    </div>
  );
};
