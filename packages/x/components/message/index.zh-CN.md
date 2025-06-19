---
category: Components
group:
  title: 表达
  order: 2
title: Message
subtitle: 消息
description: 展示各种消息类型。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 用于在对话时展示消息。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/sup.tsx">使用角标</code>
<code src="./demo/think.tsx">思考过程</code>
<code src="./demo/source.tsx">来源引用</code>
<code src="./demo/system.tsx">系统消息</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### MessageProps

| 属性       | 说明             | 类型                                         | 默认值 | 版本 |
| ---------- | ---------------- | -------------------------------------------- | ------ | ---- |
| classNames | 样式类名         | string                                       | -      | -    |
| style      | 语义化结构 style | CSSProperties                                | -      | -    |
| type       | 类型             | markdown \| sup \| think \| source \| system | -      | -    |
| content    | 内容             | React.ReactNode                              | -      | -    |

### MessageProps[type=sup]

更多api参考：[PopoverProps](https://ant-design.antgroup.com/components/popover-cn#api)

| 属性           | 说明     | 类型            | 默认值 | 版本 |
| -------------- | -------- | --------------- | ------ | ---- |
| popoverTitle   | 气泡标题 | React.ReactNode | -      | -    |
| popoverContent | 气泡内容 | React.ReactNode | -      | -    |

### MessageProps[type=think]

| 属性  | 说明     | 类型            | 默认值 | 版本 |
| ----- | -------- | --------------- | ------ | ---- |
| title | 标题     | React.ReactNode | -      | -    |
| logo  | 标题图标 | React.ReactNode | -      | -    |

### MessageProps[type=source]

| 属性  | 说明     | 类型                                               | 默认值 | 版本 |
| ----- | -------- | -------------------------------------------------- | ------ | ---- |
| items | 引用地址 | Array<{label: string; src: string; key?: string;}> | -      | -    |

### MessageProps[type=system]

| 属性    | 说明       | 类型              | 默认值 | 版本 |
| ------- | ---------- | ----------------- | ------ | ---- |
| divider | 分割线类型 | boolean \| string | true   | -    |

## Semantic DOM

## 主题变量（Design Token）
