# Data Binding Reference

This file covers how component props connect to the surface data model. Read this when binding component values to live data or building template lists.

---

## Core Concept

Every surface has an independent JSON data model. Component props can read from it via `{ path: "/json/pointer" }` syntax. When the data model updates, bound components re-render automatically.

---

## JSON Pointer Syntax (RFC 6901)

| Path                  | Accesses                        |
| --------------------- | ------------------------------- |
| `/user/name`          | `dataModel.user.name`           |
| `/cart/items/0`       | `dataModel.cart.items[0]`       |
| `/cart/items/0/price` | `dataModel.cart.items[0].price` |

**Absolute paths** start with `/` — always resolve from model root. **Relative paths** (no leading `/`) — resolve relative to collection scope inside a template.

---

## Literal vs Bound Values

```typescript
// Literal — static, does not react to data changes
{ id: 'title', component: 'Text', text: 'Hello World' }

// Data-bound — reads from /user/name, re-renders on change
{ id: 'title', component: 'Text', text: { path: '/user/name' } }
```

Any prop can be a literal or a `{ path }` object. This includes strings, numbers, booleans, and string lists.

---

## Dynamic Types

| Type                | Literal form | Bound form                 |
| ------------------- | ------------ | -------------------------- |
| `DynamicString`     | `"text"`     | `{ "path": "/data/str" }`  |
| `DynamicNumber`     | `42`         | `{ "path": "/data/num" }`  |
| `DynamicBoolean`    | `true`       | `{ "path": "/data/flag" }` |
| `DynamicStringList` | `["a","b"]`  | `{ "path": "/data/list" }` |

---

## Two-Way Binding (Input Components)

Input components bind their `value` prop for both read and write:

```typescript
// TextField — displays /form/email, updates it on user input
{ id: 'email', component: 'TextField', label: 'Email', value: { path: '/form/email' } }

// CheckBox — toggles /form/subscribe
{ id: 'subscribe', component: 'CheckBox', label: 'Subscribe', value: { path: '/form/subscribe' } }

// ChoicePicker — updates /form/plan
{ id: 'plan', component: 'ChoicePicker', label: 'Plan', options: ['free','pro'], value: { path: '/form/plan' } }

// Slider — updates /form/quantity
{ id: 'qty', component: 'Slider', label: 'Quantity', min: 1, max: 10, value: { path: '/form/quantity' } }
```

**Read**: component displays the current value from the data model. **Write**: user interaction immediately updates the data model at that path. **Reactivity**: all other components bound to the same path re-render.

> ⚠️ Server sync happens only on explicit action (button click), not on every keystroke.

---

## Template Iteration (List Components)

Use `children` as a template object to iterate over an array in the data model:

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

The `product_card_template` component is instantiated once per item in `/products`. Inside the template, paths are **relative to each array item**:

```json
{ "id": "product_card_template", "component": "Card", "child": "product_name" }
{ "id": "product_name", "component": "Text", "text": { "path": "name" } }
```

With data model `{ "products": [{ "name": "Apple" }, { "name": "Banana" }] }`, `{ "path": "name" }` resolves to `/products/0/name` and `/products/1/name` for each instance.

---

## Reactive Updates

Send targeted `updateDataModel` commands to update only what changed — no need to resend component structure:

```jsonl
// Stream in list items one by one
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/restaurants/0","value":{"name":"Bella Italia","rating":4.5}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/restaurants/1","value":{"name":"Tokyo Ramen","rating":4.8}}}
{"version":"v0.9","updateDataModel":{"surfaceId":"s1","path":"/ui/loading","value":false}}
```

---

## Data Model Organization (Best Practice)

Organize state by domain:

```json
{
  "user": { "name": "Alice", "email": "alice@example.com" },
  "form": { "name": "", "date": null, "guests": 2 },
  "ui": { "loading": false, "step": 1 },
  "results": []
}
```

- Use `ui.*` for UI state (loading, step, visibility)
- Pre-compute display values on the agent side (e.g., send `"$19.99"` rather than raw `19.99`)
- Send granular updates targeting only changed paths — not full model replacements on each change
