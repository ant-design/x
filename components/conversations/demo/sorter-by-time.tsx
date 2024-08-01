import React from 'react';
import { Conversations } from '@ant-design/x';

const getConversationsData = () => {
  const data = [];

  for (let i = 1; i <= 5; i++) {
    data.push({
      key: `demo${i}`,
      label: `示例会话${i}`,
      timestamp: 1722321645932 - i,
      pinned: i === 5,
    })
  }
  return data;
}

const App = () => (
  <Conversations
    sorter="TIME_ACS"
    data={getConversationsData()}
  />
);

export default App;
