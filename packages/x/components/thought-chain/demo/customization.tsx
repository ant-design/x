import { CodeOutlined, EditOutlined, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { Think, ThoughtChain } from '@ant-design/x';
import { Button, Card, Flex, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;
const items: ThoughtChainItem[] = [
  {
    title: 'Create Task',
    description: 'description',
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    footer: <Button block>Thought Chain Item Footer</Button>,
    content: (
      <Flex gap="small" vertical>
        <Think title="Thinking Process">
          {`1. Analyze task, understand task workflow\n2. Task creation, files needed for task\n3. Task execution, using new component`}
        </Think>
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
        <Text type="secondary">Creating Chinese documentation file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Continue creating file"
          description="component/index.zh-CN.md"
        />
        <Text type="secondary">Creating English description file for new component</Text>
        <ThoughtChain.Item
          variant="solid"
          icon={<EditOutlined />}
          title="Continue creating file"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
  },
  {
    key: 'check_task',
    title: 'Check Task Execution Steps Completion',
    icon: <SmileTwoTone />,
    collapsible: true,
    description: 'Verify the overall task execution logic and feasibility',
    content: (
      <Flex gap="small" vertical>
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="Folder creation completed"
          description="component"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.tsx"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.zh-CN.md"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
  },
  {
    key: 'used_task',
    title: 'Checking Task Execution Steps',
    description: 'Verify the overall task execution logic and feasibility',
    content: (
      <Flex gap="small" vertical>
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="Folder creation completed"
          description="component"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.tsx"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.zh-CN.md"
        />
        <ThoughtChain.Item
          variant="solid"
          status="success"
          title="File creation completed"
          description="component/index.en-US.md"
        />
      </Flex>
    ),
    status: 'error',
  },
];

const App: React.FC = () => {
  return (
    <Card style={{ width: 500 }}>
      <ThoughtChain items={items} line="dashed" />
    </Card>
  );
};

export default App;
