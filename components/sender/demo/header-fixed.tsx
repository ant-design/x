import { EnterOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { App, Flex, Space, Switch, Typography } from 'antd';
import React from 'react';

const Demo: React.FC = () => {
  const { message } = App.useApp();
  const [hasRef, setHasRef] = React.useState(true);

  const headerNode = (
    <Sender.Header
      open={hasRef}
      title={
        <Space>
          <EnterOutlined />
          <Typography.Text type="secondary">"Tell more about Ant Design X"</Typography.Text>
        </Space>
      }
      onOpenChange={setHasRef}
    />
  );

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Switch
        checked={hasRef}
        onChange={() => setHasRef(!hasRef)}
        checkedChildren="With Reference"
        unCheckedChildren="With Reference"
      />
      <Sender
        header={headerNode}
        onSubmit={() => {
          message.success('Send message successfully!');
        }}
      />
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
