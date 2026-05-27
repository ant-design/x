# 完整示例

## 1. 基础聊天（OpenAI Provider）

```tsx
import React, { useRef } from 'react';
import { Bubble, Sender } from '@ant-design/x';
import { OpenAIChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import type { XModelMessage, XModelParams, XModelResponse } from '@ant-design/x-sdk';
import XMarkdown from '@ant-design/x-markdown';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

const App = () => {
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse, XModelMessage>(BASE_URL, {
        manual: true,
        headers: { Authorization: 'Bearer your-api-key' },
        params: { model: MODEL, stream: true },
      }),
    }),
  );

  const { messages, onRequest, isRequesting, abort, onReload } = useXChat({
    provider,
    defaultMessages: [
      { id: '0', message: { role: 'user', content: '你好' }, status: 'success' },
      {
        id: '1',
        message: { role: 'assistant', content: '你好！有什么可以帮你的？' },
        status: 'success',
      },
    ],
    requestPlaceholder: () => ({ content: '正在思考中...', role: 'assistant' }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || '已取消', role: 'assistant' };
      }
      return { content: '请求失败，请重试', role: 'assistant' };
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 600 }}>
      <Bubble.List
        style={{ flex: 1 }}
        role={{
          assistant: {
            placement: 'start',
            contentRender(content: string) {
              return <XMarkdown content={content} />;
            },
          },
          user: { placement: 'end' },
        }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          content: message.content,
          loading: status === 'loading',
        }))}
      />
      <Sender
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(content) => {
          onRequest({ messages: [{ role: 'user', content }] });
        }}
      />
    </div>
  );
};

export default App;
```

## 2. 多会话管理（useXConversations + useXChat）

```tsx
import React, { useEffect, useRef } from 'react';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import { OpenAIChatProvider, useXChat, useXConversations, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse } from '@ant-design/x-sdk';
import { GetRef } from 'antd';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

// 每个会话维持独立的 Provider 实例
const providerCache = new Map<string, OpenAIChatProvider>();

function getProvider(key: string): OpenAIChatProvider {
  if (!providerCache.has(key)) {
    providerCache.set(
      key,
      new OpenAIChatProvider({
        request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
          manual: true,
          headers: { Authorization: 'Bearer your-api-key' },
          params: { model: 'gpt-4o', stream: true },
        }),
      }),
    );
  }
  return providerCache.get(key)!;
}

const App = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const {
    conversations,
    activeConversationKey,
    setActiveConversationKey,
    addConversation,
    removeConversation,
  } = useXConversations({
    defaultConversations: [{ key: 'conv-1', label: '新对话' }],
    defaultActiveConversationKey: 'conv-1',
  });

  const { messages, onRequest, isRequesting, abort, queueRequest } = useXChat({
    provider: getProvider(activeConversationKey),
    conversationKey: activeConversationKey,
    // 异步加载历史消息
    defaultMessages: async ({ conversationKey }) => {
      // const history = await api.getHistory(conversationKey);
      return [];
    },
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || '已取消', role: 'assistant' };
      }
      return { content: '请求失败，请重试', role: 'assistant' };
    },
  });

  // 切换会话时清空输入框
  useEffect(() => {
    senderRef.current?.clear?.();
  }, [activeConversationKey]);

  const handleNewConversation = () => {
    const newKey = `conv-${Date.now()}`;
    addConversation({ key: newKey, label: `新对话 ${conversations.length + 1}` });
    setActiveConversationKey(newKey);
  };

  const handleDeleteConversation = (key: string) => {
    removeConversation(key);
    if (activeConversationKey === key) {
      const remaining = conversations.filter((c) => c.key !== key);
      if (remaining.length > 0) setActiveConversationKey(remaining[0].key);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Conversations
        style={{ width: 240, borderRight: '1px solid #f0f0f0' }}
        items={conversations}
        activeKey={activeConversationKey}
        onActiveChange={setActiveConversationKey}
        creation={{ onClick: handleNewConversation }}
        menu={(conv) => ({
          items: [{ label: '删除', key: 'delete', danger: true }],
          onClick: ({ key }) => key === 'delete' && handleDeleteConversation(conv.key),
        })}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Bubble.List
          style={{ flex: 1, padding: 16 }}
          role={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
          items={messages.map(({ id, message, status }) => ({
            key: id,
            role: message.role,
            content: message.content,
            loading: status === 'loading',
          }))}
        />
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
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
    </div>
  );
};

export default App;
```

