---
category: Components
group:
  title: Expression
  order: 2
title: Mermaid
subtitle: Diagram Tool
description: Used to render diagrams with Mermaid.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When to Use

- Need to render Mermaid diagrams in the application
- Want to provide interactive features like zoom, pan, and code view
- Need to support both image and code view modes

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/custom-header.tsx">Custom Header</code>
<code src="./demo/with-xmarkdown.tsx">With XMarkdown</code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Code content | `string` | - |
| header | Header | `React.ReactNode \| null` | React.ReactNode |
| className | Style class name | `string` | |
| classNames | Style class name | `string` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Theme Variables (Design Token)

<ComponentTokenTable component="Mermaid"></ComponentTokenTable>
