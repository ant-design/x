import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

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
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
  {
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
];

export default () => (
  <Card style={{ width: 500 }}>
    <ThoughtChain items={items} collapsible />
  </Card>
);
