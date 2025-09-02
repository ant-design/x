---
group:
  title: 插件集
title: 主题和国际化
order: 6
---

使用 XProvider 全局化配置实现插件的主题和国际化。

## 使用

XProvider 使用 React 的 context 特性，只需在应用外围包裹一次即可全局生效。XProvider 继承了 antd 的 ConfigProvider，且为 @ant-design/x 中的组件提供全局化配置。如果您已经使用 antd 的 ConfigProvider，请对您的代码做如下变更：

```diff
- import { ConfigProvider } from 'antd';
+ import { XProvider } from '@ant-design/x';

  const App = () => (
-   <ConfigProvider>
+   <XProvider>
      <YourApp />
-   </ConfigProvider>
+   </XProvider>
  );
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/xprovider/locale.tsx">国际化</code>
