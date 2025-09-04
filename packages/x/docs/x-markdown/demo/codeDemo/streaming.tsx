import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { Flex, Button } from 'antd';
import { useMarkdownTheme } from '../_utils';

const text = `The Ant Design team presents the RICH paradigm, crafting superior AI interface solutions and pioneering intelligent experiences.\n\n<div align="center">\n\n<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">\n\n<h1>Ant Design X</h1>\n\nCraft AI-driven interfaces effortlessly.\n[![CI status](https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg)](https://github.com/ant-design/x/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi)](https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi) [![NPM version](https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x)
[![NPM downloads](https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x) [![](https://badgen.net/bundlephobia/minzip/@ant-design/x?style=flat-square)](https://bundlephobia.com/package/@ant-design/x) [![antd](https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square)](https://ant.design) [![Follow Twitter](https://img.shields.io/twitter/follow/AntDesignUI.svg?label=Ant%20Design)](https://twitter.com/AntDesignUI)\n\n[Changelog](./CHANGELOG.en-US.md) · [Report Bug](https://github.com/ant-design/x/issues/new?template=bug-report.yml) · [Request Feature](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml)</div>\n\n## ✨ **Features**\n\n- 🌈 **Derived from Best Practices of Enterprise-Level AI Products**: Built on the RICH interaction paradigm, delivering an exceptional AI interaction experience.\n\n- 🧩 **Flexible and Diverse Atomic Components**: Covers most AI dialogue scenarios, empowering you to quickly build personalized AI interaction interfaces.\n\n- ⚡ **Out-of-the-Box Model Integration**: Easily connect with inference services compatible with OpenAI standards.\n\n- 🔄 **Efficient Management of Conversation Data Flows**: Provides powerful tools for managing data flows, enhancing development efficiency.\n\n- 📦 **Rich Template Support**: Offers multiple templates for quickly starting LUI application development.\n\n- 🛡 **Complete TypeScript Support**: Developed with TypeScript, ensuring robust type coverage to improve the development experience and reliability.
- 🎨 **Advanced Theme Customization**: Supports fine-grained style adjustments to meet diverse use cases and personalization needs.\n\n## 📦 Installation\n\n\`\`\`bash npm install @ant-design/x --save \`\`\`\n\n\`\`\`bash yarn add @ant-design/x \`\`\`\n\n\`\`\`bash\npnpm add @ant-design/x\n\`\`\`\n\n### 🖥️ Import in Browser\n\nAdd \`script\` and \`link\` tags in your browser and use the global variable \`antd\`.
We provide \`antdx.js\`, \`antdx.min.js\`, and \`antdx.min.js.map\` in the [dist](https://cdn.jsdelivr.net/npm/@ant-design/x@1.0.0/dist/) directory of the npm package.
> **We do not recommend using the built files** because they cannot be tree-shaken and will not receive bug fixes for underlying dependencies.
> Note: \`antdx.js\` and \`antdx.min.js\` depend on \`react\`, \`react-dom\`, \`dayjs\`, \`antd\`, \`@ant-design/cssinjs\`, \`@ant-design/icons\`, please ensure these files are loaded before using them.
## 🧩 Atomic Components\n\nBased on the RICH interaction paradigm, we provide numerous atomic components for various stages of interaction to help you flexibly build your AI dialogue applications:\n\n[Components Overview](https://x.ant.design/components/overview)
[Playground](https://x.ant.design/docs/playground/independent)\n\nBelow is an example of using atomic components to create a simple chatbot interface:\n\n\`\`\`tsx\nimport React from 'react';
import {
  // Message bubble
  Bubble,
  // Input box
  Sender,
} from '@ant-design/x';
const messages = [
  {
    content: 'Hello, Ant Design X!',
    role: 'user',
  },
];
const App = () => (
  <>
    <Bubble.List items={messages} />
    <Sender />
  </>
);
export default App;
\`\`\`
`;

const App = () => {
  const [index, setIndex] = React.useState(0);
  const [hasNextChunk, setHasNextChunk] = React.useState(false);
  const timer = React.useRef<any>(-1);
  const [className] = useMarkdownTheme();

  const renderStream = () => {
    if (index >= text.length) {
      clearTimeout(timer.current);
      setHasNextChunk(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((prev) => prev + 5);
      renderStream();
    }, 20);
  };

  React.useEffect(() => {
    if (index === text.length) return;
    setHasNextChunk(true);
    renderStream();
    return () => {
      clearTimeout(timer.current);
    };
  }, [index]);

  return (
    <Flex vertical gap="small">
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setIndex(0)}>
        Re-Render
      </Button>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown
            style={{ whiteSpace: 'normal' }}
            streaming={{ hasNextChunk }}
            className={className}
          >
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
