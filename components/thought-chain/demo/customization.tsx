import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  HourglassOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { Card, Typography, Button } from 'antd';

const { Title, Paragraph, Text } = Typography;

const mockContent = (
  <Typography>
    <Title>Introduction</Title>

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
      .
    </Paragraph>
  </Typography>
);

const items: ThoughtChainProps['items'] = [
  {
    key: 'ThoughtChainItem1',
    status: 'success',
    title: 'Thought Chain Item Title',
    description: 'description',
    icon: <CheckCircleOutlined />,
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: mockContent,
    footer: <Button block>Thought Chain Item Footer</Button>,
  },
  {
    key: 'ThoughtChainItem2',
    status: 'success',
    title: 'Thought Chain Item Title',
    description: 'description',
    icon: <CheckCircleOutlined />,
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: mockContent,
    footer: <Button block>Thought Chain Item Footer</Button>,
  },
  {
    key: 'ThoughtChainItem3',
    status: 'error',
    title: 'Thought Chain Item Title',
    description: 'description',
    icon: <CloseCircleOutlined />,
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: mockContent,
  },
  {
    key: 'ThoughtChainItem4',
    status: 'pending',
    title: 'Thought Chain Item Title',
    description: 'description',
    icon: <HourglassOutlined />,
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: mockContent,
  },
  {
    key: 'ThoughtChainItem5',
    status: 'pending',
    title: 'Thought Chain Item Title',
    description: 'description',
    icon: <HourglassOutlined />,
    extra: <Button type="text" icon={<MoreOutlined />} />,
    content: mockContent,
  },
];

export default () => (
  <Card style={{ width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
