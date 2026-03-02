---
title: 代码示例
order: 2
tag: 2.0.0
category: Components
componentName: XMarkdown
packageName: x-markdown
---

## 何时使用

用于快速接入 LLM 的 Markdown 输出渲染。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" title="基础渲染" description="最小可用示例"></code>
<code src="./demo/streaming/combined.tsx" title="流式渲染" description="语法修复 + 动画"></code>
<code src="./demo/components/codeHighlighter.tsx" title="组件扩展" description="将 code 块映射为 CodeHighlighter"></code>
<code src="./demo/codeDemo/supersets.tsx" title="插件扩展" description="扩展 Markdown 语法"></code>
<code src="./demo/codeDemo/escape-raw-html.tsx" title="安全与链接" description="原始 HTML 转义与新标签链接；HTML 净化配置见 Streaming 的 format 示例"></code>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 需要渲染的 Markdown 内容 | `string` | - |
| children | Markdown 内容（与 `content` 二选一） | `string` | - |
| components | 将 HTML 节点映射为自定义 React 组件 | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>` | - |
| streaming | 流式渲染行为配置 | `StreamingOption` | - |
| config | Marked 解析配置，后应用且可能覆盖内置 renderer | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| rootClassName | 根元素的额外 CSS 类名 | `string` | - |
| className | 根容器的额外 CSS 类名 | `string` | - |
| paragraphTag | 段落使用的 HTML 标签（避免自定义组件含块级元素时的校验问题） | `keyof JSX.IntrinsicElements` | `'p'` |
| style | 根容器的内联样式 | `CSSProperties` | - |
| prefixCls | 组件节点 CSS 类名前缀 | `string` | - |
| openLinksInNewTab | 是否为所有链接添加 `target="_blank"` 并在新标签页打开 | `boolean` | `false` |
| dompurifyConfig | HTML 净化与 XSS 防护的 DOMPurify 配置 | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| protectCustomTagNewlines | 是否保留自定义标签内部的换行 | `boolean` | `false` |
| escapeRawHtml | 是否将 Markdown 中的原始 HTML 转义为纯文本展示（不解析为真实 HTML），用于防 XSS 同时保留内容 | `boolean` | `false` |
| debug | 是否开启调试模式（显示性能监控浮层） | `boolean` | `false` |

### StreamingOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续内容块。为 `false` 时会刷新缓存并完成渲染 | `boolean` | `false` |
| enableAnimation | 是否为块级元素启用文字淡入动画 | `boolean` | `false` |
| animationConfig | 动画配置（如淡入时长、缓动函数） | `AnimationConfig` | - |
| incompleteMarkdownComponentMap | 将未闭合 Markdown 片段映射到自定义 loading 组件 | `Partial<Record<'link' \| 'image' \| 'html' \| 'emphasis' \| 'list' \| 'table' \| 'inline-code', string>>` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |
