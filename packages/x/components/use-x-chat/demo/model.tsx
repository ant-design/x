import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Flex, type GetProp } from 'antd';
import React, { useRef } from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'DeepSeek-R1-Distill-Qwen-7B';

/**
 * 🔔 the API_KEY is a placeholder indicator interface that has a built-in real API_KEY
 */

const API_KEY = 'Bearer sk-xxxxxxxxxxxxxxxxxxxx';

type YourMessageType = {
  role: string;
  content: string;
};

const roles: GetProp<typeof Bubble.List, 'role'> = {
  assistant: {
    placement: 'start',
    styles: { avatar: { background: '#fde3cf' } },
    components: {
      avatar: <UserOutlined />,
    },
  },
  user: {
    placement: 'end',
    styles: { avatar: { background: '#87d068' } },
    components: {
      avatar: <UserOutlined />,
    },
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
      const { originMessage, chunk } = info || {};
      let currentContent = '';
      let currentThink = '';
      try {
        if (chunk?.data && !chunk?.data.includes('DONE')) {
          const message = JSON.parse(chunk?.data);
          currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
          currentContent = message?.choices?.[0]?.delta?.content || '';
        }
      } catch (error) {
        console.error(error);
      }

      let content = '';

      if (!originMessage?.content && currentThink) {
        content = `<think>${currentThink}`;
      } else if (
        originMessage?.content?.includes('<think>') &&
        !originMessage?.content.includes('</think>') &&
        currentContent
      ) {
        content = `${originMessage?.content}</think>${currentContent}`;
      } else {
        content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
      }

      return {
        content: content,
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
        role={roles}
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
