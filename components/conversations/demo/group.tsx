import { Conversations, type ConversationsProps } from '@ant-design/x';
import { type GetProp, theme } from 'antd';
import React from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label:
    index === 0
      ? "This's Conversation Item 1, you can click me!"
      : `Conversation Item ${index + 1}`,
  disabled: index === 3,
  group: index === 3 ? 'Group2' : 'Group1',
}));

const App = () => {
  const { token } = theme.useToken();

  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  return <Conversations items={items} defaultActiveKey="item1" style={style} groupable />;
};

export default App;
