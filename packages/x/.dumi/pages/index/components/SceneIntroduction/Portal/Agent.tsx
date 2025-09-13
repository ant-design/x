import type { BubbleListProps } from '@ant-design/x';
import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import type { XRequestOptions } from '@ant-design/x-sdk';
import {
  AbstractChatProvider,
  AbstractXRequestClass,
  TransformMessage,
  useXChat,
} from '@ant-design/x-sdk';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { TboxClient } from 'tbox-nodejs-sdk';
import useLocale from '../../../../../hooks/useLocale';
import type { AgentProps, TBoxInput, TBoxMessage, TBoxOutput } from './interface';
import Sender from './Sender';

const locales = {
  cn: {
    noData: '暂无数据',
  },
  en: {
    noData: 'No Data',
  },
};

const useStyle = createStyles(({ token, css }, isOnAgent: any) => {
  return {
    container: css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-block: ${token.marginXL}px;
        height: ${isOnAgent ? '100%' : '200px'};
        width: 100%;
        box-sizing: border-box;
        align-items: center;
 
        `,
    messageList: css`
        width:100%;
        height: calc(100% - 160px);
        display: flex;
        flex-direction:column;
        align-items: center;
        .ant-bubble-start{
        margin-inline-start: ${token.marginXL * 2}px;
        }
        .ant-bubble-end{
         margin-inline-end: ${token.marginXL * 2}px;
        }
        .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
        `,
    sender: css`
        max-width: 1000px;
        padding-inline: ${token.marginXL}px;
        width:100%;
    `,
  };
});

const Code = (props: { className: string; children: string }) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';
  return <HighlightCode lang={lang}>{children}</HighlightCode>;
};

const tboxClient = new TboxClient({
  httpClientConfig: {
    authorization: 'your-api-key', // Replace with your API key
    isAntdXDemo: true, // Only for Ant Design X demo
  },
});

class TBoxProvider<
  ChatMessage extends TBoxMessage = TBoxMessage,
  Input extends TBoxInput = TBoxInput,
  Output extends TBoxOutput = TBoxOutput,
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

class TBoxRequest<
  Input extends TBoxInput = TBoxInput,
  Output extends TBoxOutput = TBoxOutput,
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
    const stream = tboxClient.chat({
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

const provider = new TBoxProvider({
  request: new TBoxRequest('TBox Client', {}),
});

const Agent: React.FC<AgentProps> = ({ setIsOnAgent, isOnAgent }) => {
  const { styles } = useStyle(isOnAgent);
  const [locale] = useLocale(locales);
  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;
    onRequest({
      message: {
        role: 'user',
        content: val,
      },
    });
  };

  const role: BubbleListProps['role'] = {
    assistant: {
      placement: 'start',
      contentRender: (content, { status }) => (
        <XMarkdown
          components={{ code: Code, pre: Code }}
          paragraphTag="div"
          streaming={{ hasNextChunk: status === 'updating', enableAnimation: true }}
        >
          {content}
        </XMarkdown>
      ),
    },
    user: {
      placement: 'end',
      contentRender: (content) => {
        return content;
      },
    },
  };

  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider: provider,
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: 'assistant',
      };
    },
  });

  useEffect(() => {
    if (messages.length) {
      setIsOnAgent(true);
    } else {
      setIsOnAgent(false);
    }
  }, [messages]);

  const items: BubbleListProps['items'] = messages?.map((i) => ({
    content: i.message.content,
    status: i.status,
    role: i.message.role,
    loading: i.status === 'loading',
    key: i.id,
  }));

  return (
    <div className={styles.container}>
      {messages.length > 0 && (
        <div className={styles.messageList}>
          <Bubble.List
            styles={{
              bubble: {
                maxWidth: 1000,
              },
            }}
            autoScroll
            items={items}
            role={role}
          />
        </div>
      )}
      <div className={styles.sender}>
        <Sender
          onSubmit={onSubmit}
          abort={() => {
            abort?.();
          }}
          loading={isRequesting}
        />
      </div>
    </div>
  );
};

export default Agent;
