---
title: Code Examples
order: 2
---

## When To Use

Used for rendering streaming Markdown format returned by LLMs.

## Code Demos

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="Basic Markdown syntax rendering." title="Basic Usage"></code>
<code src="./demo/codeDemo/streaming.tsx" description="Streaming conversation with `Bubble`." title="Streaming Rendering"></code>
<code src="./demo/codeDemo/components.tsx" description="Custom component rendering tags." title="Custom Components"></code>
<code src="./demo/codeDemo/supersets.tsx" description="Rendering with plugins." title="Plugin Usage"></code>
<code src="./demo/codeDemo/plugin.tsx" title="Custom Extension Plugin"></code>
<code src="./demo/codeDemo/xss.tsx" title="XSS Protection"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content | `string` | - |
| children | Markdown content, same as content | `string` | - |
| components | Custom components | `Record<string, React.FC<ComponentProps>>`, see [details](/markdowns/components) | - |
| paragraphTag | Custom paragraph rendering tag. Avoids errors from p tags wrapping divs in custom components. | `string` | `p` |
| streaming | Streaming rendering configuration | `SteamingOption`, see [details](/markdowns/streaming) | - |
| config | Marked.js extension | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| className | Custom className | `string` | - |
| rootClassName | Root node custom className, same as className | `string` | - |
| style | Custom styles | `CSSProperties` | - |

### SteamingOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is another chunk. If false, clears all cache and renders. | `boolean` | `false` |
| enableAnimation | Whether to enable text animation, supports `p, li, h1, h2, h3, h4` | `boolean` | `false` |
| animationConfig | Text animation configuration | [`ControllerUpdate`](https://react-spring.dev/docs/typescript#controllerupdate) | `{ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 170, friction: 26 } }` |

### ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component Element | [`DomNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| children | Content wrapped in component | `string` | - |
| **rest** | Component properties, supports standard HTML attributes (e.g. `a`(link) href, title) and custom attributes | `Record<string,unknown>` | - |
