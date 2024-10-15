import { SmileOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Flex } from 'antd';
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

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <Flex vertical gap="middle">
      <SemanticPreview
        semantics={[
          { name: 'prefix', desc: locale.prefix },
          { name: 'input', desc: locale.input },
          { name: 'actions', desc: locale.actions },
        ]}
      >
        <Sender prefix={<Button type="text" icon={<SmileOutlined />} />} />
      </SemanticPreview>
    </Flex>
  );
};

export default App;
