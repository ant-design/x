<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X</h1>

The ready-made partner for building Copilot applications.

[![CI status][github-action-image]][github-action-url] [![codecov][codecov-image]][codecov-url] [![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url]

[Changelog](./CHANGELOG.en-US.md) · [Report Bug][github-issues-bug-report] · [Request Feature][github-issues-feature-request] · English · [中文](./README-zh_CN.md)

[npm-image]: https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ant-design/x
[github-action-image]: https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg
[github-action-url]: https://github.com/ant-design/x/actions/workflows/main.yml
[codecov-image]: https://codecov.io/gh/ant-design/x/graph/badge.svg?token=wrCCsyTmdi
[codecov-url]: https://codecov.io/gh/ant-design/x
[download-image]: https://img.shields.io/npm/dm/@ant-design/x.svg?style=flat-square
[download-url]: https://npmjs.org/package/@ant-design/x
[fossa-image]: https://app.fossa.io/api/projects/git%2Bgithub.com%2Fant-design%2Fant-design.svg?type=shield
[fossa-url]: https://app.fossa.io/projects/git%2Bgithub.com%2Fant-design%2Fant-design?ref=badge_shield
[help-wanted-image]: https://flat.badgen.net/github/label-issues/ant-design/x/help%20wanted/open
[help-wanted-url]: https://github.com/ant-design/x/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22
[twitter-image]: https://img.shields.io/twitter/follow/AntDesignUI.svg?label=Ant%20Design
[twitter-url]: https://twitter.com/AntDesignUI
[bundlesize-js-image]: https://img.badgesize.io/https:/unpkg.com/@ant-design/x/dist/antdx.min.js?label=antdx.min.js&compression=gzip&style=flat-square
[unpkg-js-url]: https://unpkg.com/browse/@ant-design/x/dist/antdx.min.js
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@ant-design/x?style=flat-square
[bundlephobia-url]: https://bundlephobia.com/package/@ant-design/x
[issues-helper-image]: https://img.shields.io/badge/using-actions--cool-blue?style=flat-square
[issues-helper-url]: https://github.com/actions-cool
[renovate-image]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?style=flat-square
[renovate-dashboard-url]: https://github.com/ant-design/x/issues/32498
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square
[dumi-url]: https://github.com/umijs/dumi
[github-issues-bug-report]: https://github.com/ant-design/x/issues/new?template=bug-report.yml
[github-issues-feature-request]: https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml

</div>

![demos](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## ✨ Features

- 🌈 **Derived from Best Practices of Enterprise-Level AI Products**: Built on the RICH interaction paradigm, delivering an exceptional AI interaction experience.
- 🧩 **Flexible and Diverse Atomic Components**: Covers most AI dialogue scenarios, empowering you to quickly build personalized AI interaction interfaces.
- ⚡ **Out-of-the-Box Model Integration**: Easily connect with inference services compatible with OpenAI standards.
- 🔄 **Efficient Management of Conversation Data Flows**: Provides powerful tools for managing data flows, enhancing development efficiency.
- 📦 **Rich Template Support**: Offers multiple templates for quickly starting LUI application development.
- 🛡 **Complete TypeScript Support**: Developed with TypeScript, ensuring robust type coverage to improve the development experience and reliability.
- 🎨 **Advanced Theme Customization**: Supports fine-grained style adjustments to meet diverse use cases and personalization needs.

## 📦 Installation

```bash
npm install @ant-design/x --save
```

```bash
yarn add @ant-design/x
```

```bash
pnpm add @ant-design/x
```

### 🖥️ Import in Browser

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

## Non-React Implementations

Welcome to contribute!

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
