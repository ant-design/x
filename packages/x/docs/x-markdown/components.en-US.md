---
title: Components
order: 4
---

Set `components` to map tag names to components.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/components/think.tsx" description="Render the thinking process with `Think`">Thinking Process</code>
<code src="./demo/components/thoughtChain.tsx" description="Render the thinking process with `ThoughtChain`">Thought Chain</code>

### ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component Element | [`DomNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| children | Content wrapped in component | `string` | - |
| **rest** | Component properties, supports standard HTML attributes (e.g. `a`(link) href, title) and custom attributes | `Record<string,unknown>` | - |
