---
name: x-card
version: 2.5.0
description: Use when building AI-driven UIs with @ant-design/x-card — covers XCard.Box, XCard.Card, A2UI v0.9 commands, data binding, catalogs, actions, and streaming patterns.
---

# 🎯 Skill Positioning

**This skill covers `@ant-design/x-card`** — the React implementation of the A2UI protocol, enabling AI agents to dynamically render rich interactive UIs through structured JSON command streams.

It covers:

- `XCard.Box` + `XCard.Card` component usage
- A2UI v0.9 command types: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`
- Custom component registration and catalog management
- Data binding via JSON Pointer paths (RFC 6901)
- Action handling — sending user events back to the agent
- Streaming progressive rendering patterns
- v0.8 ↔ v0.9 protocol differences

> **Scope**: v0.9 is the recommended protocol. v0.8 is supported for backward compatibility only — prefer v0.9 for all new work.

## Table of Contents

- [📦 Package Overview](#-package-overview)
- [🗂️ Component Architecture](#-component-architecture)
- [🚀 Quick Start Decision Guide](#-quick-start-decision-guide)
- [🛠 Recommended Workflow](#-recommended-workflow)
- [🚨 Development Rules](#-development-rules)
- [🤝 Skill Collaboration](#-skill-collaboration)
- [🔗 Reference Resources](#-reference-resources)

# 📦 Package Overview

| Package | Responsibility |
| --- | --- |
| `@ant-design/x-card` | React renderer for A2UI protocol — `XCard.Box`, `XCard.Card`, catalog APIs |
| `@ant-design/x` | Chat UI components (Bubble, Sender, etc.) — not covered here |
| `@ant-design/x-sdk` | Data providers, streaming — not covered here |

```bash
npm install @ant-design/x-card
```

**Exports:**

```typescript
import {
  XCard,
  registerCatalog,
  loadCatalog,
  validateComponent,
  clearCatalogCache,
} from '@ant-design/x-card';
import type {
  XAgentCommand_v0_9,
  XAgentCommand_v0_8,
  ActionPayload,
  Catalog,
  CatalogComponent,
} from '@ant-design/x-card';

// Subcomponents
XCard.Box; // Container: receives commands, owns catalog maps
XCard.Card; // Renderer: renders a single surface by id
```

# 🗂️ Component Architecture

```
XCard.Box
├── owns: catalogMap, surfaceCatalogMap
├── dispatches: commands → all XCard.Card children
├── aggregates: onAction events from all Cards
└── XCard.Card (id="surface-a")
│   ├── owns: component tree, data model, commandVersion
│   └── resolves: data bindings, triggers actions
└── XCard.Card (id="surface-b")
    └── ...
```

## XCard.Box Props

```typescript
interface BoxProps {
  commands?: (XAgentCommand_v0_9 | XAgentCommand_v0_8)[];
  components?: Record<string, React.ComponentType<any>>;
  onAction?: (payload: ActionPayload) => void;
  children?: React.ReactNode; // Should contain XCard.Card elements
}
```

## XCard.Card Props

```typescript
interface CardProps {
  id: string; // surfaceId to render
}
```

## ActionPayload

```typescript
interface ActionPayload {
  name: string; // from action.event.name
  surfaceId: string; // which surface triggered it
  context: Record<string, any>; // resolved values from data model
}
```

# 🚀 Quick Start Decision Guide

| If you need to... | Read first |
| --- | --- |
| Set up XCard.Box + XCard.Card | [USAGE.md → Basic Setup](reference/USAGE.md#basic-setup) |
| Send commands from agent to card | [COMMANDS.md](reference/COMMANDS.md) |
| Register a custom component catalog | [CATALOG.md → Local Catalog](reference/CATALOG.md#local-catalog) |
| Bind component props to live data | [DATA_BINDING.md](reference/DATA_BINDING.md) |
| Handle user interactions / form submit | [ACTIONS.md](reference/ACTIONS.md) |
| Build a streaming progressive UI | [USAGE.md → Streaming](reference/USAGE.md#streaming) |
| Migrate from v0.8 to v0.9 | [COMMANDS.md → v0.8 vs v0.9](reference/COMMANDS.md#v08-vs-v09) |
| Look up full prop types | [API.md](reference/API.md) |

# 🛠 Recommended Workflow

1. **Define your catalog** — register a local catalog or use the A2UI Basic Catalog URL.
2. **Register custom components** — pass them via `XCard.Box` `components` prop.
3. **Create the React tree** — wrap surfaces with `XCard.Box`, add `XCard.Card` per surface.
4. **Feed commands** — push `XAgentCommand_v0_9[]` into `commands` prop (typically from streaming agent response).
5. **Handle actions** — receive `ActionPayload` in `onAction`, update commands in response.

## Minimal Working Example

```tsx
import React, { useState } from 'react';
import { XCard, registerCatalog } from '@ant-design/x-card';
import type { XAgentCommand_v0_9, ActionPayload, Catalog } from '@ant-design/x-card';

