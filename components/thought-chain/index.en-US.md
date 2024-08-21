---
category: Components
group: Data Display
title: ThoughtChain
description: The ThoughtChain component is used to visualize and track the call chain of Actions and Tools invoked by an Agent.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*PRjsQpR3rCwAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*yMOdSIMsA8UAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

- Debug and trace complex call chains in the Agent System.
- Similar chain-like scenarios.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">Basic</code>
<code src="./demo/status.tsx" background="grey">Item Status</code>
<code src="./demo/collapsible.tsx" background="grey">Collapsible</code>
<code src="./demo/customization.tsx" background="grey">Item Customization</code>
<code src="./demo/nested.tsx" background="grey">Nested use</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ThoughtChainProps

| Property      | Description                            | Type                                               | Default | Version |
|---------------|----------------------------------------|----------------------------------------------------|---------|---------|
| items         | Chain items                            | ThoughtChainItem[]                                 | None    | -       |
| collapsible   | Whether collapsible                    | boolean \| CollapsibleOptions                                        | None    | -       |
| styles        | Styles for semantic structure          | Record<'item', React.CSSProperties>       | None    | -       |
| classNames    | Class names for semantic structure     | Record<'item', string>                    | None    | -       |
| prefixCls     | Custom prefix                          | string                                             | None    | -       |
| rootClassName | Custom root class name                 | string                                             | None    | -       |

### ThoughtChainItem

| Property     | Description                            | Type                                                        | Default | Version |
|--------------|----------------------------------------|-------------------------------------------------------------|---------|---------|
| key          | Unique identifier                      | string                                                      | None    | -       |
| icon         | Thought chain item icon                | React.ReactNode                                             | None    | -       |
| title        | Thought chain item title               | React.ReactNode                                             | None    | -       |
| description  | Thought chain item description         | React.ReactNode                                             | None    | -       |
| extra        | Thought chain item extra content       | React.ReactNode                                             | None    | -       |
| content      | Thought chain item content             | React.ReactNode                                             | None    | -       |
| footer       | Thought chain item footer              | React.ReactNode                                             | None    | -       |
| status       | Thought chain item status              | 'pending' \| 'success' \| 'error'                               | None    | -       |
| styles       | Styles for semantic structure          | Record<'header' \| 'content' \| 'footer', React.CSSProperties> | None    | -       |
| classNames   | Class names for semantic structure     | Record<'header' \| 'content' \| 'footer', string>   | None    | -       |

### CollapsibleOptions

| Property     | Description                              | Type                     | Default | Version |
|--------------|------------------------------------------|--------------------------|---------|---------|
| expandedKeys | Current expanded keys                    | string[]                 | None    | -       |
| onExpand     | Callback function when expanded keys change | (expandedKeys: string[]) => void | None    | -       |

## Design Token

<ComponentTokenTable component="ThoughtChain"></ComponentTokenTable>
