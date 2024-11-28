---
group:
  title: 模型接入
title: 通义千问
order: 1
---

通义千问提供了兼容 OpenAI 的模型推理服务。[阿里云 - 通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope?spm=a2c4g.11186623.0.i10)

## 什么是「兼容 OpenAI 的模型」？

是指在接口设计和使用方式上与 OpenAI 的 API 保持一致的模型推理服务。

这意味着开发者可以使用与调用 OpenAI 模型相同的代码和方法，来调用这些兼容服务，从而减少开发接入成本。

## 方式一: 使用 openai 兼容调用

```tsx
import React from 'react';
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env['QWEN_API_KEY'],
  dangerouslyAllowBrowser: true,
});

const Component: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      // current message
      console.log('message', message);
      // messages list
      console.log('messages', messages);

      const stream = await client.chat.completions.create({
        model: 'qwen-plus',
        messages: [{ role: 'user', content: message }],
        stream: true,
      });

      for await (const chunk of stream) {
        callbacks.onUpdate(chunk.choices[0]?.delta?.content || '');
      }
    },
  });

  const {
    // request function
    onRequest,
    // messages list
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

## 方式二: 使用 XRequest 调用

该方式是 Ant Design X 提供的函数，内部集成了 XStream 解析 SSE 流。

```tsx
import React from 'react';
import { useXAgent, useXChat, Sender, Bubble, XRequest } from '@ant-design/x';

const Component: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;

      // current message
      console.log('message', message);
      // messages list
      console.log('messages', messages);

      const { create } = XRequest({
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        dangerouslyApiKey: process.env['QWEN_API_KEY'],
        model: 'qwen-plus',
      });

      create(
        {
          messages: [{ role: 'user', content: message }],
          stream: true,
        },
        {
          onSuccess: (chunks) => {
            // get chunk list
            console.log('sse list', chunks);
          },
          onError: (error) => {
            console.log('error', error);
          },
          onUpdate: (chunk) => {
            console.log('sse object', chunk);
            // get the content of the message
            const content: string = JSON.parse(chunk.data).choices[0].delta.content;

            onUpdate(content);
          },
        },
      );
    },
  });

  const {
    // request function
    onRequest,
    // messages list
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
