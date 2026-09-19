---
title: Streaming Rendering
order: 4
---

Handle **LLM streamed Markdown** output: syntax completion and caching, animation, and tail suffix.

## Code Examples

<code src="./demo/streaming/format.tsx" description="Incomplete syntax recovery and placeholders">Syntax Processing</code> <code src="./demo/streaming/animation.tsx" description="Fade-in, tail cursor, and debug switches (slower stream pace for observation)">Rendering Controls</code>

## Out of the box

Passing a boolean to `streaming` enables the full streaming preset; the value itself is "is more content coming":

```tsx
<XMarkdown content={content} streaming={isStreaming} />
```

| Value | Effect |
| --- | --- |
| `true` | Streaming in progress. Same as `hasNextChunk: true`, with `incremental`, `incompleteMarkdown: 'complete'`, `typewriter` and `tail` switched on |
| `false` | The stream has ended. The final content is rendered; mounted custom components are not remounted |
| omitted | Non-streaming render, as before |

Pass an object for per-option control; the object form's behaviour and defaults are unchanged.

## API

### streaming

| Parameter | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether more chunks are coming | `boolean` | `false` |
| incremental | Split the document at headings so each chunk only re-parses and re-renders the last, still-growing section. Pass an object to set `minSectionChars` (shorter sections merge into the next one) | `boolean \| { minSectionChars?: number }` | `false` |
| incompleteMarkdown | How unfinished syntax is shown: `placeholder` holds it back or shows the placeholder component; `complete` shows half-written emphasis, inline code, link text and list items as finished text right away | `'placeholder' \| 'complete'` | `'placeholder'` |
| incompleteMarkdownComponentMap | Component mapping for incomplete syntax; an explicit entry always wins over `complete` | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| typewriter | Typewriter effect: arriving content is revealed at a steady pace that follows the chunk cadence instead of appearing in blocks | `boolean \| TypewriterConfig` | `false` |
| enableAnimation | Enable fade-in animation | `boolean` | `false` |
| animationConfig | Animation config | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| tail | Enable tail indicator | `boolean \| TailConfig` | `false` |

> `incremental` only splits before a column-0 ATX heading; `#` lines inside fenced code, HTML blocks (`<div>`, `<pre>`, `<script>`, comments, …) and `$$` math are not headings. Splitting is disabled once a link reference or footnote definition appears, or while a custom component tag spans the boundary. Sections render inside the same root element, so the DOM is identical to a whole-document render.

### TypewriterConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| unit | Reveal unit. `char` reveals character by character; `sentence` reveals up to the next delimiter at once (delimiters inside fenced or inline code do not count, a newline always does) | `'char' \| 'sentence'` | `'char'` |
| delimiters | Sentence delimiters | `string[]` | `['。', '！', '？', '.', '!', '?', '\n']` |
| minCps | Minimum speed in characters per second; the speed adapts to the chunk cadence | `number` | `24` |
| maxCps | Maximum speed in characters per second | `number` | `3000` |
| pauseMs | With `unit: 'char'`, pause after revealing a delimiter (ms) | `number` | `0` |

> What is shown is always a prefix of `content`; everything is revealed at once when `hasNextChunk` becomes `false`.

### TailConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Content to display as tail | `string` | `'▋'` |
| component | Custom tail component, takes precedence over content | `React.ComponentType<{ content?: string }>` | - |

### AnimationConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| fadeDuration | Duration in ms | `number` | `200` |
| easing | CSS easing function | `string` | `'ease-in-out'` |
| splitBy | Fade-in unit. `chunk` fades in each arriving piece of text on its own; `sentence` joins it to the current sentence and starts a new unit only after a delimiter. Use `sentence` together with `typewriter` | `'chunk' \| 'sentence'` | `'chunk'` |
| delimiters | Delimiters used when `splitBy` is `sentence` | `string[]` | `['。', '！', '？', '.', '!', '?', '\n']` |

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

## Re-rendering of custom components

Every parse hands custom components a fresh `domNode`, so a plain `React.memo` never finds its props equal while streaming: a code highlighter re-highlights on every chunk even when what it shows has not changed. Use `arePropsEqualIgnoringDomNode` as the comparator; it ignores `domNode` and shallow-compares the remaining props:

```tsx
import XMarkdown, { arePropsEqualIgnoringDomNode, type ComponentProps } from '@ant-design/x-markdown';

const Code = React.memo(
  (props: ComponentProps) => <CodeHighlighter lang={props.lang}>{String(props.children)}</CodeHighlighter>,
  arePropsEqualIgnoringDomNode,
);

<XMarkdown content={content} streaming={isStreaming} components={{ code: Code }} />;
```

It does not help container components whose `children` is an array of elements (such as `table`); those are covered by `incremental`. Keep `components`, `config`, `streaming` and similar objects outside the component or in `useMemo`; inline literals rebuild the parser on every render.

## FAQ

### Can `hasNextChunk` always be `true`?

No. Set it to `false` for the last chunk so placeholders can be flushed into final rendered content. With the boolean form, pass your `isStreaming` flag straight to `streaming` and this happens automatically.
