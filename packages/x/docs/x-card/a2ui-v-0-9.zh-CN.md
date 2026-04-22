---
order: 2
title: A2UI v0.9
---

<!-- prettier-ignore -->
<code src="./demo/A2UI_v0.9/basic.tsx">基础</code>
<code src="./demo/A2UI_v0.9/progressive.tsx">渐进式</code>
<code src="./demo/A2UI_v0.9/streaming.tsx">流式渲染</code>
<code src="./demo/A2UI_v0.9/nested-interaction.tsx">嵌套交互</code>
<code src="./demo/A2UI_v0.9/multi-card-sync.tsx">多卡片同步</code>
<code src="./demo/A2UI_v0.9/filter-search.tsx">筛选搜索</code>
<code src="./demo/A2UI_v0.9/form-validation.tsx">表单验证</code>

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

### A2UICommand_v0_9

v0.9 版本的命令类型，支持以下命令：

#### CreateSurfaceCommand

创建新的 Surface。

| 属性                    | 说明                    | 类型   | 默认值 | 版本 |
| ----------------------- | ----------------------- | ------ | ------ | ---- |
| version                 | 版本号                  | 'v0.9' | -      | -    |
| createSurface.surfaceId | Surface ID              | string | -      | -    |
| createSurface.catalogId | 组件目录 URL 或本地标识 | string | -      | -    |

#### UpdateComponentsCommand

更新 Surface 上的组件。

| 属性                        | 说明       | 类型                 | 默认值 | 版本 |
| --------------------------- | ---------- | -------------------- | ------ | ---- |
| version                     | 版本号     | 'v0.9'               | -      | -    |
| updateComponents.surfaceId  | Surface ID | string               | -      | -    |
| updateComponents.components | 组件列表   | BaseComponent_v0_9[] | -      | -    |

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

更新数据模型。

| 属性                      | 说明       | 类型   | 默认值 | 版本 |
| ------------------------- | ---------- | ------ | ------ | ---- |
| version                   | 版本号     | 'v0.9' | -      | -    |
| updateDataModel.surfaceId | Surface ID | string | -      | -    |
| updateDataModel.path      | 数据路径   | string | -      | -    |
| updateDataModel.value     | 数据值     | any    | -      | -    |

#### DeleteSurfaceCommand

删除 Surface。

| 属性                    | 说明       | 类型   | 默认值 | 版本 |
| ----------------------- | ---------- | ------ | ------ | ---- |
| version                 | 版本号     | 'v0.9' | -      | -    |
| deleteSurface.surfaceId | Surface ID | string | -      | -    |

### PathValue

数据绑定路径对象。

```typescript
interface PathValue {
  path: string;
}
```

### Catalog

组件目录定义。

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

Catalog 中的组件定义。

```typescript
interface CatalogComponent {
  type: 'object';
  allOf?: any[];
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}
```

### Catalog 相关方法

#### registerCatalog

注册本地 catalog。

```typescript
registerCatalog(catalog: Catalog): void
```

#### loadCatalog

加载 catalog（支持远程 URL 或本地注册的 schema）。

```typescript
loadCatalog(catalogId: string): Promise<Catalog>
```

#### validateComponent

验证组件是否符合 catalog 定义。

```typescript
validateComponent(catalog: Catalog, componentName: string, componentProps: Record<string, any>): boolean
```

#### clearCatalogCache

清除 catalog 缓存。

```typescript
clearCatalogCache(): void
```
