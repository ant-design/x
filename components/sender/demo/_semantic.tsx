import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';
import { Sender } from '@ant-design/x';

const locales = {
  cn: { input: '输入框', actions: '操作列表' },
  en: {
    input: 'Input',
    actions: 'Action List',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        { name: 'input', desc: locale.input },
        { name: 'actions', desc: locale.actions },
      ]}
    >
      <Sender />
    </SemanticPreview>
  );
};

export default App;
