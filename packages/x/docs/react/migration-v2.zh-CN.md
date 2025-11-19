---
group:
  title: 迁移
  order: 5
order: 0
tag: New
title: 从 v1 到 v2
---

本文档将帮助你从 `@ant-design/x 1.x` 版本升级到 `@ant-design/x 2.x` 版本。

## 升级准备

1. 请先将项目中依赖的 antd 升级到 6.x 的最新版本，按照控制台 warning 信息移除/修改相关的 API。

## 2.0 有哪些不兼容的变化

### 运行时相关工具迁移到 `@ant-design/x-sdk`，并进行了全面重构

1、删除了 `useXAgent` 用于模型调度的 Agent 钩子，同时升级了 `useXChat` 作为会话数据管理的钩子工具，用于产出供页面渲染需要的数据，整个实现逻辑都做了重构需要根据新的文档对代码进行修改。

2、新增 `useXConversations` 会话列表管理的钩子，提供包括会话创建、删除、更新等操作，多会话保持等能力。

3、新增 `Chat Provider` 接口实现为 useXChat 提供统一的请求管理和数据格式转换。

### Bubble

### Bubble.List

### Sender

### Attachments.FileCard

### ThoughtChain

## 开始升级

通过 git 保存你的代码，然后按照上述文档进行依赖安装：

```bash
npm install --save antd@5.x
```

如果你需要使用 v4 废弃组件如 `Comment`、`PageHeader`，请安装 `@ant-design/compatible` 与 `@ant-design/pro-components` 做兼容：

```bash
npm install --save @ant-design/compatible@v5-compatible-v4
npm install --save @ant-design/pro-components
```

