import { DeleteOutlined, EditOutlined, PlusSquareOutlined, StopOutlined } from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { theme } from 'antd';
import type { GetProp } from 'antd';
import React from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const App: React.FC = () => {
  const { token } = theme.useToken();

  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    trigger: (menuInfo) => (
      <PlusSquareOutlined
        onClick={() => {
          console.log(`Click ${conversation.key} - ${menuInfo.key}`);
        }}
      />
    ),
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
      menuInfo.domEvent.stopPropagation();
      console.log(`Click ${conversation.key} - ${menuInfo.key}`);
    },
  });

  return <Conversations defaultActiveKey="item1" menu={menuConfig} items={items} style={style} />;
};

export default () => <App />;
