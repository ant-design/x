import { FrownOutlined, SmileOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Flex } from 'antd';
import type { GetProp, GetRef } from 'antd';
import React from 'react';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
      marginInlineEnd: 44,
    },
    styles: {
      footer: {
        width: '100%',
      },
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);

  return (
    <Bubble.List
      ref={listRef}
      style={{ maxHeight: 300 }}
      roles={roles}
      items={[
        {
          key: 'welcome',
          role: 'ai',
          content: 'Mock welcome content. '.repeat(10),
          footer: (
            <Flex>
              <Button
                size="small"
                type="text"
                icon={<SyncOutlined />}
                style={{ marginInlineEnd: 'auto' }}
              />
              <Button size="small" type="text" icon={<SmileOutlined />} />
              <Button size="small" type="text" icon={<FrownOutlined />} />
            </Flex>
          ),
        },
        {
          key: 'ask',
          role: 'user',
          content: 'Mock user content.',
        },
        {
          key: 'ai',
          role: 'ai',
          loading: true,
        },
      ]}
    />
  );
};

export default App;
