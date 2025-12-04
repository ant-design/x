---
category: Components
group:
  title: Feedback
  order: 4
title: CodeHighlighter
description: Used to highlight code formatting.
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/_KKkTrXq7wcAAAAAKuAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/c62-S4SH1tUAAAAANuAAAAgADtFMAQFr/original
demo:
  cols: 1
---

## When to Use

The CodeHighlighter component is used in scenarios where you need to display code snippets with syntax highlighting.

- Used to display code snippets with syntax highlighting, providing copy functionality and header language information.
- When used in combination with XMarkdown, it can render code blocks within Markdown content and enhance highlighting display and interactive features.

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/custom-header.tsx">Custom Header</code>
<code src="./demo/with-xmarkdown.tsx">With XMarkdown</code>

## API

For common properties, refer to: [Common Properties](/docs/react/common-props).

### CodeHighlighterProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Language | `string` | - |
| children | Code content | `string` | - |
| header | Header | `React.ReactNode \| null` | React.ReactNode |
| className | Style class name | `string` |  |
| classNames | Style class names | `string` | - |
| highlightProps | Code highlighting configuration | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |

### CodeHighlighterRef

| Property      | Description        | Type        | Version |
| ------------- | ------------------ | ----------- | ------- |
| nativeElement | Get native element | HTMLElement | -       |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Theme Variables (Design Token)

<ComponentTokenTable component="CodeHighlighter"></ComponentTokenTable>
