import { Conversations, type ConversationsProps } from '@ant-design/x';
import type { GetProp } from 'antd';
import { theme } from 'antd';
import React from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 6 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index === 0
      ? "This's Conversation Item 1, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
  group: index < 3 ? 'Today' : 'Yesterday',
}));

const groupable: GetProp<typeof Conversations, 'groupable'> = {
  label: (group, { groupInfo }) => (
    <>
      {group}({groupInfo.data.length})
    </>
  ),
  collapsible: true,
};

const App: React.FC = () => {
  const { token } = theme.useToken();

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return (
    <Conversations items={items} defaultActiveKey="item1" style={style} groupable={groupable} />
  );
};

export default App;
