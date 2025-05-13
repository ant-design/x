import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Attachments, Bubble, Prompts } from '@ant-design/x';
import { Flex, GetProp, Typography } from 'antd';
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
  file: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items: any) => (
      <Flex vertical gap="middle">
        {(items as any[]).map((item) => (
          <Attachments.FileCard key={item.uid} item={item} />
        ))}
      </Flex>
    ),
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

        // Role: suggestion
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
        // Role: file
        {
          key: 3,
          role: 'file',
          content: [
            {
              uid: '1',
              name: 'excel-file.xlsx',
              size: 111111,
              description: 'Checking the data',
            },
            {
              uid: '2',
              name: 'word-file.docx',
              size: 222222,
              status: 'uploading',
              percent: 23,
            },
          ],
        },
      ]}
    />
  );
};

export default App;
