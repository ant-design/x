# Catalog Reference

This file covers catalog registration, loading, and custom component schema definition. Read this when setting up a new catalog or authoring custom components.

---

## What Is a Catalog?

A catalog is a JSON Schema file defining which component types an agent can use on a surface. Every `createSurface` command references a `catalogId`. The Card validates incoming component props against the catalog.

---

## Local Catalog Registration

For local/custom catalogs, use the `local://` URI convention and register before mounting:

```typescript
import { registerCatalog } from '@ant-design/x-card';
import type { Catalog } from '@ant-design/x-card';

const myCatalog: Catalog = {
  catalogId: 'local://my_catalog.json',
  components: {
    Text: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        variant: { type: 'string', enum: ['h1', 'h2', 'body', 'caption'] },
      },
      required: ['text'],
    },
    Button: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        variant: { type: 'string', enum: ['primary', 'borderless'] },
        action: {},
        checks: {},
      },
      required: ['text'],
    },
    TextField: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        value: {}, // Supports { path: string } binding
        checks: {},
        variant: { type: 'string', enum: ['shortText'] },
      },
      required: ['label'],
    },
    Column: {
      type: 'object',
      properties: {
        children: {}, // string[] | ChildListTemplate
      },
    },
    Card: {
      type: 'object',
      properties: {
        child: { type: 'string' },
        children: {},
      },
    },
  },
};

// Register BEFORE the React tree mounts
registerCatalog(myCatalog);
```

Then reference in `createSurface`:

```json
{
  "version": "v0.9",
  "createSurface": { "surfaceId": "my_surface", "catalogId": "local://my_catalog.json" }
}
```

---

## Remote Catalog Loading

For remote catalogs, provide a full URL as `catalogId`. The Box fetches and caches it automatically:

```json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "s1",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json"
  }
}
```

> ⚠️ `catalogId` URIs are identifiers, not runtime-fetched resources in production. For custom catalogs, always use `registerCatalog()` to avoid network dependency.

---

## Basic Catalog (Pre-built)

The A2UI Basic Catalog includes general-purpose components. Use for prototyping:

| Component       | Key Props                                       |
| --------------- | ----------------------------------------------- |
| `Text`          | `text` (DynamicString, supports basic Markdown) |
| `Image`         | `url`, `altText`                                |
| `Icon`          | `name`                                          |
| `Video`         | `url`                                           |
| `AudioPlayer`   | `url`                                           |
| `Row`           | `children`                                      |
| `Column`        | `children`                                      |
| `List`          | `children` (supports template mode)             |
| `Card`          | `child` / `children`                            |
| `Tabs`          | array of `{ title, child }`                     |
| `Divider`       | `orientation`                                   |
| `Modal`         | dialog triggered by button                      |
| `Button`        | `text`, `action`, `checks`, `variant`           |
| `CheckBox`      | `label`, `value`                                |
| `TextField`     | `label`, `value`, `checks`, `variant`           |
| `DateTimeInput` | `label`, `value`                                |
| `ChoicePicker`  | `label`, `options`, `value`, `variant`          |
| `Slider`        | `label`, `value`, `min`, `max`                  |

---

## Catalog Management APIs

```typescript
import { registerCatalog, loadCatalog, validateComponent, clearCatalogCache } from '@ant-design/x-card';

// Register a local catalog
registerCatalog(catalog: Catalog): void

// Load a catalog by ID (checks local registry first, then fetches remote)
const catalog = await loadCatalog('local://my_catalog.json');

// Validate a component against a catalog
const isValid = validateComponent(catalog, 'Button', { text: 'Click me' });

// Clear the catalog cache (useful in tests)
clearCatalogCache();
```

---

## Naming & Versioning Rules

| Change Type                                      | Version Impact                    |
| ------------------------------------------------ | --------------------------------- |
| Add/remove container component (Grid, Accordion) | **Breaking** — major version bump |
| Add leaf component (Badge, Tooltip)              | Non-breaking                      |
| Add optional property                            | Non-breaking                      |
| Remove property                                  | Non-breaking                      |
| Add required property without default            | **Breaking**                      |
| Change field type                                | **Breaking**                      |

**CatalogId convention:**

```
local://coffee_booking_catalog.json   ← local registry
https://company.com/catalogs/v2/catalog.json   ← remote, versioned URI
```

---

## Graceful Degradation

Renderers **must** handle unknown components gracefully:

- Unknown component type → render a placeholder text, not a crash
- Unknown prop on known component → silently ignored, component renders normally
- Removed component → no longer sent, client unaffected
