# Complete Example Projects

## Complete Project with Conversation Management

```tsx
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
      label: `Conversation ${conversations.length + 1}`,
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
```

## State-managed Regenerate

```tsx
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

  // Track regenerating message ID
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
```
