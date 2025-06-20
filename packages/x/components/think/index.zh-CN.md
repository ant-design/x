---
category: Think
group:
  title: 反馈
  order: 2
title: Think
subtitle: 思考过程
description: 展示大模型深度思考过程。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 用于在对话时展示大模型的深度思考过程。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/status.tsx">设置状态</code>
<code src="./demo/expand.tsx">是否展开</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ThinkProps

| 属性            | 说明             | 类型                      | 默认值          | 版本  |
| --------------- | ---------------- | ------------------------- | --------------- | ----- | --- |
| className       | 样式类名         | string                    | -               | -     |
| style           | 语义化结构 style | CSSProperties             | -               | -     |
| children        | 内容             | React.ReactNode           | -               | -     |
| statusText      | 状态文本         | React.ReactNode           | -               | -     |
| statusIcon      | 状态图标         | React.ReactNode           | -               | -     |
| loading         | 加载中           | boolean                   | React.ReactNode | false | -   |
| defaultExpanded | 默认是否展开     | boolean                   | true            | -     |
| expanded        | 是否展开         | boolean                   | -               | -     |
| onExpand        | 展开事件         | (expand: boolean) => void | -               | -     |

## Semantic DOM

## 主题变量（Design Token）
