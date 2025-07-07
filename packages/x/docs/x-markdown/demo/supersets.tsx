import XMarkdown from '@ant-design/x-markdown';
import HighlightCode from '@ant-design/x-markdown/plugins/HighlightCode';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import Latex from '@ant-design/x-markdown/plugins/Latex';
import React from 'react';

const content = `
### [Latex]()
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

### [HighlightCode]()
\`\`\` js
console.log('XMarkdown');
\`\`\`

-----

### [Mermaid]()

\`\`\`mermaid\ngraph TD\n    A[输入信息] --> B[验证邮箱]\n    B --> C[设置密码]\n    C --> D(完成)\n
\`\`\`
`;

const App = () => {
  return (
    <XMarkdown
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
