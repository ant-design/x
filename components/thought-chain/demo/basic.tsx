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
  },
  {
    key: 'ThoughtChainItem2',
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
  {
    key: 'ThoughtChainItem3',
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },

  {
    key: 'ThoughtChainItem4',
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
];

export default () => (
  <Card style={{width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
