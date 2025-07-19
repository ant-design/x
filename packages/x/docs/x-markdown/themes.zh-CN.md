---
title: 主题
order: 5
---

## 如何引入插件

### 可从 `@ant-design/x-markdown/themes/主题名.css` 引入插件。

```tsx
import XMarkdown from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/light.css';

return <XMarkdown className="x-markdown-light" content="Hello XMarkdown!" />;
```

### 从浏览器引入

在浏览器中使用 script 和 link 标签直接引入文件，并注入`类名`到组件 。

```html
<script src="**/dist/themes/light.css"></script>
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/themes/light.tsx">light</code>
<code src="./demo/themes/dark.tsx">dark</code>

## 贡献主题
