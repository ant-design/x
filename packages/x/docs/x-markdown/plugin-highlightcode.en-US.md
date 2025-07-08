---
group:
  title: Plugins
  order: 2
title: HighlightCode
order: 3
---

## When to Use

When you need to render highlighted code blocks in Markdown.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/supersets/HighlightCode/basic.tsx">Basic Usage</code>
<code src="./demo/supersets/HighlightCode/streaming.tsx">Streaming Conversation</code>

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

## Design Tokens

<ComponentTokenTable component="HighlightCode"></ComponentTokenTable>
