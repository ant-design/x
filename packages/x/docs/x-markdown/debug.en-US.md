---
group:
  title: Streaming
  order: 4
title: Performance Monitor
order: 3
---

Monitor key performance metrics (such as FPS and memory usage) during Markdown rendering in real-time, displayed as an overlay on the page to help developers identify rendering bottlenecks.

## Code Demo

<code src="./demo/streaming/debug.tsx">Performance Monitor Panel</code>

## API

| Property | Description                                 | Type      | Default |
| -------- | ------------------------------------------- | --------- | ------- |
| debug    | Whether to enable performance monitor panel | `boolean` | `false` |

> ⚠️ For development environment only. Make sure to disable in production builds to avoid performance overhead and information leakage.
