---
title: Code Examples
order: 2
tag: 2.0.0
category: Components
componentName: XMarkdown
packageName: x-markdown
---

## When to Use

Use this page to get a minimal setup for rendering LLM Markdown output.

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" title="Basic Rendering" description="Smallest working setup"></code>
<code src="./demo/streaming/combined.tsx" title="Streaming Rendering" description="Syntax recovery + animation"></code>
<code src="./demo/components/codeHighlighter.tsx" title="Component Extension" description="Map code block to CodeHighlighter"></code>
<code src="./demo/codeDemo/supersets.tsx" title="Plugin Extension" description="Extend Markdown syntax"></code>
<code src="./demo/codeDemo/escape-raw-html.tsx" title="Security & Links" description="Escape raw HTML and open links in new tab; see Streaming format demo for dompurifyConfig"></code>

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content to render | `string` | - |
| children | Markdown content (use either `content` or `children`) | `string` | - |
| components | Map HTML nodes to custom React components | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>` | - |
| streaming | Streaming behavior config | `StreamingOption` | - |
| config | Marked parse config, applied last and may override built-in renderers | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| rootClassName | Extra CSS class for the root element | `string` | - |
| className | Extra CSS class for the root container | `string` | - |
| paragraphTag | HTML tag for paragraphs (avoids validation issues when custom components contain block elements) | `keyof JSX.IntrinsicElements` | `'p'` |
| style | Inline styles for the root container | `CSSProperties` | - |
| prefixCls | CSS class name prefix for component nodes | `string` | - |
| openLinksInNewTab | Add `target="_blank"` to all links so they open in a new tab | `boolean` | `false` |
| dompurifyConfig | DOMPurify config for HTML sanitization and XSS protection | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| protectCustomTagNewlines | Whether to preserve newlines inside custom tags | `boolean` | `false` |
| escapeRawHtml | Escape raw HTML in Markdown as plain text (do not parse as real HTML), to prevent XSS while keeping content visible | `boolean` | `false` |
| debug | Enable debug mode (performance overlay) | `boolean` | `false` |

### StreamingOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether more chunks are expected. Set `false` to flush cache and finish rendering | `boolean` | `false` |
| enableAnimation | Whether to enable fade-in animation for block elements | `boolean` | `false` |
| animationConfig | Animation options (for example fade duration and easing) | `AnimationConfig` | - |
| incompleteMarkdownComponentMap | Map incomplete Markdown fragments to custom loading components | `Partial<Record<'link' \| 'image' \| 'html' \| 'emphasis' \| 'list' \| 'table' \| 'inline-code', string>>` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |

## Related Docs

- [Component Extension](/x-markdowns/components)
- [Streaming](/x-markdowns/streaming)
