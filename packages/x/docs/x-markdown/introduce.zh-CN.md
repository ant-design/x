---
order: 1
title: 介绍
---

## 何时使用

用于渲染 LLM 返回的流式 Markdown 格式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本使用</code>
<code src="./demo/streaming.tsx">流式对话</code>
<code src="./demo/components.tsx">自定义组件</code>
<code src="./demo/supersets.tsx">拓展插件</code>
<code src="./demo/plugin.tsx">自定义拓展插件</code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | markdown 内容 | `string` | - | - |
| children | markdown 内容，与 content 作用一样 | `string` | - | - |
| config | 渲染配置 | `Config` | `{ gfm: true }` | - |
| allowHtml | 是否支持html | `boolean` | `false` | - |
| components | 自定义组件 | `Record<string, React.ReactNode>` | - | - |
| streaming | 流式渲染配置 | `SteamingOption` | - | - |
| plugins | Marked.js extension plugins | `MarkedExtension[]` | - | - |
| className | 自定义 className | `string` | - | - |
| style | 自定义样式 | `CSSProperties` | - | - |

### Config

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| break | 是否支持在单个换行符处添加 `<br>`（需要 gfm 为 true） | `boolean` | - |  |
| gfm | 是否支持[GitHub Flavored Markdown Spec](https://github.github.com/gfm/) | `boolean` | `true` |  |

### SteamingOption

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| hasNextChunk | 是否还有下一个 chunk，如果为 false，清除所有缓存并渲染 | `boolean` | `false` |  |

### RendererObject

Type: `{ [key: string]: (...args: unknown[]) => React.ReactNode | false }`

Custom renderer functions for markdown elements. Keys should match markdown token types (e.g. 'heading', 'paragraph').
