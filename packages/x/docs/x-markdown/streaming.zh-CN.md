---
title: 流式处理
order: 4
---

处理 **LLM 流式返回的 Markdown**：不完整语法修复、渐进动画，以及开发期可选的性能监控。

## 代码示例

<code src="./demo/streaming/format.tsx" description="不完整语法修复与占位">语法处理</code> <code src="./demo/streaming/animation.tsx" description="淡入动画与可选调试面板">动画与调试</code>

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续 chunk | `boolean` | `false` |
| incompleteMarkdownComponentMap | 未完成语法的组件映射 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| enableAnimation | 是否启用淡入动画 | `boolean` | `false` |
| animationConfig | 动画参数 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

### AnimationConfig

| 属性         | 说明             | 类型     | 默认值          |
| ------------ | ---------------- | -------- | --------------- |
| fadeDuration | 动画时长（毫秒） | `number` | `200`           |
| easing       | 缓动函数         | `string` | `'ease-in-out'` |

### debug

| 属性  | 说明                 | 类型      | 默认值  |
| ----- | -------------------- | --------- | ------- |
| debug | 是否启用性能监控面板 | `boolean` | `false` |

> ⚠️ **debug** 仅限开发环境使用，生产环境请关闭以避免性能开销与信息泄露。

## 支持的不完整语法

| TokenType | 示例                     |
| --------- | ------------------------ |
| `link`    | `[text](https://example` |
| `image`   | `![alt](https://img...`  |
| `heading` | `###`                    |
| `table`   | `\| col1 \| col2 \|`     |
| `xml`     | `<div class="`           |

## 最小配置示例

```tsx
<XMarkdown
  content={content}
  streaming={{
    hasNextChunk,
    enableAnimation: true,
    incompleteMarkdownComponentMap: {
      link: 'link-loading',
      table: 'table-loading',
    },
  }}
  components={{
    'link-loading': LinkSkeleton,
    'table-loading': TableSkeleton,
  }}
/>
```

## FAQ

### `hasNextChunk` 可以一直是 `true` 吗？

不建议。最后一个 chunk 到达后应切换为 `false`，否则未完成语法会持续停留在占位状态。
