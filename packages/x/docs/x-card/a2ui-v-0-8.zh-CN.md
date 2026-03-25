---
order: 2
title: A2UI v0.8
---

<!-- prettier-ignore -->
<code src="./demo/A2UI_v0.8/basic.tsx">基础</code>
<code src="./demo/A2UI_v0.8/progressive.tsx">渐进式</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### BoxProps

Box 组件作为容器，用于管理 Card 实例和命令分发。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 子元素 | React.ReactNode | - | - |
| components | 自定义组件映射，组件名称必须以大写字母开头 | Record\<string, React.ComponentType\<any\>\> | - | - |
| commands | A2UI 命令对象 | A2UICommand_v0_9 \| XAgentCommand_v0_8 | - | - |
| onAction | Card 内部组件触发 action 时的回调函数 | (payload: ActionPayload) => void | - | - |

### CardProps

Card 组件用于渲染单个 Surface。

| 属性 | 说明                               | 类型   | 默认值 | 版本 |
| ---- | ---------------------------------- | ------ | ------ | ---- |
| id   | Surface ID，对应命令中的 surfaceId | string | -      | -    |

### ActionPayload

action 事件的数据结构。

| 属性      | 说明                               | 类型                  | 默认值 | 版本 |
| --------- | ---------------------------------- | --------------------- | ------ | ---- |
| name      | 事件名称                           | string                | -      | -    |
| surfaceId | 触发该 action 的 surfaceId         | string                | -      | -    |
| context   | 当前 surface 的完整 dataModel 快照 | Record\<string, any\> | -      | -    |

### XAgentCommand_v0_8

v0.8 版本的命令类型，支持以下命令：

#### SurfaceUpdateCommand

更新 Surface 上的组件。

| 属性                     | 说明       | 类型                    | 默认值 | 版本 |
| ------------------------ | ---------- | ----------------------- | ------ | ---- |
| surfaceUpdate.surfaceId  | Surface ID | string                  | -      | -    |
| surfaceUpdate.components | 组件列表   | ComponentWrapper_v0_8[] | -      | -    |

#### ComponentWrapper_v0_8

v0.8 版本的组件包装结构。

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

更新数据模型（v0.8 格式）。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| dataModelUpdate.surfaceId | Surface ID | string | - | - |
| dataModelUpdate.contents | 数据内容列表 | Array\<{ key: string; valueMap: Array\<{ key: string; valueString: string }\> }\> | - | - |

#### BeginRenderingCommand

开始渲染。

| 属性                     | 说明       | 类型   | 默认值 | 版本 |
| ------------------------ | ---------- | ------ | ------ | ---- |
| beginRendering.surfaceId | Surface ID | string | -      | -    |
| beginRendering.root      | 根组件 ID  | string | -      | -    |

#### DeleteSurfaceCommand

删除 Surface。

| 属性                    | 说明       | 类型   | 默认值 | 版本 |
| ----------------------- | ---------- | ------ | ------ | ---- |
| deleteSurface.surfaceId | Surface ID | string | -      | -    |

### PathValue

数据绑定路径对象。

```typescript
interface PathValue {
  path: string;
}
```

### LiteralStringValue

字面字符串值对象（v0.8 特有）。

```typescript
interface LiteralStringValue {
  literalString: string;
}
```
