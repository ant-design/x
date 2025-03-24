import {
  ApiOutlined,
  DeploymentUnitOutlined,
  LinkOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Flex, Switch, theme } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();

  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };

  const footer = () => {
    return (
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          <Button icon={<DeploymentUnitOutlined />}>
            Deep Thinking
            <Switch size="small" />
          </Button>
          <Button icon={<SearchOutlined />}>
            Global Search
            <Switch size="small" />
          </Button>
        </Flex>
        <Flex align="center">
          <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
          <Divider type="vertical" />
        </Flex>
      </Flex>
    );
  };
  return (
    <Sender
      prefix={<Button style={iconStyle} type="text" icon={<LinkOutlined />} />}
      placeholder="Press Shift + Enter to send message"
      footer={footer}
      onSubmit={() => {
        console.log('Send message successfully!');
      }}
    />
  );
};

export default App;
