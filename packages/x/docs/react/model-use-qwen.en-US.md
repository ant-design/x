---
group:
  title: Model Integration
  order: 1
title: Qwen
order: 1
---

This guide introduces how to integrate Qwen model services into applications built with Ant Design X.

Qwen's model inference service supports "OpenAI compatible mode". See official documentation: [Alibaba Cloud - Qwen](https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope)

### Related Parameter Acquisition

- How to get baseURL - <https://help.aliyun.com/zh/model-studio/getting-started/what-is-model-studio>
- How to get API Key - <https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key>
- Model list - <https://help.aliyun.com/zh/model-studio/getting-started/models>

### What is "OpenAI compatible mode"?

It refers to model inference services that keep the API design and usage consistent with OpenAI. This means developers can use the same code and methods as calling OpenAI models to call these compatible services, reducing integration development costs.

## Integrate with X SDK

Using URL to integrate models/agents is a basic capability provided by X SDK. For details, see [X SDK](/sdks/introduce).

### Example

<code src="../x-sdk/demos/x-chat/model.tsx" title="Integrate with X SDK"></code>

## Use openai-node for compatible calls

> Note: 🔥 `dangerouslyAllowBrowser` has security risks. See the official openai-node [documentation](https://github.com/openai/openai-node?tab=readme-ov-file#requirements) for details.

```tsx
import { Bubble, BubbleListProps, Sender } from '@ant-design/x';
import {
  AbstractXRequestClass,
  OpenAIChatProvider,
  SSEFields,
  useXChat,
  XModelMessage,
  XModelParams,
  XRequestOptions,
} from '@ant-design/x-sdk';
import { Flex } from 'antd';
import OpenAI from 'openai';
import React, { useState } from 'react';

type OutputType = Partial<Record<SSEFields, any>>;
type InputType = XModelParams;

class OpenAiRequest<
  Input extends InputType = InputType,
  Output extends OutputType = OutputType,
> extends AbstractXRequestClass<Input, Output> {
  client: any;
  stream: OpenAI | undefined;

  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;

  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this.client = new OpenAI({
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: 'OPENAI_API_KEY',
      dangerouslyAllowBrowser: true,
    });
  }
  get asyncHandler(): Promise<any> {
    return Promise.resolve();
  }
  get isTimeout(): boolean {
    return this._isTimeout;
  }
  get isStreamTimeout(): boolean {
    return this._isStreamTimeout;
  }
  get isRequesting(): boolean {
    return this._isRequesting;
  }
  get manual(): boolean {
    return true;
  }
  async run(input: Input): Promise<void> {
    const { callbacks } = this.options;
    try {
      await this.client.responses.create({
        model: 'qwen-plus',
        messages: input?.messages || [],
        stream: true,
      });

      // Please implement stream data update logic based on response
    } catch (error: any) {
      callbacks?.onError(error);
    }
  }
  abort(): void {
    // Please implement abort based on OpenAI
  }
}

const provider = new OpenAIChatProvider<XModelMessage, InputType, OutputType>({
  request: new OpenAiRequest('OPENAI', {}),
});

const Demo: React.FC = () => {
  const [content, setContent] = useState('');
  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider,
    requestPlaceholder: () => {
      return {
        content: 'loading...',
        role: 'assistant',
      };
    },
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: error?.toString(),
        role: 'assistant',
      };
    },
  });

  const items = messages.map(({ message, id }) => ({
    key: id,
    ...message,
  }));

  const role: BubbleListProps['role'] = {
    assistant: {
      placement: 'start',
    },
    user: { placement: 'end' },
  };

  return (
    <Flex
      vertical
      justify="space-between"
      style={{
        height: 400,
        padding: 16,
      }}
    >
      <Bubble.List role={role} items={items} />
      <Sender
        value={content}
        onChange={setContent}
        loading={isRequesting}
        onCancel={abort}
        onSubmit={(val) => {
          onRequest({
            messages: [{ role: 'user', content: val }],
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default Demo;
```

### Example

<code src="./demo/qwen.tsx" title="Integrate openai with qwen" description="This example only shows the logic reference for integrating openai with X SDK. Model data is not processed, please fill in the correct apiKey for data debugging." compact iframe="450"></code>
