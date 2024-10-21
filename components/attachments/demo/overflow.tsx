import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, type AttachmentsProps } from '@ant-design/x';
import { Flex, Segmented } from 'antd';
import React from 'react';

const presetFiles: AttachmentsProps['items'] = Array.from({ length: 30 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

const Demo = () => {
  const [overflow, setOverflow] = React.useState<AttachmentsProps['overflow']>('scrollX');

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Segmented
        options={[
          { value: 'wrap', label: 'Wrap' },
          { value: 'scrollX', label: 'Scroll X' },
          { value: 'scrollY', label: 'Scroll Y' },
        ]}
        value={overflow}
        onChange={setOverflow}
      />
      <Attachments
        overflow={overflow}
        items={presetFiles}
        beforeUpload={() => false}
        placeholder={{
          icon: <CloudUploadOutlined />,
          title: 'Click or Drop files here',
          description: 'Support file type: image, video, audio, document, etc.',
        }}
        disabled
      />
    </Flex>
  );
};

export default Demo;
