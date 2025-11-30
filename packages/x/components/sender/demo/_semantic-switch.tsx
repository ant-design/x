import { SearchOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    icon: '图标',
    title: '标题',
    content: '内容',
  },
  en: {
    root: 'Root',
    icon: 'Icon',
    title: 'Title',
    content: 'Content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <Flex vertical>
      {/* Basic */}
      <SemanticPreview
        componentName="Sender.Switch"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'icon', desc: locale.icon },
          { name: 'title', desc: locale.title },
          { name: 'content', desc: locale.content },
        ]}
      >
        <Sender.Switch
          checkedChildren={'Deep Search: on'}
          unCheckedChildren={'Deep Search: off'}
          icon={<SearchOutlined />}
        />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
