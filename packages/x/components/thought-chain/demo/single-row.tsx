import type { ThoughtChainProps } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Flex, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

import { CodeOutlined, EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const contentStyles = {
  backgroundColor: 'rgba(0,0,0,.01)',
  borderRadius: 8,
  padding: 10,
  marginBlockStart: 10,
  border: '1px solid rgba(0,0,0,.04)',
};

const items: ThoughtChainProps['items'] = [
  {
    key: 'create_task',
    title: 'Create Task: Write New Component',
    icon: false,
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
  },
];

const App: React.FC = () => {
  return (
    <Card style={{ width: 500 }}>
      <ThoughtChain
        styles={{
          itemContent: contentStyles,
        }}
        defaultExpandedKeys={['create_task']}
        items={items}
      />
    </Card>
  );
};

export default App;
