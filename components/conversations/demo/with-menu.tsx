import React from 'react';
import { Conversations } from '@ant-design/x';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';

const getConversationsData = () => {
  const data = [];

  for (let i = 1; i <= 5; i++) {
    data.push({
      key: `demo${i}`,
      label: `示例会话${i}`,
      timestamp: 1722321645932 + i,
      pinned: true,
    })
  }
  return data;
}

const menuItems = [
  {
    label: '重命名',
    key: 'mod',
    icon: <EditOutlined />,
  },
  {
    label: '删除',
    key: 'delete',
    icon: <DeleteOutlined />,
  },
];

const App = () => (
  <Conversations
    menu={{
      items: menuItems,
      onClick: (v) => {
        message.info(`${v.key} clicked`);
      },
    }}
    defaultActiveKey='demo1'
    data={getConversationsData()}
  />
);

export default App;
