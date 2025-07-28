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
    suffix: '后缀',
    footer: '底部',
    switch: '开关',
  },
  en: {
    root: 'Root',
    prefix: 'Prefix',
    input: 'Input',
    suffix: 'Suffix',
    footer: 'Footer',
    switch: 'Switch',
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
          { name: 'suffix', desc: locale.suffix },
          { name: 'footer', desc: locale.footer },
          { name: 'switch', desc: locale.switch },
        ]}
      >
        <Sender
          prefix={<Button type="text" icon={<SmileOutlined />} />}
          footer={() => (
            <Flex gap="small" align="center">
              <Sender.Switch>Deep Search</Sender.Switch>
              <Typography.Text type="secondary">
                Deep thinking can understand the intent behind.
              </Typography.Text>
            </Flex>
          )}
        />
      </SemanticPreview>

      <Divider style={{ margin: 0, padding: 0 }} />

      {/* With Header */}
      <SemanticPreview
        componentName="Sender.Header"
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
