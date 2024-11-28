---
group:
  title: Model Integration
title: Qwen
order: 1
---

Tongyi Qianwen provides model inference services compatible with OpenAI.  
[Alibaba Cloud - Tongyi Qianwen](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope?spm=a2c4g.11186623.0.i10)

## What is a "Service Compatible with OpenAI Models"?

It refers to a model inference service whose interface design and usage are consistent with OpenAI's API.

This means developers can use the same code and methods as they would for OpenAI models to interact with these compatible services, significantly reducing integration costs.

## Method 1: Using OpenAI compatible call

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

## Method 2: Using XRequest

This method utilizes a function provided by Ant Design X, which integrates XStream to parse SSE streams internally.

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
