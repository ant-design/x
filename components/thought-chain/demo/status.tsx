import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import { Card } from 'antd';

const items: ThoughtChainProps['items'] = [
  {
    title: 'Success - Thought Chain Item',
    status: 'success',
  },
  {
    title: 'Error - Thought Chain Item',
    status: 'error',
  },
  {
    title: 'Pending - Thought Chain Item',
    status: 'pending',
  },
];

export default () => (
  <Card style={{ width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
