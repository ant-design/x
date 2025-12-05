import { Actions } from '@ant-design/x';
import { Divider } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
  },
  en: {
    root: 'Root',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview componentName="Actions" semantics={[{ name: 'root', desc: locale.root }]}>
        <Actions.Copy />
      </SemanticPreview>
    </>
  );
};

export default App;
