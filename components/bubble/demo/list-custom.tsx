import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Prompts } from '@ant-design/x';
import { GetProp, Typography } from 'antd';
import React from 'react';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: true,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) => <Prompts vertical items={items as any} />,
  },
};

const App = () => {
  return (
    <Bubble.List
      roles={roles}
      items={[
        // Normal
        {
          key: 0,
          role: 'ai',
          content: 'Normal message',
        },

        // ReactNode
        {
          key: 1,
          role: 'ai',
          content: <Typography.Text type="danger">ReactNode message</Typography.Text>,
        },

        // Other components
        {
          key: 2,
          role: 'suggestion',
          content: [
            {
              key: '6',
              icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
              description: 'How to rest effectively after long hours of work?',
            },
            {
              key: '7',
              icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
              description: 'What are the secrets to maintaining a positive mindset?',
            },
            {
              key: '8',
              icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
              description: 'How to stay calm under immense pressure?',
            },
          ],
        },
      ]}
    />
  );
};

export default App;
