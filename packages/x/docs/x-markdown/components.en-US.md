---
group:
  title: Components
  order: 5
title: Overview
order: 1
---

The `components` property is the primary extension point in `@ant-design/x-markdown`. It lets you map Markdown/HTML nodes to your own React components so you can control rendering, streaming behavior, and business data interaction in one place. To extend further, see [Plugins](/x-markdowns/plugins) and custom renderers.

## Basic registration

```tsx
import React from 'react';
import { Mermaid, Think, XMarkdown } from '@ant-design/x';

<XMarkdown
  components={{
    think: Think,
    mermaid: Mermaid,
  }}
/>;
```

## ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component DOM node from html-react-parser, containing parsed DOM node information | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | Streaming rendering supports two states: `loading` indicates content is being loaded, `done` indicates loading is complete. Currently only supports HTML format and fenced code blocks. Since indented code has no clear end marker, it always returns `done` status | `'loading' \| 'done'` | - |
| children | Content wrapped in the component, containing the text content of DOM nodes | `React.ReactNode` | - |
| rest | Component properties, supports all standard HTML attributes (such as `href`, `title`, `className`, etc.) and custom data attributes | `Record<string, any>` | - |

## Best Practices

1. Keep component references stable. Avoid inline function components in `components`.
2. Use `streamStatus` to separate loading UI (`loading`) from finalized UI (`done`).
3. If data depends on complete syntax, fetch or parse after `streamStatus === 'done'`.
4. Keep custom tags semantically clear and avoid ambiguous mixed Markdown/HTML blocks.

## FAQ: Custom Tag Closing Issues

If block-level custom tags contain unexpected blank lines, Markdown parsers may end the HTML block early and convert trailing content into paragraphs. To avoid this:

1. Keep content inside custom tags contiguous when possible.
2. Or place blank lines both before and after the full custom block so the parser treats it as an independent block.
