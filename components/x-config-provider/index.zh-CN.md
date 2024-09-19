---
category: Components
group: 其他
title: XConfigProvider
subtitle: 全局化配置
description: 为组件提供统一的全局化配置。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/originaloriginal
demo:
  cols: 1
---

## 使用说明

`XConfigProvider` 继承了 `antd` 的 `ConfigProvider`，且为 `@ant-design/x` 中的组件提供全局化配置。

如果您已经使用 `antd` 的 `ConfigProvider`，请对您的代码做如下变更：

```tsx
- import { ConfigProvider } from 'antd';
+ import { XConfigProvider } from '@ant-design/x';

- <ConfigProvider {...configProps}>
- // ...
- </ConfigProvider>

+ <XConfigProvider {...configProps}>
+ // ...
+ </XConfigProvider>
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/use.tsx" background="grey">使用</code>

## API

属性参考：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)
