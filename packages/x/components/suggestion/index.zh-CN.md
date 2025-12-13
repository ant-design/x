---
category: Components
group:
  title: 表达
  order: 2
title: Suggestion
subtitle: 快捷指令
description: 用于给予用户快捷提示的组件
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4vEeSJ2e9xgAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cahuSJ4VxvoAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 需要构建一个对话场景下的输入框

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/block.tsx">整行宽度</code>
<code src="./demo/trigger.tsx">自定义</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

更多配置请查看 [CascaderProps](https://ant.design/components/cascader-cn#api)

### SuggestionsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 是否整行宽度 | boolean | false | - |
| children | 自定义输入框 | ({ onTrigger, onKeyDown }) => ReactElement | - | - |
| items | 建议项列表 | SuggestionItem[] \| ((info: T) => SuggestionItem[]) | - | - |
| open | 受控打开面板 | boolean | - | - |
| rootClassName | 根元素样式类名 | string | - | - |
| onSelect | 选中建议项回调 | (value: string, selectedOptions: SuggestionItem[]) => void; | - | - |
| onOpenChange | 面板打开状态变化回调 | (open: boolean) => void | - | - |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位 | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |

#### onTrigger

```typescript | pure
type onTrigger<T> = (info: T | false) => void;
```

Suggestion 接受泛型以自定义传递给 `items` renderProps 的参数类型，当传递 `false` 时，则关闭建议面板。

### SuggestionItem

| 属性     | 说明           | 类型             | 默认值 | 版本 |
| -------- | -------------- | ---------------- | ------ | ---- |
| children | 子项目         | SuggestionItem[] | -      | -    |
| extra    | 建议项额外内容 | ReactNode        | -      | -    |
| icon     | 建议项图标     | ReactNode        | -      | -    |
| label    | 建议项显示内容 | ReactNode        | -      | -    |
| value    | 建议项值       | string           | -      | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Suggestion"></ComponentTokenTable>
