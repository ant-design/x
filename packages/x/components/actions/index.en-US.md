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
<code src="./demo/preset.tsx">Preset Template</code>
<code src="./demo/variant.tsx">Using Variants</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ActionsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | A list containing multiple action items | ([ItemType](#itemtype) \| ReactNode)[] | - | - |
| onClick | Callback function when an action item is clicked | function({ item, key, keyPath, domEvent }) | - | - |
| footer | Additional React node content at the bottom | ReactNode | - | - |
| dropdownProps | Configuration properties for dropdown menu | DropdownProps | - | - |
| variant | Variant | `borderless` \| `border` | `borderless` | - |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | The unique identifier for the custom action | string | - | - |
| label | The display label for the custom action | string | - | - |
| icon | The icon for the custom action | ReactNode | - | - |
| onItemClick | Callback function when the custom action button is clicked | (info: [ItemType](#itemtype)) => void | - | - |
| danger | Syntax sugar, set dangerous icon | boolean | false | - |
| subItems | Sub action items | Omit<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'>[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu | `hover` \| `click` | `hover` | - |
| actionRender | Custom render action item content | (item: [ItemType](#itemtype)) => ReactNode | - | - |

### Actions.Feedback

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Feedback value | `like` \| `dislike` \| `default` | `default` | - |
| onChange | Feedback status change callback | (value: `like` \| `dislike` \| `default`) => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>
