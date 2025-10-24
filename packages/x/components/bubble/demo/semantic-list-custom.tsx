import { FrownOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { GetProp, GetRef } from 'antd';
import { Button, Flex, Spin } from 'antd';
import React from 'react';

const roles: GetProp<typeof Bubble.List, 'role'> = {
  ai: {
    placement: 'start',
    typing: { effect: 'typing', step: 5, interval: 20 },
    loadingRender: () => (
      <Flex align="center" gap="small">
        <Spin size="small" />
        Custom loading...
      </Flex>
    ),
  },
  user: {
    placement: 'end',
  },
};

const App = () => {
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  return (
    <Bubble.List
      ref={listRef}
      style={{ height: 500 }}
      role={roles}
      items={[
        {
          key: 'welcome',
          role: 'ai',
          content: 'Mock welcome content. '.repeat(10),
          components: {
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
          content: '',
        },
      ]}
    />
  );
};

export default App;
