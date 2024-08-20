import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import { Card, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const items: ThoughtChainProps['items'] = [
  {
    key: 'ThoughtChainItem1',
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: (
      <ThoughtChain
        items={[
          {
            key: 'ThoughtChainItem 1-1',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
          {
            key: 'ThoughtChainItem 1-2',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
          {
            key: 'ThoughtChainItem 1-3',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
        ]}
      />
    ),
  },
  {
    key: 'ThoughtChainItem2',
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: (
      <ThoughtChain
        items={[
          {
            key: 'ThoughtChainItem 2-1',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
          {
            key: 'ThoughtChainItem 2-2',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
          {
            key: 'ThoughtChainItem 2-3',
            title: 'Thought Chain Item Title',
            description: 'description',
          },
        ]}
      />
    ),
  },
];

export default () => (
  <Card style={{ width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
