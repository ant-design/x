import { XMarkdown } from '@ant-design/x-markdown';
import { Segmented } from 'antd';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { useIntl } from 'react-intl';
import { Theme_Markdown_En, Theme_Markdown_Zh } from '../_utils/theme-markdown';

const App = () => {
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? Theme_Markdown_Zh : Theme_Markdown_En;
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const className = mode === 'light' ? 'x-markdown-light' : 'x-markdown-dark';
  const containerStyle =
    mode === 'light'
      ? { background: '#ffffff', border: '1px solid rgba(5, 5, 5, 0.06)' }
      : { background: '#141414', border: '1px solid rgba(255, 255, 255, 0.14)' };

  return (
    <div>
      <Segmented<'light' | 'dark'>
        value={mode}
        onChange={setMode}
        options={[
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        style={{ marginBottom: 12 }}
      />
      <div style={{ ...containerStyle, padding: 16, borderRadius: 6 }}>
        <XMarkdown content={content} className={className} />
      </div>
    </div>
  );
};

export default App;
