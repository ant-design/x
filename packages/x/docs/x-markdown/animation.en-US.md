---
title: Streaming Animation Effects
order: 4
---

## Introduction

Add elegant animation effects to streaming rendered content, supporting text fade-in animations to enhance user experience.

## Code Demos

<code src="./demo/streaming/animation.tsx">Animation Effects</code>

## Configuration

### streaming

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
          fadeDuration: 200,
          easing: 'ease-in-out',
        },
      }}
    />
  );
};
```

## Animation Effects Description

Text fade-in animation provides the following features:

- **Smooth Transition**: Text gradually appears with fade-in effect
- **Configurable Duration**: Support custom animation duration
- **Easing Functions**: Support multiple easing effects (ease-in-out, linear, ease-in, ease-out)
- **Performance Optimization**: High-performance animations using CSS3 transform and opacity

When `enableAnimation` is set to `true`, newly received content will be displayed with fade-in animation, providing users with a smoother reading experience.
