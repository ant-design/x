---
title: Examples
order: 2
---

## When to use

Used to render streaming Markdown format returned by LLM.

## Code Demos

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="Render basic markdown syntax." title="Basic Usage"></code>
<code src="./demo/codeDemo/streaming.tsx" description="Work with `Bubble` to implement streaming conversations." title="Streaming Render"></code>
<code src="./demo/codeDemo/components.tsx" description="Custom component rendering tags." title="Component Tags"></code>
<code src="./demo/codeDemo/supersets.tsx" description="Render with plugins" title="Plugin Usage"></code>
<code src="./demo/codeDemo/plugin.tsx" title="Custom Extension Plugin"></code>
<code src="./demo/codeDemo/xss.tsx" title="XSS Defense"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content | `string` | - |
| children | Markdown content, same as content | `string` | - |
| components | Custom components | `Record<string, React.FC<Props>>`, see [details](/markdowns/components) | - |
| streaming | Streaming rendering configuration | `StreamingOption` | - |
| config | Marked.js extension | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| className | Custom className | `string` | - |
| rootClassName | Custom className for the root node, same as className | `string` | - |
| style | Custom style | `CSSProperties` | - |

### StreamingOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is a next chunk, if false, clear all cache and render | `boolean` | `false` |
| enableAnimation | Whether to enable text animation, supports `p, li, h1, h2, h3, h4` | `boolean` | `false` |
| animationConfig | Text animation configuration | [`ControllerUpdate`](https://react-spring.dev/docs/typescript#controllerupdate) | `{ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 170, friction: 26 } }` |
