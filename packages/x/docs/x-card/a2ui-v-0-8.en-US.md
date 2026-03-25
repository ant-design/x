---
order: 2
title: A2UI v0.8
---

<!-- prettier-ignore -->
<code src="./demo/A2UI_v0.8/basic.tsx">Basic</code>
<code src="./demo/A2UI_v0.8/progressive.tsx">Progressive</code>

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
