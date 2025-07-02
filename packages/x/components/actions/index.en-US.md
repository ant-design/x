---
category: Components
group:
  title: Feedback
  order: 0
title: Actions
description: Used for quickly configuring required action buttons or features in some AI scenarios.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*1ysXSqEnAckAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*EkYUTotf-eYAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When to Use

The Actions component is used for quickly configuring required action buttons or features in some AI scenarios.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/sub.tsx">More Menu Items</code>
<code src="./demo/variant.tsx">Using Variants</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Actions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | A list containing multiple action items | ActionItem[] | - | - |
| rootClassName | Style class for the root node | string | - | - |
| onClick | Callback function when an action item is clicked | `function({ item, key, keyPath, selectedKeys, domEvent })` | - | - |
| style | Style for the root node | React.CSSProperties | - | - |
| variant | Variant | `'borderless' \| 'border'` | 'borderless' | - |
| prefixCls | Prefix for style class names | string | - | - |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier for the custom action | string | - | - |
| label | The display label for the custom action | string | - | - |
| icon | The icon for the custom action | ReactNode | - | - |
| children | Sub action items | ActionItem[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu | `hover \| click` | - | - |
| onItemClick | Callback function when the custom action button is clicked | (info: ActionItem) => void | - | - |

### SubItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | The display label for the custom action | string | - | - |
| key | The unique identifier for the custom action | string | - | - |
| icon | The icon for the custom action | ReactNode | - | - |
| onItemClick | Callback function when the custom action button is clicked | (info: ActionItem) => void | - | - |
| danger | Syntax sugar, set dangerous icon | boolean | false | - |

### ActionItem

```typescript
type ActionItem = ItemType | SubItemType;
```
