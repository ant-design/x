import { SyncOutlined } from '@ant-design/icons';
import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender, Think } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import {
  DeepSeekChatProvider,
  useXChat,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Divider, Flex, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'DeepSeek-R1-Distill-Qwen-7B';

const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState('Deep thinking...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle('Complete thinking');
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    contentRender(content: string) {
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
      return (
        <XMarkdown
          content={newContent}
          components={{
            think: ThinkComponent,
          }}
        />
      );
    },
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const [content, setContent] = React.useState('');
  const [provider] = React.useState(
    new DeepSeekChatProvider({
      request: XRequest<XModelParams, XModelResponse>(BASE_URL, {
        manual: true,
        params: {
          model: MODEL,
          stream: true,
        },
      }),
    }),
  );
  // Chat messages
  const { onRequest, messages, setMessages, setMessage, isRequesting, abort, onReload } = useXChat({
    provider,
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
  });

  const addUserMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'user', content: 'Add a new user message' },
        status: 'success',
      },
    ]);
  };

  const addAIMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'assistant', content: 'Add a new AI response' },
        status: 'success',
      },
    ]);
  };

  const addSystemMessage = () => {
    setMessages([
      ...messages,
      {
        id: Date.now(),
        message: { role: 'system', content: 'Add a new system message' },
        status: 'success',
      },
    ]);
  };

  const editLastMessage = () => {
    const lastMessage = messages[messages.length - 1];
    setMessage(lastMessage.id, {
      message: { role: lastMessage.message.role, content: 'Edit a message' },
    });
  };

  return (
    <Flex vertical gap="middle">
      <Flex vertical gap="middle">
        <div>
          Current status:{' '}
          {isRequesting
            ? 'Requesting'
            : messages.length === 0
              ? 'No messages yet, please enter a question and send'
              : 'Q&A completed'}
        </div>
        <Flex align="center" gap="middle">
          <Button disabled={!isRequesting} onClick={abort}>
            abort
          </Button>
          <Button onClick={addUserMessage}>Add a user message</Button>
          <Button onClick={addAIMessage}>Add an AI message</Button>
          <Button onClick={addSystemMessage}>Add a system message</Button>
          <Button disabled={!messages.length} onClick={editLastMessage}>
            Edit the last message
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Bubble.List
        role={role}
        style={{ height: 500 }}
        items={messages.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
          components:
            message.role === 'assistant'
              ? {
                  footer: (
                    <Tooltip title="Retry">
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
        onSubmit={(nextContent) => {
          onRequest({
            messages: [
              {
                role: 'user',
                content: nextContent,
              },
            ],
          });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
