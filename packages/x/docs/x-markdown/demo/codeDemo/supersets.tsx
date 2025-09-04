import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { useMarkdownTheme } from '../_utils';

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

const Code = (props: { className: string; children: string }) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || '';
  if (lang === 'mermaid') {
    return <Mermaid>{children}</Mermaid>;
  }
  return <HighlightCode lang={lang}>{children}</HighlightCode>;
};

const App: React.FC = () => {
  const [className] = useMarkdownTheme();

  return (
    <XMarkdown
      className={className}
      config={{ extensions: Latex() }}
      components={{
        code: Code,
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
