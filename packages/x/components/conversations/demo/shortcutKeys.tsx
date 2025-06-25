import {
  CodeOutlined,
  CodeSandboxOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Conversations, ConversationsProps } from '@ant-design/x';
import { Flex, Tag, theme } from 'antd';
import type { GetProp } from 'antd';
import KeyCode from 'rc-util/lib/KeyCode';
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
    key: 'inDepthResearch',
    label: 'In-depth research',
    group: 'More Features',
  },
  {
    key: 'vincentFigure',
    label: 'Vincent Figure',
    group: 'More Features',
  },
  {
    type: 'divider',
  },
];

const conversationsText = (
  <div style={{ marginBottom: 16 }}>
    You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>, and create
    new chat using the shortcut key: <Tag>Win/⌘</Tag> + <Tag>K</Tag>.
  </div>
);

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
    <>
      {conversationsText}
      <Conversations
        creation={{
          onClick: newChatClick,
        }}
        style={style}
        defaultActiveKey="write"
        onActiveChange={(value) => {
          console.log(value);
        }}
        shortcutKeys={{
          creation: ['Meta', KeyCode.K],
          items: ['Alt', 'number'],
        }}
        groupable={{
          label: (group) => {
            return group !== 'Today' ? (
              <Flex gap="small">
                <CodeSandboxOutlined />
                {group}
              </Flex>
            ) : (
              group
            );
          },
          collapsible: (group) => {
            return group !== 'Today';
          },
        }}
        items={items}
      />
    </>
  );
};

export default App;
