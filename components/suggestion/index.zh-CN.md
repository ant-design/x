---
category: Components
group: 数据展示
title: Suggestion
subtitle: 提示
description: 用于给予用户快捷提示的组件
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*SMzgSJZE_AwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8yArQ43EGccAAAAAAAAAAAAADrJ8AQ/original
---

## 何时使用

- 需要构建一个对话场景下的输入框

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/block.tsx">整行宽度</code>

<!-- <code src="./demo/withSender.tsx">配合发送组件</code>
<code src="./demo/trigger.tsx">修改触发字符</code> -->

## API

通用属性参考：[通用属性](/docs/react/common-props)

### SuggestionsProps

| 属性             | 说明               | 类型                      | 默认值    | 版本 |
| ---------------- | ------------------ | ------------------------- | --------- | ---- |
| prefixCls        | 自定义样式前缀     | string                    | -         | -    |
| items            | 建议项列表         | Suggestion[]              | -         | -    |
| triggerCharacter | 触发建议显示的字符 | string                    | '/'       | -    |
| children         | 自定义输入框       | ReactNode                 | -         | -    |
| title            | 弹出层标题         | ReactNode                 | -         | -    |
| extra            | 额外内容           | ReactNode                 | -         | -    |
| onChange         | 输入框值改变的回调 | (value: string) => void   | -         | -    |
| value            | 输入框值           | string                    | -         | -    |
| className        | 组件样式类名       | string                    | -         | -    |
| rootClassName    | 根元素样式类名     | string                    | -         | -    |
| style            | 组件样式           | React.CSSProperties       | -         | -    |
| placeholder      | 输入框占位符       | string                    | -         | -    |
| placement        | 弹出层位置         | TooltipProps['placement'] | 'topLeft' | -    |

### Suggestion

| 属性      | 说明           | 类型       | 默认值 | 版本 |
| --------- | -------------- | ---------- | ------ | ---- |
| id        | 建议项唯一标识 | string     | -      | -    |
| label     | 建议项显示内容 | ReactNode  | -      | -    |
| icon      | 建议项图标     | ReactNode  | -      | -    |
| className | 建议项样式类名 | string     | -      | -    |
| onClick   | 建议项点击回调 | () => void | -      | -    |
| value     | 建议项值       | string     | -      | -    |
| extra     | 建议项额外内容 | ReactNode  | -      | -    |

## 主题变量（Design Token）

<ComponentTokenTable component="Suggestions"></ComponentTokenTable>
