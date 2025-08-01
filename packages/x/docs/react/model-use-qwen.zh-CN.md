---
group:
  title: 模型接入
  order: 1
title: 通义千问
order: 1
---

这篇指南将介绍如何在使用 Ant Design X 搭建的应用中接入 Qwen 提供的模型服务。

Qwen 的模型推理服务支持「兼容 OpenAI 模式」。详见官方文档: [阿里云 - 通义千问](https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope)

### 相关参数获取

- 如何获取 baseURL - <https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio>
- 如何获取 API Key - <https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key>
- 模型列表 - <https://help.aliyun.com/zh/model-studio/getting-started/models>

### 什么是「兼容 OpenAI 模式」？

是指在接口设计和使用方式上与 OpenAI 的 API 保持一致的模型推理服务。

这意味着开发者可以使用与调用 OpenAI 模型相同的代码和方法，来调用这些兼容服务，从而减少开发接入成本。

## 使用 openai-node 兼容调用

> 注意: 🔥 `dangerouslyAllowBrowser` 存在安全风险，对此 openai-node 的官方文档有详细的[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。

```tsx
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';
import React from 'react';

const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env['DASHSCOPE_API_KEY'],
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
          model: 'qwen-plus',
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

## 使用 API 接入

> 注意: 🔥 `dangerouslyApiKey` 存在安全风险，对此有详细的[说明](/docs/react/dangerously-api-key-cn)。

```tsx
import { useXAgent, useXChat, Sender, Bubble, XRequest } from '@ant-design/x';
import React from 'react';

const { create } = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyApiKey: process.env['DASHSCOPE_API_KEY'],
  model: 'qwen-plus',
});

const Component: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;

      // current message
      console.log('message', message);
      // messages list
      console.log('messages', messages);

      let content: string = '';

      try {
        create(
          {
            messages: [{ role: 'user', content: message }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              console.log('sse chunk list', chunks);
            },
            onError: (error) => {
              console.log('error', error);
            },
            onUpdate: (chunk) => {
              console.log('sse object', chunk);

              const data = JSON.parse(chunk.data);

              content += data?.choices[0].delta.content;

              onUpdate(content);
            },
          },
        );
      } catch (error) {}
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

export default Component;
```
