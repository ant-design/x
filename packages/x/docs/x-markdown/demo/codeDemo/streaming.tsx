import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import { BubbleListProps } from '@ant-design/x/es/bubble';

const fullContent = `
The Ant Design team presents the RICH paradigm, crafting superior AI interface solutions and pioneering intelligent experiences.

<div align="center">

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

Craft AI-driven interfaces effortlessly.

[![CI status](https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg)](https://github.com/ant-design/x/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi)](https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi) [![NPM version](https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x)

[![NPM downloads](https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x) [![](https://badgen.net/bundlephobia/minzip/@ant-design/x?style=flat-square)](https://bundlephobia.com/package/@ant-design/x) [![antd](https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square)](https://ant.design) [![Follow Twitter](https://img.shields.io/twitter/follow/AntDesignUI.svg?label=Ant%20Design)](https://twitter.com/AntDesignUI)

[Changelog](./CHANGELOG.en-US.md) · [Report Bug](https://github.com/ant-design/x/issues/new?template=bug-report.yml) · [Request Feature](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml) 

</div>


## ✨ **Features**

- 🌈 **Derived from Best Practices of Enterprise-Level AI Products**: Built on the RICH interaction paradigm, delivering an exceptional AI interaction experience.
- 🧩 **Flexible and Diverse Atomic Components**: Covers most AI dialogue scenarios, empowering you to quickly build personalized AI interaction interfaces.
- ⚡ **Out-of-the-Box Model Integration**: Easily connect with inference services compatible with OpenAI standards.
- 🔄 **Efficient Management of Conversation Data Flows**: Provides powerful tools for managing data flows, enhancing development efficiency.
- 📦 **Rich Template Support**: Offers multiple templates for quickly starting LUI application development.
- 🛡 **Complete TypeScript Support**: Developed with TypeScript, ensuring robust type coverage to improve the development experience and reliability.
- 🎨 **Advanced Theme Customization**: Supports fine-grained style adjustments to meet diverse use cases and personalization needs.

## 📦 Installation

\`\`\`bash
npm install @ant-design/x --save
\`\`\`

\`\`\`bash
yarn add @ant-design/x
\`\`\`

\`\`\`bash
pnpm add @ant-design/x
\`\`\`

### 🖥️ Import in Browser

Add \`script\` and \`link\` tags in your browser and use the global variable \`antd\`.

We provide \`antdx.js\`, \`antdx.min.js\`, and \`antdx.min.js.map\` in the [dist](https://cdn.jsdelivr.net/npm/@ant-design/x@1.0.0/dist/) directory of the npm package.

> **We do not recommend using the built files** because they cannot be tree-shaken and will not receive bug fixes for underlying dependencies.

> Note: \`antdx.js\` and \`antdx.min.js\` depend on \`react\`, \`react-dom\`, \`dayjs\`, \`antd\`, \`@ant-design/cssinjs\`, \`@ant-design/icons\`, please ensure these files are loaded before using them.

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide numerous atomic components for various stages of interaction to help you flexibly build your AI dialogue applications:

[Components Overview](https://x.ant.design/components/overview)
[Playground](https://x.ant.design/docs/playground/independent)

Below is an example of using atomic components to create a simple chatbot interface:

\`\`\`tsx
import React from 'react';
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

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
    components: {
      avatar: <UserOutlined />,
    },
  },
  local: {
    placement: 'end',
    components: {
      avatar: <UserOutlined />,
    },
  },
};

const App: React.FC = () => {
  const [hasNextChunk, setHasNextChunk] = useState(false);
  const [content, setContent] = React.useState('');

  // Agent for request
  const [agent] = useXAgent<string, { message: string }, string>({
    request: async (_, { onSuccess, onUpdate }) => {
      let currentContent = '';

      const id = setInterval(() => {
        setHasNextChunk(true);
        const addCount = Math.floor(Math.random() * 30);
        currentContent = fullContent.slice(0, currentContent.length + addCount);
        onUpdate(currentContent);
        if (currentContent === fullContent) {
          setHasNextChunk(false);
          clearInterval(id);
          onSuccess([fullContent]);
        }
      }, 100);
    },
  });

  // Chat messages
  const { onRequest, messages } = useXChat({
    agent,
  });

  return (
    <div style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
      <Bubble.List
        role={roles}
        style={{ flex: 1 }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: status === 'local' ? 'local' : 'ai',
          content: message,
          contentRender:
            status === 'local'
              ? undefined
              : (content) => (
                  <XMarkdown
                    className="x-markdown-light"
                    content={content as string}
                    streaming={{
                      hasNextChunk: hasNextChunk,
                      enableAnimation: true,
                    }}
                  />
                ),
        }))}
      />
      <Sender
        loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        style={{ marginTop: 48 }}
        onSubmit={(nextContent) => {
          onRequest(nextContent);
          setContent('');
        }}
      />
    </div>
  );
};

export default App;
