# Streaming Guide

## When to Use

Use streaming mode when the Markdown content is appended chunk-by-chunk and may temporarily contain incomplete syntax.

Typical examples:

- partial links like `[docs](https://example`
- partial tables
- unfinished code fences
- a tail cursor while the assistant is still generating

## Core Rule

`hasNextChunk` must reflect reality:

- `true` while more chunks are expected
- `false` for the final chunk so cached incomplete fragments flush into the final render

## Minimal Streaming Setup

```tsx
<XMarkdown
  content={content}
  streaming={{
    hasNextChunk,
    enableAnimation: true,
    tail: true,
  }}
/>
```

## Incomplete Syntax Handling

Use `incompleteMarkdownComponentMap` when unfinished fragments should show custom loading UI instead of broken Markdown.

```tsx
<XMarkdown
  content={content}
  streaming={{
    hasNextChunk,
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

## Loading vs Done

Custom components receive `streamStatus`:

- `loading`: syntax may still be incomplete
- `done`: final content is available

Use this to delay expensive parsing or API calls until the syntax is complete.

## Chat-Oriented Guidance

- Use a tail indicator only while the assistant is still generating.
- Keep placeholder components lightweight.
- If a component depends on a closed block or fenced payload, wait for `streamStatus === 'done'`.
- Do not keep `hasNextChunk` stuck at `true`, or the final Markdown will never settle.

## Debugging Checklist

- Final chunk still looks incomplete: confirm `hasNextChunk` becomes `false`.
- Placeholder never disappears: confirm the mapped tag name exists in `components`.
- Performance looks unstable: disable animation and placeholder components first, then add them back selectively.
