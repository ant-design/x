---
group:
  title: Basic Usage
order: 1
title: Usage with create-react-app
---

[create-react-app](https://create-react-app.dev/) is one of the best tools for developing React applications. In this guide, we'll use `create-react-app` to create a `TypeScript` project and introduce `@ant-design/x`.

> `@ant-design/x` is based on the latest stable version of TypeScript (`>=5.0.0`), so make sure your project uses a compatible version.

## Installation and Initialization

Before starting, you might need to install [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/).

<InstallDependencies npm='$ npx create-react-app antdx-demo --template typescript' yarn='$ yarn create react-app antdx-demo --template typescript' pnpm='$ pnpm create react-app antdx-demo --template typescript' bun='$ bun create react-app antdx-demo --template typescript'></InstallDependencies>

The tool will automatically initialize a project scaffold and install the necessary dependencies for a React project. If you encounter network issues during this process, try configuring a proxy or using a different npm registry.

Next, navigate into the project and start it.

```bash
$ cd antdx-demo
$ npm run start
```

Your browser will open at http://localhost:3000/, and you should see a "Welcome to React" message if everything was successful.

## Importing @ant-design/x

Here's the default directory structure created by create-react-app.

```
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
└── yarn.lock
```

Now, install and import `@ant-design/x` using yarn, npm, pnpm, or bun.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

Modify `src/App.js` to include the `Bubble` component from `@ant-design/x`.

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

Now, you should see the `Bubble` component from `@ant-design/x` on the page. You can continue building your application using other components. For more development processes, refer to the official [create-react-app documentation](https://create-react-app.dev/docs/getting-started).

### Custom Theme

Refer to [Customize Theme](https://ant-design.antgroup.com/docs/react/customize-theme-cn) and use `XConfigProvider` for theme configuration:

```tsx
import React from 'react';
import { XConfigProvider } from '@ant-design/x';

const App: React.FC = () => (
  <XConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
    <MyApp />
  </XConfigProvider>
);

export default App;
```

`@ant-design/x` is written in TypeScript and provides complete type definitions, allowing you to enjoy component property suggestions and definition checks.

Now that we've successfully run the `@ant-design/x` component, start building your application!
