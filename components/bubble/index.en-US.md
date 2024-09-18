---
category: Components
group: Data Display
title: Bubble
description: A bubble component for chat.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

Often used when chatting.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/avatar-and-placement.tsx">Placement and avatar</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/typing.tsx">Typing effect</code>
<code src="./demo/markdown.tsx">Content render</code>
<code src="./demo/variant.tsx">Variant</code>
<code src="./demo/list.tsx">Bubble List</code>
<code src="./demo/list-custom.tsx">Custom List Content</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Bubble

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| avatar | Avatar component | React.ReactNode | - |  |
| classNames | Semantic DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| content | Content of bubble | string | - |  |
| loading | Loading state of Message | boolean | - |  |
| placement | Direction of Message | `start` \| `end` | `start` |  |
| styles | Semantic DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| typing | Show message with typing motion | boolean \| { step?: number, interval?: number } | false |  |
| variant | Style variant | `filled` \| `borderless` | `filled` |  |
| messageRender | Display customized content | (content?: string) => ReactNode | - |  |
| onTypingComplete | Callback when typing effect is completed. If typing is not set, it will be triggered immediately when rendering. | () => void | - |  |

### Bubble.List

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoScroll | When the content is updated, scroll to the latest position automatically. If the user scrolls, the automatic scrolling will be paused. | boolean | true |  |
| items | Bubble items list | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | Set the default properties of the bubble. The `role` in `items` will be automatically matched. | Record<string, BubbleProps> \| (bubble) => BubbleProps | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
