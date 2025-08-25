import { GlobalOutlined } from '@ant-design/icons';
import { ThoughtChain } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    icon: '思维链图标',
    title: '思维链标题',
    description: '思维链节点描述',
  },
  en: {
    root: 'Root',
    title: 'Item Item',
    icon: 'Item Icon',
    description: 'Item Description',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="ThoughtChain"
      semantics={[
        {
          name: 'root',
          desc: locale.root,
        },
        {
          name: 'icon',
          desc: locale.icon,
        },
        {
          name: 'title',
          desc: locale.title,
        },
        {
          name: 'description',
          desc: locale.description,
        },
      ]}
    >
      <ThoughtChain.Item
        variant="solid"
        icon={<GlobalOutlined />}
        title="Opening Webpage"
        description="https://x.ant.design/docs/playground/copilot"
      />
    </SemanticPreview>
  );
};

export default App;
