---
group:
  title: Plugins
title: HighlightCode
order: 3
---

## When to Use

When you need to render highlighted code blocks in Markdown.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/supersets/HighlightCode/basic.tsx"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Language | `string` | - |
| children | Code content | `string` | - |
| header | Header section | `React.ReactNode \| null` | React.ReactNode |
| className | Style class name | `string` | |
| classNames | Style class names | `string` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |

## Semantic DOM

<code src="./demo/supersets/HighlightCode/_semantic.tsx" simplify="true"></code>

## Design Token

<XMarkdownComponentTokenTable component="HighlightCode"></XMarkdownComponentTokenTable>
