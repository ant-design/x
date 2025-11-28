---
category: Components
group:
  title: 表达
  order: 2
title: CodeHighlighter
subtitle: 代码高亮
description: 用于高亮代码格式。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

CodeHighlighter 组件用于需要展示带有语法高亮的代码片段的场景。

- 需要显示带有语法高亮的代码片段时
- 想要为代码块提供复制功能时
- 需要在头部显示代码语言信息时

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/language.tsx">指定语言</code>
<code src="./demo/copyable.tsx">可复制</code>
<code src="./demo/custom-style.tsx">自定义样式</code>
<code src="./demo/with-line-numbers.tsx">显示行号</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)。

### CodeHighlighterProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，[见下](#semantic-dom) | Record<string, string> | - | - |
| code | 要高亮的代码内容 | string | - | - |
| copyable | 是否显示复制按钮 | boolean | true | - |
| disabled | 是否禁用 | boolean | false | - |
| language | 代码语言类型 | string | 'text' | - |
| lineNumbers | 是否显示行号 | boolean | false | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| styles | 自定义样式对象，[见下](#semantic-dom) | Record<string, React.CSSProperties> | - | - |
| theme | 代码高亮主题 | 'light' \| 'dark' | 'light' | - |

### CodeHighlighterRef

| 属性          | 说明         | 类型        | 版本 |
| ------------- | ------------ | ----------- | ---- |
| nativeElement | 获取原生节点 | HTMLElement | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="CodeHighlighter"></ComponentTokenTable>
