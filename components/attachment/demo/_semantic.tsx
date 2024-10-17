import { BulbOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons';
import { Prompts, type PromptsProps } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: { title: '标题容器', list: '列表容器', item: '列表项', itemContent: '列表项内容' },
  en: {
    title: 'Title container',
    list: 'List container',
    item: 'List item',
    itemContent: 'List item content',
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

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        { name: 'title', desc: locale.title },
        { name: 'list', desc: locale.list },
        { name: 'item', desc: locale.item },
        { name: 'itemContent', desc: locale.itemContent },
      ]}
    >
      <Prompts title="✨ Inspirational Sparks and Marvelous Tips" items={items} />
    </SemanticPreview>
  );
};

export default App;
