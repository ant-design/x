# @ant-design/x-card

Render safe, declarative A2UI surfaces in React. The package supports A2UI v0.8 and v0.9 command streams, custom React component catalogs, data binding, actions, and an experimental headless Surface Runtime for validated transactional updates.

## Installation

```bash
npm install @ant-design/x-card antd
```

React and React DOM are peer dependencies.

## Component renderer

Use `XCard.Box` to provide the command stream and component catalog, then render one or more surfaces with `XCard.Card`.

```tsx
import XCard, { type XAgentCommand_v0_9 } from '@ant-design/x-card';
import { Button, Flex, Typography } from 'antd';

const Text = ({ text }: { text: string }) => <Typography.Text>{text}</Typography.Text>;

const commands: XAgentCommand_v0_9[] = [
  {
    version: 'v0.9',
    createSurface: { surfaceId: 'welcome', catalogId: 'local://app' },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'welcome',
      components: [
        { id: 'root', component: 'Flex', children: ['title', 'confirm'], vertical: true },
        { id: 'title', component: 'Text', text: 'Ready to continue?' },
        {
          id: 'confirm',
          component: 'Button',
          child: 'confirm-label',
          action: { event: { name: 'confirm' } },
        },
        { id: 'confirm-label', component: 'Text', text: 'Confirm' },
      ],
    },
  },
];

export default () => (
  <XCard.Box
    commands={commands}
    components={{ Button, Flex, Text }}
    onAction={(action) => console.log(action)}
  >
    <XCard.Card id="welcome" />
  </XCard.Box>
);
```

For local or remote catalog setup, protocol command shapes, and complete demos, see the [x-card documentation](https://x.ant.design/x-cards/introduce).

## Experimental Surface Runtime

The headless Runtime normalizes protocol-specific commands into immutable Surface snapshots and validates every transaction against a strict catalog before commit.

```ts
import { experimentalRuntime } from '@ant-design/x-card';

const catalogId = 'local://app';
const catalogs = experimentalRuntime.createSurfaceCatalogRegistry({
  catalogs: [
    {
      $id: catalogId,
      components: {
        Text: {
          type: 'object',
          required: ['text'],
          properties: { text: {} },
          additionalProperties: false,
        },
      },
    },
  ],
});

const runtime = experimentalRuntime.createSurfaceRuntime({
  catalogs,
  adapters: [experimentalRuntime.a2uiV09Adapter],
});

await runtime.dispatch({
  protocol: 'a2ui',
  version: 'v0.9',
  payload: {
    version: 'v0.9',
    createSurface: { surfaceId: 'welcome', catalogId },
  },
});
```

The Runtime API is experimental and may change before it becomes a stable top-level export.

## Exports

| Export | Purpose |
| --- | --- |
| `XCard`, `Box`, `Card` | React A2UI rendering components |
| `registerCatalog`, `loadCatalog`, `validateComponent` | Renderer catalog utilities |
| `XAgentCommand_v0_8`, `XAgentCommand_v0_9` | Protocol command types |
| `experimentalRuntime` | Headless adapters, catalogs, transactions, snapshots, and rollback |

## Development

```bash
npm run tsc --workspace packages/x-card
npm test --workspace packages/x-card
npm run compile --workspace packages/x-card
```

## License

MIT
