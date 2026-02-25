# 完整示例项目

## 带有对话管理的完整项目

```tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';
import { Bubble, Sender, Conversations, type ConversationsProps } from '@ant-design/x';
import { GetRef } from 'antd';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: '新对话' }]);
  const [activeKey, setActiveKey] = useState('1');
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  // 新建对话
  const handleNewConversation = () => {
    const newKey = Date.now().toString();
    const newConversation = {
      key: newKey,
      label: `对话 ${conversations.length + 1}`,
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveKey(newKey);
  };

  // 删除对话
  const handleDeleteConversation = (key: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      if (filtered.length === 0) {
        // 如果没有对话了，创建一个新的
        const newKey = Date.now().toString();
        return [{ key: newKey, label: '新对话' }];
      }
      return filtered;
    });

    // 如果删除的是当前激活的对话，切换到第一个
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
        return { content: '已取消', role: 'assistant' as const, timestamp: Date.now() };
      }
      return { content: '请求失败', role: 'assistant' as const, timestamp: Date.now() };
    },
  });

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: '删除',
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
      {/* 会话列表 */}
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

      {/* 聊天区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ padding: 16, borderBottom: '1px solid #f0f0f0', fontSize: 16, fontWeight: 500 }}
        >
          {conversations.find((c) => c.key === activeKey)?.label || '对话'}
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
            placeholder="输入消息..."
          />
        </div>
      </div>
    </div>
  );
};
export default App;
```

## 带状态管理的重新发送

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
      content: '正在思考中...',
      role: 'assistant',
      timestamp: Date.now(),
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || '已取消回复',
          role: 'assistant' as const,
          timestamp: Date.now(),
        };
      }
      return {
        content: errorInfo?.error?.message || '网络异常，请稍后重试',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    },
  });

  // 跟踪正在重新生成的消息ID
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
              {regeneratingId === msg.id ? '生成中...' : '重新生成'}
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
          placeholder="输入消息..."
          allowSpeech
          prefix={
            <Sender.Header
              title="AI 助手"
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
