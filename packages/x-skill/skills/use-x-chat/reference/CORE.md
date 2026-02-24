### 1. Message Management

#### Get Message List

```ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<MessageType>[]
// actual message data is in msg.message
```

#### Manually Set Messages

```ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message - note MessageInfo structure
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
```

#### Update Single Message

```ts
const { setMessage } = useXChat({ provider });

// Update message content - need to update message object
setMessage('msg-id', {
  message: { content: 'New content', role: 'assistant' },
});

// Mark as error - update status
setMessage('msg-id', { status: 'error' });
```

### 2. Request Control

#### Send Message

```ts
const { onRequest } = useXChat({ provider });

// Basic usage
onRequest({ query: 'User question' });

// With additional parameters
onRequest({
  query: 'User question',
  context: 'Previous conversation content',
  userId: 'user123',
});
```

#### Abort Request

```ts
const { abort, isRequesting } = useXChat({ provider });

// Abort current request
<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>
```

#### Resend

The resend feature allows users to regenerate replies for specific messages, very useful when AI responses are unsatisfactory or errors occur.

#### Basic Usage

```tsx
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
```

#### Complete Example: Resend with State Management

```tsx
import { useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Button } from '@ant-design/x';

const ChatWithRegenerate = () => {
  const { messages, onReload, isRequesting } = useXChat({
    provider,
    requestFallback: (_, { error }) => ({
      message: {
        content:
          error.name === 'AbortError' ? 'Generation cancelled' : 'Generation failed, please retry',
        role: 'assistant',
      },
      status: 'error',
    }),
  });

  // Track message ID being regenerated
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const handleRegenerate = (messageId: string | number) => {
    setRegeneratingId(messageId);
    onReload(
      messageId,
      {},
      {
        extra: { regenerate: true },
      },
    );
  };

  return (
    <div>
      <Bubble.List
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
    </div>
  );
};
```

#### Resend Notes

1. **Can only regenerate AI replies**: Usually only works for messages with `role === 'assistant'`
2. **State management**: Resend will set corresponding message status to `loading`
3. **Parameter passing**: Can pass additional info to Provider via `extra` parameter
4. **Error handling**: Recommend using `requestFallback` to handle resend failures

### 3. Error Handling

#### Unified Error Handling

```ts
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
        message: {
          content: 'Network connection failed, please check network',
          role: 'assistant',
        },
        status: 'error',
      };
    }

    // User abort
    if (error.name === 'AbortError') {
      return {
        message: {
          content: 'Generation cancelled',
          role: 'assistant',
        },
        status: 'error',
      };
    }

    // Server error
    return {
      message: {
        content: 'Service temporarily unavailable, please try again later',
        role: 'assistant',
      },
      status: 'error',
    };
  },
});
```

### 4. Request Message Display

Generally no configuration needed, works with Bubble component's loading state by default. For custom loading content:

````tsx
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

#### Custom Request Placeholder

```ts
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      message: {
        content: 'Generating...',
        role: 'assistant',
      },
      status: 'loading',
    };
  },
});
````

### 📊 Complete Example Project

```tsx
import React, { useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Sender, Conversations } from '@ant-design/x';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: 'New Chat' }]);
  const [activeKey, setActiveKey] = useState('1');

  const { messages, onRequest, isRequesting, abort } = useXChat({
    provider,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: 'Cancelled', role: 'assistant', status: 'error' };
      }
      return { content: 'Request failed', role: 'assistant', status: 'error' };
    },
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation List */}
      <Conversations items={conversations} activeKey={activeKey} onActiveChange={setActiveKey} />

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Bubble.List
          items={messages.map((msg) => ({
            key: msg.id,
            content: msg.content,
            role: msg.role,
            loading: msg.status === 'loading',
          }))}
        />

        <Sender
          loading={isRequesting}
          onSubmit={(content) => onRequest({ query: content })}
          onCancel={abort}
          placeholder="Enter message..."
        />
      </div>
    </div>
  );
};
```
