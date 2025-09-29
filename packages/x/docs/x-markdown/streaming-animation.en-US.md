---
group:
  title: Streaming Processing
  order: 4
title: Animation Effects
order: 2
---

Add elegant animation effects to streaming rendered content, supporting progressive text display to enhance user reading experience.

## Feature Introduction

Streaming animation effects are designed for real-time content rendering, using smooth transition animations to make content presentation more natural and avoid visual discomfort from abrupt content updates.

## Feature Demo

<code src="./demo/streaming/animation.tsx">Streaming Animation Effects</code> <code src="./demo/streaming/typing.tsx">Typing Effect Demonstration</code>

## Configuration Parameters

### streaming Configuration

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is more streaming data | `boolean` | `false` |
| enableAnimation | Enable text fade-in animation | `boolean` | `false` |
| animationConfig | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

#### AnimationConfig

| Property     | Description                             | Type     | Default         |
| ------------ | --------------------------------------- | -------- | --------------- |
| fadeDuration | Fade animation duration in milliseconds | `number` | `200`           |
| easing       | Animation easing function               | `string` | `'ease-in-out'` |

## Usage Examples

### Basic Animation Configuration

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => {
  return (
    <XMarkdown
      content="# Hello World\n\nThis is a streaming rendering example."
      streaming={{
        hasNextChunk: true,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 200,
          easing: 'ease-in-out',
        },
      }}
    />
  );
};
```

### Custom Animation Parameters

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const CustomAnimationExample = () => {
  return (
    <XMarkdown
      content="## Custom Animation Effects\n\nThis text will display with slower animation effects."
      streaming={{
        hasNextChunk: true,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 500, // Longer animation time
          easing: 'ease-out', // Different easing effect
        },
      }}
    />
  );
};
```

## Animation Features

### Core Features

- **Smooth Transition**: Text content gradually appears with fade-in effect, avoiding abruptness
- **Configurable Duration**: Supports custom animation duration, range 100-1000ms
- **Easing Functions**: Supports multiple easing effects:
  - `ease-in-out`: Smooth acceleration and deceleration (default)
  - `linear`: Constant speed animation
  - `ease-in`: Ease-in effect
  - `ease-out`: Ease-out effect
- **Performance Optimization**: High-performance animations using CSS3 transform and opacity, avoiding reflow and repaint

### Animation Trigger Mechanism

Animation effects trigger under the following conditions:

1. **Syntax Completeness**: Animation only triggers after Markdown syntax is fully parsed
2. **Incremental Updates**: Animation effects only apply to newly added content
3. **State Control**: Trigger timing controlled by `hasNextChunk`

## Advanced Usage

### Combined with Syntax Processing

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const CombinedStreamingExample = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);

  useEffect(() => {
    const chunks = [
      '# Streaming Rendering and Animation',
      '\n\nThis combines',
      '**syntax processing** and',
      '*animation effects* in',
      'a complete example.',
    ];

    let index = 0;
    const timer = setInterval(() => {
      if (index < chunks.length) {
        setContent((prev) => prev + chunks[index]);
        index++;

        if (index === chunks.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(timer);
      }
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 400,
          easing: 'ease-in-out',
        },
        incompleteMarkdownComponentMap: {
          link: 'loading-link',
          image: 'loading-image',
        },
      }}
    />
  );
};
```

### Typewriter Effect Implementation

Combined with animation effects, you can achieve a typewriter effect:

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const TypewriterEffect = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);
  const fullText =
    '# Typewriter Effect\n\nThis is an example simulating typewriter effect, with each character gradually appearing.';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setContent(fullText.slice(0, index));
        index++;

        if (index > fullText.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(timer);
      }
    }, 50); // 50ms per character

    return () => clearInterval(timer);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 100, // Quick fade-in
          easing: 'linear',
        },
      }}
    />
  );
};
```

## Performance Optimization

### Animation Performance

- **Hardware Acceleration**: Uses CSS3 transform property to trigger hardware acceleration
- **Throttling Control**: Avoids excessive animation trigger frequency
- **Memory Management**: Timely cleanup of animation-related DOM references

### Best Practices

1. **Animation Duration Selection**:
   - Fast content: 100-200ms
   - Normal content: 200-400ms
   - Slow content: 400-600ms

2. **Easing Function Selection**:
   - Content display: `ease-in-out`
   - Emphasis effects: `ease-out`
   - Mechanical effects: `linear`

3. **Avoid Excessive Animation**:
   - Appropriately extend animation intervals for large text content
   - Avoid triggering too many animated elements simultaneously

## Common Questions

### Q: Animation effects not working?

A: Please check the following conditions:

- Whether `enableAnimation` is set to `true`
- Whether `hasNextChunk` is correctly controlled
- Whether browser supports CSS3 animations

### Q: Performance issues with animation?

A: Recommended optimizations:

- Reduce `fadeDuration` time
- Use `linear` easing function
- Batch render large amounts of content

### Q: How to disable animation for specific elements?

A: Can be controlled through custom components:

```tsx
const NoAnimationComponent = ({ children }) => {
  return <div style={{ animation: 'none' }}>{children}</div>;
};

<XMarkdown components={{ p: NoAnimationComponent }} streaming={{ enableAnimation: true }} />;
```
