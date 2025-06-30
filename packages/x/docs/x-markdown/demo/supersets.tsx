import XMarkdown from '@ant-design/x-markdown';
import CodeHighlight from '@ant-design/x-markdown/Plugins/CodeHighlight';
import Latex from '@ant-design/x-markdown/Plugins/Latex';
import React from 'react';

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

### CodeHighlight
\`\`\` js
console.log('XMarkdown');
\`\`\`
`;

const App = () => {
  return (
    <XMarkdown className="xmarkdown-body" plugins={[Latex({ output: 'mathml' }), CodeHighlight()]}>
      {content}
    </XMarkdown>
  );
};

export default App;
