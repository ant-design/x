---
group:
  title: Basic Usage
order: 6
title: Usage with Farm
tag: New
---

[Farm](https://www.farmfe.org/) is a Rust-Based Web Building Engine to Facilitate Your Web Program and JavaScript Library. This article will try to use `Farm` to create a project and import @ant-design/x.

## Install and Initialization

Before all start, you may need install [yarn](https://github.com/yarnpkg/yarn) or [pnpm](https://pnpm.io) or [bun](https://bun.sh).

<InstallDependencies npm='$ npm create farm@latest' yarn='$ yarn create farm@latest' pnpm='$ pnpm create farm@latest' bun='$ bun create farm@latest'></InstallDependencies>

During the initialization process, `farm` provides a series of templates for us to choose, We need choose the `React` template.

The tool will create and initialize environment and dependencies automatically, please try config your proxy setting or use another npm registry if any network errors happen during it.

Then we go inside project and start it.

```bash
$ cd farm-project
$ npm install
$ npm run dev
```

Open the browser at http://localhost:9000. It renders a title saying `Farm with React` on the page, which is considered successful.

## Import @ant-design/x

Now we install `@ant-design/x` from yarn or npm or pnpm or bun.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

Modify `src/main.tsx`, import Bubble component from `@ant-design/x`.

```tsx
import React from 'react';
import { Bubble } from '@ant-design/x';
export function Main() {
  return (
    <div className="App">
      <Bubble content="ant design x" />
    </div>
  );
}
```

OK, you should now see the Bubble component displayed on the page. Next you can choose any components of `@ant-design/x` to develop your application. Visit other workflows of `Farm` at its [Official documentation](https://www.farmfe.org).

### Customize Theme

Ref to the [Customize Theme documentation](/docs/react/customize-theme). Modify theme with ConfigProvider:

```tsx
import React from 'react';
import { XProvider } from '@ant-design/x';

export function Main() {
  return (
    <XProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <MyApp />
    </XProvider>
  );
}
```

We are successfully running the `@ant-design/x` components using Farm now, let’s start build your own application!
