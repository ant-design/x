import type { TaskItem } from '@ant-design/x';
import { Task } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const items: TaskItem[] = [
  { id: 'pending', title: 'Index project files', status: 'pending', progress: 0 },
  {
    id: 'running',
    title: 'Analyze dependency graph',
    description: 'Scanning 128 modules',
    status: 'running',
    progress: 0.62,
  },
  {
    id: 'completed',
    title: 'Run validation checks',
    status: 'completed',
    result: { passed: 18, failed: 0 },
  },
  {
    id: 'failed',
    title: 'Publish preview',
    status: 'failed',
    progress: 0.8,
    error: { code: 'PREVIEW_TIMEOUT', message: 'Preview deployment timed out.' },
  },
  {
    id: 'cancelled',
    title: 'Generate screenshots',
    status: 'cancelled',
    reason: 'The run was cancelled by the user.',
  },
];

const App = () => (
  <Flex vertical gap={12}>
    {items.map((item) => (
      <Task key={item.id} item={item} />
    ))}
  </Flex>
);

export default App;
