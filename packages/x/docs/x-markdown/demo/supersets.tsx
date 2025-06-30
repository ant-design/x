import XMarkdown from '@ant-design/x-markdown';
import Latex from '@ant-design/x-markdown/plugins/Latex';
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
    <XMarkdown className="xmarkdown-body" plugins={[Latex({ output: 'mathml' })]}>
      {content}
    </XMarkdown>
  );
};

export default App;
