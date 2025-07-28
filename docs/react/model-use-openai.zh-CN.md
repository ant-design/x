---
group:
  title: 模型接入
  order: 1
title: OpenAI
order: 0
---

这篇指南将介绍如何在使用 Ant Design X 搭建的应用中接入 OpenAI 提供的模型服务。

## 使用 OpenAI API

等同于接入兼容 OpenAI 的模型推理服务，参考 [模型接入-通义千问](/docs/react/model-use-qwen-cn)

## 使用 openai-node

通常情况 openai-node 用于 node 环境，如果在浏览器环境使用，需要开启 `dangerouslyAllowBrowser`。

> 注意: `dangerouslyAllowBrowser` 存在安全风险，对此 openai-node 的官方文档有详细的[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。

```tsx
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';
import React from 'react';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

const Demo: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      const { onSuccess, onUpdate, onError } = callbacks;

      // current message
      console.log('message', message);

      // history messages
      console.log('messages', messages);

      let content: string = '';

      try {
        const stream = await client.chat.completions.create({
          model: 'gpt-4o',
          // if chat context is needed, modify the array
          messages: [{ role: 'user', content: message }],
          // stream mode
          stream: true,
        });

        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || '';

          onUpdate(content);
        }

        onSuccess(content);
      } catch (error) {
        // handle error
        // onError();
      }
    },
  });

  const {
    // use to send message
    onRequest,
    // use to render messages
    messages,
  } = useXChat({ agent });

  const items = messages.map(({ message, id }) => ({
    // key is required, used to identify the message
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

export default Demo;
```
