import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import { Card, Button, Segmented, Space } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },

  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: <Button type="text" icon={<MoreOutlined />} />,
  },
];

export default () => {
  const [size, setSize] = React.useState<'default' | 'small' | 'large'>('default');

  return (
    <Card style={{ width: 500 }}>
      <Space direction='vertical'>
        <Segmented
          onChange={setSize}
          value={size}
          options={[
            { label: 'Small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'Large', value: 'large' },
          ]}
        />
        <ThoughtChain items={items} size={size} />
      </Space>
    </Card>
  );
};
