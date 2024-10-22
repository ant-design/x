import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, Sender } from '@ant-design/x';
import { App, Button, Flex, Space, Switch, theme } from 'antd';
import React from 'react';

const Demo = () => {
  const [open, setOpen] = React.useState(true);
  const { token } = theme.useToken();

  const senderRef = React.useRef<HTMLDivElement>(null);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={open}
      onOpenChange={setOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        // Mock not real upload file
        beforeUpload={() => false}
        placeholder={{
          icon: <CloudUploadOutlined />,
          title: 'Upload files',
          description: 'Click or drag files to this area to upload',
        }}
        getDropContainer={() => senderRef.current}
      />
    </Sender.Header>
  );

  return (
    <Flex style={{ height: 300 }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={<Button onClick={() => setOpen(!open)} type="text" icon={<LinkOutlined />} />}
      />
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
