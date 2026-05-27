# Catalog 参考

本文档介绍 Catalog 的注册、加载和自定义组件 Schema 定义。配置新 Catalog 或编写自定义组件时阅读本文档。

---

## 什么是 Catalog？

Catalog 是一个 JSON Schema 文件，定义了 Agent 在 Surface 上可以使用哪些组件类型。每个 `createSurface` 命令都需要引用一个 `catalogId`。Card 会根据 Catalog 对接收到的组件属性进行校验。

---

## 本地 Catalog 注册

对于本地/自定义 Catalog，使用 `local://` URI 约定并在挂载前注册：

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
        value: {}, // 支持 { path: string } 绑定
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

// 在 React 树挂载前注册
registerCatalog(myCatalog);
```

然后在 `createSurface` 中引用：

```json
{
  "version": "v0.9",
  "createSurface": { "surfaceId": "my_surface", "catalogId": "local://my_catalog.json" }
}
```

---

## 远程 Catalog 加载

对于远程 Catalog，将完整 URL 作为 `catalogId` 提供，Box 会自动获取并缓存：

```json
{
  "version": "v0.9",
  "createSurface": {
    "surfaceId": "s1",
    "catalogId": "https://a2ui.org/specification/v0_9/basic_catalog.json"
  }
}
```

> ⚠️ 远程 Catalog 加载在运行时会发起网络请求，存在延迟和网络依赖。**自定义或内部 Catalog 推荐使用 `registerCatalog()` 本地注册**，避免不稳定的外部依赖。公共 Catalog URL（如 A2UI 官方 Catalog）可直接使用远程加载。

---

## Basic Catalog（预置）

A2UI Basic Catalog 包含通用组件，适合原型开发：

| 组件            | 关键属性                                   |
| --------------- | ------------------------------------------ |
| `Text`          | `text`（DynamicString，支持基础 Markdown） |
| `Image`         | `url`、`altText`                           |
| `Icon`          | `name`                                     |
| `Video`         | `url`                                      |
| `AudioPlayer`   | `url`                                      |
| `Row`           | `children`                                 |
| `Column`        | `children`                                 |
| `List`          | `children`（支持模板模式）                 |
| `Card`          | `child` / `children`                       |
| `Tabs`          | `{ title, child }` 对数组                  |
| `Divider`       | `orientation`                              |
| `Modal`         | 由 Button 触发的弹层                       |
| `Button`        | `text`、`action`、`checks`、`variant`      |
| `CheckBox`      | `label`、`value`                           |
| `TextField`     | `label`、`value`、`checks`、`variant`      |
| `DateTimeInput` | `label`、`value`                           |
| `ChoicePicker`  | `label`、`options`、`value`、`variant`     |
| `Slider`        | `label`、`value`、`min`、`max`             |

---

## Catalog 管理 API

```typescript
import { registerCatalog, loadCatalog, validateComponent, clearCatalogCache } from '@ant-design/x-card';

// 注册本地 Catalog（挂载前调用）
registerCatalog(catalog: Catalog): void

// 按 ID 加载 Catalog（先查本地注册表，再远程获取）
const catalog = await loadCatalog('local://my_catalog.json');

// 对照 Catalog 校验组件属性
const isValid = validateComponent(catalog, 'Button', { text: '点击' });

// 清除内存中的 Catalog 缓存（测试时使用）
clearCatalogCache();
```

---

## 命名与版本规则

| 变更类型                             | 版本影响                         |
| ------------------------------------ | -------------------------------- |
| 新增/删除容器组件（Grid、Accordion） | **破坏性变更** —— 需要主版本升级 |
| 新增叶子组件（Badge、Tooltip）       | 非破坏性                         |
| 新增可选属性                         | 非破坏性                         |
| 删除属性                             | 非破坏性                         |
| 新增无默认值的必填属性               | **破坏性变更**                   |
| 修改字段类型                         | **破坏性变更**                   |

**catalogId 命名约定：**

```
local://coffee_booking_catalog.json   ← 本地注册表
https://company.com/catalogs/v2/catalog.json   ← 远程，带版本的 URI
```

---

## 优雅降级

渲染器**必须**优雅处理未知组件：

- 未知组件类型 → 渲染占位文本，不崩溃
- 已知组件上的未知属性 → 静默忽略，正常渲染组件
- 被移除的组件 → 不再发送，客户端不受影响
