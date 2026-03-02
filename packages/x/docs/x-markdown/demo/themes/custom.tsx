import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { useIntl } from 'react-intl';
import { Theme_Markdown_En, Theme_Markdown_Zh } from '../_utils/theme-markdown';

const App = () => {
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Theme_Markdown_Zh : Theme_Markdown_En;

  const customVars = {
    '--primary-color': '#0f766e',
    '--primary-color-hover': '#0d9488',
    '--heading-color': '#0f172a',
    '--text-color': '#1f2937',
    '--light-bg': 'rgba(15, 118, 110, 0.08)',
    '--border-color': 'rgba(15, 23, 42, 0.12)',
  } as React.CSSProperties;

  return (
    <div style={{ background: '#ffffff', padding: 16, borderRadius: 6 }}>
      <XMarkdown
        content={content}
        className="x-markdown-light x-markdown-custom"
        style={customVars}
      />
    </div>
  );
};

export default App;