你可以手动对照上面的列表逐条检查代码进行修改，另外，我们也提供了一个 codemod cli 工具 [@ant-design/codemod-v5](https://github.com/ant-design/codemod-v5) 以帮助你快速升级到 v5 版本。

在运行 codemod cli 前，请先提交你的本地代码修改。

```shell
# 使用 npx 直接运行
npx -p @ant-design/codemod-v5 antd5-codemod src

# 或者使用 pnpm 直接运行
pnpm --package=@ant-design/codemod-v5 dlx antd5-codemod src
```

<video autoplay="" loop="" style="width: 100%; max-height: 600px; object-fit: contain;">
  <source src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/file/A*Sjy5ToW6ow0AAAAAAAAAAAAADrJ8AQ" type="video/webm">
  <source src="https://mdn.alipayobjects.com/huamei_7uahnr/afts/file/A*hTDYQJ2HFTYAAAAAAAAAAAAADrJ8AQ" type="video/mp4">
</video>

> 注意 codemod 不能涵盖所有场景，建议还是要按不兼容的变化逐条排查。

### less 迁移

如果你使用到了 antd 的 less 变量，通过兼容包将 v5 变量转译成 v4 版本，并通过 less-loader 注入：

```js
const { theme } = require('antd/lib');
const { convertLegacyToken, defaultTheme } = require('@ant-design/compatible/lib');

const { defaultAlgorithm, defaultSeed } = theme;

const mapV5Token = defaultAlgorithm(defaultSeed);
const v5Vars = convertLegacyToken(mapV5Token);
const mapV4Token = theme.getDesignToken(defaultTheme);
const v4Vars = convertLegacyToken(mapV4Token);

// Webpack Config
module.exports = {
  // ... other config
  loader: 'less-loader',
  options: {
    lessOptions: {
      modifyVars: v5Vars, // or v4Vars
    },
  },
};
```

同时移除对 antd less 文件的直接引用：

```diff
// Your less file
--  @import (reference) '~antd/es/style/themes/index';
or
--  @import '~antd/es/style/some-other-less-file-ref';
```

### 移除 babel-plugin-import

从 package.json 中移除 `babel-plugin-import`，并从 `.babelrc` 移除该插件：

```diff
"plugins": [
- ["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "antd"],
]
```

Umi 用户可以在配置文件中关闭：

```diff
// config/config.ts or .umirc
export default {
  antd: {
-   import: true,
+   import: false,
  },
};
```

### 替换 Day.js 语言包

将 moment.js 的 locale 替换为 day.js 的 locale 引入：

```diff
-   import moment from 'moment';
+   import dayjs from 'dayjs';
-   import 'moment/locale/zh-cn';
+   import 'dayjs/locale/zh-cn';

-   moment.locale('zh-cn');
+   dayjs.locale('zh-cn');
```

🚨 需要注意 day.js 通过插件系统拓展功能。如果你发现原本 moment.js 的功能在 day.js 中无法使用，请查阅 [day.js 官方文档](https://day.js.org/docs/en/plugin/plugin)。

如果你暂时不想替换 day.js，也可以使用 `@ant-design/moment-webpack-plugin` 插件将 day.js 替换回 moment.js：

```bash
npm install --save-dev @ant-design/moment-webpack-plugin
```

```javascript
// webpack-config.js
import AntdMomentWebpackPlugin from '@ant-design/moment-webpack-plugin';

module.exports = {
  // ...
  plugins: [new AntdMomentWebpackPlugin()],
};
```

### 使用 V4 主题包

如果你不希望样式在升级后发生变化，我们在兼容包中提供了完整的 V4 主题，可以还原到 V4 的样式。

```sandpack
const sandpackConfig = {
  dependencies: {
    '@ant-design/compatible': 'v5-compatible-v4',
  },
};

import {
  defaultTheme,   // 默认主题
  darkTheme,      // 暗色主题
} from '@ant-design/compatible';
import { ConfigProvider, Button, Radio, Space } from 'antd';

export default () => (
  <ConfigProvider theme={defaultTheme}>
    <Space direction="vertical">
      <Button type="primary">Button</Button>
      <Radio.Group>
        <Radio value={1}>A</Radio>
        <Radio value={2}>B</Radio>
        <Radio value={3}>C</Radio>
        <Radio value={4}>D</Radio>
      </Radio.Group>
    </Space>
  </ConfigProvider>
);
```

### 旧版浏览器兼容

Ant Design v5 使用 `:where` css selector 降低 CSS-in-JS hash 值优先级，如果你需要支持旧版本浏览器（如 IE 11、360 浏览器 等等）。可以通过 `@ant-design/cssinjs` 的 `StyleProvider` 去除降权操作。详情请参阅 [兼容性调整](/docs/react/customize-theme-cn#兼容性调整)。

## 多版本共存

一般情况下，并不推荐多版本共存，它会让应用变得复杂（例如样式覆盖、ConfigProvider 不复用等问题）。我们更推荐使用微应用如 [qiankun](https://qiankun.umijs.org/) 等框架进行分页研发。

### 通过别名安装 v5

```bash
$ npm install --save antd-v5@npm:antd@5
# or
$ yarn add antd-v5@npm:antd@5
# or
$ pnpm add antd-v5@npm:antd@5
```

对应的 package.json 为：

```json
{
  "antd": "4.x",
  "antd-v5": "npm:antd@5"
}
```

现在，你项目中的 antd 还是 v4 版本，antd-v5 是 v5 版本。

```tsx
import React from 'react';
import { Button as Button4 } from 'antd'; // v4
import { Button as Button5 } from 'antd-v5'; // v5

export default () => (
  <>
    <Button4 />
    <Button5 />
  </>
);
```

接着配置 ConfigProvider 将 v5 `prefixCls` 改写，防止样式冲突：

```tsx
import React from 'react';
import { ConfigProvider as ConfigProvider5 } from 'antd-v5';

export default () => (
  <ConfigProvider5 prefixCls="ant5">
    <MyApp />
  </ConfigProvider5>
);
```

需要注意的是，npm 别名并不是所有的包管理器都有很好的支持。

## 遇到问题

如果您在升级过程中遇到了问题，请到 [GitHub issues](https://new-issue.ant.design/) 进行反馈。我们会尽快响应和相应改进这篇文档。
