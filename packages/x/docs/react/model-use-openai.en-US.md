---
group:
  title: Model Integration
  order: 1
title: OpenAI
order: 0
---

This guide introduces how to integrate OpenAI model services into applications built with Ant Design X. For details, see [X SDK](/sdks/introduce).

## Integrate with X SDK

Using URL to integrate Model is a basic capability provided by X SDK. For details, see [X SDK](/sdks/introduce).

### Example

<code src="../x-sdk/demos/x-chat/model.tsx" title="Integrate with X SDK"></code>

## Using openai-node

Usually, openai-node is used in the node environment. If you use it in the browser, you need to enable `dangerouslyAllowBrowser`.

> Note: `dangerouslyAllowBrowser` has security risks. See the official openai-node [documentation](https://github.com/openai/openai-node?tab=readme-ov-file#requirements) for details.

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
        model: 'gpt-4o',
        input: input?.messages?.[0]?.content || '',
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
  const { onRequest, messages, requesting, abort } = useXChat({
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
        loading={requesting}
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

<code src="../x-sdk/demos/x-chat/openai-node.tsx" title="Integrate openai" description="This example only shows the logic reference for integrating openai with X SDK. Model data is not processed, please fill in the correct apiKey for data debugging."></code>
