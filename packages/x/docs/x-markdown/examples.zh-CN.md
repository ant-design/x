---
title: 代码示例
order: 2
---

## 何时使用

用于渲染 LLM 返回的流式 Markdown 格式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx" description="markdown基础语法渲染。" title="基础用法"></code>
<code src="./demo/streaming/combined.tsx" description="未完成语法处理、动画效果" title="流式处理"></code>
<code src="./demo/codeDemo/supersets.tsx" description="使用插件渲染。" title="插件使用"></code>
<code src="./demo/codeDemo/components.tsx" description="自定义组件渲染标签。" title="自定义组件"></code>
<code src="./demo/codeDemo/plugin.tsx" title="自定义拓展插件"></code>
<code src="./demo/codeDemo/tokenizer.tsx" title="自定义标记"></code>
<code src="./demo/codeDemo/walkTokens.tsx" title="标记处理"></code>
<code src="./demo/codeDemo/renderer.tsx" title="渲染前处理"></code>
<code src="./demo/codeDemo/link.tsx" title="中文链接处理"></code>
<code src="./demo/codeDemo/xss.tsx"  title="XSS 防御"></code>
<code src="./demo/codeDemo/open-links-in-new-tab.tsx" description="链接在新标签页打开。" title="新标签页打开链接"></code>
<code src="./demo/codeDemo/md-footer.tsx"  title="流式渲染 Footer"></code>

## API

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 需要渲染的 Markdown 内容 | `string` | - |
| children | Markdown 内容，作为 `content` 属性的别名 | `string` | - |
| components | 用于替换 HTML 元素的自定义 React 组件 | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>`，查看[详情](/x-markdowns/components-cn) | - |
| footer | 用于在流式渲染过程中自定义渲染尾部内容的 React 组件 | `React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements` | - |
| paragraphTag | 段落元素的自定义 HTML 标签，防止自定义组件包含块级元素时的验证错误 | `keyof JSX.IntrinsicElements` | `'p'` |
| streaming | 流式渲染行为的配置 | `StreamingOption`，查看[语法处理](/x-markdowns/streaming-syntax)和[动画效果](/x-markdowns/streaming-animation) | - |
| config | Markdown 解析和扩展的 Marked.js 配置 | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| openLinksInNewTab | 是否为所有 a 标签添加 `target="_blank"` | `boolean` | `false` |
| dompurifyConfig | HTML 净化和 XSS 防护的 DOMPurify 配置 | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| className | 根容器的额外 CSS 类名 | `string` | - |
| rootClassName | `className` 的别名，根元素的额外 CSS 类 | `string` | - |
| style | 根容器的内联样式 | `CSSProperties` | - |

### StreamingOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 指示是否还有后续内容块，为 false 时刷新所有缓存并完成渲染 | `boolean` | `false` |
| enableAnimation | 为块级元素（`p`、`li`、`h1`、`h2`、`h3`、`h4`）启用文字淡入动画 | `boolean` | `false` |
| animationConfig | 文字出现动画效果的配置 | `AnimationConfig` | `{ fadeDuration: 200, opacity: 0.2 }` |
| incompleteMarkdownComponentMap | 未完成语法对应的自定义组件名。当流式输出出现未闭合的 Markdown 语法（如半截表格、未收尾代码块）时，可手动指定用于包裹该片段的组件名称，实现占位或加载态。 | `{ link?: string; image?: string; table?: string; html?: string }` | `{}` |

#### AnimationConfig

| 属性         | 说明                              | 类型     | 默认值 |
| ------------ | --------------------------------- | -------- | ------ |
| fadeDuration | 淡入动画的持续时间（毫秒）        | `number` | `200`  |
| opacity      | 动画期间字符的初始透明度值（0-1） | `number` | `0.2`  |

### ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | 来自 html-react-parser 的组件 DOM 节点，包含解析后的 DOM 节点信息 | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | 流式渲染支持两种状态：`loading` 表示内容正在加载中，`done` 表示加载已完成。当前仅支持 HTML 格式以及带围栏的代码块（fenced code）。由于缩进代码块（indented code）没有明确的结束符，因此始终返回 `done` 状态 | `'loading' \| 'done'` | - |
| rest | 组件属性，支持所有标准 HTML 属性（如 `href`、`title`、`className` 等）和自定义数据属性 | `Record<string, any>` | - |

## FAQ

### Components 与 Config Marked Extensions 的区别

#### Config Marked Extensions（插件扩展）

`config` 属性中的 [`extensions`](https://marked.js.org/using_pro#extensions) 用于扩展 Markdown 解析器的功能，它们在 **Markdown 转换为 HTML 的过程中** 起作用：

- **作用阶段**：Markdown 解析阶段
- **功能**：识别和转换特殊的 Markdown 语法
- **示例**：将 `[^1]` 脚注语法转换为 `<footnote>1</footnote>` HTML 标签
- **使用场景**：扩展 Markdown 语法，支持更多标记格式

```typescript
// 插件示例：脚注扩展
const footnoteExtension = {
  name: 'footnote',
  level: 'inline',
  start(src) { return src.match(/\[\^/)?.index; },
  tokenizer(src) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'footnote',
        raw: match[0],
        text: match[1]
      };
    }
  },
  renderer(token) {
    return `<footnote>${token.text}</footnote>`;
  }
};

// 使用插件
<XMarkdown
  content="这是一个脚注示例[^1]"
  config={{ extensions: [footnoteExtension] }}
/>
```

### Components（组件替换）

`components` 属性用于将已生成的 HTML 标签替换为自定义的 React 组件：

- **作用阶段**：HTML 渲染阶段
- **功能**：将 HTML 标签替换为 React 组件
- **示例**：将 `<footnote>1</footnote>` 替换为 `<CustomFootnote>1</CustomFootnote>`
- **使用场景**：自定义标签的渲染样式和交互行为

```typescript
// 自定义脚注组件
const CustomFootnote = ({ children, ...props }) => (
  <sup
    className="footnote-ref"
    onClick={() => console.log('点击脚注:', children)}
    style={{ color: 'blue', cursor: 'pointer' }}
  >
    {children}
  </sup>
);

// 使用组件替换
<XMarkdown
  content="<footnote>1</footnote>"
  components={{ footnote: CustomFootnote }}
/>
```

### 未完成语法标记转换

当 `hasNextChunk` 为 `true` 时，所有未完成的语法标记会被自动转换为 `incomplete-token` 形式，并将未完成的语法通过 `data-raw` 属性返回，支持的 token 类型为 `StreamCacheTokenType`。例如：

- 未完成的链接 `[示例](https://example.com` 会被转换为 `<incomplete-link data-raw="[示例](https://example.com">`
- 未完成的图片 `![产品图](https://cdn.example.com/images/produc` 会被转换为 `<incomplete-image data-raw="![产品图](https://cdn.example.com/images/produc">`
- 未完成的标题 `###` 会被转换为 `<incomplete-heading data-raw="###">`

#### StreamCacheTokenType 类型

`StreamCacheTokenType` 是一个枚举类型，定义了流式处理过程中支持的所有 Markdown 语法标记类型：

```typescript
type StreamCacheTokenType =
  | 'text' // 普通文本
  | 'link' // 链接语法 [text](url)
  | 'image' // 图片语法 ![alt](src)
  | 'heading' // 标题语法 # ## ###
  | 'emphasis' // 强调语法 *斜体* **粗体**
  | 'list' // 列表语法 - + *
  | 'table' // 表格语法 | 标题 | 内容 |
  | 'xml'; // XML/HTML 标签 <tag>
```
