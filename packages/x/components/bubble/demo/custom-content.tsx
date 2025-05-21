import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex, Image } from 'antd';
import React, { useState } from 'react';

type ContentType = {
  imageUrl: string;
  text: string;
  actionNode: React.ReactNode;
};

const App = () => {
  const [content, setContent] = useState<ContentType>({
    imageUrl:
      'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
    text: 'Ant Design X',
    actionNode: <>Click Me</>,
  });

  return (
    <div style={{ height: 100 }}>
      <Bubble<ContentType>
        typing
        content={content}
        messageRender={(content) => {
          return (
            <Flex gap="middle" align="center">
              <Image height={50} src={content.imageUrl} />
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>{content.text}</span>
            </Flex>
          );
        }}
        avatar={{ icon: <UserOutlined /> }}
        footer={(content) => {
          return (
            <Button
              onClick={() => {
                setContent((ori) => ({
                  ...ori,
                  actionNode: <>🎉 Happy Ant Design X !</>,
                }));
              }}
              type="text"
            >
              {content?.actionNode}
            </Button>
          );
        }}
      />
    </div>
  );
};

export default App;
