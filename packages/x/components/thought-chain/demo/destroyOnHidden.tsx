import type { ThoughtChainProps } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Button, Card, Space, Switch } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['task1']);
  const [destroyOnHidden, setDestroyOnHidden] = useState(true);

  const items: ThoughtChainProps['items'] = [
    {
      key: 'task1',
      title: 'Collapsible Task',
      description: 'Content will be removed from DOM when collapsed',
      collapsible: true,
      destroyOnHidden,
      content: 'Task detail content.',
    },
    {
      key: 'task2',
      title: 'Normal Task',
      content: 'Task2 content.',
    },
  ];

  return (
    <Card style={{ width: 500 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setExpandedKeys(expandedKeys.includes('task1') ? [] : ['task1'])}>
          {expandedKeys.includes('task1') ? 'Collapse' : 'Expand'}
        </Button>
        <Switch
          checked={destroyOnHidden}
          onChange={setDestroyOnHidden}
          checkedChildren="destroyOnHidden"
          unCheckedChildren="keep"
        />
      </Space>
      <ThoughtChain items={items} expandedKeys={expandedKeys} onExpand={setExpandedKeys} />
    </Card>
  );
};

export default App;
