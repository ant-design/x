# A2UI Command Reference (v0.9)

This file covers all four server→client commands in `XAgentCommand_v0_9`. Read this when you need to understand command structure or build a command sequence.

---

## Message Envelope

Every v0.9 command must include `"version": "v0.9"`:

```typescript
type XAgentCommand_v0_9 =
  | { version: 'v0.9'; createSurface: CreateSurfacePayload }
  | { version: 'v0.9'; updateComponents: UpdateComponentsPayload }
  | { version: 'v0.9'; updateDataModel: UpdateDataModelPayload }
  | { version: 'v0.9'; deleteSurface: DeleteSurfacePayload };
```

---

## createSurface

Initializes a new UI surface. Must be sent before any `updateComponents` or `updateDataModel` for that `surfaceId`.

```typescript
interface CreateSurfacePayload {
  surfaceId: string; // Unique surface identifier
  catalogId: string; // Catalog URI or local:// identifier
  theme?: {
    primaryColor?: string; // Hex color e.g. "#00BFFF"
    iconUrl?: string; // Agent logo URL
    agentDisplayName?: string; // Display name in multi-agent systems
  };
  sendDataModel?: boolean; // If true, full data model sent with every action. Default: false
}
```

```json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "booking_form",
    "catalogId": "local://booking_catalog.json",
    "theme": { "primaryColor": "#1677ff" }
  }
}
```

---

## updateComponents

Sends a flat list of components (adjacency list). Can be called multiple times to add/replace components.

```typescript
interface UpdateComponentsPayload {
  surfaceId: string;
  components: BaseComponent_v0_9[];
}

interface BaseComponent_v0_9 {
  id: string; // Unique component ID within surface
  component: string; // Component type name (must be in catalog)
  child?: string; // Single child component ID
  children?: string[] | ChildListTemplate; // Multiple child IDs or template
  [key: string]: any | { path: string }; // All props support data binding
}

// Template mode for List components
interface ChildListTemplate {
  path: string; // JSON Pointer to array in data model
  componentId: string; // Template component ID to repeat per item
}
```

**Rules:**

- One component must have `id: "root"` — this is the tree root
- References to child components that haven't arrived yet are allowed (streaming)
- Components are stored in a flat map; tree is reconstructed at render

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "booking_form",
    "components": [
      { "id": "root", "component": "Column", "children": ["title", "name_input", "submit_btn"] },
      { "id": "title", "component": "Text", "text": "Book a Table", "variant": "h1" },
      {
        "id": "name_input",
        "component": "TextField",
        "label": "Your Name",
        "value": { "path": "/form/name" }
      },
      {
        "id": "submit_btn",
        "component": "Button",
        "text": "Confirm",
        "action": {
          "event": {
            "name": "confirm_booking",
            "context": { "name": { "path": "/form/name" } }
          }
        }
      }
    ]
  }
}
```

---

## updateDataModel

Updates a value in the surface's data model at a JSON Pointer path. Uses upsert semantics.

```typescript
interface UpdateDataModelPayload {
  surfaceId: string;
  path?: string; // JSON Pointer (RFC 6901). Defaults to "/" (full replace)
  value?: any; // New value. If omitted, removes key at path
}
```

**Three patterns:**

```json
// Set a nested value
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/user/name", "value": "Alice" } }

// Replace entire model
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "value": { "user": { "name": "Alice" } } } }

// Remove a key (omit value)
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/user/tempData" } }
```

**Streaming pattern** — send structure first, then push data step by step:

```jsonl
{"version":"v0.9","createSurface":{"surfaceId":"s1","catalogId":"local://cat.json"}}
{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[...]}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list","value":[]}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list/0","value":{"name":"Item A"}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list/1","value":{"name":"Item B"}}}
```

---

## deleteSurface

Removes a surface and all its components and data model.

```typescript
interface DeleteSurfacePayload {
  surfaceId: string;
}
```

```json
{ "version": "v0.9", "deleteSurface": { "surfaceId": "booking_form" } }
```

---

## v0.8 vs v0.9

| Aspect | v0.8 (deprecated) | v0.9 (recommended) |
| --- | --- | --- |
| Version field | None | `"version": "v0.9"` required |
| Surface creation | Implicit on first `updateComponents` | Explicit `createSurface` |
| Component structure | Nested `{ "Button": { props } }` | Flat `{ id, component: "Button", ...props }` |
| Data updates | `dataModelUpdate` with `contents` array | `updateDataModel` with `path` + `value` |
| Data model init | `contents: [{ key, valueString/valueMap }]` | `updateDataModel` with JSON path |
| String literals | `{ "literalString": "text" }` | Plain string `"text"` |

**v0.8 example (do not use for new work):**

```json
{
  "updateComponents": {
    "surfaceId": "s1",
    "catalogId": "...",
    "components": [{ "id": "btn", "component": { "Button": { "text": "Click" } } }]
  }
}
```

**v0.9 equivalent:**

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "s1",
    "components": [{ "id": "btn", "component": "Button", "text": "Click" }]
  }
}
```