// 1. Define and register local catalog
const myCatalog: Catalog = {
  catalogId: 'local://my_catalog.json',
  components: {
    Text: {
      type: 'object',
      properties: { text: { type: 'string' }, variant: { type: 'string' } },
      required: ['text'],
    },
    Button: {
      type: 'object',
      properties: { text: { type: 'string' }, action: {} },
      required: ['text'],
    },
  },
};
registerCatalog(myCatalog);

// 2. Custom component implementations
const Text: React.FC<{ text: string; variant?: string }> = ({ text, variant }) => (
  <p className={`text-${variant ?? 'body'}`}>{text}</p>
);

const Button: React.FC<{ text: string; onAction?: (ctx: any) => void; action?: any }> = ({
  text,
  onAction,
  action,
}) => <button onClick={() => onAction?.(action?.event?.context ?? {})}>{text}</button>;

// 3. Build commands (from agent stream)
const commands: XAgentCommand_v0_9[] = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'welcome',
      catalogId: 'local://my_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'welcome',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'btn'] },
        { id: 'title', component: 'Text', text: { path: '/user/name' }, variant: 'h1' },
        {
          id: 'btn',
          component: 'Button',
          text: 'Start',
          action: { event: { name: 'start', context: {} } },
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'welcome',
      path: '/user/name',
      value: 'Alice',
    },
  },
];

// 4. Render
export default function App() {
  const [cmdQueue, setCmdQueue] = useState<XAgentCommand_v0_9[]>(commands);

  const handleAction = (payload: ActionPayload) => {
    console.log('Action:', payload.name, payload.context);
    // Append new commands based on agent response
    setCmdQueue((prev) => [...prev /* new commands */]);
  };

  return (
    <XCard.Box commands={cmdQueue} components={{ Text, Button }} onAction={handleAction}>
      <XCard.Card id="welcome" />
    </XCard.Box>
  );
}
```

# 🚨 Development Rules

- **Always include `"version": "v0.9"`** on every command — omitting it causes protocol rejection.
- **One and only one `id: "root"` component** per surface's component tree — this is the tree root.
- **Flat adjacency list only** — never nest component objects inside other component objects; always reference children by `id` string.
- **Separate structure from data** — `updateComponents` for layout, `updateDataModel` for content/state.
- **Register catalog before mounting** — call `registerCatalog()` before the component tree renders.
- **Pass `components` map to `XCard.Box`**, not to `XCard.Card` — Box distributes to all Cards.
- **Never recreate the `components` object inline** — keep it stable with `useMemo` or module-level constant to avoid re-renders.
- **Input components require `value: { path: "..." }` for two-way binding** — literal values do not update the data model.
- **For streaming**: append new commands to the array rather than replacing it — Card processes the diff incrementally.
- **`action.event.context` paths are write targets** — they point to where user-entered data lives in the data model; do not resolve them as read sources.

# 🤝 Skill Collaboration

| Scenario                               | Skill combination                        |
| -------------------------------------- | ---------------------------------------- |
| AI chat with structured card responses | `use-x-chat` + `x-components` + `x-card` |
| Standalone agent form UI               | `x-card` only                            |
| Streaming Markdown + card side-panel   | `x-markdown` + `x-card`                  |
| HTTP streaming from agent into card    | `x-request` → feed response as commands  |

# 🔗 Reference Resources

- [USAGE.md](reference/USAGE.md) — Setup guide, streaming pattern, multi-surface examples
- [COMMANDS.md](reference/COMMANDS.md) — All four A2UI v0.9 command types, v0.8 vs v0.9 diff
- [DATA_BINDING.md](reference/DATA_BINDING.md) — JSON Pointer paths, dynamic types, two-way binding, template iteration
- [ACTIONS.md](reference/ACTIONS.md) — Action definitions, ActionPayload, form submission pattern
- [CATALOG.md](reference/CATALOG.md) — Local catalog registration, remote URL loading, custom component schema
- [API.md](reference/API.md) — Full TypeScript types for Box, Card, commands, catalog, actions

## Official Documentation

- [A2UI What Is It](https://a2ui.org/introduction/what-is-a2ui/)
- [A2UI v0.9 Specification](https://a2ui.org/specification/v0.9-a2ui/)
- [Concepts: Data Binding](https://a2ui.org/concepts/data-binding/)
- [Concepts: Catalogs](https://a2ui.org/concepts/catalogs/)
- [Guide: Agent Development](https://a2ui.org/guides/agent-development/)
- [GitHub: google/A2UI](https://github.com/google/A2UI)
