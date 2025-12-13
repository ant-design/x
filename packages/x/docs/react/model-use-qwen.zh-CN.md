---
group:
  title: 模型接入
  order: 1
title: 通义千问
tag: Updated
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

## 使用 X SDK 接入

使用URL接入模型是 X SDK提供的基础能力，详情请查看 [X SDK](/x-sdks/introduce-cn)。

### 示例

<code src="./demo/qwen-sdk.tsx" title="使用X SDK接入"></code>

## 使用 openai-node 兼容调用

> 注意: 🔥 `dangerouslyAllowBrowser` 存在安全风险，对此 openai-node 的官方文档有详细的[说明](https://github.com/openai/openai-node?tab=readme-ov-file#requirements)。

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

      // 请基于 response 实现 流数据更新逻辑
      // Please implement stream data update logic based on response
    } catch (error: any) {
      callbacks?.onError(error);
    }
  }
  abort(): void {
    // 请基于openai 实现 abort
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

### 示例

<code src="./demo/qwen.tsx" title="使用 openai 接入qwen" description="此示例仅展示使用X SDK接入 openai 的逻辑参考，并未对模型数据进行处理，需填写正确的apiKey再进行数据调试"></code>
