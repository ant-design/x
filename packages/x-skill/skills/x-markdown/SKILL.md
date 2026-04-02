---
name: x-markdown
version: 2.5.0
description: Use when building or reviewing Markdown rendering with @ant-design/x-markdown, including streaming Markdown, custom component mapping, plugins, themes, and chat-oriented rich content.
---

# 🎯 Skill Positioning

**This skill focuses on one job**: render Markdown correctly and predictably with `@ant-design/x-markdown`.

It covers:

- Basic rendering and package boundaries
- LLM streaming output and incomplete syntax handling
- Custom component mapping for rich chat or data-display blocks
- Plugins, themes, and safe rendering defaults

## Table of Contents

- [📦 Package Boundaries](#-package-boundaries)
- [🚀 Quick Start Decision Guide](#-quick-start-decision-guide)
- [🛠 Recommended Workflow](#-recommended-workflow)
- [🚨 Development Rules](#-development-rules)
- [🤝 Skill Collaboration](#-skill-collaboration)
- [🔗 Reference Resources](#-reference-resources)

# 📦 Package Boundaries

| Layer | Package | Responsibility |
| --- | --- | --- |
| **UI layer** | `@ant-design/x` | Chat UI, bubble lists, sender, rich interaction components |
| **Data layer** | `@ant-design/x-sdk` | Providers, requests, streaming data flow, state management |
| **Render layer** | `@ant-design/x-markdown` | Markdown parsing, streaming rendering, plugins, themes, custom renderers |

> ⚠️ `x-markdown` is not a chat-state tool. Use it to render content after `@ant-design/x` and `@ant-design/x-sdk` have already produced the message data.

# 🚀 Quick Start Decision Guide

| If you need to... | Read first | Typical outcome |
| --- | --- | --- |
| Render Markdown with the smallest setup | [CORE.md](reference/CORE.md) | `XMarkdown` renders trusted content with basic styling |
| Render LLM streaming chunks | [STREAMING.md](reference/STREAMING.md) | Correct `hasNextChunk`, placeholders, tail indicator, loading states |
| Replace tags with business components | [EXTENSIONS.md](reference/EXTENSIONS.md) | Stable `components` map for custom tags and code blocks |
| Add plugins or theme overrides | [EXTENSIONS.md](reference/EXTENSIONS.md) | Plugin imports, theme class wiring, minimal CSS overrides |
| Check prop details and defaults | [API.md](reference/API.md) | Full prop table for `XMarkdown` and streaming options |

# 🛠 Recommended Workflow

1. Start with [CORE.md](reference/CORE.md) and get a plain render working first.
2. Add [STREAMING.md](reference/STREAMING.md) only when the content arrives chunk-by-chunk.
3. Add [EXTENSIONS.md](reference/EXTENSIONS.md) when you need custom tags, plugins, syntax blocks, or themes.
4. Use [API.md](reference/API.md) to confirm prop names and defaults instead of guessing.

## Minimal Setup Reminder

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

export default () => <XMarkdown content="# Hello" />;
```

# 🚨 Development Rules

- Prefer a stable `components` object. Do not create new inline component mappings on every render.
- Use `streaming.hasNextChunk = false` on the final chunk, otherwise incomplete placeholders will not flush into final content.
- Treat raw HTML carefully. Prefer `escapeRawHtml` when raw HTML should stay visible as text.
- If raw HTML must be rendered, keep `dompurifyConfig` explicit and minimal.
- Keep theme overrides small. Start from `x-markdown-light` or `x-markdown-dark` and override only the variables you need.
- If a custom component depends on complete syntax, branch on `streamStatus === 'done'`.

# 🤝 Skill Collaboration

| Scenario | Recommended skill combination | Why |
| --- | --- | --- |
| Rich assistant replies in chat | `x-chat-provider` → `x-request` → `use-x-chat` → `x-markdown` | Provider and request handle data flow, `x-markdown` handles final rendering |
| Built-in provider with Markdown replies | `x-request` → `use-x-chat` → `x-markdown` | Keep request config and rendering concerns separate |
| Standalone Markdown page or docs viewer | `x-markdown` only | No chat data flow needed |

## Boundary Rules

- Use **`x-chat-provider`** when adapting an API shape.
- Use **`x-request`** when configuring transport, auth, retries, or streaming separators.
- Use **`use-x-chat`** when managing chat state in React.
- Use **`x-markdown`** when the content itself needs Markdown parsing, streaming recovery, or rich component rendering.

# 🔗 Reference Resources

- [CORE.md](reference/CORE.md) - Package boundaries, install/setup, safe defaults, common render patterns
- [STREAMING.md](reference/STREAMING.md) - Chunked rendering, incomplete syntax recovery, loading vs done behavior
- [EXTENSIONS.md](reference/EXTENSIONS.md) - Components, plugins, themes, custom tag guidance
- [API.md](reference/API.md) - Generated API reference from the official `x-markdown` docs

## Official Docs

- [XMarkdown Introduction](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/introduce.en-US.md)
- [XMarkdown Examples](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/examples.en-US.md)
- [XMarkdown Streaming](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/streaming.en-US.md)
- [XMarkdown Components](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/components.en-US.md)
- [XMarkdown Plugins](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/plugins.en-US.md)
- [XMarkdown Themes](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/themes.en-US.md)
