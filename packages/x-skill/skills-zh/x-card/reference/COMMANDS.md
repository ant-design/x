# A2UI 命令参考（v0.9）

本文档涵盖 `XAgentCommand_v0_9` 的四种 Server→Client 命令。需要了解命令结构或构建命令序列时阅读本文档。

---

## 消息信封

每条 v0.9 命令必须包含 `"version": "v0.9"`：

```typescript
type XAgentCommand_v0_9 =
  | { version: 'v0.9'; createSurface: CreateSurfacePayload }
  | { version: 'v0.9'; updateComponents: UpdateComponentsPayload }
  | { version: 'v0.9'; updateDataModel: UpdateDataModelPayload }
  | { version: 'v0.9'; deleteSurface: DeleteSurfacePayload };
```

---

## createSurface

初始化新 UI Surface。必须在针对该 `surfaceId` 的任何 `updateComponents` 或 `updateDataModel` 之前发送。

```typescript
interface CreateSurfacePayload {
  surfaceId: string; // 唯一的 Surface 标识符
  catalogId: string; // Catalog URI 或 local:// 标识符
  // 注意：theme 和 sendDataModel 为 A2UI 协议规范字段，当前实现尚未支持，传入会被静默忽略
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

发送扁平组件列表（邻接表）。可多次调用来追加/替换组件。

```typescript
interface UpdateComponentsPayload {
  surfaceId: string;
  components: BaseComponent_v0_9[];
}

interface BaseComponent_v0_9 {
  id: string; // Surface 内唯一的组件 ID
  component: string; // 组件类型名称（必须在 Catalog 中）
  child?: string; // 单个子组件 ID
  children?: string[]; // 多个子组件 ID；模板迭代时传 { path, componentId } 对象（运行时支持）
  [key: string]: any | { path: string }; // 所有 prop 均支持数据绑定
}

// List 组件的模板模式（运行时支持，TypeScript 类型中 children 声明为 string[]）
interface ChildListTemplate {
  path: string; // 数据模型中数组的 JSON Pointer
  componentId: string; // 每个数组项重复使用的模板组件 ID
}
```

**规则：**

- 必须有一个 `id: "root"` 组件 —— 这是树根
- 允许引用尚未收到的子组件（支持流式传输）
- 组件存储为扁平 Map，渲染时重建树结构

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "booking_form",
    "components": [
      { "id": "root", "component": "Column", "children": ["title", "name_input", "submit_btn"] },
      { "id": "title", "component": "Text", "text": "预订餐桌", "variant": "h1" },
      {
        "id": "name_input",
        "component": "TextField",
        "label": "您的姓名",
        "value": { "path": "/form/name" }
      },
      {
        "id": "submit_btn",
        "component": "Button",
        "text": "确认",
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

通过 JSON Pointer 路径更新 Surface 数据模型中的值。使用 upsert 语义。

```typescript
interface UpdateDataModelPayload {
  surfaceId: string;
  path: string; // JSON Pointer（RFC 6901）。根路径用 "/"
  value: any; // 要写入的值
}
```

**两种常用模式：**

```json
// 设置嵌套值
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/user/name", "value": "Alice" } }

// 全量替换数据模型（path 为根路径 "/"）
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/", "value": { "user": { "name": "Alice" } } } }
```

**流式模式** —— 先发结构，再逐步推送数据：

```jsonl
{"version":"v0.9","createSurface":{"surfaceId":"s1","catalogId":"local://cat.json"}}
{"version":"v0.9","updateComponents":{"surfaceId":"s1","components":[...]}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list","value":[]}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list/0","value":{"name":"条目 A"}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/list/1","value":{"name":"条目 B"}}}
```

> 注意：`path` 和 `value` 均为必填字段，不可省略。

---

## deleteSurface

移除 Surface 及其所有组件和数据模型。

```json
{ "version": "v0.9", "deleteSurface": { "surfaceId": "booking_form" } }
```

---

## v0.8 vs v0.9 对比

| 方面 | v0.8（已废弃） | v0.9（推荐） |
| --- | --- | --- |
| version 字段 | 无 | 必须有 `"version": "v0.9"` |
| Surface 创建 | `surfaceUpdate` 时隐式创建 | 显式发送 `createSurface` |
| 组件结构 | 嵌套 `{ "Button": { props } }` | 扁平 `{ id, component: "Button", ...props }` |
| 渲染触发 | 需要额外发 `beginRendering` | `updateComponents` 收到即渲染 |
| 数据更新 | `dataModelUpdate` + `contents` 数组 | `updateDataModel` + `path` + `value` |
| 数据路径 | 顶层 key，不支持 JSON Pointer | JSON Pointer（`/user/name`） |
| 字符串字面量 | `{ "literalString": "text" }` | 直接用字符串 `"text"` |
| action.context 格式 | 数组 `[{ key, value: { path } }]` | 对象 `{ key: { path } }` |
| 命令键名 | `surfaceUpdate` / `dataModelUpdate` / `beginRendering` | `updateComponents` / `updateDataModel` |

**v0.8 完整命令序列示例（新功能请勿使用）：**

```jsonl
// 1. 发送组件结构（隐式创建 Surface）
{
  "surfaceUpdate": {
    "surfaceId": "s1",
    "components": [
      { "id": "root", "component": { "Column": { "children": { "explicitList": ["title", "btn"] } } } },
      { "id": "title", "component": { "Text": { "text": { "path": "/user/name" } } } },
      {
        "id": "btn",
        "component": {
          "Button": {
            "text": { "literalString": "提交" },
            "action": {
              "name": "submit",
              "context": [{ "key": "name", "value": { "path": "/form/name" } }]
            }
          }
        }
      }
    ]
  }
}

// 2. 更新数据模型（key-value 格式，不支持 JSON Pointer）
{
  "dataModelUpdate": {
    "surfaceId": "s1",
    "contents": [
      { "key": "user", "valueMap": [{ "key": "name", "valueString": "Alice" }] },
      { "key": "status", "valueString": "ready" }
    ]
  }
}

// 3. 触发渲染（必须显式发送，指定根组件 ID）
{ "beginRendering": { "surfaceId": "s1", "root": "root" } }
```

> ⚠️ v0.8 中 `action.context` 是**数组**格式 `[{ key, value: { path } }]`，与 v0.9 的**对象**格式 `{ key: { path } }` 完全不同。

**v0.9 等价写法：**

```jsonl
{ "version": "v0.9", "createSurface": { "surfaceId": "s1", "catalogId": "local://cat.json" } }
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "s1",
    "components": [
      { "id": "root", "component": "Column", "children": ["title", "btn"] },
      { "id": "title", "component": "Text", "text": { "path": "/user/name" } },
      {
        "id": "btn",
        "component": "Button",
        "text": "提交",
        "action": { "event": { "name": "submit", "context": { "name": { "path": "/form/name" } } } }
      }
    ]
  }
}
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/user/name", "value": "Alice" } }
{ "version": "v0.9", "updateDataModel": { "surfaceId": "s1", "path": "/status", "value": "ready" } }
```
