import type { ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { GetProp } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const Items: GetProp<ConversationsProps, 'items'> = [
  {
    key: 'write',
    label: 'Help Me Write',
  },
  {
    key: 'coding',
    label: 'AI Coding',
  },
  {
    key: 'createImage',
    label: 'Create Image',
  },
  {
    key: 'deepSearch',
    label: 'Deep Search',
  },
  {
    key: 'divider',
    type: 'divider',
  },
  {
    group: 'Today',
    key: 'today-1',
    label: 'Conversation Item 1',
  },
  {
    group: 'Today',
    key: 'today-2',
    label: 'Conversation Item 2',
  },
];

const locales = {
  cn: {
    root: '管理对话根节点',
    item: '管理对话子节点',
    creation: '创建对话',
    group: '管理对话分组',
  },
  en: {
    root: 'root',
    item: 'Item',
    creation: 'Creation',
    group: 'Group',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Conversations"
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
          name: 'creation',
          desc: locale.creation,
        },
        {
          name: 'group',
          desc: locale.group,
        },
      ]}
    >
      <Conversations
        style={{ width: 200 }}
        creation={{
          onClick: () => {},
        }}
        items={Items}
        defaultActiveKey="write"
        groupable
      />
    </SemanticPreview>
  );
};

export default App;
