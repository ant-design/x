import XMarkdown from '@ant-design/x-markdown';
import CodeHighLight from '@ant-design/x-markdown/plugins/CodeHighLight';
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

### CodeHighLight
\`\`\` js
console.log('XMarkdown');
\`\`\`
`;

const App = () => (
  <XMarkdown content={content} plugins={[Latex({ output: 'mathml' }), CodeHighLight()]} />
);

export default App;
