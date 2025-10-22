---
group:
  title: Streaming
  order: 4
title: Animation Effects
order: 2
---

Add elegant animation effects to streaming rendered content, supporting progressive text display to enhance user reading experience.

## Code Demo

<code src="./demo/streaming/animation.tsx">Streaming Animation Effects</code>

## API

### streaming

| Parameter | Description | Type | Default Value |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is subsequent data | `boolean` | `false` |
| enableAnimation | Enable text fade-in animation | `boolean` | `false` |
| animationConfig | Text animation configuration | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

### AnimationConfig

| Property     | Description                               | Type     | Default Value   |
| ------------ | ----------------------------------------- | -------- | --------------- |
| fadeDuration | Fade-in animation duration (milliseconds) | `number` | `200`           |
| easing       | Animation easing function                 | `string` | `'ease-in-out'` |

## FAQ

### Animation effects not working?

A: Please check the following conditions:

- Is `enableAnimation` set to `true`
- Is `hasNextChunk` properly controlled
- Does the browser support CSS3 animations

### Animation causing performance issues?

A: Recommended optimizations:

- Reduce `fadeDuration` time
- Use `linear` easing function
- Render large amounts of content in batches
