import React from 'react';
import { Bubble } from '@ant-design/x';
import { UserOutlined } from '@ant-design/icons';
import { GetProp, Typography } from 'antd';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: true,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  app: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
  },
};

const App = () => {
  return (
    <Bubble.List
      roles={roles}
      items={[
        {
          key: 0,
          role: 'ai',
          content: 'Normal message',
        },
        {
          key: 1,
          role: 'ai',
          content: <Typography.Text type="danger">ReactNode message</Typography.Text>,
        },
        {
          key: 2,
          role: 'app',
          custom: {},
        },
      ]}
    />
  );
};

export default App;
