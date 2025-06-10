import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import { Card, Tag } from 'antd';
import React from 'react';

const App = () => {
  const conversationsText = (
    <div style={{ marginBottom: 10 }}>
      You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>
    </div>
  );
  return (
    <>
      {conversationsText}
      <Card>
        <Conversations
          style={{ width: 200 }}
          defaultActiveKey="write"
          shortcutKeys={{
            items: ['Alt', 'number'],
          }}
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
      </Card>
    </>
  );
};

export default App;
