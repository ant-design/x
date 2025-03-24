---
category: Components
group:
  title: Common
  order: 0
title: Conversations
description: Used to manage and view the conversation list
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Oj-bTbVXtpQAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*qwdtSKWXeikAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

- Multiple sessions need to be managed
- View a list of historical sessions

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">Basic</code>
<code src="./demo/with-menu.tsx" background="grey">Operations</code>
<code src="./demo/with-menu-trigger.tsx" background="grey">Custom Operations</code>
<code src="./demo/controlled-mode.tsx" background="grey">Controlled Mode</code>
<code src="./demo/group.tsx" background="grey">Group</code>
<code src="./demo/group-sort.tsx" background="grey">Group Sort</code>
<code src="./demo/infinite-load.tsx" background="grey">Scrolling loaded</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ConversationsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey | Currently selected value | string | - | - |
| defaultActiveKey | Default selected value | string | - | - |
| items | Data source for conversation list | `Conversation`[] | - | - |
| onActiveChange | Callback for selection change | (value: string) => void | - | - |
| menu | Operation menu for conversations | MenuProps \| ((value: `Conversation`) => MenuProps) | - | - |
| groupable | If grouping is supported, it defaults to the `Conversation.group` field | boolean \| GroupableProps | - | - |
| styles | Semantic structure styles | Record<'item', React.CSSProperties> | - | - |
| classNames | Semantic structure class names | Record<'item', string> | - | - |

### Conversation

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier | string | - | - |
| label | Conversation name | React.ReactNode | - | - |
| timestamp | Conversation timestamp | number | - | - |
| group | Conversation type, linked to `ConversationsProps.groupable` | string | - | - |
| icon | Conversation icon | React.ReactNode | - | - |
| disabled | Whether to disable | boolean | - | - |

### GroupableProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `sort` | Group sorter | (a: string, b: string) => number | - | - |
| `title` | Semantic custom rendering | ((group: string, info: { components: { GroupTitle: React.ComponentType } }) => React.ReactNode) | - | - |

### MenuProps

For more properties, see [MenuProps](https://ant.design/components/menu-cn#api).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| `trigger` | Customize menu trigger | React.ReactNode \| ((conversation: Conversation) => React.ReactNode) | - | - |

## Design Token

<ComponentTokenTable component="Conversations"></ComponentTokenTable>
