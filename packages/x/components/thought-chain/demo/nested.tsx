import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';
import { Button, Card } from 'antd';
import React from 'react';

const items: ThoughtChainProps['items'] = [
  {
    title: '1 - Thought Chain Item',
    description: 'description',
    footer: <Button>1 - Thought Chain Item Footer</Button>,
    content: (
      <ThoughtChain
        items={[
          {
            title: '1-1 Thought Chain Item',
            description: 'description',
          },
          {
            title: '1-2 Thought Chain Item',
            description: 'description',
          },
        ]}
      />
    ),
  },
  {
    title: '2 - Thought Chain Item',
    description: 'description',
    footer: <Button>2 - Thought Chain Item Footer</Button>,
    content: (
      <ThoughtChain
        items={[
          {
            title: '2-1 Thought Chain Item',
            description: 'description',
          },
          {
            title: '2-2 Thought Chain Item',
            description: 'description',
          },
          {
            title: '2-3 Thought Chain Item',
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
