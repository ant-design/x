---
title: Streaming Format Processing
order: 3
---

## Overview

The streaming format processing mechanism is designed for real-time rendering scenarios, intelligently handling incomplete Markdown syntax structures to prevent rendering anomalies caused by syntax fragments.

## Core Issues

### 1. Syntax Fragment Problems

During streaming transmission, Markdown syntax may be in an incomplete state:

```markdown
// Link in transmission Click to visit [example website](https://example // Incomplete image syntax ![product image](https://cdn.example.com/images/produc
```

### 2. Rendering Anomaly Risks

Incomplete syntax structures may cause:

- Links to fail proper navigation
- Images to fail loading
- Format markers to display directly in content

## Feature Demo

<code src="./demo/streaming/format.tsx" description="Streaming format processing effect demonstration">Streaming Format Processing</code>

## Configuration Guide

### streaming Configuration Items

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is subsequent data | `boolean` | `false` |
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

Streaming format processing supports completeness checks for the following Markdown syntax:

| Syntax Type | Format Example | Processing Mechanism |
| --- | --- | --- |
| **Link** | `[text](url)` | Detects unclosed link markers like `[text](` |
| **Image** | `![alt](src)` | Detects unclosed image markers like `![alt](` |
| **Heading** | `# ## ###` etc. | Supports progressive rendering for 1-6 level headings |
| **Emphasis** | `*italic*` `**bold**` | Handles emphasis syntax with `*` and `_` |
| **Code** | `inline code` and `code blocks` | Supports backtick code block completeness checks |
| **List** | `- + *` list markers | Detects spaces after list markers |
| **Horizontal Rule** | `---` `===` | Avoids Setext heading and horizontal rule conflicts |
| **XML Tags** | `<tag>` | Handles HTML/XML tag closure states |

## How It Works

When `hasNextChunk=true`, the component will:

1. **Tokenized Parsing**: Decomposes Markdown syntax into 11 token types for state management
2. **State Stack Maintenance**: Uses stack structure to track nested syntax states
3. **Smart Truncation**: Pauses rendering when syntax is incomplete to avoid displaying fragments
4. **Progressive Rendering**: Gradually completes syntax rendering as content is supplemented
5. **Error Recovery**: Automatically falls back to safe state when syntax errors are detected

### Token Type System

The component internally defines the following token types to handle different Markdown syntax:

- `Text`: Plain text
- `Link`: Link syntax `[text](url)`
- `Image`: Image syntax `![alt](src)`
- `Heading`: Heading syntax `# ## ###`
- `MaybeEmphasis`: Possible emphasis syntax
- `Emphasis`: Emphasis syntax `*text*` or `_text_`
- `Strong`: Bold syntax `**text**` or `__text__`
- `XML`: XML/HTML tags `<tag>`
- `MaybeCode`: Possible code syntax
- `Code`: Code syntax `` `code` `` or `code block`
- `MaybeHr`: Possible horizontal rule
- `MaybeList`: Possible list syntax

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

When the input content changes fundamentally (non-incremental update), the component will automatically reset the parsing state:

```tsx
// Old content: "Hello "
// New content: "Hi there!" - triggers state reset
// New content: "Hello world!" - continues incremental parsing
```

## hasNextChunk Best Practices

### Avoid Getting Stuck

`hasNextChunk` should not always be `true`, otherwise it will cause:

1. **Syntax Suspension**: Unclosed links, images and other syntax will remain in loading state
2. **Poor User Experience**: Users see continuous loading animations without getting complete content
3. **Memory Leaks**: State data accumulates continuously and cannot be properly cleaned up

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
      '![example image](https://picsum.photos/200)',
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

## Notes

- This feature only affects rendering timing and will not change the final content
- Recommended for scenarios with obvious network delays
- For static content, keep `hasNextChunk=false` for optimal performance
- Custom loading components need to be used with the `components` prop
- State reset mechanism is based on content prefix matching to ensure correct incremental updates

## Performance Optimization

- **Incremental Parsing**: Only processes newly added content fragments, avoiding repeated parsing
- **State Caching**: Maintains parsing state to reduce repeated calculations
- **Memory Management**: Automatically cleans up processed state data
- **Error Boundaries**: Prevents parsing errors from affecting overall rendering
