---
category: Components
group:
  title: 工具
  order: 5
title: XProvider
order: 999
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
<code src="./demo/direction.tsx" background="grey">方向</code>
<code src="./demo/theme.tsx" background="grey">主题</code>
<code src="./demo/shortcutKeys.tsx" background="grey">快捷键</code>

## API

`XProvider` 完全继承 `antd` 的 `ConfigProvider`, 属性参考：[Antd ConfigProvider](https://ant-design.antgroup.com/components/config-provider-cn#api)

### 组件配置

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bubble | 气泡组件的全局配置 |{style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;}| - | - |
| conversations | 会话组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;shortcutKeys: {items?: ShortcutKeys<'number'> \| ShortcutKeys<number>[]}} | - | - |
| prompts | 提示集组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| sender | 输入框组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| suggestion | 建议组件的全局配置 |{style: React.CSSProperties; className: string;} | - |  |
| thoughtChain | 思维链组件的全局配置 | {style: React.CSSProperties; styles: Record<string, React.CSSProperties>;className: string; classNames: Record<string, string>;} | - | - |
| actions | 操作列表组件的全局配置 | {style: React.CSSProperties; className: string;} | - | - |

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
