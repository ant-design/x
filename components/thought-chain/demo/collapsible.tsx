import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';
import React from 'react';

import { Button, Card, Space, Typography } from 'antd';

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
    key: '1',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
  {
    key: '2',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
  {
    key: '3',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
  {
    key: '4',
    title: 'Click me to expand the content',
    description: 'Collapsible',
    content: mockContent,
  },
];

const keys: string[] = items.map((item) => (item.key ? item.key : '')).filter(Boolean);

export default () => {
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>(['2']);

  return (
    <Space align="start" size={16}>
      <Card
        style={{ width: 400 }}
        title={`受控组件: [${expandedKeys.toString()}]`}
        key={expandedKeys.toString()}
        extra={
          <Button
            type="primary"
            onClick={() => {
              const count = Math.floor(Math.random() * keys.length) + 1;
              const shuffled = [...keys].sort(() => 0.5 - Math.random());

              setExpandedKeys(shuffled.slice(0, count));
            }}
          >
            更新expandedKeys
          </Button>
        }
      >
        <ThoughtChain
          items={items}
          collapsible={{
            // items[0] key
            expandedKeys,
            onExpand: (keys) => {
              setExpandedKeys(keys);
            },
          }}
        />
      </Card>
      <Card style={{ width: 400 }} title="非受控组件">
        <ThoughtChain items={items} collapsible />
      </Card>
    </Space>
  );
};
