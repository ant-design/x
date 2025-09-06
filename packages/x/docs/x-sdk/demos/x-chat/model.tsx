import { SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, Think } from '@ant-design/x';
import { BubbleListProps } from '@ant-design/x/es/bubble';
import XMarkdown from '@ant-design/x-markdown';
import {
  DeepSeekChatProvider,
  useXChat,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Avatar, Button, Flex, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'DeepSeek-R1-Distill-Qwen-7B';

const ThinkComponent = React.memo((props: { children: string; status: string }) => {
  const [title, setTitle] = React.useState('Deep thinking...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.status === 'done') {
      setTitle('Complete thinking');
      setLoading(false);
    }
  }, [props.status]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    components: {
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    contentRender(content: any) {
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replaceAll('\n\n', '<br/><br/>');
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
    components: {
      avatar: <Avatar icon={<UserOutlined />} style={{ background: '#87d068' }} />,
    },
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
  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
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
  return (
    <Flex vertical gap="middle">
      <Bubble.List
        role={role}
        style={{ maxHeight: 300 }}
        items={messages.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
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
        }))}
      />
      <Sender
        loading={isRequesting()}
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
