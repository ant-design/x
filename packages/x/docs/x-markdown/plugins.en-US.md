---
group:
  title: Plugins
  order: 2
title: Overview
order: 1
---

Using plugins enables `@ant-design/x-markdown` to support more extended features, such as LaTeX, code highlighting, etc.

## Plugin Collection

<MarkdownPluginsOverView></MarkdownPluginsOverView>

## How to Import Plugins

### Plugins can be imported from `@ant-design/x-markdown/plugins/plugin-name`.

```tsx
import Latex from '@ant-design/x-markdown/plugins/latex';
```

### Browser Import

In browsers, you can directly import files using script and link tags, with the `plugin name` as the global variable.

We provide built plugin files in the `dist/plugins` directory of the npm package, which you can use directly.

```html
<script src="**/dist/plugins/latex.min.js"></script>
<script>
  const Latex = window.Latex;
</script>
```

## Custom Plugins

### Supports implementing all Marked plugins, or creating custom plugins [Reference](/markdowns/custom-plugin-en)
