---
category: Components
group:
  title: 反馈
  order: 4
title: Mermaid
subtitle: 图表工具
description: 用于渲染图表工具 Mermaid。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

- 用于在应用中渲染支持缩放、平移、图像/代码双视图切换的交互式 Mermaid 图表。
- 与 XMarkdown 结合使用，可在 Markdown 内容中渲染 Mermaid，并增强交互功能。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/custom-header.tsx">自定义 Header</code>
<code src="./demo/with-xmarkdown.tsx">配合 XMarkdown</code>

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

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Mermaid"></ComponentTokenTable>
