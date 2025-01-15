---
order: 0
title: Ant Design X of React
---

Following the Ant Design specification, we developed a React UI library `@ant-design/x` that Crafting AI-driven interfaces with React, seamlessly integrating smart chat components and API services at your fingertips.

<div class="pic-plus">
  <img width="150" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original" />
  <span>+</span>
  <img width="160" src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
</div>

---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## ✨ Features

- 🌈 **Derived from Best Practices of Enterprise-Level AI Products**: Built on the RICH interaction paradigm, delivering an exceptional AI interaction experience.
- 🧩 **Flexible and Diverse Atomic Components**: Covers most AI dialogue scenarios, empowering you to quickly build personalized AI interaction interfaces.
- ⚡ **Out-of-the-Box Model Integration**: Easily connect with inference services compatible with OpenAI standards.
- 🔄 **Efficient Management of Conversation Data Flows**: Provides powerful tools for managing data flows, enhancing development efficiency.
- 📦 **Rich Template Support**: Offers multiple templates for quickly starting LUI application development.
- 🛡 **Complete TypeScript Support**: Developed with TypeScript, ensuring robust type coverage to improve the development experience and reliability.
- 🎨 **Advanced Theme Customization**: Supports fine-grained style adjustments to meet diverse use cases and personalization needs.

## 📦 Installation

### Using npm or yarn or pnpm or bun

**We recommend using [npm](https://www.npmjs.com/) or [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) to install**, it not only makes development easier, but also allow you to take advantage of the rich ecosystem of Javascript packages and tooling.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

If you are in a bad network environment, you can try other registries and tools like [cnpm](https://github.com/cnpm/cnpm).

### Import in Browser

Add `script` and `link` tags in your browser and use the global variable `antd`.

We provide `antdx.js`, `antdx.min.js`, and `antdx.min.js.map` in the `dist` directory of the npm package.

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide numerous atomic components for various stages of interaction to help you flexibly build your AI dialogue applications:

- General: `Bubble` - Message bubble, `Conversations` - Conversation management
- Wake-Up: `Welcome` - Welcome messages, `Prompts` - Prompt sets
- Expression: `Sender` - Input box, `Attachment` - Attachments, `Suggestion` - Quick commands
- Confirmation: `ThoughtChain` - Thought chains

Below is an example of using atomic components to create a simple chatbot interface:

```tsx
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
  <div>
    <Bubble.List items={messages} />
    <Sender />
  </div>
);

export default App;
```

## ⚡️ Connecting to Model Inference Services

With the `useXAgent` runtime tool, we make it easy to connect with model inference services that adhere to OpenAI standards.

Here’s an example of using `useXAgent`:

```tsx
import React from 'react';
import { useXAgent, Sender } from '@ant-design/x';

const App = () => {
  const [agent] = useXAgent({
    // Model inference service URL
    baseURL: 'https://your.api.host',
    // Model name
    model: 'gpt-3.5',
  });

  function chatRequest(text: string) {
    agent.request({
      // Message
      messages: [
        {
          content: text,
          role: 'user',
        },
      ],
      // Enable streaming
      stream: true,
    });
  }

  return <Sender onSubmit={chatRequest} />;
};

export default App;
```

## 🔄 Efficient Management of Data Flows

Using the `useXChat` runtime tool, you can easily manage data flows in AI dialogue applications:

```tsx
import React from 'react';
import { useXChat, useXAgent } from '@ant-design/x';

const App = () => {
  const [agent] = useXAgent({
    // Model inference service URL
    baseURL: 'https://your.api.host',
    // Model name
    model: 'gpt-3.5',
  });

  const {
    // Initiate a chat request
    onRequest,
    // Message list
    messages,
  } = useXChat({ agent });

  return (
    <div>
      <Bubble.List items={messages} />
      <Sender onSubmit={onRequest} />
    </div>
  );
};

export default App;
```

## Use modularized antd

`@ant-design/x` supports ES modules tree shaking by default.

## TypeScript

`@ant-design/x` provides a built-in ts definition.

## Companies using antdx

Ant Design X is widely used in AI-driven user interfaces within Ant Group. If your company and products use Ant Design X, feel free to leave a comment [here](https://github.com/ant-design/x/issues/126).

## Contributing

Please read our [CONTRIBUTING.md](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md) first.

If you'd like to help us improve antd, just create a [Pull Request](https://github.com/ant-design/ant-design/pulls). Feel free to report bugs and issues [here](http://new-issue.ant.design/).

> If you're new to posting issues, we ask that you read [_How To Ask Questions The Smart Way_](http://www.catb.org/~esr/faqs/smart-questions.html) and [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) prior to posting. Well written bug reports help us help you!

## Need Help?

If you encounter any issues while using Ant Design X, you can seek help through the following channels. We also encourage experienced users to assist newcomers via these platforms.

When asking questions on GitHub Discussions, it's recommended to use the `Q&A` tag.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)
