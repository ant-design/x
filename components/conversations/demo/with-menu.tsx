import React from 'react';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { EditOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { Card, type GetProp, App } from 'antd';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const Demo = () => {
  const { message } = App.useApp();

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Operation 1',
        key: 'operation1',
        icon: <EditOutlined />,
      },
      {
        label: 'Operation 2',
        key: 'operation2',
        icon: <StopOutlined />,
        disabled: true,
      },
      {
        label: 'Operation 3',
        key: 'operation3',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      message.info(`Click ${conversation.key} - ${menuInfo.key}`);
    },
  });

  return (
    <Card style={{ width: 320 }} size="small">
      <Conversations menu={menuConfig} defaultActiveKey="demo3" items={items} />
    </Card>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
