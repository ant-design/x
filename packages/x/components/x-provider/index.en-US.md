---
category: Components
group:
  title: Tools
  order: 5
title: XProvider
order: 999
description: Provide a uniform configuration support for x components.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/originaloriginal
demo:
  cols: 1
---

## Use

The `XProvider` extends the `ConfigProvider` from `antd` and provides global configuration for components in `@ant-design/x`.

If you are already using `ConfigProvider` from `antd`, please make the following changes to your code:

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

## Examples

<!-- prettier-ignore -->
<code src="./demo/direction.tsx" background="grey">Direction</code>
<code src="./demo/theme.tsx" background="grey">Theme</code>
<code src="./demo/shortcutKeys.tsx" background="grey">Shortcut Key</code>

## API

`XProvider` fully extends `antd`'s `ConfigProvider`. Props ref：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### Component Config

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| bubble | Global configuration for the Bubble component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| conversations | Global configuration for the Conversations component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;shortcutKeys: {items?: ShortcutKeys<'number'> \| ShortcutKeys<number>[]}}  | - | - |
| prompts | Global configuration for the Prompts component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| sender | Global configuration for the Sender component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| suggestion | Global configuration for the Suggestion component | {style: React.CSSProperties; className: string;} | - |  |
| thoughtChain | Global configuration for the ThoughtChain component | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;}| - |  |
| actions | Global configuration for the Actions component | {style: React.CSSProperties; className: string;}| - |  |

#### ShortcutKeys

```ts
type SignKeysType = {
  Ctrl: keyof KeyboardEvent;
  Alt: keyof KeyboardEvent;
  Meta: keyof KeyboardEvent;
  Shift: keyof KeyboardEvent;
};
type ShortcutKeys<CustomKey = number | 'number'> =
  | [keyof SignKeysType, keyof SignKeysType, CustomKey]
  | [keyof SignKeysType, CustomKey];
```
