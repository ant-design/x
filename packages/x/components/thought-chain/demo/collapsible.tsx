import type { ThoughtChainProps } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Flex, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

import { CodeOutlined, EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Write New Component',
    description: 'Execute files needed for creating new component',
    collapsible: true,
    content: (
      <Flex gap="small" vertical>
        <Text type="secondary">Creating folder for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<CodeOutlined />}
          title="Executing command"
          description="mkdir -p component"
        />
        <Text type="secondary">Creating files needed for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.tsx"
        />
        <Text type="secondary">Creating Chinese description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.zh-CN.md"
        />
        <Text type="secondary">Creating English description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Creating file"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
    status: 'success',
  },
  {
    key: 'check_task',
    title: 'Checking Task Execution Steps',
    description: 'Verify overall task execution logic and feasibility',
    content: (
      <Flex gap="small" vertical>
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="Folder created"
          description="component"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File created"
          description="component/index.tsx"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File created"
          description="component/index.zh-CN.md"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File created"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
    status: 'loading',
  },
];

const App: React.FC = () => {
  return (
    <Card style={{ width: 500 }}>
      <ThoughtChain defaultExpandedKeys={['create_task']} items={items} />
    </Card>
  );
};

export default App;
