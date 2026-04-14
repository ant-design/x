# Complete Examples

## 1. Basic Chat (OpenAI Provider)

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
      { id: '0', message: { role: 'user', content: 'Hello' }, status: 'success' },
      {
        id: '1',
        message: { role: 'assistant', content: 'Hello! How can I help you?' },
        status: 'success',
      },
    ],
    requestPlaceholder: () => ({ content: 'Thinking...', role: 'assistant' }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' };
      }
      return { content: 'Request failed, please retry', role: 'assistant' };
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

## 2. Multi-conversation Management (useXConversations + useXChat)

```tsx
import React, { useEffect, useRef } from 'react';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import { OpenAIChatProvider, useXChat, useXConversations, XRequest } from '@ant-design/x-sdk';
import type { XModelParams, XModelResponse } from '@ant-design/x-sdk';
import { GetRef } from 'antd';

const BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Each conversation maintains its own Provider instance
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
    defaultConversations: [{ key: 'conv-1', label: 'New Conversation' }],
    defaultActiveConversationKey: 'conv-1',
  });

  const { messages, onRequest, isRequesting, abort, queueRequest } = useXChat({
    provider: getProvider(activeConversationKey),
    conversationKey: activeConversationKey,
    // Async load history messages
    defaultMessages: async ({ conversationKey }) => {
      // const history = await api.getHistory(conversationKey);
      return [];
    },
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' };
      }
      return { content: 'Request failed, please retry', role: 'assistant' };
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
          items: [{ label: 'Delete', key: 'delete', danger: true }],
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

## 3. With Regenerate Feature

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
    requestPlaceholder: () => ({ content: 'Thinking...', role: 'assistant' }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' };
      }
      return { content: 'Request failed, please retry', role: 'assistant' };
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
              <Tooltip title="Regenerate">
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

## 4. With System Prompt (developer role)

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
      // developer role as system prompt; OpenAIChatProvider automatically includes it in every request
      {
        id: 'sys',
        message: {
          role: 'developer',
          content: 'You are a professional frontend engineer assistant',
        },
        status: 'success',
      },
    ],
    requestFallback: (_, { error }) => ({
      content: error.name === 'AbortError' ? 'Cancelled' : 'Request failed',
      role: 'assistant',
    }),
  });

  // Filter out developer messages from display
  const displayMessages = messages.filter((m) => m.message.role !== 'developer');

  // Dynamically update system prompt
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

## 5. Using parser (split one message into multiple bubbles)

```tsx
// Scenario: DeepSeek R1's reasoning_content + content need to be displayed separately
import { DeepSeekChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import type { XModelMessage, SSEFields, XModelResponse } from '@ant-design/x-sdk';

interface MyMessage extends XModelMessage {
  reasoning?: string; // Chain-of-thought content
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
  // parser converts one message into multiple bubbles
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

// Use parsedMessages instead of messages
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
