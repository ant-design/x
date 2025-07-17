---
title: 代码示例
order: 2
---

## 何时使用

用于渲染 LLM 返回的流式 Markdown 格式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx">基础用法</code>
<code src="./demo/codeDemo/streaming.tsx">流式渲染</code>
<code src="./demo/codeDemo/components.tsx">标签组件渲染</code>
<code src="./demo/codeDemo/supersets.tsx">拓展插件</code>
<code src="./demo/codeDemo/plugin.tsx">自定义拓展插件</code>
<code src="./demo/codeDemo/xss.tsx">XSS 防御</code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | markdown 内容 | `string` | - |
| children | markdown 内容，与 content 作用一样 | `string` | - |
| components | 自定义组件 | `Record<string, React.FC<Props>>`，查看[详情](/markdowns/components-cn) | - |
| streaming | 流式渲染配置 | `SteamingOption` | - |
| config | Marked.js extension | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| className | 自定义 className | `string` | - |
| rootClassName | 根节点自定义 className, 与 className 作用一致 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### SteamingOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有下一个 chunk，如果为 false，清除所有缓存并渲染 | `boolean` | `false` |
| enableAnimation | 是否开启文字动画，支持 `p, li, h1, h2, h3, h4` | `boolean` | `false` |
| animationConfig | 文字动画配置 | [`ControllerUpdate`](https://react-spring.dev/docs/typescript#controllerupdate) | `{ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 170, friction: 26 } }` |
