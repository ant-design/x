---
group:
  title: Model Integration
title: Qwen
order: 1
tag: Updated
---

This guide will introduce how to integrate the model service provided by Qwen into an application built with Ant Design X.

Qwen’s model inference service supports the "OpenAI Compatibility Mode." For more details, see the official documentation: [Alibaba Cloud - Tongyi Qianwen](https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope)

- How to get the baseURL - <https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio>
- How to get the API Key - <https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key>
- Model list - <https://help.aliyun.com/zh/model-studio/getting-started/models>

### What is the "OpenAI Compatibility Mode"?

It refers to model inference services whose API design and usage methods are consistent with OpenAI’s API.

This allows developers to use the same code and methods as OpenAI models to call these compatible services, thus reducing integration costs.

## Using openai-node for Compatible Calls

> Note: 🔥 `dangerouslyAllowBrowser` presents security risks. Detailed documentation on this can be found in the official [openai-node documentation](https://github.com/openai/openai-node?tab=readme-ov-file#requirements).

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

## Using API Integration

> Note: 🔥 `dangerouslyApiKey` presents security risks. Detailed documentation on this can be found in [Explanation](/docs/react/dangerously-api-key-cn).

```tsx
import { useXAgent, useXChat, Sender, Bubble, XRequest } from '@ant-design/x';
import React from 'react';

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
        const { create } = XRequest({
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
          dangerouslyApiKey: process.env['DASHSCOPE_API_KEY'],
          model: 'qwen-plus',
        });

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
