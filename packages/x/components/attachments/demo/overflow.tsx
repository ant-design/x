import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, type AttachmentsProps } from '@ant-design/x';
import { Flex, GetProp, Segmented, Switch } from 'antd';
import React from 'react';

const presetFiles: AttachmentsProps['items'] = Array.from({ length: 30 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

const Demo = () => {
  const [overflow, setOverflow] = React.useState<AttachmentsProps['overflow']>('wrap');
  const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>(presetFiles);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <Flex vertical gap="middle">
      <Flex gap="middle" align="center">
        <Segmented
          options={[
            { value: 'wrap', label: 'Wrap' },
            { value: 'scrollX', label: 'Scroll X' },
            { value: 'scrollY', label: 'Scroll Y' },
          ]}
          value={overflow}
          onChange={setOverflow}
          style={{ marginInlineEnd: 'auto' }}
        />
        <Switch
          checked={items.length !== 0}
          onChange={() => setItems((prev) => (prev.length ? [] : presetFiles))}
          checkedChildren="Data"
          unCheckedChildren="Data"
        />
        <Switch
          checked={disabled}
          onChange={setDisabled}
          checkedChildren="Disabled"
          unCheckedChildren="Disabled"
        />
      </Flex>
      <Attachments
        overflow={overflow}
        items={items}
        onChange={(info) => setItems(info.fileList)}
        beforeUpload={() => false}
        placeholder={{
          icon: <CloudUploadOutlined />,
          title: 'Click or Drop files here',
          description: 'Support file type: image, video, audio, document, etc.',
        }}
        disabled={disabled}
      />
    </Flex>
  );
};

export default Demo;
