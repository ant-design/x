import { CheckCircleOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType, ThoughtChainProps } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const customizationProps: ThoughtChainItemType = {
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  footer: <Button block>Thought Chain Item Footer</Button>,
  content: 'Thought Chain Item Content',
};

const items: ThoughtChainProps['items'] = [
  {
    ...customizationProps,
    status: 'success',
  },
];

const locales = {
  cn: {
    root: '根节点',
    item: '思维链节点',
    itemIcon: '思维链图标',
    itemHeader: '思维链节点头部',
    itemContent: '思维链节点内容',
    itemFooter: '思维链节点页脚',
  },
  en: {
    root: 'Root',
    item: 'Item',
    itemIcon: 'Item Icon',
    itemHeader: 'Item Header',
    itemContent: 'Item Content',
    itemFooter: 'Item Footer',
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
          name: 'item',
          desc: locale.item,
        },
        {
          name: 'itemIcon',
          desc: locale.itemIcon,
        },
        {
          name: 'itemHeader',
          desc: locale.itemHeader,
        },
        {
          name: 'itemContent',
          desc: locale.itemContent,
        },
        {
          name: 'itemFooter',
          desc: locale.itemFooter,
        },
      ]}
    >
      <ThoughtChain items={items} />
    </SemanticPreview>
  );
};

export default App;
