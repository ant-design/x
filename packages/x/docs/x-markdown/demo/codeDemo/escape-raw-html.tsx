import { XMarkdown } from '@ant-design/x-markdown';
import { Space, Switch, theme } from 'antd';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const markdown = `
### Links & raw HTML

- [Ant Design](https://ant.design) · [GitHub](https://github.com)
- Reference: [docs][1]

[1]: https://ant.design/components/x-markdown

Raw HTML (when not escaped, is rendered as DOM):

<div>Block div</div>

<script>alert('script')</script>

<img src=x onerror="alert(1)">
`;

export default () => {
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const [escapeRawHtml, setEscapeRawHtml] = useState(true);
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true);

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 16 }}>
        <Space>
          <span>Escape raw HTML</span>
          <Switch checked={escapeRawHtml} onChange={setEscapeRawHtml} />
        </Space>
        <Space>
          <span>Open links in new tab</span>
          <Switch checked={openLinksInNewTab} onChange={setOpenLinksInNewTab} />
        </Space>
      </Space>
      <XMarkdown
        className={className}
        content={markdown}
        escapeRawHtml={escapeRawHtml}
        openLinksInNewTab={openLinksInNewTab}
      />
    </div>
  );
};
