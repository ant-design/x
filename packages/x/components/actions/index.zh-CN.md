---
category: Components
group:
  title: 反馈
  order: 4
title: Actions
subtitle: 操作列表
description: 用于快速配置一些 AI 场景下所需要的操作按钮/功能。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*1ysXSqEnAckAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*EkYUTotf-eYAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

Actions 组件用于快速配置一些 AI 场景下所需要的操作按钮/功能

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/sub.tsx">更多菜单项</code>
<code src="./demo/variant.tsx">使用变体</code>
<code src="./demo/preset.tsx">预设模板</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Actions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ([ActionItem](#actionitem) \| ReactNode)[] | - | - |
| onClick | 组件被点击时的回调函数 | function({ item, key, keyPath, domEvent }) | - | - |
| popupRender | 底部额外的React节点内容 | ReactNode | - | - |
| dropdownProps | 下拉菜单的配置属性 | DropdownProps | - | - |
| variant | 变体 | `borderless` \| `border` | `borderless` | - |

### ActionItem

```typescript
type ActionItem = ItemType | SubItemType;
```

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | ReactNode | - | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: [ActionItem](#actionitem)) => void | - | - |
| subItems | 子操作项 | [ActionItem](#actionitem)[] | - | - |
| triggerSubMenuAction | 触发子菜单的操作 | `hover` \| `click` | `hover` | - |

### SubItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | ReactNode | - | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: [ActionItem](#actionitem)) => void | - | - |
| danger | 语法糖，设置危险icon | boolean | false | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>
