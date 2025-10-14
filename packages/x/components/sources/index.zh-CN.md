---
category: Sources
group:
  title: 确认
  order: 1
title: Sources
subtitle: 来源引用
description: 展示引用的数据来源地址。
---

## 何时使用

- 在联网搜索模式下展示引用的数据来源地址。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/icon.tsx">使用图标</code>
<code src="./demo/expand.tsx">展开</code>
<code src="./demo/inline.tsx">行内模式</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### SourcesProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 样式类名 | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | 样式 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| title | 标题内容 | React.ReactNode | - | - |
| items | 来源内容 | SourcesItem[] | - | - |
| expandIconPosition | 折叠图标位置 | 'start' \| 'end' | 'start' | - |
| defaultExpanded | 默认是否展开 | boolean | true | - |
| expanded | 是否展开 | boolean | - | - |
| onExpand | 展开事件 | (expand: boolean) => void | - | - |
| onClick | 点击事件 | (item: SourcesItem) => void | - | - |
| inline | 行内模式 | boolean | false | - |
| popoverOverlayWidth | 弹出层宽度 | number \| string | 300 | - |

```typescript
interface SourcesItem {
  key?: React.Key;
  title: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Sources"></ComponentTokenTable>
