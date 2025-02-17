---
group:
  title: Model Integration
title: DeepSeek
order: 1
tag: Updated
---

This guide explains how to integrate DeepSeek's model services into applications built with Ant Design X.

DeepSeek's model inference service supports an **OpenAI-compatible mode**. For details, refer to the official documentation: [DeepSeek - First API Call](https://api-docs.deepseek.com)

### Obtaining Required Parameters

- How to get baseURL - <https://api-docs.deepseek.com>
- How to get API Key - <https://platform.deepseek.com/api_keys>

## Integrating DeepSeek-R1

DeepSeek-R1: [`deepseek-reasoner`](https://api-docs.deepseek.com/guides/reasoning_model) is DeepSeek's reasoning model. Before outputting the final answer, the model first generates chain-of-thought content to improve answer accuracy.

The `deepseek-reasoner` model output includes additional **reasoning content** (`reasoning_content`) at the same level as the final answer (`content`). During each conversation turn, the model outputs both the reasoning content and final answer.

> Warning: 🔥 `dangerouslyAllowBrowser` carries security risks. Refer to the official [openai-node documentation](https://github.com/openai/openai-node?tab=readme-ov-file#requirements) for details.

```tsx
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';
import React from 'react';

import type { GetProp } from 'antd';

const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env['DEEPSEEK_API_KEY'],
  dangerouslyAllowBrowser: true,
});

const DeepSeekR1 = 'deepseek-reasoner';

interface YourMessage {
  /**
   * @description The content of model answer
   */
  content: string;
  /**
   * @description The content of model reasoning
   */
  reasoning_content: string;
}

const Demo: React.FC = () => {
  const [agent] = useXAgent<YourMessage>({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      const { onSuccess, onUpdate, onError } = callbacks;

      // current message
      console.log('message', message);

      // history messages
      console.log('messages', messages);

      let content: string = '';
      let reasoning_content: string = '';

      try {
        const stream = await client.chat.completions.create({
          model: DeepSeekR1,
          // if chat context is needed, modify the array
          messages: [{ role: 'user', content: message?.content as string }],
          // stream mode
          stream: true,
        });

        for await (const chunk of stream) {
          const { reasoning_content: deltaReasoningContent, content: deltaContent } = (chunk
            .choices[0]?.delta || {}) as YourMessage;

          // update reasoning content
          if (deltaReasoningContent) {
            reasoning_content += deltaReasoningContent;
          }

          // update content
          if (deltaContent) {
            content += deltaContent;
          }

          onUpdate({
            content,
            reasoning_content,
          });
        }

        onSuccess({
          content,
          reasoning_content,
        });
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

  const onSubmit = (value: string) => {
    onRequest({ content: value, reasoning_content: '' });
  };

  console.log(messages);

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ message, id }) => ({
    // key is required, used to identify the message
    key: id,
    messageRender() {
      return (
        <>
          {/** render reasoning content */}
          <div>{message.reasoning_content}</div>
          {/** render content */}
          <div>{message.content}</div>
        </>
      );
    },
  }));

  return (
    <div>
      <Bubble.List items={items} />
      <Sender onSubmit={onSubmit} />
    </div>
  );
};

export default Demo;
```
