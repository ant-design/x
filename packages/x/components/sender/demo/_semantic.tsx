import { SmileOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Divider, Flex, Typography } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    prefix: '前缀',
    input: '输入框',
    actions: '操作列表',
    footer: '底部',
  },
  en: {
    root: 'Root',
    prefix: 'Prefix',
    input: 'Input',
    actions: 'Action List',
    footer: 'Footer',
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
        componentName="Sender"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'prefix', desc: locale.prefix },
          { name: 'input', desc: locale.input },
          { name: 'actions', desc: locale.actions },
          { name: 'footer', desc: locale.footer },
        ]}
      >
        <Sender
          prefix={<Button type="text" icon={<SmileOutlined />} />}
          footer={() => (
            <Typography.Text type="secondary">
              Deep thinking can understand the intent behind.
            </Typography.Text>
          )}
        />
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      {/* With Header */}
      <SemanticPreview
        componentName="Sender"
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
