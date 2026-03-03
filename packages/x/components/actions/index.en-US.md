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
| fadeIn | Fade in effect | boolean | - | 2.0.0 |
| fadeInLeft | Fade left in effect | boolean | - | 2.0.0 |

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
| value | Feedback status value | `like` \| `dislike` \| `default` | `default` | 2.0.0 |
| onChange | Feedback status change callback | (value: `like` \| `dislike` \| `default`) => void | - | 2.0.0 |

### Actions.Copy

| Property | Description       | Type            | Default | Version |
| -------- | ----------------- | --------------- | ------- | ------- |
| text     | Text to be copied | string          | ''      | 2.0.0   |
| icon     | Copy button       | React.ReactNode | -       | 2.0.0   |

### Actions.Audio

| Property | Description     | Type                                     | Default | Version |
| -------- | --------------- | ---------------------------------------- | ------- | ------- |
| status   | Playback status | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0   |

### Actions.Item

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| status | Status | 'loading'\|'error'\|'running'\|'default' | default | 2.0.0 |
| label | Display label for custom action | string | - | 2.0.0 |
| defaultIcon | Default status icon | ReactNode | - | 2.0.0 |
| runningIcon | Running status icon | ReactNode | - | 2.0.0 |

## Semantic DOM

### Actions

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Actions.Copy

<code src="./demo/_semantic-copy.tsx" simplify="true"></code>

### Actions.Feedback

<code src="./demo/_semantic-feedback.tsx" simplify="true"></code>

### Actions.Audio

<code src="./demo/_semantic-audio.tsx" simplify="true"></code>

### Actions.Item

<code src="./demo/_semantic-item.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Actions"></ComponentTokenTable>
