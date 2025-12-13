import { FieldTimeOutlined } from '@ant-design/icons';
import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Flex, type GetProp, theme } from 'antd';
import React, { useState } from 'react';

const groupName = ['Today', 'Yesterday', 'Historical chats'];
const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 9 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  group: groupName[index % 3],
}));

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [expandedKeys, setExpandedKeys] = useState(['Yesterday']);
  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const groupable: GetProp<typeof Conversations, 'groupable'> = {
    label: (group) => {
      return (
        <Flex gap="small">
          <FieldTimeOutlined />
          {group}
        </Flex>
      );
    },
    collapsible: (group) => {
      return group !== 'Today';
    },
    expandedKeys: expandedKeys,
    onExpand: setExpandedKeys,
  };

  return (
    <Conversations items={items} defaultActiveKey="item1" style={style} groupable={groupable} />
  );
};

export default App;
