import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, type AttachmentsProps } from '@ant-design/x';
import { App, Button, Flex, Result, Space, Switch, theme } from 'antd';
import React from 'react';

const Demo = () => {
  const { message } = App.useApp();

  const { token } = theme.useToken();

  const [items, setItems] = React.useState<AttachmentsProps['items']>([]);

  const sharedBorderStyle: React.CSSProperties = {
    border: `${token.lineWidthBold}px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadius,
    overflow: 'hidden',
  };

  const sharedAttachmentProps: AttachmentsProps = {
    beforeUpload: () => false,
    items,
    onChange: ({ file, fileList }) => {
      message.info(`Mock upload: ${file.name}`);
      setItems(fileList);
    },
  };

  return (
    <Flex vertical gap="middle">
      <div style={sharedBorderStyle}>
        <Attachments
          {...sharedAttachmentProps}
          placeholder={{
            icon: <CloudUploadOutlined />,
            title: 'Drag & Drop files here',
            description: 'Support file type: image, video, audio, document, etc.',
          }}
        />
      </div>

      <div style={sharedBorderStyle}>
        <Attachments
          {...sharedAttachmentProps}
          placeholder={
            <Result
              title="Custom Placeholder Node"
              icon={<CloudUploadOutlined />}
              extra={<Button type="primary">Do Upload</Button>}
            />
          }
        />
      </div>
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
