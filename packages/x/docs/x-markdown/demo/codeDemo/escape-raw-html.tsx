import { SettingOutlined } from '@ant-design/icons';
import { XMarkdown } from '@ant-design/x-markdown';
import { Button, Flex, Popover, Space, Switch, Typography, theme } from 'antd';
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

const { Text } = Typography;

interface ToggleItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, checked, onChange }) => (
  <Flex align="center" justify="space-between" gap={16} style={{ minWidth: 160 }}>
    <Text style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>{label}</Text>
    <Switch size="small" checked={checked} onChange={onChange} />
  </Flex>
);

export default () => {
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const [escapeRawHtml, setEscapeRawHtml] = useState(true);
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true);

  const configContent = (
    <Flex vertical gap={10} style={{ minWidth: 180 }}>
      <ToggleItem label="Escape Raw HTML" checked={escapeRawHtml} onChange={setEscapeRawHtml} />
      <ToggleItem
        label="Open Links In New Tab"
        checked={openLinksInNewTab}
        onChange={setOpenLinksInNewTab}
      />
    </Flex>
  );

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 16 }}>
        <Popover trigger="click" placement="bottomLeft" content={configContent}>
          <Button type="default" size="small" icon={<SettingOutlined />}>
            Config
          </Button>
        </Popover>
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
