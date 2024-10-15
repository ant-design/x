---
category: Components
group:
  title: Other
  order: 3
title: XProvider
description: Provide a uniform configuration support for x components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/originaloriginal
demo:
  cols: 1
---

## Use

The `XProvider` extends the `ConfigProvider` from `antd` and provides global configuration for components in `@ant-design/x`.

If you are already using `ConfigProvider` from `antd`, please make the following changes to your code:

```tsx
- import { ConfigProvider } from 'antd';
+ import { XProvider } from '@ant-design/x';

- <ConfigProvider>
- // ...
- </ConfigProvider>

+ <XProvider>
+ // ...
+ </XProvider>
```

## Examples

<!-- prettier-ignore -->
<code src="./demo/use.tsx" background="grey">Use</code>

## API

`XProvider` fully extends `antd`'s `ConfigProvider`. Props ref：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### Component Config

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bubble | Global configuration for the Bubble component | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| conversations | Global configuration for the Conversations component | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| prompts | Global configuration for the Prompts component | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| sender | Global configuration for the Sender component | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
| suggestion | Global configuration for the Suggestion component | 'className' \| 'style' | - |  |
| thoughtChain | Global configuration for the ThoughtChain component | 'classNames' \| 'styles' \| 'className' \| 'style' | - |  |
