import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import type { GetProp } from 'antd';
import { theme } from 'antd';
import React, { useState } from 'react';

const agentItems: GetProp<ConversationsProps, 'items'> = [
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
  {
    type: 'divider',
  },
];

const App: React.FC = () => {
  const { token } = theme.useToken();
  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const [historicalItems, setHistoricalItems] = useState<GetProp<ConversationsProps, 'items'>>([
    {
      key: `item1`,
      label: 'Conversation Item 1',
      group: 'Today',
    },
  ]);

  const items = [...agentItems, ...historicalItems];

  const newChatClick = () => {
    setHistoricalItems((ori) => {
      return [
        ...ori,
        {
          key: `item${ori.length + 1}`,
          label: `Conversation Item ${ori.length + 1}`,
          group: 'Today',
        },
      ];
    });
  };

  return (
    <Conversations
      creation={{
        onClick: newChatClick,
      }}
      items={items}
      defaultActiveKey="write"
      style={style}
      groupable
    />
  );
};

export default App;
