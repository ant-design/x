---
category: Components
group:
  title: Confirmation
  order: 3
title: ThoughtChain
description: The ThoughtChain component is used to visualize and track the call chain of an Agent to Actions and Tools.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*GaspS5T6proAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*siL-Qpl794sAAAAAAAAAAAAADgCCAQ/original
tag: 2.0.0
---

## When to use

- To debug and trace the call chain in a complex Agent System.
- For use in similar chain-like scenarios.

## Code Demos

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">Basic Usage</code>
<code src="./demo/status.tsx" background="grey">Node Status</code>
<code src="./demo/simple.tsx">Simple ThoughtChain</code>
<code src="./demo/collapsible.tsx" background="grey">Collapsible</code>
<code src="./demo/controlled-collapsible" background="grey">Controlled Collapsible</code>
<code src="./demo/customization.tsx" background="grey">Customization</code>
<code src="./demo/nested.tsx" background="grey">Nested Usage</code>
<code src="./demo/single-row.tsx" background="grey">Single Row</code>

## API

Reference: [Common API](/docs/react/common-props)

### ThoughtChainProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Collection of thought nodes | ThoughtChainItemType[] | - | - |
| defaultExpandedKeys | Initially expanded nodes | string[] | - | - |
| expandedKeys | Currently expanded nodes | string[] | - | - |
| onExpand | Callback for when expanded nodes change | (expandedKeys: string[]) => void; | - | - |
| line | Line style, no line is shown when `false` | boolean \| 'solid' \| 'dashed' \| 'dotted‌' | 'solid' | - |
| classNames | Class names for semantic structure | Record<'root'\|'item' \| 'itemIcon'\|'itemHeader' \| 'itemContent' \| 'itemFooter', string> | - | - |
| prefixCls | Custom prefix | string | - | - |
| styles | Styles for semantic structure | Record<'root'\|'item' \|'itemIcon'\| 'itemHeader' \| 'itemContent' \| 'itemFooter', React.CSSProperties> | - | - |
| rootClassName | Root element class name | string | - | - |

### ThoughtChainItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Content of the thought node | React.ReactNode | - | - |
| description | Description of the thought node | React.ReactNode | - | - |
| footer | Footer of the thought node | React.ReactNode | - | - |
| icon | Icon of the thought node, not displayed when `false` | false \| React.ReactNode | DefaultIcon | - |
| key | Unique identifier for the thought node | string | - | - |
| status | Status of the thought node | 'loading' \| 'success' \| 'error'\| 'abort' | - | - |
| title | Title of the thought node | React.ReactNode | - | - |
| collapsible | Whether the thought node is collapsible | boolean | false | - |
| blink | Blink mode | boolean | - | - |

### ThoughtChain.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | Custom prefix | string | - | - |
| icon | Icon of the thought chain | React.ReactNode | - | - |
| title | Title of the thought chain | React.ReactNode | - | - |
| description | Description of the thought chain | React.ReactNode | - | - |
| status | Status of the thought chain | 'loading' \| 'success' \| 'error'\| 'abort' | - | - |
| variant | Variant configuration | 'solid' \| 'outlined' \| 'text' | - | - |
| blink | Blink mode | boolean | - | - |

## Semantic DOM

## ThoughtChain

<code src="./demo/_semantic.tsx" simplify="true"></code>

## ThoughtChain.Item

<code src="./demo/_semantic-item.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="ThoughtChain"></ComponentTokenTable>
