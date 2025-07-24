---
group:
  title: Basic Usage
  order: 3
order: 5
title: Usage with Rsbuild
---

Here’s the translation of your guide on using `@ant-design/x` with Rsbuild:

---

[Rsbuild](https://rsbuild.dev/zh) is a build tool powered by Rspack. This article will guide you on how to create a project using Rsbuild and integrate `@ant-design/x`.

## Installation and Initialization

Before you start, you might need to install [yarn](https://github.com/yarnpkg/yarn), [pnpm](https://pnpm.io/zh), or [bun](https://bun.sh).

<InstallDependencies npm='$ npm create rsbuild' yarn='$ yarn create rsbuild' pnpm='$ pnpm create rsbuild' bun='$ bun create rsbuild'></InstallDependencies>

During initialization, `create-rsbuild` provides a range of templates to choose from. Here, we’ll select the `React` template.

The tool will automatically initialize a scaffold and install necessary dependencies for a React project. If you encounter network issues during the process, try configuring a proxy or using another npm registry.

Next, navigate to the project directory and start the development server.

```bash
$ cd demo
$ npm run dev
```

Visit http://localhost:3000 in your browser, and seeing the `Rsbuild with React` interface means the setup is successful.

## Importing @ant-design/x

Now, install and import `@ant-design/x` using yarn, npm, pnpm, or bun.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

Modify `src/App.tsx` to import the Bubble component from `@ant-design/x`.

```tsx
import React from 'react';
import { Bubble } from '@ant-design/x';

const App: React.FC = () => (
  <div className="App">
    <Bubble content="Hello world!" />
  </div>
);

export default App;
```

You should now see the Bubble component from `@ant-design/x` on your page. You can proceed to use other components to develop your application. For other development processes, refer to the [official Rsbuild documentation](https://rsbuild.dev/zh).

### Customizing Theme

Refer to [Customizing Theme](/docs/react/customize-theme) for theme configuration through `ConfigProvider`:

```tsx
import React from 'react';
import { XProvider } from '@ant-design/x';

const App: React.FC = () => (
  <XProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
    <MyApp />
  </XProvider>
);

export default App;
```

You have successfully integrated `@ant-design/x` components using Rsbuild. Start developing your application!
