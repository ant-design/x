import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';

const content = `
### Latex
inline standard: $\\frac{df}{dt}$ \n
block standard：\n
$$
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
$$

inline: \\(\\frac{df}{dt}\\)  \n
block: \n
\\[
\\Delta t' = \\frac{\\Delta t}{\\sqrt{1 - \\frac{v^2}{c^2}}}
\\]

`;

const App: React.FC = () => {
  return (
    <XMarkdown
      className="x-markdown-light"
      config={{ extensions: Latex() }}
      components={{
        code: (props: any) => {
          const { class: className, children } = props;
          const lang = className?.replace('language-', '');
          if (lang === 'mermaid') {
            return <Mermaid>{children}</Mermaid>;
          }
          return <HighlightCode lang={lang}>{children}</HighlightCode>;
        },
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
