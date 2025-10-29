---
title: Code Examples
order: 2
---

## When To Use

Used for rendering streaming Markdown format returned by LLMs.

## Code Demos

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="Basic Markdown syntax rendering." title="Basic Usage"></code>
<code src="./demo/streaming/combined.tsx" description="Incomplete syntax processing and animation effects." title="Streaming Rendering"></code>
<code src="./demo/codeDemo/supersets.tsx" description="Rendering with plugins." title="Plugin Usage"></code>
<code src="./demo/codeDemo/components.tsx" description="Custom component rendering tags." title="Custom Components"></code>
<code src="./demo/codeDemo/plugin.tsx" title="Custom Extension Plugin"></code>
<code src="./demo/codeDemo/tokenizer.tsx" title="Custom Markers"></code>
<code src="./demo/codeDemo/walkTokens.tsx" title="Token Processing"></code>
<code src="./demo/codeDemo/renderer.tsx" title="Pre-rendering Processing"></code>
<code src="./demo/codeDemo/link.tsx" title="Chinese Link Processing"></code>
<code src="./demo/codeDemo/xss.tsx" title="XSS Protection"></code>
<code src="./demo/codeDemo/open-links-in-new-tab.tsx" description="Open links in new tab." title="Open Links in New Tab"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content to be rendered | `string` | - |
| children | Markdown content, alias for `content` property | `string` | - |
| components | Custom React components to replace HTML elements | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>`, see [details](/x-markdowns/components) | - |
| paragraphTag | Custom HTML tag for paragraph elements. Prevents validation errors when custom components contain block-level elements | `keyof JSX.IntrinsicElements` | `'p'` |
| streaming | Configuration for streaming rendering behavior | `SteamingOption`, see [details](/x-markdowns/streaming) | - |
| config | Marked.js configuration for Markdown parsing and extensions | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| openLinksInNewTab | Whether to add `target="_blank"` to all anchor tags | `boolean` | `false` |
| dompurifyConfig | DOMPurify configuration for HTML sanitization and XSS protection | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| className | Additional CSS class name for the root container | `string` | - |
| rootClassName | Alias for `className`, additional CSS class for the root element | `string` | - |
| style | Inline styles for the root container | `CSSProperties` | - |

### SteamingOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Indicates whether more content chunks are expected. When false, flushes all cached content and completes rendering | `boolean` | `false` |
| enableAnimation | Enables text fade-in animation for block elements (`p`, `li`, `h1`, `h2`, `h3`, `h4`) | `boolean` | `false` |
| animationConfig | Configuration for text appearance animation effects | `AnimationConfig` | `{ fadeDuration: 200, opacity: 0.2 }` |
| incompletePlaceholderMap | Placeholder mapping for unclosed Markdown elements, supports custom placeholder components for links and images | `{ link?: string; image?: string }` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |

#### AnimationConfig

| Property     | Description                                                 | Type     | Default |
| ------------ | ----------------------------------------------------------- | -------- | ------- |
| fadeDuration | Duration of the fade-in animation in milliseconds           | `number` | `200`   |
| opacity      | Initial opacity value for characters during animation (0-1) | `number` | `0.2`   |

### ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component Element from html-react-parser, contains the parsed DOM node information | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | Streaming rendering supports two states: `loading` indicates content is being loaded, and `done` indicates loading is complete. Currently, only HTML format and fenced code blocks are supported. Since indented code blocks lack a clear end delimiter, they always return the `done` state. | `'loading' \| 'done'` | - |
| rest | Component properties, supports all standard HTML attributes (e.g. `href`, `title`, `className`, etc.) and custom data attributes | `Record<string, any>` | - |

## FAQ

### Difference Between Components and Config Marked Extensions

#### Config Marked Extensions (Plugin Extensions)

The [`extensions`](https://marked.js.org/using_pro#extensions) in the `config` property are used to extend the functionality of the Markdown parser, acting during the **Markdown to HTML conversion process**:

- **Stage**: Markdown parsing stage
- **Function**: Recognize and convert special Markdown syntax
- **Example**: Convert `[^1]` footnote syntax to `<footnote>1</footnote>` HTML tags
- **Use Case**: Extend Markdown syntax to support more markup formats

```typescript
// Plugin example: Footnote extension
const footnoteExtension = {
  name: 'footnote',
  level: 'inline',
  start(src) { return src.match(/\[\^/)?.index; },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'footnote',
        raw: match[0],
        text: match[1]
      };
    }
  },
  renderer(token) {
    return `<footnote>${token.text}</footnote>`;
  }
};

// Using the plugin
<XMarkdown
  content="This is a footnote example[^1]"
  config={{ extensions: [footnoteExtension] }}
/>
```

### Components (Component Replacement)

The `components` property is used to replace generated HTML tags with custom React components:

- **Stage**: HTML rendering stage
- **Function**: Replace HTML tags with React components
- **Example**: Replace `<footnote>1</footnote>` with `<CustomFootnote>1</CustomFootnote>`
- **Use Case**: Customize tag rendering styles and interactive behavior

```typescript
// Custom footnote component
const CustomFootnote = ({ children, ...props }) => (
  <sup
    className="footnote-ref"
    onClick={() => console.log('Clicked footnote:', children)}
    style={{ color: 'blue', cursor: 'pointer' }}
  >
    {children}
  </sup>
);

// Using component replacement
<XMarkdown
  content="<footnote>1</footnote>"
  components={{ footnote: CustomFootnote }}
/>
```
