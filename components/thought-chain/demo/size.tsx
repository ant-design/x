import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';
import React from 'react';

import { MoreOutlined } from '@ant-design/icons';
import { Button, Card, Radio } from 'antd';

import type { ConfigProviderProps } from 'antd';

type SizeType = ConfigProviderProps['componentSize'];

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
  // default size is 'middle'
  const [size, setSize] = React.useState<SizeType>('middle');

  return (
    <Card style={{ width: 500 }}>
      <Radio.Group
        value={size}
        onChange={(e) => setSize(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="large">Large</Radio.Button>
        <Radio.Button value="middle">Default</Radio.Button>
        <Radio.Button value="small">Small</Radio.Button>
      </Radio.Group>
      <ThoughtChain items={items} size={size} />
    </Card>
  );
};
