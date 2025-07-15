---
group:
  title: 插件集
  order: 2
title: Latex
subtitle: 公式
order: 3
---

## 何时使用

Markdown 中需要渲染公式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/supersets/Latex/basic.tsx">基本使用</code>
<code src="./demo/supersets/Latex/streaming.tsx">流式对话</code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| replaceAlignStart | 是否将公式中的 align* 替换为 aligned， [katex not support align*](https://github.com/KaTeX/KaTeX/issues/1007) | `boolean` | `true` |
| katexOptions | Katex 配置 | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'mathml' }` |
