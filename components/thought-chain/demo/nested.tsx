import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import { Card, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const items: ThoughtChainProps['items'] = [
  {
    title: '1 - Thought Chain Item',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    footer: (
      <Button block type="text">
        1 - Thought Chain Item Footer
      </Button>
    ),
    content: (
      <ThoughtChain
        items={[
          {
            title: '1-1 Thought Chain Item',
            description: 'description',
            extra: <Button type="text" icon={<MoreOutlined />} />,
          },
          {
            title: '1-2 Thought Chain Item',
            description: 'description',
            extra: <Button type="text" icon={<MoreOutlined />} />,
          },
        ]}
      />
    ),
  },
  {
    title: '2 - Thought Chain Item',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    footer: (
      <Button block type="text">
        2 - Thought Chain Item Footer
      </Button>
    ),
    content: (
      <ThoughtChain
        items={[
          {
            title: '2-1 Thought Chain Item',
            description: 'description',
            extra: <Button type="text" icon={<MoreOutlined />} />,
          },
          {
            title: '2-2 Thought Chain Item',
            description: 'description',
            extra: <Button type="text" icon={<MoreOutlined />} />,
          },
        ]}
      />
    ),
  },
];

export default () => (
  <Card style={{ width: '100%' }}>
    <ThoughtChain items={items} collapsible />
  </Card>
);
