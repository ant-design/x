import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/dark.css';
import { useIntl } from 'react-intl';
import { Adx_Markdown_En, Adx_Markdown_Zh } from '../_utils/adx-markdown';

const App = () => {
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Adx_Markdown_Zh : Adx_Markdown_En;
  return (
    <div style={{ background: '#000', padding: 16, borderRadius: 6 }}>
      <XMarkdown content={content} className="x-markdown-dark" />
    </div>
  );
};

export default App;
