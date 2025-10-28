import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileWordOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { App, Badge, Button, Dropdown, Flex, type GetProp, type GetRef, Typography } from 'antd';
import React, { useEffect } from 'react';

const MAX_COUNT = 5;

const Demo = () => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const [text, setText] = React.useState('');

  const { notification } = App.useApp();

  const senderRef = React.useRef<GetRef<typeof Sender>>(null);
  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

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
      closable={false}
      forceRender
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
        ref={attachmentsRef}
        multiple
        maxCount={MAX_COUNT}
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

  const acceptItem = [
    {
      key: 'image',
      label: (
        <Flex gap="small">
          <FileImageOutlined />
          <span>Image</span>
        </Flex>
      ),
    },
    {
      key: 'docs',
      label: (
        <Flex gap="small">
          <FileWordOutlined />
          <span>Docs</span>
        </Flex>
      ),
    },
  ];

  const selectFile = ({ key }: { key: string }) => {
    attachmentsRef?.current?.select({
      accept: key === 'image' ? '.png,.jpg,.jpeg' : '.doc,.docx',
      multiple: true,
    });
  };

  useEffect(() => {
    if (items.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [items.length]);

  return (
    <Flex style={{ minHeight: 250 }} align="flex-end">
      <Sender
        ref={senderRef}
        header={senderHeader}
        prefix={
          <Badge dot={items.length > 0 && !open}>
            <Dropdown
              trigger={['click']}
              menu={{ items: acceptItem, onClick: selectFile }}
              placement="topLeft"
              arrow={{ pointAtCenter: true }}
            >
              <Button disabled={items.length >= MAX_COUNT} type="text" icon={<LinkOutlined />} />
            </Dropdown>
          </Badge>
        }
        value={text}
        onChange={setText}
        onSubmit={() => {
          notification.info({
            title: 'Mock Submit',
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
