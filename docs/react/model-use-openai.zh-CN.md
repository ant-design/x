---
group:
  title: 模型接入
title: OpenAI
order: 0
---

通常情况 openai-node 用于 node 环境，如果在浏览器环境使用，需要开启 `dangerouslyAllowBrowser`。

## 使用 openai-node 流式调用示例

```tsx
import React from 'react';
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

const Component: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      console.log('message', message);
      console.log('messages', messages);

      const stream = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: message }],
        stream: true,
      });

      for await (const chunk of stream) {
        // 调用回调
        callbacks.onUpdate(chunk.choices[0]?.delta?.content || '');
      }
    },
  });

  const {
    // 用于发起对话请求
    onRequest,
    // 用于绑定视图
    messages,
  } = useXChat({ agent });

  const items = messages.map(({ message, id }) => ({
    key: id,
    content: message,
  }));

  return (
    <div>
      <Bubble.List items={items} />
      <Sender onSubmit={onRequest} />
    </div>
  );
};
```

## 使用 openai API 调用

参考 [接入兼容 OpenAI 的模型推理服务](/docs/react/model-use-qwen-cn)
