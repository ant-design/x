---
category: Components
group: Runtime
title: useXAgent
description: Use agent hook for data management.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

Use with Bubble.List and Sender to quickly build a conversational LUI.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/suggestions.tsx">Multiple Suggestion</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### Bubble

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| avatar | Avatar component | React.ReactNode | - |  |
| classNames | Semantic DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| styles | Semantic DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| placement | Direction of Message | `start` \| `end` | `start` |  |
| loading | Loading state of Message | boolean | - |  |
| typing | Show message with typing motion | boolean \| { step?: number, interval?: number } | false |  |
| content | Content of bubble | string | - |  |
| messageRender | Display customized content | (content?: string) => ReactNode | - |  |

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
