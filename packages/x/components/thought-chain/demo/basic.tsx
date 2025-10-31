import type { ThoughtChainProps } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Card } from 'antd';
import React from 'react';

const items: ThoughtChainProps['items'] = [
  {
    title: 'Knowledge Query',
    description: 'Query knowledge base',
  },
  {
    title: 'Web Search Tool Invoked',
    description: 'Tool invocation',
  },
  {
    title: 'Model Invocation Complete',
    description: 'Invoke model for response',
  },

  {
    title: 'Response Complete',
    description: 'Task completed',
    blink: true,
  },
];

export default () => (
  <Card style={{ width: 500 }}>
    <ThoughtChain items={items} />
  </Card>
);
