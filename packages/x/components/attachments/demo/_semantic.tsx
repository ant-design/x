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
  cn: {
    root: '根节点',
    list: '列表容器',
    card: '文件卡片',
    file: '文件',
    upload: '上传按钮',
    icon: '文件图标',
    name: '文件名称',
    description: '文件描述',
  },
  en: {
    root: 'Root',
    list: 'List container',
    card: 'File Card',
    upload: 'Upload Btn',
    file: 'File',
    icon: 'File Icon',
    name: 'File Name',
    description: 'File Description',
  },
};

const items: AttachmentsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));
items.push({
  uid: 'xlsx',
  name: 'excel-file.xlsx',
  status: 'done',
  size: 31231,
});

const App: React.FC = () => {
  const [placeholderLocale] = useLocale(placeholderLocales);
  const [withItemLocale] = useLocale(withItemLocales);

  return (
    <Flex vertical>
      <SemanticPreview
        componentName="Attachments"
        semantics={[
          { name: 'root', desc: withItemLocale.root },
          { name: 'placeholder', desc: placeholderLocale.placeholder },
        ]}
      >
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
        componentName="Attachments"
        semantics={[
          { name: 'root', desc: withItemLocale.root },
          { name: 'list', desc: withItemLocale.list },
          { name: 'card', desc: withItemLocale.card },
          { name: 'file', desc: withItemLocale.file },
          { name: 'icon', desc: withItemLocale.icon },
          { name: 'name', desc: withItemLocale.name },
          { name: 'description', desc: withItemLocale.description },
          { name: 'upload', desc: withItemLocale.upload },
        ]}
      >
        <Attachments items={items} />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
