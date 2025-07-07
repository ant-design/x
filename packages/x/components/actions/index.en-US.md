---
category: Components
group:
  title: Feedback
  order: 4
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
<code src="./demo/preset.tsx">Preset Template</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Actions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | A list containing multiple action items | ([ActionItem](#actionitem) \| ReactNode)[] | - | - |
| onClick | Callback function when an action item is clicked | function({ item, key, keyPath, domEvent }) | - | - |
| popupRender | Additional React node content at the bottom | ReactNode | - | - |
| dropdownProps | Configuration properties for dropdown menu | DropdownProps | - | - |
| variant | Variant | `borderless` \| `border` | `borderless` | - |

### ActionItem

```typescript
type ActionItem = ItemType | SubItemType;
```

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier for the custom action | string | - | - |
| label | The display label for the custom action | string | - | - |
| icon | The icon for the custom action | ReactNode | - | - |
| onItemClick | Callback function when the custom action button is clicked | (info: [ActionItem](#actionitem)) => void | - | - |
| subItems | Sub action items | [ActionItem](#actionitem)[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu | `hover` \| `click` | `hover` | - |

### SubItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier for the custom action | string | - | - |
| label | The display label for the custom action | string | - | - |
| icon | The icon for the custom action | ReactNode | - | - |
| onItemClick | Callback function when the custom action button is clicked | (info: [ActionItem](#actionitem)) => void | - | - |
| danger | Syntax sugar, set dangerous icon | boolean | false | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>
