import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Flex } from 'antd';
import React from 'react';

interface ChatInput {
  query: string;
  role: 'user';
  stream?: boolean;
}

interface ChatOutput {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

interface SystemMessage {
  role: 'system';
  content: string;
}

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: ChatOutput) {
      return content?.choices?.[0]?.message?.content;
    },
  },
  user: {
    placement: 'end',
    contentRender(content: ChatInput) {
      return content?.query;
    },
  },
  system: {
    variant: 'borderless',
    contentRender(content: SystemMessage) {
      return content?.content;
    },
  },
};

const useLocale = () => {
  const isCN = typeof location !== 'undefined' ? location.pathname.endsWith('-cn') : false;
  return {
    abort: isCN ? '中止' : 'abort',
    addUserMessage: isCN ? '添加用户消息' : 'Add a user message',
    addAIMessage: isCN ? '添加AI消息' : 'Add an AI message',
    addSystemMessage: isCN ? '添加系统消息' : 'Add a system message',
    editLastMessage: isCN ? '编辑最后一条消息' : 'Edit the last message',
    placeholder: isCN
      ? '请输入内容，按下 Enter 发送消息'
      : 'Please enter content and press Enter to send message',
    waiting: isCN ? '等待中...' : 'Waiting...',
    mockFailed: isCN ? '模拟失败返回，请稍后再试。' : 'Mock failed return. Please try again later.',
    historyUserMessage: isCN ? '这是一条历史消息' : 'This is a historical message',
    historyAIResponse: isCN
      ? '这是一条历史回答消息，请发送新消息。'
      : 'This is a historical response message, please send a new message.',
    editSystemMessage: isCN ? '编辑系统消息' : 'Edit a system message',
    editUserMessage: isCN ? '编辑用户消息' : 'Edit a user message',
    editAIResponse: isCN ? '编辑AI回复' : 'Edit an AI response',
  };
};

const App = () => {
  const [content, setContent] = React.useState('');
  const locale = useLocale();

  const [provider] = React.useState(
    new DefaultChatProvider<ChatOutput | ChatInput | SystemMessage, ChatInput, ChatOutput>({
      request: XRequest('https://api.x.ant.design/api/default_chat_provider_stream', {
        manual: true,
      }),
    }),
  );

  // Chat messages
  const { onRequest, messages, abort, isRequesting, setMessages, setMessage } = useXChat({
    provider,
    defaultMessages: [
      {
        id: '1',
        message: { query: locale.historyUserMessage, role: 'user' },
        status: 'local',
      },
      {
        id: '2',
        message: {
          choices: [{ message: { content: locale.historyAIResponse, role: 'assistant' } }],
        },
        status: 'success',
      },
    ],
    requestPlaceholder: { choices: [{ message: { content: locale.waiting, role: 'assistant' } }] },
    requestFallback: { choices: [{ message: { content: locale.mockFailed, role: 'assistant' } }] },
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { query: locale.addUserMessage, role: 'user' },
        status: 'local',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { choices: [{ message: { content: locale.addAIMessage, role: 'assistant' } }] },
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
    const isSystem = (lastMessage.message as SystemMessage).role === 'system';
    const isUser = !!(lastMessage.message as ChatInput).query;
    const isAI = !!(lastMessage.message as ChatOutput).choices;
    if (isSystem) {
      setMessage(lastMessage.id, {
        message: { role: 'system', content: locale.editSystemMessage },
      });
    } else if (isUser) {
      setMessage(lastMessage.id, {
        message: { role: 'user', query: locale.editUserMessage },
      });
    } else if (isAI) {
      setMessage(lastMessage.id, {
        message: { choices: [{ message: { content: locale.editAIResponse, role: 'assistant' } }] },
      });
    }
  };

  return (
    <Flex vertical gap="middle">
      <Flex gap="small">
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
      <Bubble.List
        role={role}
        style={{ height: 500 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          role: (message as SystemMessage | ChatInput).role
            ? (message as SystemMessage | ChatInput).role
            : (message as ChatOutput)?.choices?.[0]?.message?.role,
          content: message,
        }))}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onChange={setContent}
        onCancel={abort}
        placeholder={locale.placeholder}
        onSubmit={(nextContent) => {
          onRequest({
            stream: false,
            role: 'user',
            query: nextContent,
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
