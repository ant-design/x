import { SyncOutlined } from '@ant-design/icons';
import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  OpenAIChatProvider,
  useXChat,
  type XModelParams,
  type XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Flex, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/big_model_glm-4.5-flash';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'THUDM/glm-4-9b-chat';

const useLocale = () => {
  const isCN = location.pathname.endsWith('-cn');
  return {
    abort: isCN ? '中止' : 'abort',
    addUserMessage: isCN ? '添加用户消息' : 'Add a user message',
    addAIMessage: isCN ? '添加AI消息' : 'Add an AI message',
    addSystemMessage: isCN ? '添加系统消息' : 'Add a system message',
    editLastMessage: isCN ? '编辑最后一条消息' : 'Edit the last message',
    placeholder: isCN
      ? '请输入内容，按下 Enter 发送消息'
      : 'Please enter content and press Enter to send message',
    waiting: isCN ? '请稍候...' : 'Please wait...',
    requestFailed: isCN ? '请求失败，请重试！' : 'Request failed, please try again!',
    requestAborted: isCN ? '请求已中止' : 'Request is aborted',
    noMessages: isCN
      ? '暂无消息，请输入问题并发送'
      : 'No messages yet, please enter a question and send',
    requesting: isCN ? '请求中' : 'Requesting',
    qaCompleted: isCN ? '问答完成' : 'Q&A completed',
    retry: isCN ? '重试' : 'Retry',
    currentStatus: isCN ? '当前状态：' : 'Current status:',
    historyUserMessage: isCN ? '这是一条历史消息' : 'This is a historical message',
    historyAIResponse: isCN
      ? '这是一条历史回答消息，请发送新消息。'
      : 'This is a historical response message, please send a new message.',
  };
};

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: string) {
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
      return <XMarkdown content={newContent} />;
    },
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
        manual: true,
        params: {
          model: MODEL,
          stream: true,
        },
      }),
    }),
  );
  const locale = useLocale();

  // Chat messages
  const { onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload } = useXChat({
    provider,
    defaultMessages: [
      {
        id: '1',
        message: { role: 'user', content: locale.historyUserMessage },
        status: 'success',
      },
      {
        id: '2',
        message: { role: 'assistant', content: locale.historyAIResponse },
        status: 'success',
      },
    ],
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || locale.requestAborted,
          role: 'assistant',
        };
      }
      return {
        content: errorInfo?.error?.message || locale.requestFailed,
        role: 'assistant',
      };
    },
    requestPlaceholder: () => {
      return {
        content: locale.waiting,
        role: 'assistant',
      };
    },
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'user', content: locale.addUserMessage },
        status: 'success',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'assistant', content: locale.addAIMessage },
        status: 'success',
      },
    ]);
  };

  const addSystemMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'system', content: locale.addSystemMessage },
        status: 'success',
      },
    ]);
  };

  const editLastMessage = () => {
    const lastMessage = messages[messages.length - 1];
    setMessage(lastMessage.id, {
      message: { role: lastMessage.message.role, content: locale.editLastMessage },
    });
  };

  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="middle">
        <div>
          {locale.currentStatus}{' '}
          {isRequesting
            ? locale.requesting
            : messages.length === 0
              ? locale.noMessages
              : locale.qaCompleted}
        </div>
        <Flex align="center" gap="middle">
          <Button disabled={!isRequesting} onClick={abort}>
            {locale.abort}
          </Button>
          <Button onClick={addUserMessage}>{locale.addUserMessage}</Button>
          <Button onClick={addAIMessage}>{locale.addAIMessage}</Button>
          <Button onClick={addSystemMessage}>{locale.addSystemMessage}</Button>
          <Button disabled={!messages.length} onClick={editLastMessage}>
            {locale.editLastMessage}
          </Button>
        </Flex>
      </Flex>

      <Bubble.List
        style={{ height: 500 }}
        role={role}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role,
          status: status,
          loading: status === 'loading',
          content: message.content,
          components:
            message.role === 'assistant'
              ? {
                  footer: (
                    <Tooltip title={locale.retry}>
                      <Button
                        size="small"
                        type="text"
                        icon={<SyncOutlined />}
                        style={{ marginInlineEnd: 'auto' }}
                        onClick={() =>
                          onReload(id, {
                            userAction: 'retry',
                          })
                        }
                      />
                    </Tooltip>
                  ),
                }
              : {},
        }))}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onCancel={() => {
          abort();
        }}
        onChange={setContent}
        placeholder={locale.placeholder}
        onSubmit={(nextContent) => {
          onRequest({
            messages: [
              {
                role: 'user',
                content: nextContent,
              },
            ],
            frequency_penalty: 0,
            max_tokens: 1024,
            thinking: {
              type: 'disabled',
            },
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
