---
group:
  title: Plugins
title: Mermaid
order: 4
---

## When to Use

When you need to render Mermaid diagrams in Markdown.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/supersets/Mermaid/basic.tsx">Basic Usage</code>
<code src="./demo/supersets/Mermaid/streaming.tsx">Streaming Conversation</code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Diagram content | `string` | - |
| header | Header section | `React.ReactNode \| null` | React.ReactNode |
| className | Style class name | `string` | |
| classNames | Style class names | `string` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |

## Semantic DOM

<code src="./demo/supersets/Mermaid/_semantic.tsx" simplify="true"></code>
