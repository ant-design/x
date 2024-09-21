---
group:
  title: 如何使用
order: 1
title: 在 create-react-app 中使用
---

[create-react-app](https://create-react-app.dev/) 是业界最优秀的 React 应用开发工具之一，本文会尝试使用 `create-react-app` 创建一个 `TypeScript` 项目，并引入 @ant-design/x。

> `@ant-design/x` 基于最新稳定版本的 TypeScript（`>=5.0.0`），请确保项目中使用匹配的版本。

## 安装和初始化

在开始之前，你可能需要安装 [yarn](https://github.com/yarnpkg/yarn/) 或者 [pnpm](https://pnpm.io/zh/) 或者 [bun](https://bun.sh/)。

<InstallDependencies npm='$ npx create-react-app antdx-demo --template typescript' yarn='$ yarn create react-app antdx-demo --template typescript' pnpm='$ pnpm create react-app antdx-demo --template typescript' bun='$ bun create react-app antdx-demo --template typescript'></InstallDependencies>

工具会自动初始化一个脚手架并安装 React 项目的各种必要依赖，如果在过程中出现网络问题，请尝试配置代理或使用其他 npm registry。

然后我们进入项目并启动。

```bash
$ cd antdx-demo
$ npm run start
```

此时浏览器会访问 http://localhost:3000/ ，看到 `Welcome to React` 的界面就算成功了。

## 引入 @ant-design/x

这是 create-react-app 生成的默认目录结构。

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

现在从 yarn 或 npm 或 pnpm 安装并引入 @ant-design/x。

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

修改 `src/App.js`，引入 @ant-design/x 的气泡组件。

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

好了，现在你应该能看到页面上已经有了 @ant-design/x 的气泡组件，接下来就可以继续选用其他组件开发应用了。其他开发流程你可以参考 create-react-app 的[官方文档](https://create-react-app.dev/docs/getting-started)。

### 自定义主题

参考 [配置主题](https://ant-design.antgroup.com/docs/react/customize-theme-cn)，通过 XProvider 进行主题配置：

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

`@ant-design/x` 使用 TypeScript 书写并提供了完整的定义，你可以享受组件属性输入建议和定义检查的功能。

我们现在已经把 @ant-design/x 组件成功运行起来了，开始开发你的应用吧！
