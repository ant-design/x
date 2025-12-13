---
group:
  title: Streaming
  order: 4
title: Syntax Processing
order: 1
---

The syntax processing mechanism is specifically designed for streaming rendering scenarios. It can intelligently identify incomplete Markdown syntax structures and provide a smooth user experience through flexible custom component mapping.

## Code Demo

<code src="./demo/streaming/format.tsx" description="Streaming syntax processing effect demo">Streaming Syntax Processing</code>

## API

### streaming

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| **hasNextChunk** | Whether there is subsequent data | `boolean` | `false` |
| **enableAnimation** | Enable text fade-in animation | `boolean` | `false` |
| **animationConfig** | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| **incompleteMarkdownComponentMap** | Custom component names for incomplete syntax. When streaming output contains unclosed Markdown syntax (such as half-finished tables or unterminated code blocks), you can manually specify the component name to wrap the fragment for placeholder or loading states. | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |

### Incomplete Syntax Markup Conversion

When `hasNextChunk` is `true`, all incomplete syntax tokens are automatically converted to `incomplete-token` form, and the incomplete syntax is returned via the `data-raw` property. The supported token type is `StreamCacheTokenType`. For example:

- Incomplete link `[Example](https://example.com` will be converted to `<incomplete-link data-raw="[Example](https://example.com">`
- Incomplete image `![Product Image](https://cdn.example.com/images/produc` will be converted to `<incomplete-image data-raw="![Product Image](https://cdn.example.com/images/produc">`
- Incomplete heading `###` will be converted to `<incomplete-heading data-raw="###">`

### StreamCacheTokenType Type

`StreamCacheTokenType` is an enumeration type that defines all Markdown syntax mark types supported during streaming processing:

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

### Supported Syntax Types

Streaming syntax processing supports integrity checks for the following Markdown syntax:

| Syntax Type | Format Example | Processing Mechanism | Incomplete State Example | Corresponding TokenType |
| --- | --- | --- | --- | --- |
| **Link** | `[text](url)` | Detect unclosed link markers | `[Example Website](https://example` | `link` |
| **Image** | `![alt](src)` | Detect unclosed image markers | `![Product Image](https://cdn.example.com/images/produc` | `image` |
| **Heading** | `# ## ###` etc. | Support progressive rendering of 1-6 level headings | `###` | `heading` |
| **Emphasis** | `*italic*` `**bold**` | Handle emphasis syntax with `*` and `_` | `**Unfinished bold text` | `emphasis` |
| **List** | `- + *` list markers | Detect spaces after list markers | `-` | `list` |
| **Table** | [`Table Format`](https://github.github.com/gfm/#tables-extension-) | Detect unclosed table rows and cells | `\| Header1 \| Header2 \|` | `table` |
| **XML Tags** | `<tag>` | Handle closing state of HTML/XML tags | `<div class="` | `xml` |

### Custom Incomplete Syntax Components

You can decide how to render incomplete syntax structures by configuring custom components through `incompleteMarkdownComponentMap`:

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const ImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />;

const IncompleteLink = (props: ComponentProps) => {
  const text = String(props['data-raw'] || '');

  // Extract link text, format is [text](url)
  const linkTextMatch = text.match(/^\[([^\]]*)\]/);
  const displayText = linkTextMatch ? linkTextMatch[1] : text.slice(1);

  return (
    <a style={{ pointerEvents: 'none' }} href="#">
      {displayText}
    </a>
  );
};

const App = () => {
  return (
    <XMarkdown
      content="Visit [Ant Design](https://ant.design) for documentation, there are `code examples` and |table data|"
      streaming={{
        hasNextChunk,
        incompleteMarkdownComponentMap: {
          link: 'link-loading',
        },
      }}
      components={{
        'link-loading': ImageSkeleton,
        'incomplete-link': IncompleteLink,
      }}
    />
  );
};
```

## FAQ

### Why is it needed?

During streaming transmission, Markdown syntax may be in an incomplete state:

```markdown
// Incomplete link syntax: [Example Website](https://example // Incomplete image syntax: ![Product Image](https://cdn.example.com/images/produc
```

Incomplete syntax structures may cause:

- Links unable to navigate correctly
- Image loading failures
- Format markers displayed directly in content

### Why shouldn't hasNextChunk always be true

`hasNextChunk` should not always be `true`, otherwise it would cause the following issues:

1. **Syntax pending**: Unclosed links, images, and other syntax will remain in a loading state
2. **Poor user experience**: Users see continuous loading animations without getting complete content
3. **Memory leaks**: State data continues to accumulate and cannot be properly cleaned up
