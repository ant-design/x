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

![demos](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## ✨ Features

- 🌈 **Best Practices from Enterprise-level AI Products**: Based on the RICH interaction paradigm, delivering an excellent AI experience
- 🧩 **Flexible Atomic Components**: Covering most AI chat scenarios, helping you quickly build personalized AI UIs
- ✨ **Streaming-friendly, extensible, high-performance Markdown renderer**: Formula, code highlight, mermaid, etc. [@ant-design/x-markdown](../x-markdown/README.md)
- 🚀 **Out-of-the-box model/agent integration**: Easily connect to OpenAI-compatible models/agents [@ant-design/x-sdk](../x-sdk/README.md)
- ⚡️ **Efficient conversation data flow management**: Powerful data flow management for efficient development [@ant-design/x-sdk](../x-sdk/README.md)
- 📦 **Rich templates**: Multiple templates for quick LUI app development [Playground](https://github.com/ant-design/x/tree/main/packages/x/docs/playground/)
- 🛡 **Full TypeScript support**: Developed in TypeScript, providing complete type definitions
- 🎨 **Deep theme customization**: Fine-grained style adjustments for all scenarios

## 📦 Installation

```bash
npm install @ant-design/x
```

```bash
yarn add @ant-design/x
```

```bash
pnpm add @ant-design/x
```

```bash
ut install @ant-design/x
```

### 🖥️ Import in Browser

Use `script` and `link` tags to import files directly in the browser, and use the global variable `antdx`.

We provide `antdx.js`, `antdx.min.js`, and `antdx.min.js.map` in the [dist](https://cdn.jsdelivr.net/npm/@ant-design/x@1.0.0/dist/) directory of the npm package.

> **Strongly not recommended to use built files** as they cannot be tree-shaken and are hard to get bug fixes for dependencies.

> Note: `antdx.js` and `antdx.min.js` depend on `react`, `react-dom`, `dayjs`, `antd`, `@ant-design/cssinjs`, `@ant-design/icons`. Please make sure to import these files first.

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide a large number of atomic components for different interaction stages to help you flexibly build your AI chat applications:

- [Components Overview](https://x.ant.design/components/overview)
- [Playground](https://x.ant.design/docs/playground/independent)

Below is an example of building a simple chat box with atomic components:

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
    key: 'message_1',
    content: 'Hello, Ant Design X!',
    role: 'user',
  },
  {
    key: 'x_message_1',
    content: 'Hello, I am Ant Design X!',
    role: 'x',
  },
];

const role = {
  // Bubble position: end
  x: {
    placement: 'end',
  },
};

const App = () => (
  <div>
    <Bubble.List items={messages} role={role} />
    <Sender />
  </div>
);

export default App;
```

## ⚡️ Model/Agent Integration & Efficient Data Flow Management

`@ant-design/x-sdk` provides a set of tools and APIs to help developers manage AI chat app data flow out of the box. See details [here](../x-sdk/README.md).

### Qwen Integration Example

> Note: 🔥 `dangerouslyApiKey` has security risks, see [documentation](/docs/react/dangerously-api-key.en-US.md) for details.

```tsx
import { useXAgent, Sender, XRequest } from '@ant-design/x';
import React from 'react';

const { create } = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyApiKey: process.env['DASHSCOPE_API_KEY'],
  model: 'qwen-plus',
});

const Component: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;
      const { onUpdate } = callbacks;

      // current message
      console.log('message', message);
      // messages list
      console.log('messages', messages);

      let content: string = '';

      try {
        create(
          {
            messages: [{ role: 'user', content: message }],
            stream: true,
          },
          {
            onSuccess: (chunks) => {
              console.log('sse chunk list', chunks);
            },
            onError: (error) => {
              console.log('error', error);
            },
            onUpdate: (chunk) => {
              console.log('sse object', chunk);
              const data = JSON.parse(chunk.data);
              content += data?.choices[0].delta.content;
              onUpdate(content);
            },
          },
        );
      } catch (error) {
        // handle error
      }
    },
  });

  const onSubmit = (message: string) => {
    agent.request(
      { message },
      {
        onUpdate: () => {},
        onSuccess: () => {},
        onError: () => {},
      },
    );
  };

  return <Sender onSubmit={onSubmit} />;
};
```

### OpenAI Integration Example

```tsx
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import OpenAI from 'openai';
import React from 'react';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

const Demo: React.FC = () => {
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      const { onSuccess, onUpdate, onError } = callbacks;

      // current message
      console.log('message', message);

      // history messages
      console.log('messages', messages);

      let content: string = '';

      try {
        const stream = await client.chat.completions.create({
          model: 'gpt-4o',
          // if chat context is needed, modify the array
          messages: [{ role: 'user', content: message }],
          // stream mode
          stream: true,
        });

        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || '';
          onUpdate(content);
        }

        onSuccess(content);
      } catch (error) {
        // handle error
        // onError();
      }
    },
  });

  const {
    // use to send message
    onRequest,
    // use to render messages
    messages,
  } = useXChat({ agent });

  const items = messages.map(({ message, id }) => ({
    // key is required, used to identify the message
    key: id,
    content: message,
  }));

  return (
    <>
      <Bubble.List items={items} />
      <Sender onSubmit={onRequest} />
    </>
  );
};

export default Demo;
```

## ✨ Markdown Renderer

`@ant-design/x-markdown` provides a streaming-friendly, extensible, high-performance Markdown renderer. Supports formula, code highlight, mermaid, etc. See details [here](../x-markdown/README.md).

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide a large number of atomic components for different interaction stages to help you flexibly build your AI chat applications:

- [Components Overview](https://x.ant.design/components/overview)
- [Playground](https://x.ant.design/docs/playground/independent)

Below is an example of building a simple chat box with atomic components:

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
    key: 'message_1',
    content: 'Hello, Ant Design X!',
    role: 'user',
  },
  {
    key: 'x_message_1',
    content: 'Hello, I am Ant Design X!',
    role: 'x',
  },
];

const role = {
  // Bubble position: end
  x: {
    placement: 'end',
  },
};

const App = () => (
  <div>
    <Bubble.List items={messages} role={role} />
    <Sender />
  </div>
);

export default App;
```

 </a>

Please read our [CONTRIBUTING.md](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md) first.

If you'd like to help us improve Ant Design X, just create a [Pull Request](https://github.com/ant-design/ant-design/pulls). Feel free to report bugs and issues [here](http://new-issue.ant.design/).

> We strongly recommend reading [_How To Ask Questions The Smart Way_](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way), [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545), and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) before posting. Well-written bug reports help us help you!

## Community

If you encounter any problems, you can seek help through the following channels. We also encourage experienced users to help newcomers.

When asking questions on GitHub Discussions, please use the `Q&A` tag.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)
