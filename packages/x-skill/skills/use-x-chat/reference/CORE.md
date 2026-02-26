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

<<<<<<< HEAD
// Add welcome message - note it's MessageInfo structure
=======
// Add welcome message - note this is MessageInfo structure
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
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
<<<<<<< HEAD
  Stop generating
</button>;
```

#### Resend Message

# The resend feature allows users to regenerate replies for specific messages, which is very useful when AI answers are unsatisfactory or errors occur.

Stop generation </button>;

````

#### Resend

The resend feature allows users to regenerate replies for specific messages, which is very useful when AI responses are unsatisfactory or errors occur.
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

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
````

#### Resend Notes

<<<<<<< HEAD

1. **Can only regenerate AI replies**: Usually can only use resend on messages with `role === 'assistant'`
2. **Status Management**: Resend will set corresponding message status to `loading`
3. **Parameter Passing**: Can pass additional information to Provider through `extra` parameter
4. # **Error Handling**: Recommend cooperating with `requestFallback` to handle resend failures
5. **Only regenerate AI replies**: Usually only use resend on messages with `role === 'assistant'`
6. **Status management**: Resend will set the corresponding message status to `loading`
7. **Parameter passing**: Can pass additional information to Provider via the `extra` parameter
8. **Error handling**: Recommended to use with `requestFallback` to handle resend failures
   > > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

### 3. Error Handling

#### Unified Error Handling

```tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
<<<<<<< HEAD
        content: 'Network connection failed, please check network',
=======
        content: 'Network connection failed, please check your network',
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
        role: 'assistant' as const,
      };
    }

<<<<<<< HEAD
    // User abort
=======
    // User interruption
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
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

<<<<<<< HEAD

### 4. Message Display During Request

# Generally no configuration needed, default uses Bubble component's loading state. For custom loading content reference:

### 4. Displaying Messages During Requests

Generally no configuration is needed, works with Bubble component's loading state by default. For custom loading content, refer to:

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

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

<<<<<<< HEAD When setting requestPlaceholder, will display placeholder message before request starts, used with Bubble component's loading state. ======= When requestPlaceholder is set, placeholder messages will display before requests start, used with Bubble component's loading state.

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

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
