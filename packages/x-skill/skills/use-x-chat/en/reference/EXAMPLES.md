### Example 1: Intelligent Customer Service System

```tsx
const CustomerService = () => {
  const { messages, onRequest, setMessages } = useXChat({
    provider,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: 'Reply cancelled', role: 'assistant', status: 'error' };
      }
      return {
        content: 'Network error, please try again later',
        role: 'assistant',
        status: 'error',
      };
    },
  });

  // Add welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        message: {
          content:
            'Hello! I am your intelligent customer service assistant. How can I help you today?',
          role: 'assistant',
        },
        status: 'success',
      },
    ]);
  }, []);

  return (
    <div className="chat-container">
      <Bubble.List
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message.content,
          role: msg.message.role,
        }))}
      />
      <Sender onSubmit={(query) => onRequest({ query })} />
    </div>
  );
};
```

### Example 2: Code Assistant

```tsx
const CodeAssistant = () => {
  const { messages, onRequest } = useXChat({ provider });

  const handleCodeQuestion = (code: string, question: string) => {
    onRequest({
      query: question,
      context: `Current code:\n${code}`,
      language: 'javascript',
    });
  };

  return (
    <div>
      <CodeEditor onSubmit={handleCodeQuestion} />
      <Bubble.List items={messages} />
    </div>
  );
};
```
