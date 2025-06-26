---
category: Components
group:
  title: Feedback
  order: 0
title: Think
description: Show deep thinking process.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Used to show deep thinking process.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/expand.tsx">Expand</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ThinkProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| children | Think Content | React.ReactNode | - | - |
| title | Text of status | React.ReactNode | - | - |
| icon | Show icon | React.ReactNode | - | - |
| loading | Loading | boolean \| React.ReactNode | false | - |
| defaultExpanded | Default Expand state | boolean | true | - |
| expanded | Expand state | boolean | - | - |
| onExpand | Callback when expand changes | (expand: boolean) => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Think"></ComponentTokenTable>
