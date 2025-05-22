import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';
import React, { useState } from 'react';

import { Card, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const mockContent = (
  <Typography>
    <Paragraph>
      In the process of internal desktop applications development, many different design specs and
      implementations would be involved, which might cause designers and developers difficulties and
      duplication and reduce the efficiency of development.
    </Paragraph>
    <Paragraph>
      After massive project practice and summaries, Ant Design, a design language for background
      applications, is refined by Ant UED Team, which aims to{' '}
      <Text strong>
        uniform the user interface specs for internal background projects, lower the unnecessary
        cost of design differences and implementation and liberate the resources of design and
        front-end development
      </Text>
    </Paragraph>
  </Typography>
);

const items: ThoughtChainProps['items'] = [
  {
    key: 'item-1',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
    status: 'success',
  },
  {
    key: 'item-2',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
    status: 'pending',
  },
];

const App: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState(['item-2']);

  const collapsible: ThoughtChainProps['collapsible'] = {
    expandedKeys,
    onExpand: (keys: string[]) => {
      setExpandedKeys(keys);
    },
  };
  return (
    <Card style={{ width: 500 }}>
      <ThoughtChain items={items} collapsible={collapsible} />
    </Card>
  );
};

export default App;
