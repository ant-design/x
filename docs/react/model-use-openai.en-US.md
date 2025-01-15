---
group:
  title: Model Integration
title: OpenAI
order: 0
tag: Updated
---

This guide will explain how to integrate OpenAI's model service into an application built using Ant Design X.

## Using OpenAI API

This is equivalent to integrating with a model inference service compatible with OpenAI. For reference, see [Model Integration - Qwen](/docs/react/model-use-qwen).

## Using openai-node

Typically, `openai-node` is used in a Node environment. If used in a browser environment, the `dangerouslyAllowBrowser` option must be enabled.

> Note: `dangerouslyAllowBrowser` poses a security risk. For more details, refer to the official [documentation](https://github.com/openai/openai-node?tab=readme-ov-file#requirements).

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
