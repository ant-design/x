---
category: Components
order: 0
title: Introduction
showImport: false
---

`@ant-design/x` is a React UI library based on the Ant Design system, designed for AI-driven interfaces. It provides out-of-the-box intelligent conversation components and seamless API integration to help you quickly build smart application interfaces.

---

## ✨ Features

- 🌈 **Best practices from enterprise-level AI products**: Based on the RICH interaction paradigm, delivering an exceptional AI experience
- 🧩 **Flexible and diverse atomic components**: Covering most AI conversation scenarios, enabling rapid construction of personalized AI interaction pages
- ⚡ **Out-of-the-box model integration**: Easily connect models and agent services with [X SDK](/x-sdks/introduce)
- 📦 **Rich template support**: Multiple templates for quickly starting LUI application development
- 🛡 **Full TypeScript support**: Developed with TypeScript, providing complete type definitions for a better development experience and reliability
- 🎨 **Advanced theme customization**: Supports fine-grained style adjustments to meet diverse and personalized needs

## Installation

### Install via npm, yarn, pnpm, bun, or utoo

**We recommend using [npm](https://www.npmjs.com/), [yarn](https://github.com/yarnpkg/yarn), [pnpm](https://pnpm.io/), [bun](https://bun.sh/), or [utoo](https://github.com/umijs/mako/tree/next) for development.** This allows easy debugging in development and reliable packaging for production, benefiting from the ecosystem and toolchain.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x' utoo='$ ut install @ant-design/x --save'></InstallDependencies>

If your network is unstable, consider using [cnpm](https://github.com/cnpm/cnpm).

### Browser Import

You can use `script` and `link` tags to directly import files and use the global variable `antdx`.

The npm package's dist directory provides `antdx.js`, `antdx.min.js`, and `antdx.min.js.map`.

> **Not recommended to use built files** as they do not support on-demand loading and may not receive quick bug fixes for underlying dependencies.

> Note: `antdx.js` and `antdx.min.js` depend on `react`, `react-dom`, `dayjs`, `antd`, `@ant-design/cssinjs`, and `@ant-design/icons`. Please ensure these files are imported first.

## 🧩 Components

Based on the RICH interaction paradigm, we provide a variety of atomic components for different interaction stages to help you flexibly build your AI conversation app:

- General: `Bubble` - message bubble, `Conversations` - conversation management, `Notification` - system notification
- Wake-up: `Welcome` - welcome, `Prompts` - prompt set
- Expression: `Sender` - input box, `Attachment` - input attachment, `Suggestion` - quick command
- Confirmation: `Think` - thinking process, `ThoughtChain` - chain of thought
- Feedback: `Actions` - action list, `FileCard` - file card
- Others: `XProvider` - global config: theme, locale, etc.

Here is a simple example of building a chat box using atomic components:

```sandpack
const sandpackConfig = {
  autorun: true,
};

import React from 'react';
import { Bubble, Sender} from '@ant-design/x';

const messages = [
  {
    content: 'Hello, Ant Design X!',
    role: 'user',
    key: 'user_0',
  },
];

const App = () => (
  <div style={{ height: '400px',display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <Bubble.List items={messages} />
    <Sender />
  </div>
);

export default App;
```

## ⚡️ Model/Agent Integration & AI Conversation Data Flow

With [X SDK](/x-sdks/introduce), you can easily integrate models and agent services, along with useful utilities.

## ✨ High-performance Markdown Streaming Engine

We provide an optimized [X Markdown](/x-markdowns/introduce) rendering solution for streaming content, with powerful extension capabilities. It supports formulas, code highlighting, mermaid charts, and delivers excellent performance for smooth content display.

## On-demand Loading

`@ant-design/x` supports tree shaking based on ES modules by default.

## TypeScript

`@ant-design/x` is written in TypeScript and provides complete type definitions.
