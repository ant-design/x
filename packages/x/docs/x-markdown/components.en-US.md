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

## Passing extra props

Custom components often need business data (theme, callbacks, etc.). Passing it via an inline function creates a new component reference on every render, so React unmounts and remounts the whole subtree — losing internal state and hurting performance in streaming scenarios. Use `componentsProps` to pass extra props while keeping component references stable:

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x';

// ❌ Inline function: a new component type every render, the subtree is rebuilt
<XMarkdown
  components={{
    'custom-chart': (props) => <CustomChart {...props} theme={theme} onSelect={onSelect} />,
  }}
/>;

// ✅ Stable component reference; extra data flows through componentsProps
<XMarkdown
  components={{ 'custom-chart': CustomChart }}
  componentsProps={{ 'custom-chart': { theme, onSelect } }}
/>;
```

`componentsProps` is keyed by tag name. Its props are merged with the parsed HTML attributes and passed to the component (`componentsProps` wins on conflicts). When `componentsProps` changes, the component receives a normal props update without being remounted.

## Best Practices

1. Keep component references stable. Avoid inline function components in `components`; use `componentsProps` to pass extra data.
2. Use `streamStatus` to separate loading UI (`loading`) from finalized UI (`done`).
3. If data depends on complete syntax, fetch or parse after `streamStatus === 'done'`.
4. Keep custom tags semantically clear and avoid ambiguous mixed Markdown/HTML blocks.

## FAQ: Custom Tag Closing Issues

If block-level custom tags contain unexpected blank lines, Markdown parsers may end the HTML block early and convert trailing content into paragraphs. To avoid this:

1. Keep content inside custom tags contiguous when possible.
2. Or place blank lines both before and after the full custom block so the parser treats it as an independent block.
