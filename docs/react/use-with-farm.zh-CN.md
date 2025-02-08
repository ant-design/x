---
group:
  title: 如何使用
order: 6
title: 在 Farm 中使用
tag: New
---

[Farm](https://www.farmfe.org/) 是一个基于 Rust 实现的极速构建引擎，帮助您更快地构建 Web 程序 和 JavaScript 库，本文会尝试使用 `Farm` 创建一个项目，并引入 @ant-design/x。

## 安装和初始化

在开始之前，你可能需要安装 [yarn](https://github.com/yarnpkg/yarn) 或者 [pnpm](https://pnpm.io/zh) 或者 [bun](https://bun.sh)。

<InstallDependencies npm='$ npm create farm@latest' yarn='$ yarn create farm@latest' pnpm='$ pnpm create farm@latest' bun='$ bun create farm@latest'></InstallDependencies>

在初始化的过程中，`farm` 提供了一系列模板供我们选择，这里我们选择 `React` 模板。

工具会自动初始化一个脚手架并安装 React 项目的各种必要依赖，如果在过程中出现网络问题，请尝试配置代理或使用其他 npm registry。

然后我们进入项目并启动。

```bash
$ cd farm-project
$ npm install
$ npm run dev
```

此时访问浏览器 http://localhost:9000, 看到 `Farm with React` 的界面就算成功了。

## 引入 @ant-design/x

现在从 yarn 或 npm 或 pnpm 或 bun 安装并引入 @ant-design/x。

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

修改 `src/main.tsx`，引入 antd 的 Bubble 组件。

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

好了，现在你应该能看到页面上已经有了 @ant-design/x 的气泡组件，接下来就可以继续选用其他组件开发应用了。其它开发流程你可以参考 Farm 的[官方文档](https://www.farmfe.org/zh/)。

### 自定义主题

参考 [配置主题](/docs/react/customize-theme)，通过 ConfigProvider 进行主题配置：

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

我们现在已经把 `@ant-design/x` 组件成功使用 Farm 运行起来了，开始开发你的应用吧！
