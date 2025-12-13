---
group:
  title: 流式处理
  order: 4
title: 语法处理
order: 1
---

语法处理机制专为流式渲染场景设计，能够智能识别不完整的 Markdown 语法结构，通过灵活的自定义组件映射，提供流畅的用户体验。

## 代码演示

<code src="./demo/streaming/format.tsx" description="流式语法处理效果演示">流式语法处理</code>

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| **hasNextChunk** | 是否还有后续数据 | `boolean` | `false` |
| **enableAnimation** | 启用文本淡入动画 | `boolean` | `false` |
| **animationConfig** | 文本动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| **incompleteMarkdownComponentMap** | 未完成语法对应的自定义组件名。当流式输出出现未闭合的 Markdown 语法（如半截表格、未收尾代码块）时，可手动指定用于包裹该片段的组件名称，实现占位或加载态。 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |

### 未完成语法标记转换

当 `hasNextChunk` 为 `true` 时，所有未完成的语法标记会被自动转换为 `incomplete-token` 形式，并将未完成的语法通过 `data-raw` 属性返回，支持的 token 类型为 `StreamCacheTokenType`。例如：

- 未完成的链接 `[示例](https://example.com` 会被转换为 `<incomplete-link data-raw="[示例](https://example.com">`
- 未完成的图片 `![产品图](https://cdn.example.com/images/produc` 会被转换为 `<incomplete-image data-raw="![产品图](https://cdn.example.com/images/produc">`
- 未完成的标题 `###` 会被转换为 `<incomplete-heading data-raw="###">`

### StreamCacheTokenType 类型

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

### 支持的语法类型

流式语法处理支持以下 Markdown 语法的完整性检查：

| 语法类型 | 格式示例 | 处理机制 | 未完成状态示例 | 对应 TokenType |
| --- | --- | --- | --- | --- |
| **链接** | `[text](url)` | 检测未闭合的链接标记 | `[示例网站](https://example` | `link` |
| **图片** | `![alt](src)` | 检测未闭合的图片标记 | `![产品图](https://cdn.example.com/images/produc` | `image` |
| **标题** | `# ## ###` 等 | 支持1-6级标题的渐进式渲染 | `###` | `heading` |
| **强调** | `*斜体*` `**粗体**` | 处理 `*` 和 `_` 的强调语法 | `**未完成的粗体文本` | `emphasis` |
| **列表** | `- + *` 列表标记 | 检测列表标记后的空格 | `-` | `list` |
| **表格** | [`表格格式`](https://github.github.com/gfm/#tables-extension-) | 检测未闭合的表格行和单元格 | `\| 标题1 \| 标题2 \|` | `table` |
| **XML标签** | `<tag>` | 处理HTML/XML标签的闭合状态 | `<div class="` | `xml` |

### 自定义未完成语法组件

你可以决定如何渲染未完成的语法结构，通过 `incompleteMarkdownComponentMap` 配置自定义组件：

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const ImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />;

const IncompleteLink = (props: ComponentProps) => {
  const text = String(props['data-raw'] || '');

  // 提取链接文本，格式为 [text](url)
  const linkTextMatch = text.match(/^\[([^\]]*)\]/);
  const displayText = linkTextMatch ? linkTextMatch[1] : text.slice(1);

  return (
    <a style={{ pointerEvents: 'none' }} href="#">
      {displayText}
    </a>
  );
};

const App = () => {
  return (
    <XMarkdown
      content="访问[Ant Design](https://ant.design)查看文档，这里有`代码示例`和|表格数据|"
      streaming={{
        hasNextChunk,
        incompleteMarkdownComponentMap: {
          link: 'link-loading',
        },
      }}
      components={{
        'link-loading': ImageSkeleton,
        'incomplete-link': IncompleteLink,
      }}
    />
  );
};
```

## FAQ

### 为什么需要它？

在流式传输过程中，Markdown语法可能处于不完整状态：

```markdown
// 不完整的链接语法： [示例网站](https://example // 不完整的图片语法： ![产品图](https://cdn.example.com/images/produc
```

不完整的语法结构可能导致：

- 链接无法正确跳转
- 图片加载失败
- 格式标记直接显示在内容中

### hasNextChunk 为什么不能始终为 `true`

`hasNextChunk` 不应该始终为 `true`，否则会导致以下问题：

1. **语法悬而未决**：未闭合的链接、图片等语法会一直保持加载状态
2. **用户体验差**：用户看到持续的加载动画，无法获得完整内容
3. **内存泄漏**：状态数据持续累积，无法正确清理
