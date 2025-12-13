---
group:
  title: Plugins
title: Latex
order: 2
---

## When to Use

When you need to render formulas in Markdown.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/supersets/Latex/basic.tsx"></code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| replaceAlignStart | Whether to replace align* with aligned in formulas, [katex doesn't support align*](https://github.com/KaTeX/KaTeX/issues/1007) | `boolean` | `true` |
| katexOptions | Katex configuration | [`KatexOptions`](https://katex.org/docs/options) | `{ output: 'mathml' }` |
