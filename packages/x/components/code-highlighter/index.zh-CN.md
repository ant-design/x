---
category: Components
group:
  title: 反馈
  order: 4
title: CodeHighlighter
subtitle: 代码高亮
description: 用于高亮代码格式。
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/_KKkTrXq7wcAAAAAKuAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/c62-S4SH1tUAAAAANuAAAAgADtFMAQFr/original
tag: 2.1.0
---

## 何时使用

CodeHighlighter 组件用于需要展示带有语法高亮的代码片段的场景。

- 用于展示带语法高亮的代码片段，并提供复制功能及头部语言信息。
- 与 XMarkdown 结合使用，可在 Markdown 内容中渲染代码块，并增强高亮显示和交互功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/custom-header.tsx">自定义 Header</code>
<code src="./demo/with-xmarkdown.tsx">配合 XMarkdown</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)。

### CodeHighlighterProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| lang | 代码语言类型 | `string` | - |
| children | 代码内容 | `string` | - |
| header | 头部内容，为 `false` 时不显示头部 | `React.ReactNode \| (() => React.ReactNode \| false) \| false` | - |
| highlightProps | 代码高亮配置，透传给 react-syntax-highlighter | [`SyntaxHighlighterProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |
| prismLightMode | 是否使用 Prism 轻量模式，根据 `lang` 自动按需加载语言支持以减少打包体积 | `boolean` | `true` |

### CodeHighlighterRef

| 属性          | 说明              | 类型          | 版本 |
| ------------- | ----------------- | ------------- | ---- |
| nativeElement | 获取原生 DOM 节点 | `HTMLElement` | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="CodeHighlighter"></ComponentTokenTable>
