---
order: 1
title: Introduction
---

`@ant-design/x-sdk` provides a set of tool APIs designed to help developers manage AI conversation application data flows out-of-the-box.

## Features

## Installation

### Install using npm or yarn or pnpm or bun or utoo

**We recommend using [npm](https://www.npmjs.com/) or [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) or [utoo](https://github.com/umijs/mako/tree/next) for development**, which allows easy debugging in development environment and safe production deployment, while enjoying the benefits of the entire ecosystem and toolchain.

<InstallDependencies npm='$ npm install @ant-design/x-sdk --save' yarn='$ yarn add @ant-design/x-sdk' pnpm='$ pnpm install @ant-design/x-sdk --save' bun='$ bun add @ant-design/x-sdk' utoo='$ ut install @ant-design/x-sdk --save'></InstallDependencies>

If your network environment is poor, we recommend using [cnpm](https://github.com/cnpm/cnpm).

### Browser Import

Use `script` and `link` tags to directly import files in the browser, and use the global variable `XSDK`.

We provide `x-sdk.js`, `x-sdk.min.js` and `x-sdk.min.js.map` in the dist directory of the npm package.

> **Strongly not recommended to use built files**, as this prevents on-demand loading and makes it difficult to get quick bug fixes for underlying dependency modules.

> Note: `x-sdk.js`, `x-sdk.min.js` and `x-sdk.min.js.map` depend on `react` and `react-dom`. Please ensure these files are imported first.

## Example

```sandpack
const sandpackConfig = {
  autorun: true,
};

import React,{ useEffect, useState } from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = useState<'string'>('');
  const [lines, setLines] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    setStatus('pending');

    XRequest('https://api.example.com/chat', {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
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
