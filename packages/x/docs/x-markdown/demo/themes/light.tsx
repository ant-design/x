import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import '@ant-design/x-markdown/themes/light.css';

const content = `
<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

Craft AI-driven interfaces effortlessly.

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url]

[![NPM downloads][download-image]][download-url] [![][bundlephobia-image]][bundlephobia-url] [![antd][antd-image]][antd-url] [![Follow Twitter][twitter-image]][twitter-url]

[Changelog](./CHANGELOG.en-US.md) · [Report Bug][github-issues-bug-report] · [Request Feature][github-issues-feature-request] · English · [中文](./README-zh_CN.md)

[npm-image]: https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ant-design/x
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml
[antd-image]: https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square
[antd-url]: https://ant.design
[twitter-image]: https://img.shields.io/twitter/follow/AntDesignUI.svg?label=Ant%20Design
[twitter-url]: https://twitter.com/AntDesignUI

</div>


## ✨ Features

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

- [Components Overview](https://x.ant.design/components/overview)
- [Playground](https://x.ant.design/docs/playground/independent)

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

const App = () => {
  const urlParams = new URLSearchParams(window?.location?.search);
  const theme = urlParams.get('theme');
  const className = theme === 'dark' ? 'x-markdown-dark' : 'x-markdown-light';

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 6 }}>
      <XMarkdown content={content} className={className} />
    </div>
  );
};

export default App;
