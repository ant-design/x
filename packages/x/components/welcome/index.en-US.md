---
category: Components
group:
  title: Wake
  order: 1
title: Welcome
order: 0
description: Clearly convey the scope of intent and expected functionality to the user.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*sSjhQ6q2-Z0AAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-gLqQpan1NAAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Use the appropriate welcome recommendation component to effectively reduce the user's learning cost and allow the user to quickly understand and start smoothly.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/variant.tsx">Variant</code>
<code src="./demo/background.tsx">Background</code>

## API

### WelcomeProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom style class names for different parts of each prompt item. | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| description | The description displayed in the prompt list. | React.ReactNode | - | - |
| extra | The extra operation displayed at the end of the prompt list. | React.ReactNode | - | - |
| icon | The icon displayed on the front side of the prompt list. | React.ReactNode | - | - |
| rootClassName | The style class name of the root node. | string | - | - |
| styles | Custom styles for different parts of each prompt item. | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| title | The title displayed at the top of the prompt list. | React.ReactNode | - | - |
| variant | Variant type. | 'filled' \| 'borderless' | 'filled' | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Welcome"></ComponentTokenTable>
