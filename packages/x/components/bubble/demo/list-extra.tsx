import { Actions, Bubble, BubbleItemType } from '@ant-design/x';
import type { GetProp, GetRef } from 'antd';
import { Flex, Spin } from 'antd';
import React, { useState } from 'react';

const roles = (
  setMessage: React.Dispatch<React.SetStateAction<BubbleItemType[]>>,
): GetProp<typeof Bubble.List, 'role'> => ({
  ai: {
    placement: 'start',
    typing: (_, { status }) =>
      status === 'updating' ? { effect: 'typing', step: 5, interval: 20 } : false,
    components: {
      footer: (content, { key, extra }) => (
        <Actions
          items={[
            {
              key: 'copy',
              label: 'copy',
              actionRender: () => {
                return <Actions.Copy text={content} />;
              },
            },
            {
              key: 'feedback',
              actionRender: () => (
                <Actions.Feedback
                  value={extra?.feedback || 'default'}
                  styles={{
                    liked: {
                      color: '#f759ab',
                    },
                  }}
                  onChange={(val) => {
                    setMessage((messages) =>
                      messages.map((message) => {
                        if (message.key === key) {
                          message.extra = { feedback: val };
                        }
                        return message;
                      }),
                    );
                  }}
                  key="feedback"
                />
              ),
            },
          ]}
        />
      ),
    },
    loadingRender: () => (
      <Flex align="center" gap="small">
        <Spin size="small" />
        Custom loading...
      </Flex>
    ),
  },
  user: {
    placement: 'end',
  },
});

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [message, setMessage] = useState<BubbleItemType[]>([
    {
      status: 'success',
      key: 'welcome',
      role: 'ai',
      content: 'Mock welcome content. '.repeat(10),
      extra: {
        feedback: 'like',
      },
    },
    {
      key: 'ask',
      role: 'user',
      content: 'Mock user content.',
    },
    {
      key: 'ai_0',
      role: 'ai',
      status: 'success',
      content: 'Mock welcome content. '.repeat(10),
      extra: {
        feedback: 'dislike',
      },
    },
    {
      key: 'user_1',
      role: 'user',
      content: 'Mock user content.',
    },
    {
      key: 'ai_1',
      role: 'ai',
      status: 'success',
      content: 'Mock welcome content. '.repeat(10),
      extra: {
        feedback: 'dislike',
      },
    },
    {
      key: 'user_2',
      role: 'user',
      content: 'Mock user content.',
    },
    {
      key: 'ai_2',
      role: 'ai',
      status: 'success',
      content: 'Mock welcome content. '.repeat(10),
      extra: {
        feedback: 'like',
      },
    },
    {
      key: 'user_3',
      role: 'user',
      content: 'Mock user content.',
    },
    {
      key: 'ai_3',
      role: 'ai',
      status: 'loading',
      loading: true,
      content: '',
    },
  ]);
  return (
    <Bubble.List
      ref={listRef}
      styles={{
        bubble: {
          maxWidth: '90%',
        },
      }}
      style={{ maxHeight: 500 }}
      role={roles(setMessage)}
      items={message}
    />
  );
};

export default App;
