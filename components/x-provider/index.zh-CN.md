---
category: Components
group: 其他
title: XProvider
subtitle: 全局化配置
description: 为组件提供统一的全局化配置。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/originaloriginal
demo:
  cols: 1
---

## 使用说明

`XProvider` 继承了 `antd` 的 `ConfigProvider`，且为 `@ant-design/x` 中的组件提供全局化配置。

如果您已经使用 `antd` 的 `ConfigProvider`，请对您的代码做如下变更：

```tsx
- import { ConfigProvider } from 'antd';
+ import { XProvider } from '@ant-design/x';

- <ConfigProvider {...configProps}>
- // ...
- </ConfigProvider>

+ <XProvider {...configProps}>
+ // ...
+ </XProvider>
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/use.tsx" background="grey">使用</code>

## API

`XProvider` 完全继承 `antd` 的 `ConfigProvider`, 属性参考：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### 组件配置

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bubble | 气泡组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| conversations | 会话组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| prompts | 提示集组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| sender | 输入框组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| suggestion | 建议组件的全局配置 | 'className' \| 'style' | - |  |
| thoughtChain | 思维链组件的全局配置 | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
