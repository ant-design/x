---
order: 3
title: Surface Runtime
---

`experimentalRuntime` is a protocol-independent, headless Surface state layer. It normalizes A2UI v0.8/v0.9 inputs into transactions, validates catalogs, component properties, graph invariants, and capacity limits, then commits immutable snapshots. Renderers subscribe to trusted snapshots instead of consuming Agent input directly.

> The Runtime is currently exported under the `experimentalRuntime` namespace and may change before stabilization.

## Quick start

```typescript
import { experimentalRuntime } from '@ant-design/x-card';

const CATALOG_ID = 'local://booking';
const catalogs = experimentalRuntime.createSurfaceCatalogRegistry({
  catalogs: [
    {
      $id: CATALOG_ID,
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
  limits: { maxNodesPerSurface: 1000, historyLimit: 8 },
  onIssue: (issue) => reportSurfaceIssue(issue),
});

const result = await runtime.dispatchBatch([
  {
    protocol: 'a2ui',
    version: 'v0.9',
    payload: {
      version: 'v0.9',
      createSurface: { surfaceId: 'booking', catalogId: CATALOG_ID },
    },
  },
  {
    protocol: 'a2ui',
    version: 'v0.9',
    payload: {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'booking',
        components: [{ id: 'root', component: 'Text', text: 'Ready' }],
      },
    },
  },
]);

if (!result.accepted) console.error(result.issue);
```

`dispatchBatch` is atomic: if any input fails decoding, catalog validation, or state reduction, none of the batch is committed and subscribers keep the last valid snapshot.

## A2UI v0.8

A v0.8 command does not carry its catalog, so bind one when creating the adapter:

```typescript
const runtime = experimentalRuntime.createSurfaceRuntime({
  catalogs,
  adapters: [experimentalRuntime.createA2UIV08Adapter({ catalogId: CATALOG_ID })],
});

await runtime.dispatch({
  protocol: 'a2ui',
  version: 'v0.8',
  payload: {
    surfaceUpdate: {
      surfaceId: 'booking',
      components: [{ id: 'root', component: { Text: { text: { literalString: 'Ready' } } } }],
    },
  },
});
```

The `version` above belongs to the Runtime input envelope and selects the adapter; the v0.8 `payload` keeps its original legacy shape.

## Subscription and rollback

React consumers can subscribe with `useSyncExternalStore(runtime.subscribe, runtime.getSnapshot)`. The snapshot contains `surfaces`; each Surface exposes `status`, `revision`, `rootId`, `nodes`, and `dataModel`.

```typescript
const surface = runtime.getSurface('booking');
const previous = runtime.rollback('booking');
const selected = runtime.rollback('booking', 3);
```

Rollback restores historical content and assigns a revision greater than the current one. It never reuses an old revision number.

## Runtime API

| Method | Description |
| --- | --- |
| `dispatch(input)` | Normalize, validate, and commit one protocol input |
| `dispatchBatch(inputs)` | Atomically commit a group of protocol inputs |
| `rollback(surfaceId, revision?)` | Restore the previous snapshot or a selected historical revision |
| `getSnapshot()` | Read the current immutable snapshot of all Surfaces |
| `getSurface(surfaceId)` | Read one Surface snapshot |
| `subscribe(listener)` | Subscribe to successful commits and rollbacks |
| `dispose()` | Stop the Runtime and release subscriptions and history |

## Catalog Registry API

| Method | Description |
| --- | --- |
| `register(catalog)` | Register a local catalog |
| `get(catalogId)` | Synchronously read a registered catalog |
| `resolve(catalogId)` | Read locally or deduplicate a remote load through `loader` |
| `validateNode(catalogId, node)` | Check the component allowlist, required properties, and extra properties |
| `clear()` | Clear registrations and pending loads |

A loaded Catalog's `$id` / `catalogId` must match the requested identifier. Property validation currently covers the allowlist, `required`, `properties`, and `additionalProperties`; it is not a complete JSON Schema implementation.

## Issues and limits

Rejections are returned through `SurfaceDispatchResult.issue` with a `decode`, `catalog`, or `reduce` phase. Common codes include `unsupported_protocol`, `invalid_command`, `component_not_allowed`, `schema_validation_failed`, `revision_conflict`, `graph_invariant_failed`, and `limit_exceeded`.

Use `limits` to configure nodes per Surface, graph depth, operations per transaction, and snapshot history. Production applications should connect `onIssue` to logging or observability and provide a renderer error boundary for failed Surfaces.

## Version choice

Use v0.9 for new integrations. The v0.8 adapter exists for legacy traffic. Both normalize to the same `SurfaceTransaction` and `SurfaceSnapshot`, so a renderer does not need separate state models. See the complete [v0.8 Production Runtime](/x-cards/a2ui-v-0-8) and [v0.9 Production Runtime](/x-cards/a2ui-v-0-9) demos.
