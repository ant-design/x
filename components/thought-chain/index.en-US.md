---
category: Components
group:
  title: Confirm
  order: 3
title: ThoughtChain
description: The ThoughtChain component is used to visualize and track the call chain of Actions and Tools invoked by an Agent.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*GaspS5T6proAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*siL-Qpl794sAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

- Debug and trace complex call chains in the Agent System.
- Similar chain-like scenarios.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">Basic</code>
<code src="./demo/size.tsx" background="grey">Size</code>
<code src="./demo/status.tsx" background="grey">Item Status</code>
<code src="./demo/collapsible.tsx" background="grey">Collapsible</code>
<code src="./demo/customization.tsx" background="grey">Item Customization</code>
<code src="./demo/nested.tsx" background="grey">Nested use</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ThoughtChainProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| collapsible | Whether collapsible | boolean \| CollapsibleOptions | None | - |
| classNames | Class names for semantic structure | Record<'item' \| 'itemHeader' \| 'itemContent' \| 'itemFooter', string> | None | - |
| items | Chain items | ThoughtChainItem[] | None | - |
| prefixCls | Custom prefix | string | None | - |
| rootClassName | Custom root class name | string | None | - |
| size | Size | 'large' \| 'middle' \| 'small' | 'middle' | - |
| styles | Styles for semantic structure | Record<'item' \| 'itemHeader' \| 'itemContent' \| 'itemFooter', React.CSSProperties> | None | - |

### ThoughtChainItem

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Thought chain item content | React.ReactNode | None | - |
| description | Thought chain item description | React.ReactNode | None | - |
| extra | Thought chain item extra content | React.ReactNode | None | - |
| footer | Thought chain item footer | React.ReactNode | None | - |
| icon | Thought chain item icon | React.ReactNode | None | - |
| key | Unique identifier | string | None | - |
| status | Thought chain item status | 'pending' \| 'success' \| 'error' | None | - |
| title | Thought chain item title | React.ReactNode | None | - |

### CollapsibleOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| expandedKeys | Current expanded keys | string[] | None | - |
| onExpand | Callback function when expanded keys change | (expandedKeys: string[]) => void | None | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="ThoughtChain"></ComponentTokenTable>
