import { ApiOutlined, PaperClipOutlined, SearchOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Flex, message, Switch, theme } from 'antd';
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [value, setValue] = useState<string>('Hello? this is X!');
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = theme.useToken();

  const iconStyle = {
    fontSize: 18,
    color: token.colorText,
  };

  // Mock send message
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        message.success('Send message successfully!');
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    <Flex vertical gap="middle">
      <Sender
        loading={loading}
        value={value}
        footer={(actionNode) => {
          return (
            <Flex justify="space-between" align="center">
              <Flex gap="small" align="center">
                <Button style={iconStyle} type="text" icon={<PaperClipOutlined />} />
                Deep Thinking
                <Switch size="small" />
                <Button icon={<SearchOutlined />}>Global Search</Button>
              </Flex>
              <Flex align="center">
                <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
                <Divider orientation="vertical" />
                {actionNode}
              </Flex>
            </Flex>
          );
        }}
        suffix={false}
        onChange={(v) => {
          setValue(v);
        }}
        onSubmit={() => {
          setValue('');
          setLoading(true);
          message.info('Send message!');
        }}
        onCancel={() => {
          setLoading(false);
          message.error('Cancel sending!');
        }}
        autoSize={{ minRows: 2, maxRows: 6 }}
      />
    </Flex>
  );
};

export default () => <App />;
