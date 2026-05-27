---
order: 2
title: A2UI v0.9
---

<!-- prettier-ignore -->
<code src="./demo/A2UI_v0.9/basic.tsx">Basic</code>
<code src="./demo/A2UI_v0.9/progressive.tsx">Progressive</code>
<code src="./demo/A2UI_v0.9/streaming.tsx">Streaming</code>
<code src="./demo/A2UI_v0.9/nested-interaction.tsx">Nested Interaction</code>
<code src="./demo/A2UI_v0.9/multi-card-sync.tsx">Multi Card Sync</code>
<code src="./demo/A2UI_v0.9/filter-search.tsx">Filter Search</code>
<code src="./demo/A2UI_v0.9/form-validation.tsx">Form Validation</code>
<code src="./demo/A2UI_v0.9/action-context-resolve.tsx">Action Context Resolve</code>

## API

Common props ref: [Common Props](/docs/react/common-props)

### BoxProps

Box component serves as a container to manage Card instances and command dispatching.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Child elements | React.ReactNode | - | - |
| components | Custom component mapping, component names must start with uppercase letters | Record\<string, React.ComponentType\<any\>\> | - | - |
| commands | A2UI command object | A2UICommand_v0_9 \| XAgentCommand_v0_8 | - | - |
| onAction | Callback function when action is triggered inside Card | (payload: ActionPayload) => void | - | - |

### CardProps

Card component is used to render a single Surface.

| Property | Description                                        | Type   | Default | Version |
| -------- | -------------------------------------------------- | ------ | ------- | ------- |
| id       | Surface ID, corresponding to surfaceId in commands | string | -       | -       |

### ActionPayload

Data structure for action events.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | Event name | string | - | - |
| surfaceId | The surfaceId that triggered the action | string | - | - |
| context | Context passed by component, with path references resolved | Record\<string, any\> | - | - |

### Action Context Path Reference Resolution

When a component triggers an action, X-Card automatically resolves path references in the context to actual values.

#### Path Reference Format

Use `{ path: string }` format to bind values from dataModel in action configuration:

```json
{
  "id": "submit-btn",
  "component": "Button",
  "action": {
    "event": {
      "name": "agent:send_context_text",
      "context": {
        "username": { "path": "/form/username", "label": "Username" },
        "email": { "path": "/form/email", "label": "Email" }
      }
    }
  }
}
```

#### Resolution Result

When user clicks the button to trigger action, the context received by `onAction` callback is automatically resolved:

```json
{
  "username": { "value": "John", "label": "Username" },
  "email": { "value": "john@example.com", "label": "Email" }
}
```

**Note**:

- Only values in `{ path: "xxx" }` format in the context are converted
- Actual values passed by component (e.g., `{ value: "actual_value" }`) are not incorrectly converted
- Other properties (like label) are preserved, only path is replaced with value

### A2UICommand_v0_9

Command type for v0.9 version, supporting the following commands:

#### CreateSurfaceCommand

Create a new Surface.

| Property                | Description                               | Type   | Default | Version |
| ----------------------- | ----------------------------------------- | ------ | ------- | ------- |
| version                 | Version number                            | 'v0.9' | -       | -       |
| createSurface.surfaceId | Surface ID                                | string | -       | -       |
| createSurface.catalogId | Component catalog URL or local identifier | string | -       | -       |

#### UpdateComponentsCommand

Update components on a Surface.

| Property                    | Description    | Type                 | Default | Version |
| --------------------------- | -------------- | -------------------- | ------- | ------- |
| version                     | Version number | 'v0.9'               | -       | -       |
| updateComponents.surfaceId  | Surface ID     | string               | -       | -       |
| updateComponents.components | Component list | BaseComponent_v0_9[] | -       | -       |

#### BaseComponent_v0_9

```typescript
interface BaseComponent_v0_9 {
  id: string;
  component: string;
  child?: string;
  children?: string[];
  [key: string]: any | PathValue;
}
```

#### UpdateDataModelCommand

Update data model.

| Property                  | Description    | Type   | Default | Version |
| ------------------------- | -------------- | ------ | ------- | ------- |
| version                   | Version number | 'v0.9' | -       | -       |
| updateDataModel.surfaceId | Surface ID     | string | -       | -       |
| updateDataModel.path      | Data path      | string | -       | -       |
| updateDataModel.value     | Data value     | any    | -       | -       |

#### DeleteSurfaceCommand

Delete a Surface.

| Property                | Description    | Type   | Default | Version |
| ----------------------- | -------------- | ------ | ------- | ------- |
| version                 | Version number | 'v0.9' | -       | -       |
| deleteSurface.surfaceId | Surface ID     | string | -       | -       |

### PathValue

Data binding path object.

```typescript
interface PathValue {
  path: string;
}
```

### Catalog

Component catalog definition.

```typescript
interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  functions?: Record<string, any>;
  $defs?: Record<string, any>;
}
```

### CatalogComponent

Component definition in Catalog.

```typescript
interface CatalogComponent {
  type: 'object';
  allOf?: any[];
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}
```

### Catalog Methods

#### registerCatalog

Register a local catalog.

```typescript
registerCatalog(catalog: Catalog): void
```

#### loadCatalog

Load a catalog (supports remote URL or locally registered schema).

```typescript
loadCatalog(catalogId: string): Promise<Catalog>
```

#### validateComponent

Validate whether a component conforms to catalog definition.

```typescript
validateComponent(catalog: Catalog, componentName: string, componentProps: Record<string, any>): boolean
```

#### clearCatalogCache

Clear catalog cache.

```typescript
clearCatalogCache(): void
```
