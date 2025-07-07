import { Token, XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import 'github-markdown-css/github-markdown-light.css';
import './plugin.css';

const content = `
### Custom Plugin

Footnotes: Bubble [^1]. Conversations [^2].
`;

const referenceList = [
  { url: 'https://x.ant.design/components/bubble-cn' },
  { url: 'https://x.ant.design/components/conversations-cn' },
];

const App = () => {
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
      if (!currentUrl) {
        return null;
      }
      return `<a style="cursor: pointer" target="_blank" href="${currentUrl}" class="markdown-cite">${text}</a>`;
    },
  };

  return <XMarkdown plugins={{ extensions: [footNoteExtension] }} content={content} />;
};

export default App;
