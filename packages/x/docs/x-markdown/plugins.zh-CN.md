---
group:
  title: 插件集
  order: 2
title: 总览
order: 1
---

使用插件可以使 `@ant-design/x-markdown` 支持更多的扩展功能，比如：Latex、代码高亮等。

## 插件集

<MarkdownPluginsOverView></MarkdownPluginsOverView>

## 如何引入插件

### 可从 `@ant-design/x-markdown/plugins/插件名` 引入插件。

```tsx
import Latex from '@ant-design/x-markdown/plugins/latex';
```

## 自定义插件

### 支持基于实现 Marked 所有插件，也可通过自定义方式来插件 [参考](/markdowns/custom-plugin-cn)

### 从浏览器引入

在浏览器中使用 script 和 link 标签直接引入文件，并使用`插件名`作为全局变量 。

我们在 npm 发布包内的 `dist/plugins` 目录下提供了插件的构建文件，你可以直接使用。

```html
<script src="**/dist/plugins/latex.min.js"></script>
<script>
  const Latex = window.Latex;
</script>
```
