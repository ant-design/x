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
import Sender from './Sender';

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

const useStyle = createStyles(({ token, css }) => {
  return {
    container: css`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-block: ${token.marginXL}px;
        height: 100%;
        width:100%;
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
        `,
    sender: css`
        max-width: 1000px;
        padding-inline: ${token.marginXL}px;
        width:100%;
    `,
    loadingMessage: css``,
  };
});

interface TBoxMessage {
  content: string;
  role: string;
}

interface TBoxInput {
  message: TBoxMessage;
}

interface TBoxOutput {
  text?: string;
}

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
interface AgentProps {
  setIsOnAgent: (val: boolean) => void;
  isOnAgent: boolean;
}
const Agent: React.FC<AgentProps> = ({ setIsOnAgent }) => {
  const { styles } = useStyle();

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
      contentRender: (content) => (
        <XMarkdown
          components={{ code: Code }}
          paragraphTag="div"
          streaming={{ hasNextChunk: content.status === 'loading', enableAnimation: true }}
        >
          {content.text}
        </XMarkdown>
      ),
    },
    user: {
      placement: 'end',
      contentRender: (content) => {
        return content.text;
      },
    },
  };

  const { onRequest, messages, requesting, abort } = useXChat({
    provider: provider, // every conversation has its own provider
    requestPlaceholder: () => {
      return {
        content: '',
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
        content: 'Request failed, please try again!',
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

  const items: BubbleListProps['items'] = messages?.map((i, index) => ({
    content: {
      status: i.status,
      text: i.message.content,
    },
    role: i.message.role,
    classNames: {
      content: i.status === 'loading' ? styles.loadingMessage : '',
    },
    loading: !i.message.content,
    key: i.id,
  }));

  return (
    <div className={styles.container}>
      {messages.length > 0 && (
        <div className={styles.messageList}>
          <Bubble.List
            styles={{
              bubble: {
                width: 1000,
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
          loading={requesting}
        />
      </div>
    </div>
  );
};

export default Agent;
