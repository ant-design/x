---
category: Components
group:
  title: Wake
  order: 1
title: Prompts
order: 1
description: Display a predefined set of questions or suggestion.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UfhXRamlAf0AAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*3CN5RLKP0X4AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

The Prompts component is used to display a predefined set of questions or suggestion that are relevant to the current context.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/flex-vertical.tsx">Vertical</code>
<code src="./demo/flex-wrap.tsx">Wrap</code>
<code src="./demo/flex-wrap-fixed.tsx">Responsive Size</code>
<code src="./demo/nest.tsx">Nest Usage</code>
<code src="./demo/fadeIn.tsx">Fade In Effect</code>

## API

### PromptsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names for different parts of each prompt item. | Record<SemanticType, string> | - | - |
| items | List containing multiple prompt items. | PromptProps[] | - | - |
| prefixCls | Prefix for style class names. | string | - | - |
| rootClassName | Style class name for the root node. | string | - | - |
| styles | Custom styles for different parts of each prompt item. | Record<SemanticType, React.CSSProperties> | - | - |
| title | Title displayed at the top of the prompt list. | React.ReactNode | - | - |
| vertical | When set to `true`, the Prompts will be arranged vertically. | boolean | `false` | - |
| wrap | When set to `true`, the Prompts will automatically wrap. | boolean | `false` | - |
| onItemClick | Callback function when a prompt item is clicked. | (info: { data: PromptProps }) => void | - | - |
| fadeIn | Fade in effect | boolean | - | - |
| fadeInLeft | Fade left in effect | boolean | - | - |

#### SemanticType

```typescript | pure
type SemanticType = 'list' | 'item' | 'content' | 'title' | 'subList' | 'subItem';
```

### PromptProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Nested child prompt items. | PromptProps[] | - | - |
| description | Prompt description providing additional information. | React.ReactNode | - | - |
| disabled | When set to `true`, click events are disabled. | boolean | `false` | - |
| icon | Prompt icon displayed on the left side of the prompt item. | React.ReactNode | - | - |
| key | Unique identifier used to distinguish each prompt item. | string | - | - |
| label | Prompt label displaying the main content of the prompt. | React.ReactNode | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
