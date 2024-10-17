import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments } from '@ant-design/x';
import { App, Button, Space, Switch } from 'antd';
import React from 'react';

const Demo = () => {
  const { message } = App.useApp();

  const [fullScreenDrop, setFullScreenDrop] = React.useState(false);

  return (
    <Space>
      <Switch
        checked={fullScreenDrop}
        onChange={setFullScreenDrop}
        checkedChildren="Full screen drop"
        unCheckedChildren="Full screen drop"
      />
      <Attachments
        beforeUpload={() => false}
        onChange={({ file }) => {
          message.info(`Mock upload: ${file.name}`);
        }}
        getDropContainer={fullScreenDrop ? () => document.body : null}
        placeholder={{
          icon: <CloudUploadOutlined />,
          title: 'Drag & Drop files here',
          description: 'Support file type: image, video, audio, document, etc.',
        }}
      >
        <Button icon={<CloudUploadOutlined />}>{fullScreenDrop ? 'Click or Drop' : null}</Button>
      </Attachments>
    </Space>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
