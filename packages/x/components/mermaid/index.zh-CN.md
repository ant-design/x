---
category: Components
group:
  title: 反馈
  order: 4
title: Mermaid
subtitle: 图表工具
description: 用于渲染图表工具 Mermaid。
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/yTn9SILS900AAAAAPaAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/uYcMRYLDTCMAAAAAQBAAAAgADtFMAQFr/original
tag: 2.1.0
---

## 何时使用

- 用于在应用中渲染支持缩放、平移、图像/代码双视图切换的交互式 Mermaid 图表。
- 与 XMarkdown 结合使用，可在 Markdown 内容中渲染 Mermaid，并增强交互功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/custom-header.tsx">自定义 Header</code>
<code src="./demo/header-actions.tsx">Header Actions</code>
<code src="./demo/with-xmarkdown.tsx">配合 XMarkdown</code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 代码内容 | `string` | - |
| header | 顶部 | `React.ReactNode \| null` | React.ReactNode |
| className | 样式类名 | `string` | - |
| classNames | 样式类名 | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', string>>` | - |
| styles | 样式对象 | `Partial<Record<'root' \| 'header' \| 'graph' \| 'code', React.CSSProperties>>` | - |
| highlightProps | 代码高亮配置 | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| config | Mermaid 配置项 | `MermaidConfig` | - |
| actions | 操作栏配置 | `{ enableZoom?: boolean; enableDownload?: boolean; enableCopy?: boolean; customActions?: ItemType[] }` | `{ enableZoom: true, enableDownload: true, enableCopy: true }` |
| onRenderTypeChange | 渲染类型切换回调 | `(value: 'image' \| 'code') => void` | - |
| prefixCls | 样式前缀 | `string` | - |
| style | 自定义样式 | `React.CSSProperties` | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Mermaid"></ComponentTokenTable>

## FAQ

### 使用 `config` 时，如何避免重复渲染或重复初始化？

当传递 `config` prop 时，请确保其为引用稳定的对象。避免在 `JSX` 中直接传入对象字面量（如 `config={{ theme: 'base' }}`），否则每次父组件重渲染都会触发 `Mermaid` 重新初始化。

✅ 推荐做法：

```tsx
// 动态配置：使用 useMemo 缓存
const config = React.useMemo(
  () => ({
    theme: isDark ? 'dark' : 'base',
    fontFamily: 'monospace',
  }),
  [isDark],
);

// 静态配置：提取为常量
const CONFIG = { theme: 'base', fontFamily: 'monospace' } as const;

<Mermaid config={config}>{code}</Mermaid>;
```
