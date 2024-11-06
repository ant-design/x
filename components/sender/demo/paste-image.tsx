import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, type GetProp, type GetRef } from 'antd';
import React from 'react';

const Demo = () => {
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = React.useState('');

  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

  const senderRef = React.useRef<HTMLDivElement>(null);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      styles={{
        content: {
          padding: 0,
        },
      }}
      closable={false}
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
        getDropContainer={() => senderRef.current}
      />
    </Sender.Header>
  );

  return (
    <Sender
      ref={senderRef}
      header={senderHeader}
      value={text}
      onChange={setText}
      onPasteFile={(file) => attachmentsRef.current?.upload(file)}
      onSubmit={() => {
        setItems([]);
        setText('');
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
