---
order: 1
title: 介绍
---

`@ant-design/x-sdk` 提供了一系列的工具API，旨在帮助开发人员开箱即用的管理AI对话应用数据流

## ✨ 特性

## 安装

### 使用 npm 或 yarn 或 pnpm 或 bun 安装 或 utoo 安装

**我们推荐使用 [npm](https://www.npmjs.com/) 或 [yarn](https://github.com/yarnpkg/yarn/) 或 [pnpm](https://pnpm.io/zh/) 或 [bun](https://bun.sh/) 或 [utoo](https://github.com/umijs/mako/tree/next) 的方式进行开发**，不仅可在开发环境轻松调试，也可放心地在生产环境打包部署使用，享受整个生态圈和工具链带来的诸多好处。

<InstallDependencies npm='$ npm install @ant-design/x-sdk --save' yarn='$ yarn add @ant-design/x-sdk' pnpm='$ pnpm install @ant-design/x-sdk --save' bun='$ bun add @ant-design/x-sdk' utoo='$ ut install @ant-design/x-sdk --save'></InstallDependencies>

如果你的网络环境不佳，推荐使用 [cnpm](https://github.com/cnpm/cnpm)。

### 浏览器引入

在浏览器中使用 `script` 和 `link` 标签直接引入文件，并使用全局变量 `XSDK`。

我们在 npm 发布包内的 dist 目录下提供了 `x-sdk.js`、`x-sdk.min.js` 和 `x-sdk.min.js.map`。

> **强烈不推荐使用已构建文件**，这样无法按需加载，而且难以获得底层依赖模块的 bug 快速修复支持。

> 注意：`x-sdk.js` 和 `x-sdk.min.js` 和 `x-sdk.min.js.map`。依赖 `react`、`react-dom`请确保提前引入这些文件。

## 示例

```tsx
import React from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = React.useState<'string'>('');
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  useEffect(() => {
    setStatus('pending');

    XRequest('https://api.example.com/chat', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
      callbacks: {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
    });
  }, []);

  return (
    <div>
      <div>Status: {status}</div>
      <div>Lines: {lines.length}</div>
    </div>
  );
};
```