## 3. 带重新生成功能

```tsx
import React, { useRef, useState } from 'react';
import { Bubble, Sender } from '@ant-design/x';
import { SyncOutlined } from '@ant-design/icons';
import { OpenAIChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Tooltip, GetRef } from 'antd';

const App = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest(BASE_URL, { manual: true, params: { model: 'gpt-4o', stream: true } }),
    }),
  );

  const { messages, onRequest, onReload, isRequesting, abort } = useXChat({
    provider,
    requestPlaceholder: () => ({ content: '正在思考中...', role: 'assistant' }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || '已取消', role: 'assistant' };
      }
      return { content: '请求失败，请重试', role: 'assistant' };
    },
  });

  const handleRegenerate = (id: string | number) => {
    setRegeneratingId(id);
    onReload(id, {}, { extraInfo: { isRegenerate: true } });
  };

  return (
    <div>
      <Bubble.List
        role={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          content: message.content,
          loading: status === 'loading',
          footer:
            message.role === 'assistant' ? (
              <Tooltip title="重新生成">
                <Button
                  size="small"
                  type="text"
                  icon={<SyncOutlined />}
                  loading={regeneratingId === id && isRequesting}
                  disabled={isRequesting && regeneratingId !== id}
                  onClick={() => handleRegenerate(id)}
                />
              </Tooltip>
            ) : undefined,
        }))}
      />
      <Sender
        ref={senderRef}
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(val) => {
          onRequest({ messages: [{ role: 'user', content: val }] });
          senderRef.current?.clear?.();
        }}
      />
    </div>
  );
};
```

## 4. 带系统提示词（developer 角色）

```tsx
const App = () => {
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest(BASE_URL, { manual: true, params: { model: 'gpt-4o', stream: true } }),
    }),
  );

  const { messages, onRequest, setMessage, isRequesting, abort } = useXChat({
    provider,
    defaultMessages: [
      // developer 角色作为系统提示词，OpenAIChatProvider 会自动携带到每次请求
      {
        id: 'sys',
        message: { role: 'developer', content: '你是一个专业的前端工程师助手' },
        status: 'success',
      },
    ],
    requestFallback: (_, { error }) => ({
      content: error.name === 'AbortError' ? '已取消' : '请求失败',
      role: 'assistant',
    }),
  });

  // 过滤掉 developer 消息不展示
  const displayMessages = messages.filter((m) => m.message.role !== 'developer');

  // 动态修改系统提示
  const updateSystemPrompt = (prompt: string) => {
    setMessage('sys', { message: { role: 'developer', content: prompt } });
  };

  return (
    <div>
      <Bubble.List
        role={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
        items={displayMessages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          content: message.content,
          loading: status === 'loading',
        }))}
      />
      <Sender
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(val) => onRequest({ messages: [{ role: 'user', content: val }] })}
      />
    </div>
  );
};
```

## 5. 使用 parser（一条消息拆分为多条气泡）

```tsx
// 场景：DeepSeek R1 的 reasoning_content + content 需要分开展示
import { DeepSeekChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import type { XModelMessage, SSEFields, XModelResponse } from '@ant-design/x-sdk';

interface MyMessage extends XModelMessage {
  reasoning?: string; // 思考链内容
}

const [provider] = React.useState(
  new DeepSeekChatProvider({
    request: XRequest(BASE_URL, {
      manual: true,
      params: { model: 'deepseek-reasoner', stream: true },
    }),
  }),
);

const { parsedMessages, onRequest, isRequesting, abort } = useXChat<
  MyMessage,
  { role: string; content: string } // ParsedMessage
>({
  provider,
  // parser 将一条消息转为多条气泡
  parser: (message: MyMessage) => {
    const result: { role: string; content: string }[] = [];
    if (message.reasoning) {
      result.push({ role: 'reasoning', content: message.reasoning });
    }
    if (message.content) {
      result.push({ role: 'assistant', content: message.content as string });
    }
    return result.length > 0 ? result : { role: message.role, content: message.content as string };
  },
});

// 使用 parsedMessages 而非 messages
<Bubble.List
  role={{
    assistant: { placement: 'start' },
    user: { placement: 'end' },
    reasoning: { placement: 'start', variant: 'borderless' },
  }}
  items={parsedMessages.map(({ id, message, status }) => ({
    key: id,
    role: message.role,
    content: message.content,
    loading: status === 'loading',
  }))}
/>;
```
