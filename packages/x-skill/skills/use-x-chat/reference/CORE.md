### 1. Message Management

#### Get Message List

```ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<MessageType>[]
// Actual message data is in msg.message
```

#### Manually Set Messages

```ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message - note this is MessageInfo structure
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

```tsx
const { abort, isRequesting } = useXChat({ provider });

// Abort current request
<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>;
```

#### Resend

The resend feature allows users to regenerate replies for specific messages, which is very useful when AI responses are unsatisfactory or errors occur.

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

#### Resend Notes

1. **Only regenerate AI replies**: Usually only use resend on messages with `role === 'assistant'`
2. **Status management**: Resend will set the corresponding message status to `loading`
3. **Parameter passing**: Can pass additional information to Provider via the `extra` parameter
4. **Error handling**: Recommended to use with `requestFallback` to handle resend failures

### 3. Error Handling

#### Unified Error Handling

```tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
        content: 'Network connection failed, please check your network',
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
```

### 4. Displaying Messages During Requests

Generally no configuration is needed, works with Bubble component's loading state by default. For custom loading content, refer to:

```tsx
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
```

#### Custom Request Placeholder

When requestPlaceholder is set, placeholder messages will display before requests start, used with Bubble component's loading state.

```tsx
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      content: 'Generating...',
      role: 'assistant',
    };
  },
});
```
