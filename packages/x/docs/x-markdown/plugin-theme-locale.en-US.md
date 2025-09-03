---
group:
  title: Plugins
title: Theme & Locale
order: 6
---

Use XProvider for global configuration of plugin theme and internationalization.

## Usage

XProvider leverages React's context feature, so you only need to wrap your app once for global effect. XProvider extends antd's ConfigProvider and provides global configuration for components in @ant-design/x. If you are already using antd's ConfigProvider, please update your code as follows:

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

## Code Example

<!-- prettier-ignore -->
<code src="./demo/xprovider/locale.tsx">Locale</code>
<code src="./demo/xprovider/theme.tsx">Theme</code>
