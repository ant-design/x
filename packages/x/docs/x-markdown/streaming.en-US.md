---
title: Streaming
order: 4
---

Handle **LLM streamed Markdown** output: incomplete syntax recovery, progressive animation, and optional performance monitoring during development.

## Code Examples

<code src="./demo/streaming/format.tsx" description="Incomplete syntax recovery and placeholders">Syntax Processing</code> <code src="./demo/streaming/animation.tsx" description="Fade-in animation and optional debug panel">Animation & Debug</code>

## API

### streaming

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether more chunks are coming | `boolean` | `false` |
| incompleteMarkdownComponentMap | Component mapping for incomplete syntax | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| enableAnimation | Enable fade-in animation | `boolean` | `false` |
| animationConfig | Animation config | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

### AnimationConfig

| Property     | Description         | Type     | Default         |
| ------------ | ------------------- | -------- | --------------- |
| fadeDuration | Duration in ms      | `number` | `200`           |
| easing       | CSS easing function | `string` | `'ease-in-out'` |

### debug

| Property | Description                                 | Type      | Default |
| -------- | ------------------------------------------- | --------- | ------- |
| debug    | Whether to enable performance monitor panel | `boolean` | `false` |

> ⚠️ **debug** is for development only. Disable in production to avoid overhead and information leakage.

## Supported Incomplete Types

| TokenType | Example                  |
| --------- | ------------------------ |
| `link`    | `[text](https://example` |
| `image`   | `![alt](https://img...`  |
| `heading` | `###`                    |
| `table`   | `\| col1 \| col2 \|`     |
| `xml`     | `<div class="`           |

## Minimal Setup

```tsx
<XMarkdown
  content={content}
  streaming={{
    hasNextChunk,
    enableAnimation: true,
    incompleteMarkdownComponentMap: {
      link: 'link-loading',
      table: 'table-loading',
    },
  }}
  components={{
    'link-loading': LinkSkeleton,
    'table-loading': TableSkeleton,
  }}
/>
```

## FAQ

### Can `hasNextChunk` always be `true`?

No. Set it to `false` for the last chunk so placeholders can be flushed into final rendered content.
