# Usage Guide

This file covers setup, multi-surface patterns, and streaming progressive rendering. Read this for end-to-end integration examples.

---

## Basic Setup

Minimum working setup:

```tsx
import React, { useState } from 'react';
import { XCard, registerCatalog } from '@ant-design/x-card';
import type { XAgentCommand_v0_9, ActionPayload, Catalog } from '@ant-design/x-card';

// 1. Define catalog
const catalog: Catalog = {
  catalogId: 'local://basic.json',
  components: {
    Text: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
    Column: { type: 'object', properties: { children: {} } },
    Button: {
      type: 'object',
      properties: { text: { type: 'string' }, action: {} },
      required: ['text'],
    },
  },
};
registerCatalog(catalog);

// 2. Custom component implementations
const components = {
  Text: ({ text }: { text: string }) => <p>{text}</p>,
  Column: ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
  ),
  Button: ({ text, onAction, action }: any) => (
    <button onClick={() => onAction?.(action?.event?.context ?? {})}>{text}</button>
  ),
};

// 3. Build initial commands
const initialCommands: XAgentCommand_v0_9[] = [
  { version: 'v0.9', createSurface: { surfaceId: 'main', catalogId: 'local://basic.json' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        { id: 'root', component: 'Column', children: ['greeting', 'btn'] },
        { id: 'greeting', component: 'Text', text: { path: '/name' } },
        {
          id: 'btn',
          component: 'Button',
          text: 'Say Hi',
          action: { event: { name: 'greet', context: {} } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'main', path: '/name', value: 'Alice' } },
];

// 4. Component
export default function App() {
  const [cmds, setCmds] = useState(initialCommands);

  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'greet') {
      setCmds((prev) => [
        ...prev,
        { version: 'v0.9', updateDataModel: { surfaceId: 'main', path: '/name', value: 'Bob' } },
      ]);
    }
  };

  return (
    <XCard.Box commands={cmds} components={components} onAction={handleAction}>
      <XCard.Card id="main" />
    </XCard.Box>
  );
}
```

---

## Multi-Surface Setup

Multiple independent surfaces in one Box:

```tsx
export default function MultiSurface() {
  const [cmds, setCmds] = useState<XAgentCommand_v0_9[]>([
    // Surface 1
    { version: 'v0.9', createSurface: { surfaceId: 'profile', catalogId: 'local://cat.json' } },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'profile',
        components: [{ id: 'root', component: 'Text', text: { path: '/user/name' } }],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: { surfaceId: 'profile', path: '/user/name', value: 'Alice' },
    },

    // Surface 2
    { version: 'v0.9', createSurface: { surfaceId: 'cart', catalogId: 'local://cat.json' } },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'cart',
        components: [{ id: 'root', component: 'Text', text: { path: '/total' } }],
      },
    },
    { version: 'v0.9', updateDataModel: { surfaceId: 'cart', path: '/total', value: '$42.00' } },
  ]);

  return (
    <XCard.Box commands={cmds} components={components}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <XCard.Card id="profile" />
        <XCard.Card id="cart" />
      </div>
    </XCard.Box>
  );
}
```

---

## Streaming

Append commands incrementally as the agent streams responses:

```tsx
export default function StreamingDemo() {
  const [cmds, setCmds] = useState<XAgentCommand_v0_9[]>([]);

  const startStream = async () => {
    // Step 1: Create surface immediately
    setCmds([
      { version: 'v0.9', createSurface: { surfaceId: 'results', catalogId: 'local://cat.json' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'results',
          components: [
            { id: 'root', component: 'Column', children: ['loading', 'list'] },
            { id: 'loading', component: 'Text', text: { path: '/ui/status' } },
            {
              id: 'list',
              component: 'List',
              children: { path: '/items', componentId: 'item_tmpl' },
            },
            { id: 'item_tmpl', component: 'Text', text: { path: 'name' } },
          ],
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'results',
          value: { ui: { status: 'Loading...' }, items: [] },
        },
      },
    ]);

    // Step 2: Stream data in progressively
    for (let i = 0; i < 5; i++) {
      await delay(500);
      setCmds((prev) => [
        ...prev,
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'results',
            path: `/items/${i}`,
            value: { name: `Item ${i + 1}` },
          },
        },
      ]);
    }

    // Step 3: Done
    setCmds((prev) => [
      ...prev,
      {
        version: 'v0.9',
        updateDataModel: { surfaceId: 'results', path: '/ui/status', value: 'Complete!' },
      },
    ]);
  };

  return (
    <div>
      <button onClick={startStream}>Start</button>
      <XCard.Box commands={cmds} components={components}>
        <XCard.Card id="results" />
      </XCard.Box>
    </div>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

---

## Stable `components` Prop

Keep the `components` map stable to prevent unnecessary re-renders:

```tsx
// ✅ Module-level constant — always stable
const COMPONENTS = { Text, Button, Column, Card };

// ✅ useMemo when deps are static
const components = useMemo(() => ({ Text, Button }), []);

// ❌ Inline object — recreated every render, causes Card to remount
<XCard.Box components={{ Text, Button }} ...>
```

---

## Teardown

When done, send `deleteSurface` to clean up:

```tsx
const teardown = () => {
  setCmds((prev) => [...prev, { version: 'v0.9', deleteSurface: { surfaceId: 'main' } }]);
};
```
