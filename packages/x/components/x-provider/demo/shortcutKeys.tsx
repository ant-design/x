import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations, XProvider } from '@ant-design/x';
import { Card, Tag } from 'antd';
import React from 'react';

export default () => {
  const conversationsText = (
    <div style={{ marginBottom: 10 }}>
      You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>
    </div>
  );

  return (
    <>
      {conversationsText}
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
