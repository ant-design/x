import { Token, XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import 'github-markdown-css/github-markdown-light.css';
import './plugin.css';

const content = `
### Ant Design X Components:
Bubble [^1].

Conversations [^2].
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
          renderType: 'component',
        };
      }
    },
    renderer(token: Token) {
      if (!referenceList) {
        return '';
      }
      const { text } = token;
      const order = Number(text);
      const currentUrl = referenceList?.[order]?.url;
      if (!currentUrl) {
        return null;
      }
      return (
        <span
          style={{
            cursor: 'pointer',
          }}
          className="markdown-cite"
          onClick={() => {
            window.open(currentUrl);
          }}
        >
          {text}
        </span>
      );
    },
  };

  return (
    <XMarkdown
      className="xmarkdown-body"
      plugins={[{ extensions: [footNoteExtension] }]}
      content={content}
    />
  );
};

export default App;
