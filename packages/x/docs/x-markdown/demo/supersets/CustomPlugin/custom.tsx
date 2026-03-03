import { type ComponentProps, type Token, XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import './plugin.css';
import { Popover, theme } from 'antd';
import { useIntl } from 'react-intl';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const customPluginMarkdownZh = `
# 自定义脚注插件

Ant Design X 提供可扩展的 Markdown 渲染能力[^1]，你可以按需添加插件并映射为业务组件[^2]。

- 解析自定义语法
- 渲染业务化 UI
- 兼容流式输出

更多说明见文档[^3]。

[^1]: x-markdown 支持扩展 tokenizer 与 renderer。
[^2]: 通过 components 将标签映射为 React 组件。
[^3]: 示例链接仅用于演示脚注交互。
`;

const customPluginMarkdownEn = `
# Custom Footnote Plugin

Ant Design X provides extensible Markdown rendering[^1], so you can add plugins and map them to business components[^2].

- Parse custom syntax
- Render business UI
- Keep streaming-friendly behavior

See docs for more details[^3].

[^1]: x-markdown supports custom tokenizer and renderer.
[^2]: Use components to map tags to React components.
[^3]: Links in this demo are for footnote interaction only.
`;

const referenceList = [
  { url: 'https://x.ant.design', title: 'link1' },
  { url: 'https://x.ant.design', title: 'link2' },
  { url: 'https://x.ant.design', title: 'link3' },
  { url: 'https://x.ant.design', title: 'link4' },
  { url: 'https://x.ant.design', title: 'link5' },
  { url: 'https://x.ant.design', title: 'link6' },
  { url: 'https://x.ant.design', title: 'link7' },
  { url: 'https://x.ant.design', title: 'link8' },
  { url: 'https://x.ant.design', title: 'link9' },
];

const Footnote: React.FC<ComponentProps<{ href?: string; title?: string }>> = (props) => (
  <Popover content={props.title} title="Footnote" trigger="hover">
    <span onClick={() => window.open(props.href)} className="markdown-cite">
      {props.children}
    </span>
  </Popover>
);

const App = () => {
  const { theme: antdTheme } = theme.useToken();
  const className = antdTheme.id === 0 ? 'x-markdown-light' : 'x-markdown-dark';
  const { locale } = useIntl();
  const content = locale === 'zh-CN' ? customPluginMarkdownZh : customPluginMarkdownEn;
  const footNoteExtension = {
    name: 'footnote',
    level: 'inline' as const,
    tokenizer(src: string) {
      const match = src.match(/^\[\^(\d+)\]/);
      if (match) {
        const content = match[0].trim();
        return {
          type: 'footnote',
          raw: content,
          text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
          renderType: 'component',
        };
      }
    },
    renderer(token: Token) {
      if (!referenceList) {
        return '';
      }
      const { text } = token;
      const order = Number(text) - 1;
      const currentUrl = referenceList?.[order]?.url;
      const currentTitle = referenceList?.[order]?.title;
      if (!currentUrl) {
        return null;
      }
      return `<footnote href="${currentUrl}" title="${currentTitle}">${text}</footnote>`;
    },
  };

  return (
    <XMarkdown
      className={className}
      config={{ extensions: [footNoteExtension] }}
      components={{
        footnote: Footnote,
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
