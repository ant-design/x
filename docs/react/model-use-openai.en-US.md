---
group:
  title: Model Integration
title: OpenAI
order: 0
---

Typically, `openai-node` is used in Node.js environments. If you need to use it in a browser environment, you must enable `dangerouslyAllowBrowser`.

## Example of Streaming Requests with `openai-node`

```tsx
import { useXAgent, useXChat, Sender } from '@ant-design/x';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

// React environment setup
const [agent] = useXAgent({
  request: async (info, callbacks) => {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say this is a test' }],
      stream: true,
    });

    for await (const chunk of stream) {
      // Trigger the callback
      callbacks.onUpdate(chunk.choices[0]?.delta?.content || '');
    }
  },
});

const {
  // Used to initiate conversation requests
  onRequest,
  // Used to bind the view
  messages,
} = useXChat({ agent });

const items = messages.map((message) => ({
  content: message,
}));

return (
  <div>
    <Bubble.List items={items} />
    <Sender onSubmit={onRequest} />
  </div>
);
```

## use openai API

参考 [Compatible OpenAI](/docs/react/model-use-qwen)
