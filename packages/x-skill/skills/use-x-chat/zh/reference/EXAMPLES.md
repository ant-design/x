### 案例1：智能客服系统

```tsx
const CustomerService = () => {
  const { messages, onRequest, setMessages } = useXChat({
    provider,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: '已取消回复', role: 'assistant', status: 'error' };
      }
      return { content: '网络异常，请稍后重试', role: 'assistant', status: 'error' };
    },
  });

  // 添加入口欢迎语
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        message: {
          content: '您好！我是智能客服小助手，请问有什么可以帮您？',
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

### 案例2：代码助手

```tsx
const CodeAssistant = () => {
  const { messages, onRequest } = useXChat({ provider });

  const handleCodeQuestion = (code: string, question: string) => {
    onRequest({
      query: question,
      context: `当前代码：\n${code}`,
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
