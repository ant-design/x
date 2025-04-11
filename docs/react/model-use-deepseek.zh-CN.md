---
group:
  title: 模型接入
title: DeepSeek
order: 1
tag: Updated
---

这篇指南将介绍如何在使用 Ant Design X 搭建的应用中接入 DeepSeek 提供的模型服务。

DeepSeek 的模型推理服务支持「兼容 OpenAI 模式」。详见官方文档: [DeepSeek - 首次调用 API](https://api-docs.deepseek.com)

### 相关参数获取

- 如何获取 baseURL - <https://api-docs.deepseek.com>
- 如何获取 API Key - <https://platform.deepseek.com/api_keys>

## 对接 DeepSeek-R1 推理模型

DeepSeek-R1：[`deepseek-reasoner`](https://api-docs.deepseek.com/guides/reasoning_model) 是 DeepSeek 推出的推理模型。在输出最终回答之前，模型会先输出一段思维链内容，以提升最终答案的准确性。

`deepseek-reasoner` 模型的输出字段增加了 思维链内容（reasoning_content），与最终回答（content）同级。在每一轮对话过程中，模型会输出思维链内容（reasoning_content）和最终回答（content）。

> 注意: 🔥 `dangerouslyAllowBrowser` 存在安全风险，对此 openai-node 的官方文档有详细的[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。

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
