import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React, { useRef } from 'react';

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const API_KEY = 'Bearer sk-ravoadhrquyrkvaqsgyeufqdgphwxfheifujmaoscudjgldr';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

type YourMessageType = {
  role: string;
  content: string;
};

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  assistant: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  const [agent] = useXAgent<YourMessageType>({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: API_KEY,
    /** 🔥🔥 Its dangerously! */
  });
  const abortController = useRef<AbortController>(null);
  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
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
    requestPlaceholder: () => {
      return {
        content: 'Please wait...',
        role: 'assistant',
      };
    },
    transformMessage: (info) => {
      const { originMessage, currentMessage, status } = info || {};
      let currentText = '';
      let originText = '';
      if (status === 'loading' && currentMessage.data && !currentMessage.data.includes('DONE')) {
        try {
          const message = JSON.parse(currentMessage.data);
          currentText =
            message?.choices?.[0].delta?.reasoning_content === null
              ? ''
              : message?.choices?.[0].delta?.reasoning_content;
        } catch (e) {
          console.error('error', e);
        }
      }
      if (originMessage) {
        originText = originMessage.content || '';
      }
      return {
        content: originText + currentText,
        role: 'assistant',
      };
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
  });
  return (
    <Flex vertical gap="middle">
      <Bubble.List
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
        }))}
      />
      <Sender
        loading={agent.isRequesting()}
        value={content}
        onCancel={() => {
          abortController?.current?.abort?.();
        }}
        onChange={setContent}
        onSubmit={(nextContent) => {
          onRequest({
            stream: true,
            message: {
              role: 'user',
              content: nextContent,
            },
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
