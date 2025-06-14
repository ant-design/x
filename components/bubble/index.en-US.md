---
category: Components
group:
  title: Common
  order: 0
title: Bubble
description: A bubble component for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Often used when chatting.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/avatar-and-placement.tsx">Placement and avatar</code>
<code src="./demo/header-and-footer.tsx">Header and footer</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/typing.tsx">Typing effect</code>
<code src="./demo/markdown.tsx">Content render</code>
<code src="./demo/variant.tsx">Variant</code>
<code src="./demo/shape.tsx">Shape</code>
<code src="./demo/list.tsx">Bubble List</code>
<code src="./demo/bubble-custom.tsx">Semantic Custom</code>
<code src="./demo/list-custom.tsx">Custom List Content</code>
<code src="./demo/gpt-vis.tsx">Using GPT-Vis to render charts</code>
<code src="./demo/reference" debug>Reference</code>
<code src="./demo/debug.tsx" debug>debug</code>
<code src="./demo/debug-list.tsx" debug>debug list</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Bubble

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| avatar | Avatar component | React.ReactNode | - |  |
| classNames | Semantic DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| content | Content of bubble | string | - |  |
| footer | Footer content | React.ReactNode | - |  |
| header | Header content | React.ReactNode | - |  |
| loading | Loading state of Message | boolean | - |  |
| placement | Direction of Message | `start` \| `end` | `start` |  |
| shape | Shape of bubble | `round` \| `corner` | - |  |
| styles | Semantic DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| typing | Show message with typing motion | boolean \| { step?: number, interval?: number } | false |  |
| variant | Style variant | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` |  |
| loadingRender | Customize loading content | () => ReactNode | - |  |
| messageRender | Customize display content | (content?: string) => ReactNode | - |  |
| onTypingComplete | Callback when typing effect is completed. If typing is not set, it will be triggered immediately when rendering. | () => void | - |  |

### Bubble.List

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoScroll | When the content is updated, scroll to the latest position automatically. If the user scrolls, the automatic scrolling will be paused. | boolean | true |  |
| items | Bubble items list | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | Set the default properties of the bubble. The `role` in `items` will be automatically matched. | Record<string, BubbleProps> \| (bubble, index) => BubbleProps | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
