---
category: Components
group:
  title: 唤醒
  order: 1
title: Choice
order: 10
subtitle: 选择交互
description: 用于在 AI 对话场景中呈现一组结构化选项供用户选择。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

Choice 组件用于在 AI 对话场景中呈现一组结构化选项供用户选择。与 antd 的 `Select`、`Radio`、`Checkbox` 不同，Choice 专为 AI 对话上下文设计，支持推荐标记、禁用原因、多种布局模式、加载态等 AI 场景特有需求。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本单选</code>
<code src="./demo/multiple.tsx">多选模式</code>
<code src="./demo/card-layout.tsx">卡片布局</code>
<code src="./demo/grid-layout.tsx">网格布局</code>
<code src="./demo/recommended.tsx">推荐标记</code>
<code src="./demo/disabled.tsx">禁用与禁用原因</code>
<code src="./demo/indicator.tsx">指示器类型</code>
<code src="./demo/confirmable.tsx">确认按钮</code>
<code src="./demo/loading.tsx">加载态</code>
<code src="./demo/in-bubble.tsx">在对话气泡中使用</code>
<code src="./demo/controlled.tsx">受控模式</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ChoiceProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 选项列表 | ChoiceItemType[] | - | - |
| mode | 选择模式 | 'single' \| 'multiple' | 'single' | - |
| layout | 布局模式 | 'list' \| 'grid' \| 'card' | 'list' | - |
| value | 当前选中值（受控） | ChoiceValueType \| ChoiceValueType[] | - | - |
| defaultValue | 默认选中值 | ChoiceValueType \| ChoiceValueType[] | - | - |
| onChange | 选中变化回调 | (value, info: ChangeInfo) => void | - | - |
| onItemClick | 选项点击回调 | (info: { data: ChoiceItemType, index: number }) => void | - | - |
| onConfirm | 确认回调 | (value, info: ChangeInfo) => void | - | - |
| title | 标题 | React.ReactNode | - | - |
| description | 描述文本 | React.ReactNode | - | - |
| footer | 底部操作区 | React.ReactNode | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否显示加载态 | boolean | false | - |
| maxCount | 多选模式下最大可选数量 | number | - | - |
| indicator | 选择指示器类型 | 'check' \| 'radio' \| 'number' \| 'none' | 'radio'(single) / 'check'(multiple) | - |
| confirmable | 是否显示确认按钮 | boolean | false | - |
| confirmText | 确认按钮文案 | React.ReactNode | - | - |
| fadeIn | 渐入效果 | boolean | - | - |
| fadeInLeft | 从左到右渐入效果 | boolean | - | - |
| classNames | 语义化结构类名 | Record<SemanticType, string> | - | - |
| styles | 语义化结构样式 | Record<SemanticType, React.CSSProperties> | - | - |
| prefixCls | 样式类名前缀 | string | - | - |
| rootClassName | 根节点样式类名 | string | - | - |

### ChoiceItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识，同时作为选中值 | string \| number | - | - |
| label | 选项标签 | React.ReactNode | - | - |
| description | 选项描述 | React.ReactNode | - | - |
| icon | 选项图标 | React.ReactNode | - | - |
| disabled | 是否禁用 | boolean | false | - |
| disabledReason | 禁用原因提示 | React.ReactNode | - | - |
| recommended | AI 推荐标记 | boolean \| 'primary' \| 'secondary' | - | - |
| recommendedReason | 推荐原因 | React.ReactNode | - | - |
| extra | 额外信息 | React.ReactNode | - | - |
| meta | 附加元数据 | Record<string, any> | - | - |
| children | 嵌套子选项 | ChoiceItemType[] | - | - |

### ChangeInfo

| 属性         | 说明               | 类型                                 | 版本 |
| ------------ | ------------------ | ------------------------------------ | ---- |
| value        | 变更后的值         | ChoiceValueType \| ChoiceValueType[] | -    |
| items        | 当前所有选项       | ChoiceItemType[]                     | -    |
| changedItems | 本次变更涉及的选项 | ChoiceItemType[]                     | -    |
| type         | 变更类型           | 'select' \| 'deselect'               | -    |

### ChoiceRef

| 属性          | 说明           | 类型                                                    | 版本 |
| ------------- | -------------- | ------------------------------------------------------- | ---- |
| nativeElement | 原生 DOM 元素  | HTMLDivElement                                          | -    |
| scrollTo      | 滚动到指定选项 | (key: ChoiceValueType) => void                          | -    |
| getValue      | 获取当前选中值 | () => ChoiceValueType \| ChoiceValueType[] \| undefined | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Choice"></ComponentTokenTable>
