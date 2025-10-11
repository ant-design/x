---
group:
  title: Streaming Processing
  order: 4
title: Syntax Processing
order: 1
---

Streaming syntax processing mechanism is designed for real-time rendering scenarios, capable of intelligently handling incomplete Markdown syntax structures to avoid rendering anomalies caused by syntax fragments.

## Core Issues

During streaming transmission, Markdown syntax may be in an incomplete state:

```markdown
// Incomplete link during transmission Click to visit [example website](https://example // Incomplete image syntax ![product image](https://cdn.example.com/images/produc
```

### Rendering Anomaly Risks

Incomplete syntax structures may lead to:

- Links unable to jump correctly
- Image loading failures
- Format markers displaying directly in content

## Feature Demo

<code src="./demo/streaming/format.tsx" description="Streaming syntax processing effect demonstration">Streaming Syntax Processing</code>

## Configuration Guide

### streaming Configuration

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is more streaming data | `boolean` | `false` |
| incompleteMarkdownComponentMap | Mapping configuration for converting incomplete Markdown formats to custom loading components, used to provide custom loading components for unclosed links and images during streaming rendering | `{ link?: string; image?: string }` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |

### Usage Example

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => {
  return (
    <XMarkdown
      content="# Streaming Rendering Example\n\nVisit [Ant Design](https://ant.design) for design resources.\n\n![Logo](https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg)"
      streaming={{
        hasNextChunk: true,
        incompleteMarkdownComponentMap: {
          link: 'custom-link-loading',
          image: 'custom-image-loading',
        },
      }}
    />
  );
};
```

## Supported Syntax Types

Streaming syntax processing supports integrity checks for the following Markdown syntax:

| Syntax Type | Format Example | Processing Mechanism |
| --- | --- | --- |
| **Links** | `[text](url)` | Detects unclosed link markers like `[text](` |
| **Images** | `![alt](src)` | Detects unclosed image markers like `![alt](` |
| **Headings** | `# ## ###` etc. | Supports progressive rendering for 1-6 level headings |
| **Emphasis** | `*italic*` `**bold**` | Handles emphasis syntax with `*` and `_` |
| **Code** | `inline code` and `code blocks` | Supports backtick code block integrity checks |
| **Lists** | `- + *` list markers | Detects spaces after list markers |
| **Dividers** | `---` `===` | Avoids conflicts between Setext headings and dividers |
| **XML Tags** | `<tag>` | Handles HTML/XML tag closure states |

## How It Works

When `hasNextChunk=true`, the component will:

1. **Tokenized Parsing**: Decomposes Markdown syntax into 11 token types for state management
2. **State Stack Maintenance**: Uses stack structure to track nested syntax states
3. **Smart Truncation**: Pauses rendering when syntax is incomplete to avoid displaying fragments
4. **Progressive Rendering**: Gradually completes syntax rendering as content is supplemented
5. **Error Recovery**: Automatically falls back to safe state when syntax errors are detected

## Advanced Configuration

### Custom Loading Components

You can customize the loading state display for incomplete syntax through `incompleteMarkdownComponentMap`:

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const CustomLoadingComponents = {
  LinkLoading: () => <span className="loading-link">🔗 Loading...</span>,
  ImageLoading: () => <div className="loading-image">🖼️ Image loading...</div>,
};

const App = () => {
  return (
    <XMarkdown
      content="Visit [Ant Design](https://ant.design) to view documentation"
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

### State Reset Mechanism

When input content changes fundamentally (non-incremental update), the component automatically resets the parsing state:

```tsx
// Old content: "Hello "
// New content: "Hi there!" - triggers state reset
// New content: "Hello world!" - continues incremental parsing
```

## hasNextChunk Best Practices

### Avoid Getting Stuck

`hasNextChunk` should not always be `true`, otherwise it will cause:

1. **Syntax Hanging**: Unclosed links, images and other syntax will remain in loading state
2. **Poor User Experience**: Users see continuous loading animations
3. **Memory Leaks**: State data accumulates continuously and cannot be cleaned properly

### Correct Usage Example

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const StreamingExample = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);

  useEffect(() => {
    // Simulate streaming data
    const chunks = [
      '# Welcome to Streaming Rendering',
      '\n\nThis is a demonstration',
      ' showing how to handle',
      '[incomplete links](https://example',
      '.com) and images',
      '![Example Image](https://picsum.photos/200)',
      '\n\nContent completed!',
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < chunks.length) {
        setContent((prev) => prev + chunks[currentIndex]);
        currentIndex++;

        // Set to false on last chunk
        if (currentIndex === chunks.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        incompleteMarkdownComponentMap: {
          link: 'loading-link',
          image: 'loading-image',
        },
      }}
    />
  );
};
```

## Performance Optimization

- **Incremental Parsing**: Only processes newly added content fragments, avoiding repeated parsing
- **State Caching**: Maintains parsing state to reduce repeated calculations
- **Memory Management**: Automatically cleans up processed state data
- **Error Boundaries**: Prevents parsing errors from affecting overall rendering
