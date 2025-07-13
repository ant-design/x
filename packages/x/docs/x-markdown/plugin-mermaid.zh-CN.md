---
group:
  title: 插件集
  order: 2
title: Mermaid
subtitle: 图表
order: 3
---

## 何时使用

Markdown 中需要渲染 Mermaid。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/supersets/Mermaid/basic.tsx">基本使用</code>
<code src="./demo/supersets/Mermaid/streaming.tsx">流式对话</code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 代码内容 | `string` | - |
| header | 顶部 | `React.ReactNode \| null` | React.ReactNode |
| className | 样式类名 | `string` | |
| classNames | 样式类名 | `string` | - |
| highlightProps | 代码高亮配置 | [`highlightProps`](https://github.com/react-syntax-highlighter/react-syntax-highlighter?tab=readme-ov-file#props) | - |

## Semantic DOM

<code src="./demo/supersets/Mermaid/_semantic.tsx" simplify="true"></code>
