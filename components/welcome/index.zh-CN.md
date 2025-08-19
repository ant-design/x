---
category: Components
group:
  title: 唤醒
  order: 1
title: Welcome
subtitle: 欢迎
order: 0
description: 清晰传达给用户可实现的意图范围和预期功能。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*sSjhQ6q2-Z0AAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-gLqQpan1NAAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

使用合适的欢迎推荐组件，可以有效降低用户学习成本，让用户快速了解并顺利开始。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/variant.tsx">变体</code>
<code src="./demo/background.tsx">背景定制</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### WelcomeProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | 样式类名的前缀 | string | - | - |
| classNames | 自定义样式类名，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', string> | - | - |
| description | 显示在提示列表中的描述。 | React.ReactNode | - | - |
| extra | 显示在提示列表末尾的额外操作。 | React.ReactNode | - | - |
| icon | 显示在提示列表前侧的图标。 | React.ReactNode | - | - |
| rootClassName | 根节点的样式类名。 | string | - | - |
| styles | 自定义样式，用于各个提示项的不同部分。 | Record<'icon' \| 'title' \| 'description' \| 'extra', React.CSSProperties> | - | - |
| title | 显示在提示列表顶部的标题。 | React.ReactNode | - | - |
| variant | 变体类型。 | 'filled' \| 'borderless' | 'filled' | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Welcome"></ComponentTokenTable>
