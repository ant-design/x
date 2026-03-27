# Core Guide

## Package Boundaries

| Need                                  | Package                  |
| ------------------------------------- | ------------------------ |
| Render message content as Markdown    | `@ant-design/x-markdown` |
| Build chat UI containers              | `@ant-design/x`          |
| Manage provider/request/message state | `@ant-design/x-sdk`      |

## Install and Minimal Render

```bash
npm install @ant-design/x-markdown
```

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const content = `
# Hello

- item 1
- item 2
`;

export default () => <XMarkdown content={content} />;
```

## Safe Defaults

- Use `content` or `children`, not both.
- Start with plain Markdown before adding plugins or custom components.
- Use `openLinksInNewTab` when model output may contain external links.
- Use `escapeRawHtml` when raw HTML should remain visible but should not execute.
- If real HTML rendering is required, explicitly review `dompurifyConfig`.

## Common Integration Patterns

### Basic content block

```tsx
<XMarkdown content={message} className="x-markdown-light" />
```

### Chat message rendering

Render plain text or Markdown from message data after `useXChat` has already produced the message list.

```tsx
<XMarkdown content={message.message.content} openLinksInNewTab escapeRawHtml />
```

### Minimal checklist

- Confirm the content is actually Markdown, not a structured component schema.
- Keep rendering concerns out of Provider classes.
- Keep transport concerns out of `XMarkdown`.
- Add themes and custom components only after basic rendering works.

## When to Read Other References

- Read [STREAMING.md](STREAMING.md) when content arrives incrementally from an LLM.
- Read [EXTENSIONS.md](EXTENSIONS.md) when you need custom tags, code blocks, plugins, or themes.
- Read `API.md` for the full prop tables.
