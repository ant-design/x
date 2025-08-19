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
<code src="./demo/preset.tsx">预设模板</code>
<code src="./demo/variant.tsx">使用变体</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ActionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 包含多个操作项的列表 | ([ItemType](#itemtype) \| ReactNode)[] | - | - |
| onClick | 组件被点击时的回调函数 | function({ item, key, keyPath, domEvent }) | - | - |
| dropdownProps | 下拉菜单的配置属性 | DropdownProps | - | - |
| variant | 变体 | `borderless` \| `outlined` \|`filled` | `borderless` | - |

### ItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 自定义操作的唯一标识 | string | - | - |
| label | 自定义操作的显示标签 | string | - | - |
| icon | 自定义操作的图标 | ReactNode | - | - |
| onItemClick | 点击自定义操作按钮时的回调函数 | (info: [ItemType](#itemtype)) => void | - | - |
| danger | 语法糖，设置危险icon | boolean | false | - |
| subItems | 子操作项 | Omit<ItemType, 'subItems' \| 'triggerSubMenuAction' \| 'actionRender'>[] | - | - |
| triggerSubMenuAction | 触发子菜单的操作 | `hover` \| `click` | `hover` | - |
| actionRender | 自定义渲染操作项内容 | (item: [ItemType](#itemtype)) => ReactNode | - | - |

### Actions.Feedback

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 反馈状态值 | `like` \| `dislike` \| `default` | `default` | - |
| onChange | 反馈状态变化回调 | (value: `like` \| `dislike` \| `default`) => void | - | - |

### Actions.Copy

| 属性 | 说明       | 类型            | 默认值 | 版本 |
| ---- | ---------- | --------------- | ------ | ---- |
| text | 复制的文本 | string          | ''     | -    |
| icon | 复制按钮   | React.ReactNode | -      | -    |

### Actions.Audio

| 属性   | 说明     | 类型                                     | 默认值  | 版本 |
| ------ | -------- | ---------------------------------------- | ------- | ---- |
| status | 播放状态 | 'loading'\|'error'\|'running'\|'default' | default | -    |

### Actions.Item

| 属性        | 说明                 | 类型                                     | 默认值  | 版本 |
| ----------- | -------------------- | ---------------------------------------- | ------- | ---- |
| status      | 状态                 | 'loading'\|'error'\|'running'\|'default' | default | -    |
| label       | 自定义操作的显示标签 | string                                   | -       | -    |
| defaultIcon | 默认状态图标         | React.ReactNode                          | -       | -    |
| runningIcon | 执行状态图标         | React.ReactNode                          | -       | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>
