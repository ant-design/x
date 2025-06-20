import { DeleteOutlined, EditOutlined, ShareAltOutlined, StopOutlined } from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import type { GetProp } from 'antd';
import { theme } from 'antd';
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

  const menuConfig: ConversationsProps['menu'] = {
    items: [
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
    ],
    onClick: (itemInfo) => {
      console.log(`Click ${itemInfo.key}`);
      itemInfo.domEvent.stopPropagation();
    },
  };

  return <Conversations defaultActiveKey="item1" menu={menuConfig} items={items} style={style} />;
};

export default App;
