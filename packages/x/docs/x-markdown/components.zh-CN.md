---
group:
  title: 组件
  order: 5
title: 总览
order: 1
---

`components` 属性允许你使用自定义 React 组件替换标准的 HTML 标签。

## 基本用法

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const CustomHeading = ({ children, ...props }) => (
  <h1 style={{ color: '#1890ff' }} {...props}>
    {children}
  </h1>
);

const App = () => <XMarkdown content="# Hello World" components={{ h1: CustomHeading }} />;
```

## 性能优化

### 1. 避免内联组件定义

```tsx
// ❌ 错误：每次渲染创建新组件
<XMarkdown components={{ h1: (props) => <h1 {...props} /> }} />;

// ✅ 正确：使用预定义组件
const Heading = (props) => <h1 {...props} />;
<XMarkdown components={{ h1: Heading }} />;
```

### 2. 使用 React.memo

```tsx
const StaticContent = React.memo(({ children }) => <div className="static">{children}</div>);
```

## 流式渲染处理

XMarkdown 会默认给组件传递 `streamStatus` 属性，用于标识组件是否闭合，便于处理流式渲染。

### 状态判断

```tsx
const StreamingComponent = ({ streamStatus, children }) => {
  if (streamStatus === 'loading') {
    return <div className="loading">加载中...</div>;
  }
  return <div>{children}</div>;
};
```

## 数据获取示例

组件支持两种数据获取方式：直接解析 Markdown 中的数据，或自主发起网络请求。

### 数据获取

```tsx
const UserCard = ({ domNode, streamStatus }) => {
  const [user, setUser] = useState(null);
  const username = domNode.attribs?.['data-username'];

  useEffect(() => {
    if (username && streamStatus === 'done') {
      fetch(`/api/users/${username}`)
        .then((r) => r.json())
        .then(setUser);
    }
  }, [username, streamStatus]);

  if (!user) return <div>加载中...</div>;

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
};
```

## 支持的标签映射

### 标准 HTML 标签

| 标签       | 组件名     |
| ---------- | ---------- |
| `a`        | `a`        |
| `h1-h6`    | `h1-h6`    |
| `p`        | `p`        |
| `img`      | `img`      |
| `table`    | `table`    |
| `ul/ol/li` | `ul/ol/li` |
| `code/pre` | `code/pre` |

### 自定义标签

```tsx
// 支持任意自定义标签
<XMarkdown
  components={{
    'my-component': MyComponent,
    'user-card': UserCard,
  }}
/>
```

## ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | 来自 html-react-parser 的组件 DOM 节点，包含解析后的 DOM 节点信息 | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | 流式渲染支持两种状态：`loading` 表示内容正在加载中，`done` 表示加载已完成。当前仅支持 HTML 格式以及带围栏的代码块（fenced code）。由于缩进代码块（indented code）没有明确的结束符，因此始终返回 `done` 状态 | `'loading' \| 'done'` | - |
| children | 包裹在组件中的内容，包含 DOM 节点的文本内容 | `React.ReactNode` | - |
| rest | 组件属性，支持所有标准 HTML 属性（如 `href`、`title`、`className` 等）和自定义数据属性 | `Record<string, any>` | - |

## FAQ

### 块级 HTML 标签未正确闭合

块级 HTML 标签内部包含空行（\n\n），Markdown 解析器将空行视为新段落的开始，从而中断对原始 HTML 块的识别。这会导致闭合标签被错误地解析为行内 HTML 或普通文本，最终破坏标签结构。

**示例问题：**

输入 Markdown：

```markdown
<think>
这是思考内容

思考内容包含空行 </think>

这是正文内容
```

错误输出：

```html
<think>
  这是思考内容

  <p>思考内容包含空行</p>
  <p>这是正文内容</p>
</think>
```

**根本原因：** 根据 [CommonMark](https://spec.commonmark.org/0.30/#html-blocks) 规范，HTML 块的识别依赖于严格的格式规则。一旦在 HTML 块内部出现两个连续换行（即空行），且未满足特定 HTML 块类型（如 `<div>`、`<pre>` 等）的延续条件，解析器会终止当前 HTML 块，并将后续内容作为 Markdown 段落处理。

自定义标签（如 `<think>` ）通常不被识别为“可跨段落”的 HTML 块类型，因此极易受空行干扰。

**解决方案：**

1. **方案一**：移除标签内部所有空行

```markdown
<think>
这是思考内容
思考内容无空行
</think>
```

2. **方案二**：在 HTML 标签前后及内部添加空行，使其成为独立块

```markdown
<think>

这是思考内容

思考内容包含空行

</think>
```
