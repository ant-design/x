---
title: 代码示例
order: 2
---

## 何时使用

用于渲染 LLM 返回的流式 Markdown 格式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="markdown基础语法渲染。" title="基础用法"></code>
<code src="./demo/codeDemo/streaming.tsx" description="配合 `Bubble` 实现流式对话。" title="流式渲染"></code>
<code src="./demo/codeDemo/components.tsx" description="自定义组件渲染标签。" title="自定义组件"></code>
<code src="./demo/codeDemo/supersets.tsx" description="使用插件渲染。" title="插件使用"></code>
<code src="./demo/codeDemo/plugin.tsx" title="自定义拓展插件"></code>
<code src="./demo/codeDemo/xss.tsx"  title="XSS 防御"></code>
<code src="./demo/codeDemo/open-links-in-new-tab.tsx" description="链接在新标签页打开。" title="新标签页打开链接"></code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | markdown 内容 | `string` | - |
| children | markdown 内容，与 content 作用一样 | `string` | - |
| components | 自定义组件 | `Record<string, React.FC<ComponentProps>>`，查看[详情](/markdowns/components-cn) | - |
| paragraphTag | 自定义段落渲染的标签。避免自定义组件导致 p 标签包裹 div 报错。 | `string` | `p` |
| streaming | 流式渲染配置 | `SteamingOption`，查看[详情](/markdowns/streaming-cn) | - |
| config | Marked.js extension | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| openLinksInNewTab | 是否在新标签页打开链接 | `boolean` | `false` |
| className | 自定义 className | `string` | - |
| rootClassName | 根节点自定义 className, 与 className 作用一致 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### SteamingOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有下一个 chunk，如果为 false，清除所有缓存并渲染 | `boolean` | `false` |
| enableAnimation | 是否开启文字动画，支持 `p, li, h1, h2, h3, h4` | `boolean` | `false` |
| animationConfig | 文字动画配置 | [`ControllerUpdate`](https://react-spring.dev/docs/typescript#controllerupdate) | `{ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 170, friction: 26 } }` |

### ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | Component Element | [`DomNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| children | 包裹在 component 的内容 | `string` | - |
| **rest** | 组件上的属性，支持标准 HTML 属性（如 `a`(link) href、title）及自定义属性 | `Record<string,unknown>` | - |
