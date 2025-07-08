import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import Latex from '@ant-design/x-markdown/plugins/Latex';
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

-----

### HighlightCode
\`\`\` js
console.log('XMarkdown');
\`\`\`

-----

### Mermaid

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\`
`;

const App = () => {
  return (
    <XMarkdown
      className="x-markdown-theme-light"
      plugins={{ extensions: Latex() }}
      components={{
        code: (props: any) => {
          const { class: className, children } = props;
          const lang = className?.replace('language-', '');
          if (lang === 'mermaid') {
            return <Mermaid children={children} />;
          } else {
            return <HighlightCode lang={lang}>{children}</HighlightCode>;
          }
        },
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
