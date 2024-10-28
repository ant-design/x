import { CloudUploadOutlined } from '@ant-design/icons';
import { Attachments, type AttachmentsProps } from '@ant-design/x';
import { Divider, Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const placeholderLocales = {
  cn: { placeholder: '占位符' },
  en: {
    placeholder: 'Placeholder',
  },
};
const withItemLocales = {
  cn: { list: '列表容器', item: '列表项' },
  en: {
    list: 'List container',
    item: 'List item',
  },
};

const items: AttachmentsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

const App: React.FC = () => {
  const [placeholderLocale] = useLocale(placeholderLocales);
  const [withItemLocale] = useLocale(withItemLocales);

  return (
    <Flex vertical>
      <SemanticPreview semantics={[{ name: 'placeholder', desc: placeholderLocale.placeholder }]}>
        <Attachments
          placeholder={{
            icon: <CloudUploadOutlined />,
            title: 'Upload File',
            description: 'Drag or click to upload file.',
          }}
        />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview
        semantics={[
          { name: 'list', desc: withItemLocale.list },
          { name: 'item', desc: withItemLocale.item },
        ]}
      >
        <Attachments items={items} />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
