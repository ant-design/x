---
category: Components
group:
  title: Confirmation
  order: 1
title: Sources
description: Show the source address of the referenced data.
cover: https://mdn.alipayobjects.com/huamei_b00jk5/afts/img/A*3nEPRYJbNQgAAAAAQFAAAAgAegitAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_b00jk5/afts/img/A*_7mMRrQVcXcAAAAAQEAAAAgAegitAQ/original
demo:
  cols: 1
---

## When To Use

Show the referenced data source address in online search mode.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/expand.tsx">Expand</code>
<code src="./demo/inline.tsx">Inline</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SourcesProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| title | Title content | React.ReactNode | - | - |
| items | Sources Content list | SourcesItem[] | - | - |
| expandIconPosition | Icon position | 'start' \| 'end' | 'start' | - |
| defaultExpanded | Default Expand state | boolean | true | - |
| expanded | Expand state | boolean | - | - |
| onExpand | Callback when expand changes | (expand: boolean) => void | - | - |
| onClick | Callback when click | (item: SourcesItem) => void | - | - |
| inline | Inline mode | boolean | false | - |
| popoverOverlayWidth | popover overlay width | number \| string | 300 | - |

```typescript
interface SourcesItem {
  key?: React.Key;
  title: React.ReactNode;
  url?: string;
  icon?: React.ReactNode;
  description?: React.ReactNode;
}
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Sources"></ComponentTokenTable>
