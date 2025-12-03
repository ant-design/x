import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import { AbstractChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Flex } from 'antd';
import React from 'react';

// 类型定义
interface CustomInput {
  query: string;
  role: 'user';
  stream?: boolean;
}

interface CustomOutput {
  data: string;
}

interface CustomMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

// 自定义Provider实现
class CustomProvider<
  ChatMessage extends CustomMessage = CustomMessage,
  Input extends CustomInput = CustomInput,
  Output extends CustomOutput = CustomOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      query: requestParams.query || '',
      role: 'user',
      stream: requestParams.stream ?? false,
    } as Input;
  }

  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return {
      content: requestParams.query || '',
      role: 'user',
    } as ChatMessage;
  }

  transformMessage(info: any): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk || !chunk?.data || (chunk?.data && chunk?.data?.includes('[DONE]'))) {
      return {
        content: `${originMessage?.content}`,
        role: 'assistant',
      } as ChatMessage;
    }

    try {
      // 处理流式数据
      const chunkJson = JSON.parse(chunk.data);
      const content = originMessage?.content || '';
      return {
        content: `${content}${chunkJson.data || ''}`,
        role: 'assistant',
      } as ChatMessage;
    } catch (error) {
      // 如果解析失败，直接使用原始数据
      return {
        content: `${originMessage?.content || ''}${chunk.data || ''}`,
        role: 'assistant',
      } as ChatMessage;
    }
  }
}

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: CustomMessage) {
      return (content as any)?.content;
    },
  },
  user: {
    placement: 'end',
    contentRender(content: CustomMessage) {
      return (content as any)?.content;
    },
  },
  system: {
    variant: 'borderless',
    contentRender(content: CustomMessage) {
      return content?.content;
    },
  },
};

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
    waiting: isCN ? '等待中...' : 'Waiting...',
    mockFailed: isCN ? '模拟失败返回，请稍后再试。' : 'Mock failed return. Please try again later.',
    historyUserMessage: isCN ? '这是一条历史消息' : 'This is a historical message',
    historyAIResponse: isCN
      ? '这是一条历史回答消息，请发送新消息。'
      : 'This is a historical response message, please send a new message.',
    editSystemMessage: isCN ? '编辑系统消息' : 'Edit a system message',
    editUserMessage: isCN ? '编辑用户消息' : 'Edit a user message',
    editAIResponse: isCN ? '编辑AI回复' : 'Edit an AI response',
    customProviderTitle: isCN ? '自定义Provider示例' : 'Custom Provider Example',
    customProviderDesc: isCN
      ? '这是一个使用自定义Provider的示例，展示了如何继承AbstractChatProvider来实现自定义的数据处理逻辑。'
      : 'This is an example using a custom provider, demonstrating how to extend AbstractChatProvider to implement custom data processing logic.',
  };
};

const App = () => {
  const [content, setContent] = React.useState('');
  const locale = useLocale();

  // 使用自定义Provider
  const [provider] = React.useState(
    new CustomProvider<CustomMessage, CustomInput, CustomOutput>({
      request: XRequest('https://api.x.ant.design/api/custom_chat_provider_stream', {
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
        message: { content: locale.historyUserMessage, role: 'user' },
        status: 'local',
      },
      {
        id: '2',
        message: { content: locale.historyAIResponse, role: 'assistant' },
        status: 'success',
      },
    ],
    requestPlaceholder: { content: locale.waiting, role: 'assistant' },
    requestFallback: { content: locale.mockFailed, role: 'assistant' },
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { content: locale.addUserMessage, role: 'user' },
        status: 'local',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { content: locale.addAIMessage, role: 'assistant' },
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
      message: { role: lastMessage.message.role, content: locale.editSystemMessage },
    });
  };

  return (
    <Flex vertical gap="middle">
      <div>
        <h3>{locale.customProviderTitle}</h3>
        <p>{locale.customProviderDesc}</p>
      </div>
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
          role: message.role,
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
            stream: true,
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
