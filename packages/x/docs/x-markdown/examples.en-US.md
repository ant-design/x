---
title: Code Examples
order: 2
---

## When to Use

Used for rendering streaming Markdown format returned by LLM.

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="Basic markdown syntax rendering." title="Basic Usage"></code>
<code src="./demo/streaming/combined.tsx" description="Incomplete syntax handling and animation effects" title="Streaming Processing"></code>
<code src="./demo/codeDemo/supersets.tsx" description="Rendering with plugins." title="Plugin Usage"></code>
<code src="./demo/codeDemo/components.tsx" description="Custom component rendering tags." title="Custom Components"></code>
<code src="./demo/codeDemo/footer.tsx" description="Display loading indicators or status information at the end" title="Footer Support"></code>
<code src="./demo/codeDemo/plugin.tsx" title="Custom Extension Plugin"></code>
<code src="./demo/codeDemo/tokenizer.tsx" title="Custom Tokens"></code>
<code src="./demo/codeDemo/walkTokens.tsx" title="Token Processing"></code>
<code src="./demo/codeDemo/renderer.tsx" title="Pre-rendering Processing"></code>
<code src="./demo/codeDemo/link.tsx" title="Chinese Link Handling"></code>
<code src="./demo/codeDemo/xss.tsx"  title="XSS Defense"></code>
<code src="./demo/codeDemo/open-links-in-new-tab.tsx" description="Open links in new tab." title="Open Links in New Tab"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content to render | `string` | - |
| children | Markdown content, alias for `content` prop | `string` | - |
| components | Custom React components to replace HTML elements | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>`, see [details](/x-markdowns/components) | - |
| paragraphTag | Custom HTML tag for paragraph elements to prevent validation errors when custom components contain block-level elements | `keyof JSX.IntrinsicElements` | `'p'` |
| streaming | Configuration for streaming rendering behavior | `StreamingOption`, see [syntax processing](/x-markdowns/streaming-syntax) and [animation effects](/x-markdowns/streaming-animation) | - |
| footer | React node displayed at the end | `React.ReactNode` | - |
| footerClassName | The CSS class for the footer | `string` | - |
| footerStyle | The styles for the footer | `CSSProperties` | - |
| config | Marked.js configuration for Markdown parsing and extensions | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| openLinksInNewTab | Whether to add `target="_blank"` to all a tags | `boolean` | `false` |
| dompurifyConfig | DOMPurify configuration for HTML sanitization and XSS protection | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| className | Additional CSS class for root container | `string` | - |
| rootClassName | Alias for `className`, additional CSS class for root element | `string` | - |
| style | Inline styles for root container | `CSSProperties` | - |

### StreamingOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Indicates whether there are subsequent content chunks. When false, flushes all caches and completes rendering | `boolean` | `false` |
| enableAnimation | Enables text fade-in animation for block-level elements (`p`, `li`, `h1`, `h2`, `h3`, `h4`) | `boolean` | `false` |
| animationConfig | Configuration for text appearance animation effects | `AnimationConfig` | `{ fadeDuration: 200, opacity: 0.2 }` |
| incompleteMarkdownComponentMap | Custom component names for incomplete syntax. When streaming output contains unclosed Markdown syntax (e.g., incomplete tables, unterminated code blocks), you can manually specify the component name to wrap the fragment for placeholder or loading states. | `{ link?: string; image?: string; table?: string; html?: string }` | `{}` |

#### AnimationConfig

| Property     | Description                                                 | Type     | Default |
| ------------ | ----------------------------------------------------------- | -------- | ------- |
| fadeDuration | Duration of fade-in animation in milliseconds               | `number` | `200`   |
| opacity      | Initial opacity value for characters during animation (0-1) | `number` | `0.2`   |

### ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component DOM node from html-react-parser, containing parsed DOM node information | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | Streaming rendering supports two states: `loading` indicates content is being loaded, `done` indicates loading is complete. Currently only supports HTML format and fenced code blocks. Since indented code blocks have no explicit terminator, they always return `done` status | `'loading' \| 'done'` | - |
| rest | Component props, supports all standard HTML attributes (e.g., `href`, `title`, `className`) and custom data attributes | `Record<string, any>` | - |

## FAQ

### Difference Between Components and Config Marked Extensions

#### Config Marked Extensions (Plugin Extensions)

The [`extensions`](https://marked.js.org/using_pro#extensions) in the `config` property are used to extend the functionality of the Markdown parser, they take effect **during the Markdown to HTML conversion process**:

- **Stage**: Markdown parsing stage
- **Function**: Recognize and convert special Markdown syntax
- **Example**: Convert `[^1]` footnote syntax to `<footnote>1</footnote>` HTML tag
- **Use Case**: Extend Markdown syntax to support more markup formats

```typescript
// Plugin example: footnote extension
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
- **Use Case**: Customize rendering styles and interactive behavior of tags

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

### Incomplete Syntax Token Conversion

When `hasNextChunk` is `true`, all incomplete syntax tokens are automatically converted to `incomplete-token` form, and the incomplete syntax is returned via the `data-raw` property. The supported token type is `StreamCacheTokenType`. For example:

- Incomplete link `[example](https://example.com` will be converted to `<incomplete-link data-raw="[example](https://example.com">`
- Incomplete image `![product](https://cdn.example.com/images/produc` will be converted to `<incomplete-image data-raw="![product](https://cdn.example.com/images/produc">`
- Incomplete heading `###` will be converted to `<incomplete-heading data-raw="###">`

#### StreamCacheTokenType Type

`StreamCacheTokenType` is an enumeration type that defines all Markdown syntax token types supported during streaming processing:

```typescript
type StreamCacheTokenType =
  | 'text' // Plain text
  | 'link' // Link syntax [text](url)
  | 'image' // Image syntax ![alt](src)
  | 'heading' // Heading syntax # ## ###
  | 'emphasis' // Emphasis syntax *italic* **bold**
  | 'list' // List syntax - + *
  | 'table' // Table syntax | header | content |
  | 'xml'; // XML/HTML tags <tag>
```
