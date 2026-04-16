## A2UI v0.9

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
| context | Complete dataModel snapshot of current surface | Record\<string, any\> | - | - |

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

---

## A2UI v0.8

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
| context | Complete dataModel snapshot of current surface | Record\<string, any\> | - | - |

### XAgentCommand_v0_8

Command type for v0.8 version, supporting the following commands:

#### SurfaceUpdateCommand

Update components on a Surface.

| Property                 | Description    | Type                    | Default | Version |
| ------------------------ | -------------- | ----------------------- | ------- | ------- |
| surfaceUpdate.surfaceId  | Surface ID     | string                  | -       | -       |
| surfaceUpdate.components | Component list | ComponentWrapper_v0_8[] | -       | -       |

#### ComponentWrapper_v0_8

Component wrapper structure for v0.8 version.

```typescript
interface ComponentWrapper_v0_8 {
  id: string;
  component: {
    [componentType: string]: {
      child?: string;
      children?: string[] | ExplicitList;
      [key: string]: any | PathValue | LiteralStringValue;
    };
  };
}
```

#### ExplicitList

```typescript
interface ExplicitList {
  explicitList: string[];
}
```

#### DataModelUpdateCommand

Update data model (v0.8 format).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| dataModelUpdate.surfaceId | Surface ID | string | - | - |
| dataModelUpdate.contents | Data content list | Array\<{ key: string; valueMap: Array\<{ key: string; valueString: string }\> }\> | - | - |

#### BeginRenderingCommand

Begin rendering.

| Property                 | Description       | Type   | Default | Version |
| ------------------------ | ----------------- | ------ | ------- | ------- |
| beginRendering.surfaceId | Surface ID        | string | -       | -       |
| beginRendering.root      | Root component ID | string | -       | -       |

#### DeleteSurfaceCommand

Delete a Surface.

| Property                | Description | Type   | Default | Version |
| ----------------------- | ----------- | ------ | ------- | ------- |
| deleteSurface.surfaceId | Surface ID  | string | -       | -       |

### PathValue

Data binding path object.

```typescript
interface PathValue {
  path: string;
}
```

### LiteralStringValue

Literal string value object (v0.8 specific).

```typescript
interface LiteralStringValue {
  literalString: string;
}
```
