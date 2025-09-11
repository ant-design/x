import { SyncOutlined } from '@ant-design/icons';
import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  OpenAIChatProvider,
  useXChat,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Flex, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_cloudflare_qwq-32b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'qwq-32b';

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',

    contentRender(content: any) {
      // Double '\n' in a mark will causes markdown parse as a new paragraph, so we need to replace it with a single '\n'
      const newContent = content.replaceAll('\n\n', '<br/><br/>');
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
