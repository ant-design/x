import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Attachments, Bubble, Prompts } from '@ant-design/x';
import { Button, Flex, GetProp, Image, Typography } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [items, setItems] = useState<GetProp<typeof Bubble.List, 'items'>>([
    // Normal
    {
      key: 0,
      role: 'ai',
      content: 'Normal message',
    },
    // Custom content
    {
      key: 1,
      role: 'ai',
      content: {
        imageUrl:
          'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
        text: 'Ant Design X',
        actionNode: <>Click Me</>,
      },
      messageRender: (content) => {
        return (
          <Flex gap="middle" align="center">
            <Image height={50} src={content?.imageUrl} />
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>{content?.text}</span>
          </Flex>
        );
      },
    },
    // ReactNode
    {
      key: 2,
      role: 'ai',
      id: 'message_id_2',
      content: <Typography.Text type="danger">ReactNode message</Typography.Text>,
    },

    // Role: suggestion
    {
      key: 3,
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
      key: 4,
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
  ]);

  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
      placement: 'start',
      typing: true,
      avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
      footer: (content, { key }) => {
        if (content?.actionNode) {
          return (
            <Button
              onClick={() => {
                setItems((ori) =>
                  ori.map((item) => {
                    if (item.key === key) {
                      return {
                        ...item,
                        content: {
                          ...item?.content,
                          actionNode: <>🎉 Happy Ant Design X !</>,
                        },
                      };
                    }
                    return item;
                  }),
                );
              }}
              type="text"
            >
              {content?.actionNode}
            </Button>
          );
        }
        return null;
      },
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
      messageRender: (items) => (
        <Flex vertical gap="middle">
          {(items as any[]).map((item) => (
            <Attachments.FileCard key={item.uid} item={item} />
          ))}
        </Flex>
      ),
    },
  };
  return <Bubble.List roles={roles} items={items} />;
};

export default App;
