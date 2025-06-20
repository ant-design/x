import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { theme } from 'antd';
import type { GetProp, MenuProps } from 'antd';

import React from 'react';

const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const menuItems: MenuProps['items'] = [
  {
    label: 'Rename',
    key: 'Rename',
    icon: <EditOutlined />,
  },
  {
    label: 'Share',
    key: 'Share',
    icon: <ShareAltOutlined />,
  },
  {
    type: 'divider',
  },
  {
    label: 'Archive',
    key: 'Archive',
    icon: <StopOutlined />,
    disabled: true,
  },
  {
    label: 'Delete Chat',
    key: 'deleteChat',
    icon: <DeleteOutlined />,
    danger: true,
  },
];

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  trigger:
    conversation.key === 'item2' ? (
      <ShareAltOutlined
        onClick={(e) => {
          e.stopPropagation();
          console.log(`Share ${conversation.key}`);
        }}
      />
    ) : (
      <PlusSquareOutlined
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    ),
  items: conversation.key !== 'item2' ? menuItems : [],
  onClick: (itemInfo) => {
    console.log(`Click ${conversation.key}-${itemInfo.key}`);
    itemInfo.domEvent.stopPropagation();
  },
});

const App: React.FC = () => {
  const { token } = theme.useToken();
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };
  return <Conversations defaultActiveKey="item1" menu={menuConfig} items={items} style={style} />;
};

export default App;
