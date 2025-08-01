import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, Badge, Button, Flex, type GetProp, type GetRef, Typography } from 'antd';
import React from 'react';

const Demo = () => {
  const [open, setOpen] = React.useState(true);
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = React.useState('');

  const { notification } = App.useApp();

  const senderRef = React.useRef<GetRef<typeof Sender>>(null);

  React.useEffect(() => {
    // Clear all created object URLs when the component is unmounted
    return () => {
      items.forEach((item) => {
        if (item.url?.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

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
        onChange={({ file, fileList }) => {
          const updatedFileList = fileList.map((item) => {
            if (item.uid === file.uid && file.status !== 'removed' && item.originFileObj) {
              // clear URL
              if (item.url?.startsWith('blob:')) {
                URL.revokeObjectURL(item.url);
              }
              // create new preview URL
              return {
                ...item,
                url: URL.createObjectURL(item.originFileObj),
              };
            }
            return item;
          });
          setItems(updatedFileList);
        }}
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
    <Flex style={{ minHeight: 250 }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={
          <Badge dot={items.length > 0 && !open}>
            <Button onClick={() => setOpen(!open)} icon={<LinkOutlined />} />
          </Badge>
        }
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
