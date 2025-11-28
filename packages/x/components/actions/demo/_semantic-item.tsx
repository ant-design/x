import { ShareAltOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import { Divider } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    default: '默认图标',
    loading: '加载图标',
    running: '运行图标',
    error: '错误图标',
  },
  en: {
    root: 'Root',
    default: 'Default',
    loading: 'Loading',
    running: 'Running',
    error: 'Error',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <>
      <SemanticPreview
        componentName="Actions"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'default', desc: locale.default },
        ]}
      >
        <Actions.Item defaultIcon={<ShareAltOutlined />} />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview
        componentName="Actions"
        semantics={[{ name: 'loading', desc: locale.loading }]}
      >
        <Actions.Item defaultIcon={<ShareAltOutlined />} status="loading" />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview
        componentName="Actions"
        semantics={[{ name: 'running', desc: locale.running }]}
      >
        <Actions.Item defaultIcon={<ShareAltOutlined />} status="running" />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview componentName="Actions" semantics={[{ name: 'error', desc: locale.error }]}>
        <Actions.Item defaultIcon={<ShareAltOutlined />} status="error" />
      </SemanticPreview>
    </>
  );
};

export default App;
