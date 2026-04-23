---
title: 流式渲染
order: 4
---

处理 **LLM 流式返回的 Markdown**：语法补全和缓存、动画以及尾缀。

## 代码示例

<code src="./demo/streaming/format.tsx" description="不完整语法修复与占位">语法处理</code> <code src="./demo/streaming/animation.tsx">渲染控制</code>

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续 chunk | `boolean` | `false` |
| incompleteMarkdownComponentMap | 未完成语法的组件映射 | `Partial<Record<Exclude<StreamCacheTokenType, 'text'>, string>>` | `{}` |
| enableAnimation | 是否启用淡入动画 | `boolean` | `false` |
| animationConfig | 动画参数 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |
| tail | 是否启用尾部指示器 | `boolean \| TailConfig` | `false` |

### TailConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 尾部显示的内容 | `string` | `'▋'` |
| component | 自定义尾部组件，优先级高于 content | `React.ComponentType<{ content?: string }>` | - |

### AnimationConfig

| 属性         | 说明             | 类型     | 默认值          |
| ------------ | ---------------- | -------- | --------------- |
| fadeDuration | 动画时长（毫秒） | `number` | `200`           |
| easing       | 缓动函数         | `string` | `'ease-in-out'` |

> 尾部默认显示 `▋`。可通过 `content` 自定义字符，或通过 `component` 传入自定义 React 组件实现动画、延迟显示等效果。
>
> ```tsx
> // 自定义尾部组件示例
> const DelayedTail: React.FC<{ content?: string }> = ({ content }) => {
>   const [visible, setVisible] = useState(false);
>
>   useEffect(() => {
>     const timer = setTimeout(() => setVisible(true), 2000);
>     return () => clearTimeout(timer);
>   }, []);
>
>   if (!visible) return null;
>   return <span className="my-tail">{content}</span>;
> };
> ```

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
    tail: true,
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
