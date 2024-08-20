import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import { Card } from 'antd';

const items: ThoughtChainProps['items'] = [
  {
    key: 'ThoughtChainItem1',
    title: 'Success - Thought Chain Item',
    status: 'success',
  },
  {
    key: 'ThoughtChainItem2',
    title: 'Success - Thought Chain Item',
    status: 'success',
  },
  {
    key: 'ThoughtChainItem3',
    title: 'Error - Thought Chain Item',
    status: 'error',
  },
  {
    key: 'ThoughtChainItem4',
    title: 'Error - Thought Chain Item',
    status: 'error',
  },
  {
    key: 'ThoughtChainItem5',
    title: 'Pending - Thought Chain Item',
    status: 'pending',
  },
  {
    key: 'ThoughtChainItem5',
    title: 'Pending - Thought Chain Item',
    status: 'pending',
  },
];

export default () => (
  <Card style={{width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
