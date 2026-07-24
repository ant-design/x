---
group:
  title: 组件
  order: 5
title: 总览
order: 1
---

`components` 是 `@ant-design/x-markdown` 最核心的扩展入口。你可以把 Markdown/HTML 节点映射成自定义 React 组件，在同一处统一处理渲染、流式状态和业务数据。更多扩展见 [插件](/x-markdowns/plugins-cn) 与自定义 renderer。

## 基础注册方式

```tsx
import React from 'react';
import { Mermaid, Think, XMarkdown } from '@ant-design/x';

<XMarkdown
  components={{
    think: Think,
    mermaid: Mermaid,
  }}
/>;
```

## ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | 来自 html-react-parser 的组件 DOM 节点，包含解析后的 DOM 节点信息 | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | 流式渲染支持两种状态：`loading` 表示内容正在加载中，`done` 表示加载已完成。当前仅支持 HTML 格式以及带围栏的代码块（fenced code）。由于缩进代码块（indented code）没有明确的结束符，因此始终返回 `done` 状态 | `'loading' \| 'done'` | - |
| children | 包裹在组件中的内容，包含 DOM 节点的文本内容 | `React.ReactNode` | - |
| rest | 组件属性，支持所有标准 HTML 属性（如 `href`、`title`、`className` 等）和自定义数据属性 | `Record<string, any>` | - |

## 传递额外的 props

自定义组件常常需要接收业务数据（如主题、回调函数等）。如果通过内联函数传递，每次渲染都会产生新的组件引用，导致组件被反复卸载重建，在流式场景下会丢失内部状态并造成明显的性能损耗。使用 `componentsProps` 可以在保持组件引用稳定的同时传入额外的 props：

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x';

// ❌ 内联函数：每次渲染都是新组件类型，子树整体重建
<XMarkdown
  components={{
    'custom-chart': (props) => <CustomChart {...props} theme={theme} onSelect={onSelect} />,
  }}
/>;

// ✅ 组件引用稳定，额外数据通过 componentsProps 传入
<XMarkdown
  components={{ 'custom-chart': CustomChart }}
  componentsProps={{ 'custom-chart': { theme, onSelect } }}
/>;
```

`componentsProps` 以标签名为 key，对应的 props 会与解析出的 HTML 属性合并后传给组件（同名时 `componentsProps` 优先）。`componentsProps` 变化时组件只会正常更新 props，不会被重新挂载。

## 最佳实践

1. 保持组件引用稳定，避免在 `components` 中写内联函数组件；需要传递额外数据时使用 `componentsProps`。
2. 使用 `streamStatus` 区分加载态（`loading`）和完成态（`done`）。
3. 依赖完整语法的数据解析，尽量在 `streamStatus === 'done'` 后执行。
4. 自定义标签命名尽量语义化，减少 Markdown 与 HTML 混写歧义。

## FAQ: 自定义标签闭合异常

如果块级自定义标签内部出现不符合预期的空行，Markdown 解析器可能提前结束 HTML 块，后续内容会被当作普通段落处理。建议：

1. 尽量保证标签内部内容连续。
2. 或在完整标签块前后保留空行，让解析器将其识别为独立块。
