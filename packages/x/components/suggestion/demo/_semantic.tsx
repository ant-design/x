import { OpenAIFilled } from '@ant-design/icons';
import { Sender, Suggestion } from '@ant-design/x';
import { Flex, GetProp } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    content: '标题容器',
    popup: '列表容器',
  },
  en: {
    root: 'Root',
    content: 'Content',
    popup: 'Popup',
  },
};

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      {
        label: 'About React',
        value: 'react',
      },
      {
        label: 'About Ant Design',
        value: 'antd',
      },
    ],
  },
];

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <Flex vertical>
      <SemanticPreview
        height={300}
        componentName="Suggestion"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'content', desc: locale.content },
          { name: 'popup', desc: locale.popup },
        ]}
      >
        <Suggestion
          open={true}
          getPopupContainer={(triggerNode) => triggerNode.parentElement!}
          items={suggestions}
        >
          {({ onKeyDown }) => {
            return <Sender onKeyDown={onKeyDown} placeholder="输入 / 获取建议" />;
          }}
        </Suggestion>
      </SemanticPreview>
    </Flex>
  );
};

export default App;
