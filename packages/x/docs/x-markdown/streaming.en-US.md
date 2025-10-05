---
title: Streaming Rendering
order: 3
---

## Introduction

Optimize streaming Markdown rendering in LLM scenarios by caching to hide markdown formatting and animation effects.

## Code Demos

<!-- prettier-ignore -->
<!-- <code src="./demo/streaming/typing.tsx" description="Rendering with `Bubble`">Typing Effect</code> -->

<code src="./demo/streaming/format.tsx" description="Hide Markdown formatting through caching">Caching</code><code src="./demo/streaming/animation.tsx">Animation Effects</code>

## Configuration

### streaming

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is more streaming data | `boolean` | `false` |
| enableAnimation | Enable text fade-in animation | `boolean` | `false` |
| animationConfig | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, opacity: 0.2 }` |

#### AnimationConfig

| Property     | Description                               | Type     | Default |
| ------------ | ----------------------------------------- | -------- | ------- |
| fadeDuration | Fade animation duration in milliseconds   | `number` | `200`   |
| opacity      | Opacity value for fading characters (0-1) | `number` | `0.2`   |

### Usage Example

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
          fadeDuration: 300,
          opacity: 0.3,
        },
      }}
    />
  );
};
```
