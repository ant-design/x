import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, Sender } from '@ant-design/x';
import { App, Button, Flex, Switch } from 'antd';
import React from 'react';

const Demo = () => {
  const { message } = App.useApp();

  const [fullScreenDrop, setFullScreenDrop] = React.useState(false);
  const divRef = React.useRef<HTMLDivElement>(null);

  return (
    <Flex vertical gap="middle" align="flex-start" ref={divRef}>
      <Sender
        prefix={
          <Attachments
            beforeUpload={() => false}
            onChange={({ file }) => {
              message.info(`Mock upload: ${file.name}`);
            }}
            getDropContainer={() => (fullScreenDrop ? document.body : divRef.current)}
            placeholder={{
              icon: <CloudUploadOutlined />,
              title: 'Drag & Drop files here',
              description: 'Support file type: image, video, audio, document, etc.',
            }}
          >
            <Button type="text" icon={<LinkOutlined />} />
          </Attachments>
        }
      />

      <Switch
        checked={fullScreenDrop}
        onChange={setFullScreenDrop}
        checkedChildren="Full screen drop"
        unCheckedChildren="Full screen drop"
      />
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
