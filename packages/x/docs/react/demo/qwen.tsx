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
