---
title: Streaming Rendering
order: 4
---

Handle **LLM streamed Markdown** output: syntax completion and caching, animation, and tail suffix.

## Code Examples

<code src="./demo/streaming/format.tsx" description="Incomplete syntax recovery and placeholders">Syntax Processing</code> <code src="./demo/streaming/animation.tsx" description="Fade-in, tail cursor, and debug switches (slower stream pace for observation)">Rendering Controls</code>

## API

### streaming

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether more chunks are coming | `boolean` | `false` |
| incompleteMarkdownComponentMap | Component mapping for incomplete syntax | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| enableAnimation | Enable fade-in animation | `boolean` | `false` |
| animationConfig | Animation config | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| tail | Enable tail indicator | `boolean \| TailConfig` | `false` |

### TailConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Content to display as tail | `string` | `'▋'` |
| component | Custom tail component, takes precedence over content | `React.ComponentType<{ content?: string }>` | - |

### AnimationConfig

| Property     | Description         | Type     | Default         |
| ------------ | ------------------- | -------- | --------------- |
| fadeDuration | Duration in ms      | `number` | `200`           |
| easing       | CSS easing function | `string` | `'ease-in-out'` |

> The tail displays `▋` by default. You can customize the character via `content`, or pass a custom React component via `component` for animations, delayed display, and other effects.
>
> ```tsx
> // Custom tail component example
> const DelayedTail: React.FC<{ content?: string }> = ({ content }) => {
>   const [visible, setVisible] = useState(false);
>
>   useEffect(() => {
>     const timer = setTimeout(() => setVisible(true), 2000);
>     return () => clearTimeout(timer);
>   }, []);
>
>   if (!visible) return null;
>   return <span className="my-tail">{content}</span>;
> };
> ```

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
    tail: true,
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
