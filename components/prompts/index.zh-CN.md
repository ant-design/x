---
category: Components
group: 数据展示
title: Prompts
subtitle: 提示集
description: 用于显示一组与当前上下文相关的预定义的问题或建议。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*1ysXSqEnAckAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*EkYUTotf-eYAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

Prompts 组件用于显示一组与当前上下文相关的预定义的问题或建议。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/disabled.tsx">不可用状态</code>
<code src="./demo/flex-vertical.tsx">纵向展示</code>
<code src="./demo/flex-wrap.tsx">可换行</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### PromptsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，用于各个提示项的不同部分。 | Record<'list' \| 'item' \| 'content' \| 'title', string> | - | - |
| items | 包含多个提示项的列表。 | PromptProps[] | - | - |
| prefixCls | 样式类名的前缀。 | string | - | - |
| rootClassName | 根节点的样式类名。 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分。 | Record<'list' \| 'item' \| 'content' \| 'title', React.CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题。 | React.ReactNode | - | - |
| vertical | 设置为 `true` 时, 提示列表将垂直排列。 | boolean | `false` | - |
| wrap | 设置为 `true` 时, 提示列表将自动换行。 | boolean | `false` | - |
| onItemClick | 提示项被点击时的回调函数。 | (info: { data: PromptProps }) => void | - | - |

### PromptProps

| 属性        | 说明                           | 类型            | 默认值  | 版本 |
| ----------- | ------------------------------ | --------------- | ------- | ---- |
| description | 提示描述提供额外的信息。       | React.ReactNode | -       | -    |
| disabled    | 设置为 `true` 时禁用点击事件。 | boolean         | `false` | -    |
| icon        | 提示图标显示在提示项的左侧。   | React.ReactNode | -       | -    |
| key         | 唯一标识用于区分每个提示项。   | string          | -       | -    |
| label       | 提示标签显示提示的主要内容。   | React.ReactNode | -       | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
