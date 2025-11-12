---
group:
  title: 流式处理
  order: 4
title: 语法处理
order: 1
---

流式语法处理机制专为实时渲染场景设计，能够智能处理不完整的Markdown语法结构，避免因语法片段导致的渲染异常。

## 代码演示

<code src="./demo/streaming/format.tsx" description="流式语法处理效果演示">流式语法处理</code>

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续数据 | `boolean` | `false` |
| enableAnimation | 启用文本淡入动画 | `boolean` | `false` |
| animationConfig | 文本动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

## FAQ

### 为什么需要它？

在流式传输过程中，Markdown语法可能处于不完整状态：

```markdown
// 不完整的链接语法 [示例网站](https://example // 不完整的图片语法 ![产品图](https://cdn.example.com/images/produc
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

### 支持的语法类型

流式语法处理支持以下Markdown语法的完整性检查：

| 语法类型    | 格式示例               | 处理机制                           |
| ----------- | ---------------------- | ---------------------------------- | --- | --- | -------------------------- |
| **链接**    | `[text](url)`          | 检测未闭合的链接标记，如 `[text](` |
| **图片**    | `![alt](src)`          | 检测未闭合的图片标记，如 `![alt](` |
| **标题**    | `# ## ###` 等          | 支持1-6级标题的渐进式渲染          |
| **强调**    | `*斜体*` `**粗体**`    | 处理 `*` 和 `_` 的强调语法         |
| **代码**    | `行内代码` 和 `代码块` | 支持反引号代码块的完整性检查       |
| **列表**    | `- + *` 列表标记       | 检测列表标记后的空格               |
| **分隔线**  | `---` `===`            | 避免Setext标题与分隔线冲突         |
| **表格**    | `                      | 列1                                | 列2 | `   | 检测未闭合的表格行和单元格 |
| **XML标签** | `<tag>`                | 处理HTML/XML标签的闭合状态         |

### 自定义加载组件

通过 `incompleteMarkdownComponentMap` 可以自定义未完整语法的加载状态显示：

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const CustomLoadingComponents = {
  LinkLoading: () => <span className="loading-link">🔗 加载中...</span>,
  ImageLoading: () => <div className="loading-image">🖼️ 图片加载中...</div>,
};

const App = () => {
  return (
    <XMarkdown
      content="访问[Ant Design](https://ant.design)查看文档"
      streaming={{
        hasNextChunk: true,
        incompleteMarkdownComponentMap: {
          link: 'link-loading',
          image: 'image-loading',
        },
      }}
      components={{
        'link-loading': CustomLoadingComponents.LinkLoading,
        'image-loading': CustomLoadingComponents.ImageLoading,
      }}
    />
  );
};
```
