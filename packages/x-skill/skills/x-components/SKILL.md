---
name: x-components
version: 2.7.0
description: Use when building AI chat UIs with @ant-design/x components — covers Bubble, Sender, Conversations, Prompts, ThoughtChain, Actions, Welcome, Attachments, Sources, Suggestion, Think, FileCard, CodeHighlighter, Mermaid, Folder, XProvider, and Notification.
---

# 🎯 Skill Positioning

**This skill covers all UI components in `@ant-design/x`** — the React component library for building AI-driven chat interfaces based on the RICH interaction paradigm.

It covers component selection, API usage, composition patterns, and common anti-patterns.

> **Prerequisite**: This skill handles UI only. For data flow and streaming, see `use-x-chat`, `x-chat-provider`, `x-request` skills.

## Table of Contents

- [📦 Package Overview](#-package-overview)
- [🗂️ Component Groups](#-component-groups)
- [🚀 Quick Start Decision Guide](#-quick-start-decision-guide)
- [🛠 Recommended Workflow](#-recommended-workflow)
- [🚨 Development Rules](#-development-rules)
- [🤝 Skill Collaboration](#-skill-collaboration)
- [🔗 Reference Resources](#-reference-resources)

# 📦 Package Overview

| Package                  | Responsibility                                              |
| ------------------------ | ----------------------------------------------------------- |
| `@ant-design/x`          | All UI components in this skill                             |
| `@ant-design/x-sdk`      | Data providers, request, streaming state — not covered here |
| `@ant-design/x-markdown` | Markdown rendering inside Bubble — see `x-markdown` skill   |

```bash
npm install @ant-design/x
```

> `@ant-design/x` extends `antd`. If you use `ConfigProvider`, replace it with `XProvider`.

# 🗂️ Component Groups

Based on the RICH interaction paradigm:

| Stage            | Components                                                               |
| ---------------- | ------------------------------------------------------------------------ |
| **General**      | `Bubble`, `Bubble.List`, `Conversations`, `Notification`                 |
| **Wake**         | `Welcome`, `Prompts`                                                     |
| **Express**      | `Sender`, `Attachments`, `Suggestion`                                    |
| **Confirmation** | `Think`, `ThoughtChain`                                                  |
| **Feedback**     | `Actions`, `FileCard`, `Sources`, `CodeHighlighter`, `Mermaid`, `Folder` |
| **Global**       | `XProvider`                                                              |

# 🚀 Quick Start Decision Guide

| If you need to... | Read first |
| --- | --- |
| Render a chat message bubble | [COMPONENTS.md → Bubble](reference/COMPONENTS.md#bubble) |
| Build a chat input box | [COMPONENTS.md → Sender](reference/COMPONENTS.md#sender) |
| List and switch conversations | [COMPONENTS.md → Conversations](reference/COMPONENTS.md#conversations) |
| Show AI thinking process | [COMPONENTS.md → ThoughtChain / Think](reference/COMPONENTS.md#thoughtchain--think) |
| Add action buttons below a message | [COMPONENTS.md → Actions](reference/COMPONENTS.md#actions) |
| Build a welcome / onboarding screen | [COMPONENTS.md → Welcome + Prompts](reference/COMPONENTS.md#welcome--prompts) |
| Show file attachments in input | [COMPONENTS.md → Attachments](reference/COMPONENTS.md#attachments) |
| Show source citations | [COMPONENTS.md → Sources](reference/COMPONENTS.md#sources) |
| Add quick command suggestions | [COMPONENTS.md → Suggestion](reference/COMPONENTS.md#suggestion) |
| Display a hierarchical file/folder tree | [COMPONENTS.md → Folder](reference/COMPONENTS.md#folder) |
| Wire a complete chat page | [PATTERNS.md](reference/PATTERNS.md) |
| Look up a specific prop | [API.md](reference/API.md) |

# 🛠 Recommended Workflow

1. Pick components from [COMPONENTS.md](reference/COMPONENTS.md) for each interaction stage.
2. Use [PATTERNS.md](reference/PATTERNS.md) to understand how components compose into full pages.
3. Wrap the app root with `XProvider` (replaces `antd`'s `ConfigProvider`) for locale, theme, and shortcut keys.
4. Use [API.md](reference/API.md) for precise prop names — do not guess them.

## Minimal Full-Page Example

```tsx
import { XProvider, Welcome, Prompts, Bubble, Sender } from '@ant-design/x';

export default () => (
  <XProvider>
    <Welcome title="Hello!" description="How can I help you?" />
    <Prompts
      items={[{ key: '1', label: 'What can you do?' }]}
      onItemClick={(info) => console.log(info.data.label)}
    />
    <Bubble.List items={[{ key: '1', content: 'Hello World', placement: 'end' }]} />
    <Sender onSubmit={(msg) => console.log(msg)} />
  </XProvider>
);
```

# 🚨 Development Rules

- **Always use `XProvider` at the app root** — it supersedes `antd`'s `ConfigProvider` and enables locale, direction, and x-specific shortcut keys.
- **`Bubble.List` not `Bubble` in loops** — `Bubble.List` handles scroll anchoring, auto-scroll, and role-based layout; mapping `Bubble` manually loses these.
- **Keep `components` prop stable** in `Bubble` and `Bubble.List` — inline object creation causes re-renders and resets typing animations.
- **Set `streaming={true}` during stream, `streaming={false}` on final chunk** — leaving it `true` permanently breaks the done state.
- **`ThoughtChain` vs `Think`**: use `ThoughtChain` for multi-step tool/agent call chains; use `Think` for a collapsible single-block reasoning display.
- **`Actions.Copy`, `Actions.Feedback`, `Actions.Audio`** are preset sub-components — prefer them over building custom equivalents.
- **Sender `onSubmit` vs `onChange`**: `onSubmit` fires on send button or Enter key; `onChange` fires on every keystroke — do not conflate them.
- **Never render `Mermaid` or `CodeHighlighter` inside a `Bubble` `content` string** — use `contentRender` or the `components` map instead.

# 🤝 Skill Collaboration

| Scenario | Skill combination |
| --- | --- |
| Full AI chat app | `x-chat-provider` → `x-request` → `use-x-chat` → `x-components` → `x-markdown` |
| Just building UI structure | `x-components` only |
| Markdown in bubble replies | `x-components` + `x-markdown` |
| Streaming data flow only | `use-x-chat` + `x-request` |

# 🔗 Reference Resources

- [COMPONENTS.md](reference/COMPONENTS.md) — Component-by-component guide with usage, key props, and examples
- [PATTERNS.md](reference/PATTERNS.md) — Full-page composition patterns and integration recipes
- [API.md](reference/API.md) — Auto-generated prop reference from official component docs — covers all 17 components

## Official Documentation

- [Ant Design X Overview](https://github.com/ant-design/x/blob/main/packages/x/components/overview/index.en-US.md)
- [Bubble](https://github.com/ant-design/x/blob/main/packages/x/components/bubble/index.en-US.md)
- [Sender](https://github.com/ant-design/x/blob/main/packages/x/components/sender/index.en-US.md)
- [Conversations](https://github.com/ant-design/x/blob/main/packages/x/components/conversations/index.en-US.md)
- [ThoughtChain](https://github.com/ant-design/x/blob/main/packages/x/components/thought-chain/index.en-US.md)
- [Actions](https://github.com/ant-design/x/blob/main/packages/x/components/actions/index.en-US.md)
- [Welcome](https://github.com/ant-design/x/blob/main/packages/x/components/welcome/index.en-US.md)
- [Prompts](https://github.com/ant-design/x/blob/main/packages/x/components/prompts/index.en-US.md)
- [Attachments](https://github.com/ant-design/x/blob/main/packages/x/components/attachments/index.en-US.md)
- [Sources](https://github.com/ant-design/x/blob/main/packages/x/components/sources/index.en-US.md)
- [Suggestion](https://github.com/ant-design/x/blob/main/packages/x/components/suggestion/index.en-US.md)
- [Think](https://github.com/ant-design/x/blob/main/packages/x/components/think/index.en-US.md)
- [Folder](https://github.com/ant-design/x/blob/main/packages/x/components/folder/index.en-US.md)
- [XProvider](https://github.com/ant-design/x/blob/main/packages/x/components/x-provider/index.en-US.md)
