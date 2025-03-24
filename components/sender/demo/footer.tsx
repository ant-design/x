import {
  ApiOutlined,
  DeploymentUnitOutlined,
  LinkOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Flex, Switch, theme } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setValue('');
        console.log('Send message successfully!');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    <Sender
      value={value}
      onChange={setValue}
      placeholder="Press Shift + Enter to send message"
      footer={(info) => {
        const { SendButton, LoadingButton, SpeechButton } = info.actionsComponents;
        return (
          <Flex justify="space-between">
            <Flex gap="small" align="center">
              <Button style={iconStyle} type="text" icon={<LinkOutlined />} />
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
              <SpeechButton style={iconStyle} />
              <Divider type="vertical" />
              {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
            </Flex>
          </Flex>
        );
      }}
      onSubmit={() => {
        setLoading(true);
      }}
      onCancel={() => {
        setLoading(false);
      }}
      actions={null}
    />
  );
};

export default App;
