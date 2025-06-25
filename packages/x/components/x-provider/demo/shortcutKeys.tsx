import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations, XProvider } from '@ant-design/x';
import { Card, Flex, Tag, Typography } from 'antd';
import React from 'react';

export default () => {
  return (
    <>
      <Flex gap={12} style={{ marginBottom: 16 }} align="center">
        <Typography.Text>
          You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>
        </Typography.Text>
      </Flex>
      <Card>
        <XProvider
          conversations={{
            shortcutKeys: {
              items: ['Alt', 'number'],
            },
          }}
        >
          <Conversations
            style={{ width: 200 }}
            defaultActiveKey="write"
            items={[
              {
                key: 'write',
                label: 'Help Me Write',
                icon: <SignatureOutlined />,
              },
              {
                key: 'coding',
                label: 'AI Coding',
                icon: <CodeOutlined />,
              },
              {
                key: 'createImage',
                label: 'Create Image',
                icon: <FileImageOutlined />,
              },
              {
                key: 'deepSearch',
                label: 'Deep Search',
                icon: <FileSearchOutlined />,
              },
            ]}
          />
        </XProvider>
      </Card>
    </>
  );
};
