import { BulbOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { Prompts, type PromptsProps } from '@ant-design/x';
import { Divider, Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    title: '标题容器',
    list: '列表容器',
    item: '列表项',
    itemContent: '列表项内容',
  },
  en: {
    root: 'Root',
    title: 'Title container',
    list: 'List container',
    item: 'List item',
    itemContent: 'List item content',
  },
};

const subLocales = {
  cn: { subList: '子列表容器', subItem: '子列表项' },
  en: {
    subList: 'Sub-list container',
    subItem: 'Sub-list item',
  },
};

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    label: 'Ignite Your Creativity',
    description: 'Got any sparks for a new project?',
    disabled: false,
  },
  {
    key: '2',
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
    label: 'Uncover Background Info',
    description: 'Help me understand the background of this topic.',
    disabled: false,
  },
  {
    key: '3',
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,
    label: 'Efficiency Boost Battle',
    description: 'How can I work faster and better?',
    disabled: false,
  },
];

const nestItems: PromptsProps['items'] = [
  {
    key: '1',
    label: '🔥 Ignite Your Creativity',
    children: [
      {
        key: '1-1',
        description: 'What sparks your creativity?',
      },
      {
        key: '1-2',
        description: 'How do you get inspired?',
      },
    ],
  },
  {
    key: '2',
    label: '🎨 Uncover Background Info',
    children: [
      {
        key: '2-1',
        description: 'What is the background of this topic?',
      },
      {
        key: '2-2',
        description: 'Why is this important?',
      },
    ],
  },
];

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [subLocale] = useLocale(subLocales);

  return (
    <Flex vertical>
      <SemanticPreview
        componentName="Prompts"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'title', desc: locale.title },
          { name: 'list', desc: locale.list },
          { name: 'item', desc: locale.item },
          { name: 'itemContent', desc: locale.itemContent },
        ]}
      >
        <Prompts title="✨ Inspirational Sparks and Marvelous Tips" items={items} />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview
        componentName="Prompts"
        semantics={[
          { name: 'subList', desc: subLocale.subList },
          { name: 'subItem', desc: subLocale.subItem },
        ]}
      >
        <Prompts title="✨ Nested Prompts" items={nestItems} />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
