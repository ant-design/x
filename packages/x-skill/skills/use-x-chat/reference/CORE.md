### 1. Message Management

#### Get Message List

```ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<ChatMessage>[]
// Actual message data is in msg.message
// msg.status: 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort'
```

#### Manually Set Messages (no request triggered)

```ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message
setMessages([
  {
    id: 'welcome',
    message: { content: 'Welcome to AI Assistant', role: 'assistant' },
    status: 'success',
  },
]);
```

#### Update Single Message

```ts
const { setMessage } = useXChat({ provider });

// Update message content
setMessage('msg-id', {
  message: { content: 'New content', role: 'assistant' },
});

// Mark as error status
setMessage('msg-id', { status: 'error' });

// Update with extraInfo
setMessage('msg-id', {
  message: { content: 'Edited', role: 'user' },
  extraInfo: { edited: true, editedAt: Date.now() },
});
```

#### Delete Message

```ts
const { removeMessage } = useXChat({ provider });

// Delete first message
removeMessage(messages[0]?.id);

// Delete all error-status messages
messages.filter((m) => m.status === 'error').forEach((m) => removeMessage(m.id));
```

### 2. Request Control

#### Send Message

```ts
const { onRequest } = useXChat({ provider });

// Basic usage (onRequest param type is Partial<Input>)
onRequest({ query: 'User question' });

// With extra metadata (extraInfo is stored in MessageInfo.extraInfo)
onRequest({ query: 'User question' }, { extraInfo: { sourceId: 'msg-123', isRetry: false } });

// For OpenAIChatProvider, send full message array
onRequest({
  messages: [{ role: 'user', content: 'Question content' }],
  temperature: 0.7,
});
```

#### Abort Request

```tsx
const { abort, isRequesting } = useXChat({ provider });

<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>;
// abort triggers requestFallback with error.name === 'AbortError'
```

#### Regenerate (onReload)

```tsx
const { messages, onReload, isRequesting } = useXChat({ provider });

// Add regenerate button to assistant messages
items={messages.map((msg) => ({
  key: msg.id,
  role: msg.message.role,
  content: msg.message.content,
  loading: msg.status === 'loading',
  footer: msg.message.role === 'assistant' && (
    <Button
      size="small"
      type="text"
      icon={<SyncOutlined />}
      loading={msg.status === 'loading' && isRequesting}
      onClick={() => onReload(msg.id, {}, { extraInfo: { isRegenerate: true } })}
    >
      Regenerate
    </Button>
  ),
}))}
```

> ⚠️ `onReload`'s second parameter is `requestParams`; usually pass `{}` (original context will be reused)

### 3. Error Handling

#### Unified Error Handling

```tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // User actively cancelled
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
      };
    }

    // Timeout error
    if (error.name === 'TimeoutError' || error.name === 'StreamTimeoutError') {
      return { content: 'Request timed out, please retry later', role: 'assistant' as const };
    }

    // Server-returned error message
    if (errorInfo?.error?.message) {
      return { content: errorInfo.error.message, role: 'assistant' as const };
    }

    // Network error fallback
    return { content: 'Network error, please retry later', role: 'assistant' as const };
  },
});
```

#### Async requestFallback

```tsx
requestFallback: async (requestParams, { error, messageInfo }) => {
  if (error.name === 'AbortError') {
    return { content: messageInfo?.message?.content || 'Cancelled', role: 'assistant' };
  }
  // Can do async operations like error reporting
  await reportError(error);
  return { content: 'Error recorded, please retry later', role: 'assistant' };
},
```

### 4. Default Messages and Placeholder

#### Synchronous Default Messages

```tsx
const { messages } = useXChat({
  provider,
  defaultMessages: [
    { id: 'sys', message: { role: 'developer', content: 'System prompt' }, status: 'success' },
    { id: '0', message: { role: 'user', content: 'Hello' }, status: 'success' },
    {
      id: '1',
      message: { role: 'assistant', content: 'Hello! I am an AI assistant' },
      status: 'success',
    },
  ],
});
```

#### Async Default Messages (fetch history from server)

