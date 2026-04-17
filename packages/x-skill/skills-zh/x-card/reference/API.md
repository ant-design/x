# API 参考

`@ant-design/x-card` 的完整 TypeScript 类型。

---

## React 组件

### XCard.Box

```typescript
interface BoxProps {
  /** 命令队列 —— 追加新命令；每次更新不要替换整个数组 */
  commands?: (XAgentCommand_v0_9 | XAgentCommand_v0_8)[];
  /**
   * 组件名称 → React 组件实现的映射
   * 组件名称必须以大写字母开头（符合 React 组件规范）
   */
  components?: Record<string, React.ComponentType<any>>;
  /** Surface 组件触发 Action 时调用 */
  onAction?: (payload: ActionPayload) => void;
  children?: React.ReactNode;
}
```

### XCard.Card

```typescript
interface CardProps {
  /** 该卡片渲染的 surfaceId */
  id: string;
}
```

---

## 命令类型（v0.9）

```typescript
type XAgentCommand_v0_9 =
  | { version: 'v0.9'; createSurface: CreateSurfacePayload }
  | { version: 'v0.9'; updateComponents: UpdateComponentsPayload }
  | { version: 'v0.9'; updateDataModel: UpdateDataModelPayload }
  | { version: 'v0.9'; deleteSurface: DeleteSurfacePayload };

interface CreateSurfacePayload {
  surfaceId: string;
  catalogId: string;
  // 注意：theme 和 sendDataModel 为 A2UI 协议规范字段，当前实现尚未支持，传入会被静默忽略
}

interface UpdateComponentsPayload {
  surfaceId: string;
  components: BaseComponent_v0_9[];
}

interface BaseComponent_v0_9 {
  id: string;
  component: string;
  child?: string;
  children?: string[]; // 子组件 ID 数组；模板迭代用 { path, componentId } 对象（运行时支持，类型层未体现）
  [key: string]: any | PathValue;
}

interface PathValue {
  path: string;
}

interface UpdateDataModelPayload {
  surfaceId: string;
  path: string; // JSON Pointer（RFC 6901），根路径用 "/"
  value: any; // 要写入的值
}

interface DeleteSurfacePayload {
  surfaceId: string;
}
```

---

## Action 类型

```typescript
interface ActionPayload {
  name: string;
  surfaceId: string;
  /**
   * 触发 Action 时当前 Surface 的完整 dataModel 快照。
   * 注意：这是整个数据模型，不只是 action.event.context 中定义的字段。
   * 例：{ form: { email: '...', name: '...' }, ui: { loading: false } }
   */
  context: Record<string, any>;
}

// 服务端 Action 定义（写在组件上）
interface ServerAction {
  event: {
    name: string;
    context: Record<string, any | PathValue>;
  };
}

// 客户端函数 Action
interface FunctionAction {
  functionCall: {
    call: string;
    args: Record<string, any>;
  };
}
```

---

## Catalog 类型

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

interface CatalogComponent {
  type: 'object';
  properties?: Record<string, any>;
  required?: string[];
  allOf?: any[];
  [key: string]: any;
}
```

---

## Catalog API 函数

```typescript
/** 注册本地 Catalog（挂载前调用） */
function registerCatalog(catalog: Catalog): void;

/** 按 ID 加载 Catalog —— 先查本地注册表，再远程获取 */
function loadCatalog(catalogId: string): Promise<Catalog>;

/** 对照已加载的 Catalog 校验组件属性 */
function validateComponent(
  catalog: Catalog,
  componentName: string,
  componentProps: Record<string, any>,
): boolean;

/** 清除内存中的 Catalog 缓存 */
function clearCatalogCache(): void;
```

---

## v0.8 类型（已废弃）

```typescript
type XAgentCommand_v0_8 =
  | { surfaceUpdate: SurfaceUpdate_v0_8 }
  | { dataModelUpdate: DataModelUpdate_v0_8 }
  | { beginRendering: BeginRendering_v0_8 }
  | { deleteSurface: DeleteSurface_v0_8 };

interface SurfaceUpdate_v0_8 {
  surfaceId: string;
  components: ComponentWrapper_v0_8[];
}

interface ComponentWrapper_v0_8 {
  id: string;
  component: {
    [componentType: string]: {
      // 例 "Button"
      child?: string;
      children?: string[] | { explicitList: string[] };
      action?: ActionConfig_v0_8; // v0.8 action 格式
      [key: string]: any; // 支持 { path } 或 { literalString } 绑定
    };
  };
}

// v0.8 action 格式：context 是数组，与 v0.9 的对象格式不同
interface ActionConfig_v0_8 {
  name: string;
  context?: Array<{
    key: string;
    value: PathValue | LiteralStringValue | any; // { path } 是写入目标
  }>;
}

interface LiteralStringValue {
  literalString: string; // v0.8 特有，等价于 v0.9 中的直接字符串字面量
}

interface DataModelUpdate_v0_8 {
  surfaceId: string;
  contents: Array<{
    key: string;
    valueString?: string; // 直接存储字符串值
    valueMap?: Array<{ key: string; valueString: string }>; // 转换为对象
  }>;
}

interface BeginRendering_v0_8 {
  surfaceId: string;
  root: string; // 根组件 ID，v0.8 须显式指定
}

interface DeleteSurface_v0_8 {
  surfaceId: string;
}
```
