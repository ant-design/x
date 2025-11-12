---
group:
  title: Streaming
  order: 4
title: Syntax Processing
order: 1
---

The streaming syntax processing mechanism is designed for real-time rendering scenarios, intelligently handling incomplete Markdown syntax structures to avoid rendering anomalies caused by syntax fragments.

## Code Demo

<code src="./demo/streaming/format.tsx" description="Streaming syntax processing effect demo">Streaming Syntax Processing</code>

## API

### streaming

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is subsequent data | `boolean` | `false` |
| enableAnimation | Enable text fade-in animation | `boolean` | `false` |
| animationConfig | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

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

### Why shouldn't hasNextChunk always be `true`

`hasNextChunk` should not always be `true`, otherwise it would cause the following issues:

1. **Pending syntax**: Unclosed links, images, and other syntax will remain in a loading state
2. **Poor user experience**: Users see continuous loading animations without getting complete content
3. **Memory leaks**: State data continues to accumulate and cannot be properly cleaned up

### Supported syntax types

Streaming syntax processing supports integrity checks for the following Markdown syntax:

| Syntax Type | Format Example | Processing Mechanism |
| --- | --- | --- |
| **Link** | `[text](url)` | Detect unclosed link markers, such as `[text](` |
| **Image** | `![alt](src)` | Detect unclosed image markers, such as `![alt](` |
| **Heading** | `# ## ###` etc. | Support progressive rendering of 1-6 level headings |
| **Emphasis** | `*italic*` `**bold**` | Handle emphasis syntax with `*` and `_` |
| **Code** | `Inline code` and `Code blocks` | Support integrity checks for backtick code blocks |
| **List** | `- + *` list markers | Detect spaces after list markers |
| **Horizontal Rule** | `---` `===` | Avoid conflicts between Setext headings and horizontal rules |
| **Table** | [`table`](https://github.github.com/gfm/#tables-extension-) | Detect unclosed table rows and cells |
| **XML Tags** | `<tag>` | Handle closing state of HTML/XML tags |

### Custom Loading Components

Custom loading state display for incomplete syntax can be achieved through `incompleteMarkdownComponentMap`:

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const CustomLoadingComponents = {
  LinkLoading: () => <span className="loading-link">🔗 Loading...</span>,
  ImageLoading: () => <div className="loading-image">🖼️ Image loading...</div>,
};

const App = () => {
  return (
    <XMarkdown
      content="Visit [Ant Design](https://ant.design) for documentation"
      streaming={{
        hasNextChunk: true,
        incompleteMarkdownComponentMap: {
          link: 'link-loading',
          image: 'image-loading',
        },
      }}
      components={{
        'link-loading': CustomLoadingComponents.LinkLoading,
        'image-loading': CustomLoadingComponents.ImageLoading,
      }}
    />
  );
};
```
