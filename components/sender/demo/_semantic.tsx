import { SmileOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Flex } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    prefix: '前缀',
    input: '输入框',
    actions: '操作列表',
  },
  en: {
    prefix: 'Prefix',
    input: 'Input',
    actions: 'Action List',
  },
};

const headerLocales = {
  cn: {
    header: '头部',
    content: '内容',
  },
  en: {
    header: 'Header',
    content: 'Content',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [headerLocale] = useLocale(headerLocales);

  return (
    <Flex vertical>
      {/* Basic */}
      <SemanticPreview
        semantics={[
          { name: 'prefix', desc: locale.prefix },
          { name: 'input', desc: locale.input },
          { name: 'actions', desc: locale.actions },
        ]}
      >
        <Sender prefix={<Button type="text" icon={<SmileOutlined />} />} />
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      {/* With Header */}
      <SemanticPreview
        semantics={[
          { name: 'header', desc: headerLocale.header },
          { name: 'content', desc: headerLocale.content },
        ]}
      >
        {(injectProps) => (
          <Sender
            header={
              <Sender.Header open title="Header" {...injectProps}>
                Content
              </Sender.Header>
            }
          />
        )}
      </SemanticPreview>
    </Flex>
  );
};

export default App;
