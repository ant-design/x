import { SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import {
  OpenAIChatProvider,
  useXChat,
  XModel,
  XModelParams,
  XModelResponse,
} from '@ant-design/x-sdk';
import { Button, Flex, type GetProp, Tooltip } from 'antd';
import React from 'react';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const BASE_URL = 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b';

/**
 * 🔔 The MODEL is fixed in the current request, please replace it with your BASE_UR and MODEL
 */

const MODEL = 'DeepSeek-R1-Distill-Qwen-7B';

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
  const [provider] = React.useState(
    new OpenAIChatProvider({
      request: XModel<XModelParams, XModelResponse>(BASE_URL, {
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
        roles={roles}
        style={{ maxHeight: 300 }}
        items={messages.map(({ id, message }) => ({
          key: id,
          role: message.role,
          content: message.content,
          footer: (
            <Tooltip title="重新生成">
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
