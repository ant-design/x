import { ApiOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons';
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
      autoSize={{ minRows: 2, maxRows: 6 }}
      placeholder="Press Enter to send message"
      footer={({ components }) => {
        const { SendButton, LoadingButton, SpeechButton } = components;
        return (
          <Flex justify="space-between" align="center">
            <Flex gap="small" align="center">
              <Button style={iconStyle} type="text" icon={<LinkOutlined />} />
              <Divider orientation="vertical" />
              Deep Thinking
              <Switch size="small" />
              <Divider orientation="vertical" />
              <Button icon={<SearchOutlined />}>Global Search</Button>
            </Flex>
            <Flex align="center">
              <Button type="text" style={iconStyle} icon={<ApiOutlined />} />
              <Divider orientation="vertical" />
              <SpeechButton style={iconStyle} />
              <Divider orientation="vertical" />
              {loading ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" disabled={false} />
              )}
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
      actions={false}
    />
  );
};

export default App;
