---
category: Components
group: Other
title: XConfigProvider
description: Provide a uniform configuration support for x components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/originaloriginal
demo:
  cols: 1
---

## Use

The `XConfigProvider` extends the `ConfigProvider` from `antd` and provides global configuration for components in `@ant-design/x`.

If you are already using `ConfigProvider` from `antd`, please make the following changes to your code:

```tsx
- import { ConfigProvider } from 'antd';
+ import { XConfigProvider } from '@ant-design/x';

- <ConfigProvider>
- // ...
- </ConfigProvider>

+ <XConfigProvider>
+ // ...
+ </XConfigProvider>
```

## Examples

<!-- prettier-ignore -->
<code src="./demo/use.tsx" background="grey">Use</code>

## API

Props ref：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)
