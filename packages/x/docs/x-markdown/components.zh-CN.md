---
title: 自定义组件
order: 4
---

设置`components`可以将标签名称映射到组件，配合使用自定义组件以及插件渲染标签。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/components/think.tsx" description="配合 `Think` 渲染思考过程">思考过程</code>
<code src="./demo/components/thoughtChain.tsx" description="配合 `ThoughtChain` 渲染思考过程">思维链</code>

### ComponentProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| domNode | Component Element | [`DomNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| children | 包裹在 component 的内容 | `string` | - |
| **rest** | 组件上的属性，支持标准 HTML 属性（如 `a`(link) href、title）及自定义属性 | `Record<string,unknown>` | - |
