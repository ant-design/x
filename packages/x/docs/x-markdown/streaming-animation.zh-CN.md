---
group:
  title: 流式处理
  order: 4
title: 动画效果
order: 2
---

为流式渲染的内容添加优雅的动画效果，支持文本的渐进式显示，提升用户阅读体验。

## 功能介绍

流式动画效果专为实时内容渲染设计，通过平滑的过渡动画让内容呈现更加自然，避免突兀的内容更新带来的视觉不适。

## 功能演示

<code src="./demo/streaming/animation.tsx">流式动画效果</code>

## 配置参数

### streaming 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续数据 | `boolean` | `false` |
| enableAnimation | 启用文本淡入动画 | `boolean` | `false` |
| animationConfig | 文本动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

#### AnimationConfig

| 属性         | 说明                     | 类型     | 默认值          |
| ------------ | ------------------------ | -------- | --------------- |
| fadeDuration | 淡入动画持续时间（毫秒） | `number` | `200`           |
| easing       | 动画缓动函数             | `string` | `'ease-in-out'` |

## 使用示例

### 基础动画配置

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => {
  return (
    <XMarkdown
      content="# Hello World\n\nThis is a streaming rendering example."
      streaming={{
        hasNextChunk: true,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 200,
          easing: 'ease-in-out',
        },
      }}
    />
  );
};
```

### 自定义动画参数

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const CustomAnimationExample = () => {
  return (
    <XMarkdown
      content="## 自定义动画效果\n\n这段文字将以更慢的动画效果显示。"
      streaming={{
        hasNextChunk: true,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 500, // 更长的动画时间
          easing: 'ease-out', // 不同的缓动效果
        },
      }}
    />
  );
};
```

## 动画效果特性

### 核心特性

- **平滑过渡**：文本内容以淡入效果逐步显示，避免突兀感
- **可配置时长**：支持自定义动画持续时间，范围 100-1000ms
- **缓动函数**：支持多种缓动效果：
  - `ease-in-out`：平滑的加速减速（默认）
  - `linear`：匀速动画
  - `ease-in`：缓入效果
  - `ease-out`：缓出效果
- **性能优化**：使用 CSS3 transform 和 opacity 实现高性能动画，避免重排重绘

### 动画触发机制

动画效果在以下条件下触发：

1. **语法完整性**：仅当Markdown语法完整解析后触发动画
2. **增量更新**：仅对新添加的内容应用动画效果
3. **状态控制**：通过 `hasNextChunk` 控制动画的触发时机

## 高级用法

### 与语法处理配合使用

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const CombinedStreamingExample = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);

  useEffect(() => {
    const chunks = [
      '# 流式渲染与动画',
      '\n\n这是结合了',
      '**语法处理**和',
      '*动画效果*的',
      '完整示例。',
    ];

    let index = 0;
    const timer = setInterval(() => {
      if (index < chunks.length) {
        setContent((prev) => prev + chunks[index]);
        index++;

        if (index === chunks.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(timer);
      }
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 400,
          easing: 'ease-in-out',
        },
        incompleteMarkdownComponentMap: {
          link: 'loading-link',
          image: 'loading-image',
        },
      }}
    />
  );
};
```

### 打字机效果实现

结合动画效果可以实现打字机效果：

```tsx
import { useState, useEffect } from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const TypewriterEffect = () => {
  const [content, setContent] = useState('');
  const [hasNextChunk, setHasNextChunk] = useState(true);
  const fullText = '# 打字机效果\n\n这是一个模拟打字机效果的示例，每个字符都会逐步显示。';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setContent(fullText.slice(0, index));
        index++;

        if (index > fullText.length) {
          setHasNextChunk(false);
        }
      } else {
        clearInterval(timer);
      }
    }, 50); // 每个字符50ms

    return () => clearInterval(timer);
  }, []);

  return (
    <XMarkdown
      content={content}
      streaming={{
        hasNextChunk,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 100, // 快速淡入
          easing: 'linear',
        },
      }}
    />
  );
};
```

## 性能优化

### 动画性能

- **硬件加速**：使用 CSS3 transform 属性触发硬件加速
- **节流控制**：避免过快的动画触发频率
- **内存管理**：及时清理动画相关的DOM引用

### 最佳实践

1. **动画时长选择**：
   - 快速内容：100-200ms
   - 正常内容：200-400ms
   - 慢速内容：400-600ms

2. **缓动函数选择**：
   - 内容展示：`ease-in-out`
   - 强调效果：`ease-out`
   - 机械效果：`linear`

3. **避免过度动画**：
   - 大量文本内容时适当延长动画间隔
   - 避免同时触发过多动画元素

## 常见问题

### Q: 动画效果不生效？

A: 请检查以下条件：

- `enableAnimation` 是否设置为 `true`
- `hasNextChunk` 是否正确控制
- 浏览器是否支持 CSS3 动画

### Q: 动画导致性能问题？

A: 建议优化：

- 减少 `fadeDuration` 时间
- 使用 `linear` 缓动函数
- 分批渲染大量内容

### Q: 如何禁用特定元素的动画？

A: 可以通过自定义组件控制：

```tsx
const NoAnimationComponent = ({ children }) => {
  return <div style={{ animation: 'none' }}>{children}</div>;
};

<XMarkdown components={{ p: NoAnimationComponent }} streaming={{ enableAnimation: true }} />;
```
