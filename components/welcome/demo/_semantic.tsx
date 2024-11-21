import { EllipsisOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Welcome } from '@ant-design/x';
import { Button, Space } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: { title: '标题容器', description: '描述容器', icon: '图标容器', extra: '额外内容' },
  en: {
    title: 'Title container',
    description: 'Description container',
    icon: 'Icon container',
    extra: 'Extra content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        { name: 'icon', desc: locale.icon },
        { name: 'title', desc: locale.title },
        { name: 'description', desc: locale.description },
        { name: 'extra', desc: locale.extra },
      ]}
    >
      <Welcome
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button size="small" icon={<ShareAltOutlined />} />
            <Button size="small" icon={<EllipsisOutlined />} />
          </Space>
        }
      />
    </SemanticPreview>
  );
};

export default App;
