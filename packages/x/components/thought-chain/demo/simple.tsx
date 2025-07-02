import { EditOutlined, GlobalOutlined, SearchOutlined, SunOutlined } from '@ant-design/icons';
import { ThoughtChain } from '@ant-design/x';
import { Flex, Typography } from 'antd';
import React from 'react';
const { Text } = Typography;

const onClick = () => {
  console.log('Item Click');
};

export default () => (
  <Flex vertical gap="middle">
    <Flex gap="small" wrap align="center">
      <Text>loading status:</Text>
      <ThoughtChain.Item variant="solid" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="outlined" status="loading" title="Tool Calling" />
      <ThoughtChain.Item variant="text" status="loading" title="Tool Calling" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>success status:</Text>
      <ThoughtChain.Item variant="solid" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="outlined" status="success" title="Tool Call Finished" />
      <ThoughtChain.Item variant="text" status="success" title="Tool Call Finished" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>error status:</Text>
      <ThoughtChain.Item variant="solid" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="outlined" status="error" title="Tool Call Error" />
      <ThoughtChain.Item variant="text" status="error" title="Tool Call Error" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>abort status</Text>
      <ThoughtChain.Item variant="solid" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="outlined" status="abort" title="Agent Response Aborted" />
      <ThoughtChain.Item variant="text" status="abort" title="Agent Response Aborted" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>custom icon:</Text>
      <ThoughtChain.Item variant="solid" icon={<SunOutlined />} title="Task Completed" />
      <ThoughtChain.Item variant="outlined" icon={<SunOutlined />} title="Task Completed" />
      <ThoughtChain.Item variant="text" icon={<SunOutlined />} title="Task Completed" />
    </Flex>

    <Flex gap="small" wrap align="center">
      <Text>description:</Text>
      <ThoughtChain.Item
        variant="solid"
        onClick={onClick}
        icon={<GlobalOutlined />}
        title="Opening Webpage"
        description="https://x.ant.design/docs/playground/copilot"
      />
      <ThoughtChain.Item
        variant="outlined"
        onClick={onClick}
        icon={<EditOutlined />}
        title="Creating"
        description="todo.md"
      />
      <ThoughtChain.Item
        variant="text"
        onClick={onClick}
        icon={<SearchOutlined />}
        title="Searching"
        description="Route Information"
      />
    </Flex>
  </Flex>
);
