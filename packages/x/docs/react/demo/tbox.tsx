import { Bubble, BubbleListProps, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { TransformMessage } from '@ant-design/x-sdk';
import {
  AbstractChatProvider,
  AbstractXRequestClass,
  useXChat,
  XRequestOptions,
} from '@ant-design/x-sdk';
import { Flex } from 'antd';

import React, { useState } from 'react';
import { TboxClient } from 'tbox-nodejs-sdk';

interface TboxMessage {
  content: string;
  role: string;
}

interface TboxInput {
  message: TboxMessage;
}

interface TboxOutput {
  text?: string;
}

class TboxRequest<
  Input extends TboxInput = TboxInput,
  Output extends TboxOutput = TboxOutput,
> extends AbstractXRequestClass<Input, Output> {
  tboxClient: TboxClient;
  tboxStream: any;

  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;

  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this.tboxClient = new TboxClient({
      httpClientConfig: {
        authorization: 'your-api-key', // Replace with your API key
        isAntdXDemo: true, // Only for Ant Design X demo
      },
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
  run(params?: Input | undefined): void {
    const stream = this.tboxClient.chat({
      appId: 'your-app-id', // Replace with your app ID
      query: params?.message.content || '',
      userId: 'antd-x',
    });
    this.tboxStream = stream;
    const { callbacks } = this.options;

    const dataArr: Output[] = [];

    stream.on('data', (data) => {
      let parsedPayload: Output;
      try {
        const payload = (data as any).data?.payload || '{}';
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        console.error('Failed to parse payload:', e);
        return;
      }

      if (parsedPayload?.text) {
        dataArr.push(parsedPayload);
        callbacks?.onUpdate?.(parsedPayload, new Headers());
      }
    });

    stream.on('error', (error) => {
      callbacks?.onError(error);
    });

    stream.on('end', () => {
      callbacks?.onSuccess(dataArr, new Headers());
    });

    stream.on('abort', () => {
      callbacks?.onSuccess(dataArr, new Headers());
    });
  }
  abort(): void {
    this.tboxStream?.abort?.();
  }
}

class TboxProvider<
  ChatMessage extends TboxMessage = TboxMessage,
  Input extends TboxInput = TboxInput,
  Output extends TboxOutput = TboxOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return requestParams.message as unknown as ChatMessage;
  }
  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk) {
      return {
        content: originMessage?.content || '',
        role: 'assistant',
      } as ChatMessage;
    }

    const content = originMessage?.content || '';
    return {
      content: content + chunk.text,
      role: 'assistant',
    } as ChatMessage;
  }
}

const provider = new TboxProvider({
  request: new TboxRequest('Tbox Client', {}),
});

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: string) {
      const newContent = content.replaceAll('\n\n', '<br/><br/>');
      return <XMarkdown content={newContent} />;
    },
  },
  user: { placement: 'end' },
};

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

  return (
    <Flex
      vertical
      justify="space-between"
      gap={16}
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
            message: { role: 'user', content: val },
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default Demo;
