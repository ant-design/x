# 数据绑定参考

本文档介绍组件属性如何与 Surface 数据模型连接。需要将组件值绑定到实时数据或构建模板列表时阅读本文档。

---

## 核心概念

每个 Surface 都有独立的 JSON 数据模型。组件属性可通过 `{ path: "/json/pointer" }` 语法读取数据模型中的值。数据模型更新时，绑定的组件自动重新渲染。

---

## JSON Pointer 语法（RFC 6901）

| 路径                  | 访问位置                        |
| --------------------- | ------------------------------- |
| `/user/name`          | `dataModel.user.name`           |
| `/cart/items/0`       | `dataModel.cart.items[0]`       |
| `/cart/items/0/price` | `dataModel.cart.items[0].price` |

**绝对路径**：以 `/` 开头，始终从数据模型根部解析。 **相对路径**：无前导 `/`，在模板的集合作用域内按相对位置解析。

---

## 字面量 vs 绑定值

```typescript
// 字面量 —— 静态，不响应数据变化
{ id: 'title', component: 'Text', text: '你好世界' }

// 数据绑定 —— 读取 /user/name，数据变化时自动重渲染
{ id: 'title', component: 'Text', text: { path: '/user/name' } }
```

任何属性都可以是字面量或 `{ path }` 对象，包括字符串、数字、布尔值和字符串列表。

---

## 动态类型

| 类型                | 字面量形式  | 绑定形式                   |
| ------------------- | ----------- | -------------------------- |
| `DynamicString`     | `"文本"`    | `{ "path": "/data/str" }`  |
| `DynamicNumber`     | `42`        | `{ "path": "/data/num" }`  |
| `DynamicBoolean`    | `true`      | `{ "path": "/data/flag" }` |
| `DynamicStringList` | `["a","b"]` | `{ "path": "/data/list" }` |

---

## 双向绑定（输入组件）

输入组件通过 `value` 属性实现读写双向绑定：

```typescript
// TextField —— 展示 /form/email，用户输入时更新它
{ id: 'email', component: 'TextField', label: '邮箱', value: { path: '/form/email' } }

// CheckBox —— 切换 /form/subscribe
{ id: 'subscribe', component: 'CheckBox', label: '订阅', value: { path: '/form/subscribe' } }

// ChoicePicker —— 更新 /form/plan
{ id: 'plan', component: 'ChoicePicker', label: '套餐', options: ['免费','专业'], value: { path: '/form/plan' } }

// Slider —— 更新 /form/quantity
{ id: 'qty', component: 'Slider', label: '数量', min: 1, max: 10, value: { path: '/form/quantity' } }
```

**读取**：组件展示数据模型中的当前值。 **写入**：用户操作立即更新数据模型中对应路径的值。 **响应式**：所有绑定到同一路径的组件自动重新渲染。

> ⚠️ 数据同步到服务端只在用户主动触发（点击按钮）时发生，不会在每次按键时触发。

---

## 模板迭代（List 组件）

将 `children` 设为模板对象，即可遍历数据模型中的数组：

```json
{
  "id": "product_list",
  "component": "List",
  "children": {
    "path": "/products",
    "componentId": "product_card_template"
  }
}
```

`product_card_template` 组件会为 `/products` 中的每个元素实例化一次。模板内部路径**相对于各数组项**解析：

```json
{ "id": "product_card_template", "component": "Card", "child": "product_name" }
{ "id": "product_name", "component": "Text", "text": { "path": "name" } }
```

当数据模型为 `{ "products": [{ "name": "苹果" }, { "name": "香蕉" }] }` 时，`{ "path": "name" }` 分别解析为 `/products/0/name` 和 `/products/1/name`。

---

## 响应式更新

发送精准的 `updateDataModel` 命令，只更新变化的部分——无需重新发送组件结构：

```jsonl
// 逐条流式推入列表项
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/restaurants/0","value":{"name":"意大利美食","rating":4.5}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/restaurants/1","value":{"name":"东京拉面","rating":4.8}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/ui/loading","value":false}}
```

---

## 数据模型组织（最佳实践）

按领域组织状态：

```json
{
  "user": { "name": "Alice", "email": "alice@example.com" },
  "form": { "name": "", "date": null, "guests": 2 },
  "ui": { "loading": false, "step": 1 },
  "results": []
}
```

- 用 `ui.*` 管理 UI 状态（loading、步骤、可见性）
- 在 Agent 端预先计算展示值（如发送 `"¥19.99"` 而非原始数字 `19.99`）
- 发送精准更新，只更新变化的路径——避免每次都全量替换数据模型
