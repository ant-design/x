import { CloudUploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { AttachmentsProps } from '@ant-design/x';
import { Attachments, Sender } from '@ant-design/x';
import type { GetProp, GetRef } from 'antd';
import { Badge, Button, Flex, Tooltip } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
  const senderRef = React.useRef<GetRef<typeof Sender>>(null);
  const [value, setValue] = useState('');

  const submitDisabled = items.length === 0 && !value && !loading;

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
    <Flex style={{ height: 350 }} align="end">
      <Sender
        submitType="enter"
        ref={senderRef}
        header={senderHeader}
        value={value}
        onChange={setValue}
        placeholder="Enter to send message"
        prefix={
          <Badge dot={items.length > 0 && !open}>
            <Button
              type="text"
              onClick={() => setOpen(!open)}
              icon={<PaperClipOutlined style={{ fontSize: 16 }} />}
            />
          </Badge>
        }
        suffix={(_, info) => {
          const { SendButton, LoadingButton } = info.components;
          if (loading) {
            return (
              <Tooltip title="Click to cancel">
                <LoadingButton />
              </Tooltip>
            );
          }

          const node = <SendButton disabled={submitDisabled} />;
          return node;
        }}
        onSubmit={() => {
          setValue('');
          setItems([]);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }}
      />
    </Flex>
  );
};

export default App;
