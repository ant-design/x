import { CloudUploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, Button, Flex, type GetProp, type GetRef } from 'antd';
import React from 'react';

const Demo = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = React.useState('');

  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

  const senderRef = React.useRef<GetRef<typeof Sender>>(null);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open}
      onOpenChange={setOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        // Mock not real upload file
        beforeUpload={() => false}
        items={items}
        onChange={({ fileList }) => setItems(fileList)}
        placeholder={(type) =>
          type === 'drop'
            ? {
                title: 'Drop file here',
              }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
        getDropContainer={() => senderRef.current?.nativeElement}
      />
    </Sender.Header>
  );

  return (
    <Flex style={{ height: 220 }} align="end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={
          <Button
            type="text"
            style={{ fontSize: 16 }}
            icon={<PaperClipOutlined />}
            onClick={() => {
              setOpen(!open);
            }}
          />
        }
        value={text}
        onChange={setText}
        onPasteFile={(files) => {
          for (const file of files) {
            attachmentsRef.current?.upload(file);
          }
          setOpen(true);
        }}
        onSubmit={() => {
          setItems([]);
          setText('');
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
