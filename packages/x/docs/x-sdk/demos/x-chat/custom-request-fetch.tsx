import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import { DefaultChatProvider, useXChat, XRequest, XRequestOptions } from '@ant-design/x-sdk';
import { Flex } from 'antd';
import React from 'react';

interface ChatInput {
  query: string;
  stream: false;
  role: 'user';
}

interface ChatOutput {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

// DefaultChatProvider 不做数据处理，数据类型和输出输入是一致的如果需要处理流数据请使用其他 Chat Provider
// DefaultChatProvider does not process data, input and output data types remain consistent. If you need to process streaming data, please use other Chat Providers
type MessageType = ChatInput | ChatOutput;

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender: (content) => {
      // 获取助手的回复内容 / Get assistant's response content
      return content?.choices?.[0]?.message?.content || '';
    },
  },
  user: {
    placement: 'end',
    contentRender: (content) => {
      // 获取用户的输入内容 / Get user's input content
      return content.query;
    },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  const [provider] = React.useState(
    new DefaultChatProvider<MessageType, ChatInput, ChatOutput>({
      request: XRequest<ChatInput, ChatOutput>(
        'https://api.x.ant.design/api/default_chat_provider_stream',
        {
          manual: true,
          fetch: async (
            url: Parameters<typeof fetch>[0],
            options: XRequestOptions<ChatInput, ChatOutput>,
          ) => {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(options.params || '{}'),
            });
            return response;
          },
        },
      ),
    }),
  );

  // 聊天消息管理：获取消息列表、发送请求状态等
  // Chat message management: get message list, request status, etc.
  const { onRequest, messages, isRequesting } = useXChat({
    provider,
  });

  return (
    <Flex vertical gap="middle">
      <Bubble.List
        role={role}
        style={{ height: 500 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          content: message,
          // 判断消息角色：用户或助手
          // Determine message role: user or assistant
          role: (message as ChatInput).role
            ? (message as ChatInput).role
            : (message as ChatOutput)?.choices?.[0]?.message?.role,
          status: status,
        }))}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onChange={setContent}
        onSubmit={(nextContent) => {
          // 发送用户消息：构建请求参数并清空输入框
          // Send user message: build request parameters and clear input field
          onRequest({
            query: nextContent,
            stream: false,
            role: 'user',
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
