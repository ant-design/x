import React from 'react';
import { Button } from 'antd';
import { ThoughtChain } from '@ant-design/x';
import { CheckCircleOutlined, MoreOutlined } from '@ant-design/icons';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

import type { ThoughtChainProps, ThoughtChainItem } from '@ant-design/x';

const customizationProps: ThoughtChainItem = {
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  extra: <Button type="text" icon={<MoreOutlined />} />,
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
    item: '思维链节点',
    itemHeader: '思维链节点头部',
    itemContent: '思维链节点内容',
    itemFooter: '思维链节点页脚',
  },
  en: {
    item: 'Item',
    itemHeader: 'Item Header',
    itemContent: 'Item Content',
    itemFooter: 'Item Footer',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        {
          name: 'item',
          desc: locale.item,
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
