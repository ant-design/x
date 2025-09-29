---
title: 流式语法处理
order: 3
---

## 概述

流式语法处理机制专为实时渲染场景设计，能够智能处理不完整的Markdown语法结构，避免因语法片段导致的渲染异常。

## 核心问题

### 1. 语法片段问题

在流式传输过程中，Markdown语法可能处于不完整状态：

```markdown
// 传输中的链接点击访问[示例网站](https://example // 不完整的图片语法 ![产品图](https://cdn.example.com/images/produc
```

### 2. 渲染异常风险

不完整的语法结构可能导致：

- 链接无法正确跳转
- 图片加载失败
- 格式标记直接显示在内容中

## 功能演示

<code src="./demo/streaming/format.tsx" description="流式语法处理效果演示">流式语法处理</code>

## 配置指南

### streaming 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续数据 | `boolean` | `false` |
| incompleteMarkdownComponentMap | 未完成的 Markdown 格式转换为自定义加载组件的映射配置，用于在流式渲染过程中为未闭合的链接和图片提供自定义 loading 组件 | `{ link?: string; image?: string }` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |

### 使用示例

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => {
  return (
    <XMarkdown
      content="# 流式渲染示例\n\n访问[Ant Design](https://ant.design)获取设计资源。\n\n![Logo](https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg)"
      streaming={{
        hasNextChunk: true,
        incompleteMarkdownComponentMap: {
          link: 'custom-link-loading',
          image: 'custom-image-loading',
        },
      }}
    />
  );
};
```

## 支持的语法类型

流式语法处理支持以下Markdown语法的完整性检查：

| 语法类型    | 格式示例               | 处理机制                           |
| ----------- | ---------------------- | ---------------------------------- |
| **链接**    | `[text](url)`          | 检测未闭合的链接标记，如 `[text](` |
| **图片**    | `![alt](src)`          | 检测未闭合的图片标记，如 `![alt](` |
| **标题**    | `# ## ###` 等          | 支持1-6级标题的渐进式渲染          |
| **强调**    | `*斜体*` `**粗体**`    | 处理 `*` 和 `_` 的强调语法         |
| **代码**    | `行内代码` 和 `代码块` | 支持反引号代码块的完整性检查       |
| **列表**    | `- + *` 列表标记       | 检测列表标记后的空格               |
| **分隔线**  | `---` `===`            | 避免Setext标题与分隔线冲突         |
| **XML标签** | `<tag>`                | 处理HTML/XML标签的闭合状态         |

## 工作原理

当 `hasNextChunk=true` 时，组件会：

1. **Token化解析**：将Markdown语法分解为11种Token类型进行状态管理
2. **状态栈维护**：使用栈结构追踪嵌套的语法状态
3. **智能截断**：在语法不完整时暂停渲染，避免显示片段
4. **渐进渲染**：随着内容补充，逐步完成语法渲染
5. **错误恢复**：当检测到语法错误时自动回退到安全状态

## 高级配置

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

### 状态重置机制

当输入内容发生根本性变化时（非增量更新），组件会自动重置解析状态：

```tsx
// 旧内容："Hello "
// 新内容："Hi there!" - 会触发状态重置
// 新内容："Hello world!" - 会继续增量解析
```

## hasNextChunk 使用最佳实践

### 避免一直卡住

`hasNextChunk` 不应该始终为 `true`，否则会导致以下问题：

1. **语法悬而未决**：未闭合的链接、图片等语法会一直保持加载状态
2. **用户体验差**：用户看到持续的加载动画，无法获得完整内容
3. **内存泄漏**：状态数据持续累积，无法正确清理

### 正确用法示例

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const StreamingExample = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);

  useEffect(() => {
    // 模拟流式数据
    const chunks = [
      '# 欢迎使用流式渲染',
      '\n\n这是一个演示',
      '，展示了如何处理',
      '[不完整链接](https://example',
      '.com)和图片',
      '![示例图片](https://picsum.photos/200)',
      '\n\n内容已完成！',
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < chunks.length) {
        setContent((prev) => prev + chunks[currentIndex]);
        currentIndex++;

        // 最后一组数据时设置为 false
        if (currentIndex === chunks.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        incompleteMarkdownComponentMap: {
          link: 'loading-link',
          image: 'loading-image',
        },
      }}
    />
  );
};
```

## 性能优化

- **增量解析**：只处理新增的内容片段，避免重复解析
- **状态缓存**：维护解析状态，减少重复计算
- **内存管理**：自动清理已处理的状态数据
- **错误边界**：防止解析错误影响整体渲染
