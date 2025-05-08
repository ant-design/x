---
category: Components
group:
  title: 通用
  order: 0
title: Actions
subtitle: 操作栏
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

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Actions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ActionItemType[] | - | - |
| rootClassName | 根节点样式类 | string | - | - |
| onClick | Item 操作项被点击时的回调函数 | `function({ item, key, keyPath, selectedKeys, domEvent })` | - | - |
| style | 根节点样式 | React.CSSProperties | - | - |
| variant | 变体 | `'borderless' \| 'border'` | 'borderless' | - |
| prefixCls | 样式类名的前缀 | string | - | - |

### ItemType

| 属性                 | 说明                           | 类型             | 默认值 | 版本 |
| -------------------- | ------------------------------ | ---------------- | ------ | ---- |
| key                  | 自定义操作的唯一标识           | string           | -      | -    |
| label                | 自定义操作的显示标签           | string           | -      | -    |
| icon                 | 自定义操作的图标               | ReactNode        | -      | -    |
| children             | 子操作项                       | ActionItemType[] | -      | -    |
| triggerSubMenuAction | 触发子菜单的操作               | `hover \| click` | -      | -    |
| onClick              | 点击自定义操作按钮时的回调函数 | () => void       | -      | -    |

### SubItemType

| 属性    | 说明                           | 类型       | 默认值 | 版本 |
| ------- | ------------------------------ | ---------- | ------ | ---- |
| label   | 自定义操作的显示标签           | string     | -      | -    |
| key     | 自定义操作的唯一标识           | string     | -      | -    |
| icon    | 自定义操作的图标               | ReactNode  | -      | -    |
| onClick | 点击自定义操作按钮时的回调函数 | () => void | -      | -    |
| danger  | 语法糖，设置危险icon           | boolean    | false  | -    |

### ActionItemType

> type `ActionItemType` = `ItemType` | `SubItemType`