```tsx
const { messages, isDefaultMessagesRequesting } = useXChat({
  provider,
  conversationKey: activeKey,
  defaultMessages: async ({ conversationKey }) => {
    const history = await fetchHistory(conversationKey);
    return history.map((item, index) => ({
      id: `history_${index}`,
      message: { role: item.role, content: item.content },
      status: 'success' as const,
    }));
  },
});

// isDefaultMessagesRequesting: true while async loading
if (isDefaultMessagesRequesting) {
  return <Spin />;
}
```

#### Custom Request Placeholder

```tsx
requestPlaceholder: (requestParams, { messages }) => {
  return {
    content: `Generating reply (${messages.length} messages so far)...`,
    role: 'assistant',
  };
},
```

### 5. parser: Message Format Conversion

Use `parser` when `ChatMessage` needs to be split into multiple bubbles (one-to-many):

```tsx
import { useXChat } from '@ant-design/x-sdk';

// Scenario: one ChatMessage contains reasoning chain + answer, split into two bubbles
const { parsedMessages } = useXChat({
  provider,
  parser: (message: MyMessage) => {
    if (message.reasoning && message.content) {
      return [
        { content: message.reasoning, role: 'assistant', type: 'reasoning' },
        { content: message.content, role: 'assistant', type: 'answer' },
      ];
    }
    return { content: message.content, role: message.role };
  },
});

// Use parsedMessages instead of messages for Bubble.List
<Bubble.List
  items={parsedMessages.map(({ id, message, status }) => ({
    key: id,
    role: message.role,
    content: message.content,
    loading: status === 'loading',
  }))}
/>;
```

### 6. extraInfo: Message Metadata

```tsx
// Attach extraInfo when sending
onRequest(
  { query: 'Hello' },
  { extraInfo: { sourceComponent: 'SearchPanel', queryId: 'q-001' } },
);

// Read extraInfo from messages
messages.map((msg) => ({
  key: msg.id,
  content: msg.message.content,
  // extraInfo stores metadata attached at send time
  'data-query-id': msg.extraInfo?.queryId,
}));

// requestFallback can use extraInfo to identify message source
requestFallback: (requestParams, { messageInfo }) => {
  const isRetry = messageInfo?.extraInfo?.isRetry;
  return {
    content: isRetry ? 'Retry also failed' : 'Request failed',
    role: 'assistant',
  };
},
```

### 7. developer / system Role Handling

`OpenAIChatProvider` supports `developer` and `system` roles as system prompts; these messages are typically not shown to users:

```tsx
const { messages, setMessage } = useXChat({
  provider,
  defaultMessages: [
    // developer role: equivalent to system prompt
    {
      id: 'sys',
      message: { role: 'developer', content: 'You are a helpful assistant' },
      status: 'success',
    },
    { id: '0', message: { role: 'user', content: 'Hello' }, status: 'success' },
    { id: '1', message: { role: 'assistant', content: 'Hello!' }, status: 'success' },
  ],
});

// Filter out developer/system messages from display
const chatMessages = messages.filter(
  (m) => m.message.role !== 'developer' && m.message.role !== 'system',
);

// Dynamically update system prompt
const updateSystemPrompt = (newPrompt: string) => {
  setMessage('sys', {
    message: { role: 'developer', content: newPrompt },
  });
};
```

### 8. Bubble.List role Configuration

> ⚠️ **Common mistake**: `Bubble.List` uses the `role` prop, not `roles`

```tsx
// ✅ Correct
<Bubble.List
  role={{
    assistant: { placement: 'start' },
    user: { placement: 'end' },
    system: { variant: 'borderless' },
  }}
  items={...}
/>

// ❌ Wrong (roles is not a valid prop)
<Bubble.List roles={{ ... }} items={...} />
```

The `role` field value in `Bubble.List`'s `items` must match the keys in the `role` config:

```tsx
items={messages.map(({ id, message, status }) => ({
  key: id,
  role: message.role,    // 'user' | 'assistant' | 'system' — must match role config keys
  content: message.content,
  loading: status === 'loading',
  // status can be passed in (not required but sometimes useful)
  status: status,
}))}
```
