import {
  AntDesignOutlined,
  ApiOutlined,
  CodeOutlined,
  EditOutlined,
  OpenAIOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Dropdown, Flex, MenuProps, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';

const items: MenuProps['items'] = [
  {
    key: 'deep_search',
    icon: <SearchOutlined />,
    label: 'Deep Search',
  },
  {
    key: 'ai_code',
    label: 'AI Code',
    icon: <CodeOutlined />,
  },
  {
    key: 'ai_writing',
    label: 'Writing',
    icon: <EditOutlined />,
  },
];

const App: React.FC = () => {
  const [value, setValue] = useState<string>('Hello? this is X!');
  const [loading, setLoading] = useState<boolean>(false);
  const [deepThink, setDeepThink] = useState<boolean>(false);
  const { token } = theme.useToken();

  const iconStyle = {
    fontSize: 16,
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
                <Button
                  color={deepThink ? 'primary' : 'default'}
                  variant={deepThink ? 'solid' : 'outlined'}
                  onClick={() => setDeepThink((ori) => !ori)}
                  icon={<OpenAIOutlined />}
                >
                  Deep Think
                </Button>
                <Dropdown menu={{ items }}>
                  <Button icon={<AntDesignOutlined />}>Agent</Button>
                </Dropdown>
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
