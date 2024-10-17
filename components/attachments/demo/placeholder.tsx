import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, type AttachmentsProps } from '@ant-design/x';
import { App, Button, Flex, GetProp, Result, Space, Switch, theme } from 'antd';
import React from 'react';

const Demo = () => {
  const { message } = App.useApp();

  const { token } = theme.useToken();

  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);

  const sharedBorderStyle: React.CSSProperties = {
    borderRadius: token.borderRadius,
    overflow: 'hidden',
    background: token.colorBgContainer,
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
    <Flex
      vertical
      gap="middle"
      style={{
        padding: token.padding,
        background: token.colorBgContainerDisabled,
      }}
    >
      <div style={sharedBorderStyle}>
        <Attachments
          {...sharedAttachmentProps}
          placeholder={{
            icon: <CloudUploadOutlined />,
            title: 'Click or Drop files here',
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

      {!!items.length && <Button onClick={() => setItems([])}>Reset Files</Button>}
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
