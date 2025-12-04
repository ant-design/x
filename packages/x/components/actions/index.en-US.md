---
category: Components
group:
  title: Feedback
  order: 4
title: Actions
description: Used for quickly configuring required action buttons or features in some AI scenarios.
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/DAQYQqFa5n0AAAAAQFAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/bcXhRphVOuIAAAAAQFAAAAgADtFMAQFr/original
demo:
  cols: 2
---

## When to Use

The Actions component is used for quickly configuring required action buttons or features in some AI scenarios.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/sub.tsx">More Menu Items</code>
<code src="./demo/preset.tsx">Preset Templates</code>
<code src="./demo/variant.tsx">Using Variants</code>
<code src="./demo/fadeIn.tsx">Fade In Effect</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ActionsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | List containing multiple action items | ([ItemType](#itemtype) \| ReactNode)[] | - | - |
| onClick | Callback function when component is clicked | function({ item, key, keyPath, domEvent }) | - | - |
| dropdownProps | Configuration properties for dropdown menu | DropdownProps | - | - |
| variant | Variant | `borderless` \| `outlined` \|`filled` | `borderless` | - |
| fadeIn | Fade in effect | boolean | - | - |
| fadeInLeft | Fade left in effect | boolean | - | - |

### ItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier for custom action | string | - | - |
| label | Display label for custom action | string | - | - |
| icon | Icon for custom action | ReactNode | - | - |
| onItemClick | Callback function when custom action button is clicked | (info: [ItemType](#itemtype)) => void | - | - |
| danger | Syntactic sugar, sets danger icon | boolean | false | - |
| subItems | Sub action items | Omit<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'>[] | - | - |
| triggerSubMenuAction | Action to trigger the sub-menu | `hover` \| `click` | `hover` | - |
| actionRender | Custom render action item content | (item: [ItemType](#itemtype)) => ReactNode | - | - |

### Actions.Feedback

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| value | Feedback status value | `like` \| `dislike` \| `default` | `default` | - |
| onChange | Feedback status change callback | (value: `like` \| `dislike` \| `default`) => void | - | - |

### Actions.Copy

| Property | Description       | Type            | Default | Version |
| -------- | ----------------- | --------------- | ------- | ------- |
| text     | Text to be copied | string          | ''      | -       |
| icon     | Copy button       | React.ReactNode | -       | -       |

### Actions.Audio

| Property | Description     | Type                                     | Default | Version |
| -------- | --------------- | ---------------------------------------- | ------- | ------- |
| status   | Playback status | 'loading'\|'error'\|'running'\|'default' | default | -       |

### Actions.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| status | Status | 'loading'\|'error'\|'running'\|'default' | default | - |
| label | Display label for custom action | string | - | - |
| defaultIcon | Default status icon | React.ReactNode | - | - |
| runningIcon | Running status icon | React.ReactNode | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Actions"></ComponentTokenTable>
