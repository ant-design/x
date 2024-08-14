---
category: Components
group: Data Display
title: Prompts
description: Display a predefined set of questions or suggestions.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*1ysXSqEnAckAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*EkYUTotf-eYAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

The Prompts component is used to display a predefined set of questions or suggestions that are relevant to the current context.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/flex-vertical.tsx">Vertical</code>
<code src="./demo/flex-wrap.tsx">Wrap</code>

## API

### PromptsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names for different parts of each prompt item. | Record<'list' \| 'item' \| 'content' \| 'title', string> | - | - |
| items | List containing multiple prompt items. | PromptProps[] | - | - |
| prefixCls | Prefix for style class names. | string | - | - |
| rootClassName | Style class name for the root node. | string | - | - |
| styles | Custom styles for different parts of each prompt item. | Record<'list' \| 'item' \| 'content' \| 'title', React.CSSProperties> | - | - |
| title | Title displayed at the top of the prompt list. | React.ReactNode | - | - |
| vertical | When set to `true`, the Prompts will be arranged vertically. | boolean | `false` | - |
| wrap | When set to `true`, the Prompts will automatically wrap. | boolean | `false` | - |
| onItemClick | Callback function when a prompt item is clicked. | (info: { data: PromptProps }) => void | - | - |

### PromptProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| description | Prompt description providing additional information. | React.ReactNode | - | - |
| disabled | When set to `true`, click events are disabled. | boolean | `false` | - |
| icon | Prompt icon displayed on the left side of the prompt item. | React.ReactNode | - | - |
| key | Unique identifier used to distinguish each prompt item. | string | - | - |
| label | Prompt label displaying the main content of the prompt. | React.ReactNode | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
