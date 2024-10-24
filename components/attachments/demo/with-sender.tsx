import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, Button, Flex, type GetProp, Typography } from 'antd';
import React from 'react';

const Demo = () => {
  const [open, setOpen] = React.useState(true);
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = React.useState('');

  const { notification } = App.useApp();

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
    <Flex style={{ minHeight: 250 }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={<Button onClick={() => setOpen(!open)} type="text" icon={<LinkOutlined />} />}
        value={text}
        onChange={setText}
        onSubmit={() => {
          notification.info({
            message: 'Mock Submit',
            description: (
              <Typography>
                <ul>
                  <li>You said: {text}</li>
                  <li>
                    Attachments count: {items.length}
                    <ul>
                      {items.map((item) => (
                        <li key={item.uid}>{item.name}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </Typography>
            ),
          });

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
