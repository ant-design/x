---
category: Components
group: Data Display
title: Conversations
description: Used to manage and view the conversation list
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

- Multiple sessions need to be managed
- View a list of historical sessions

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/with-menu.tsx">Operations</code>
<code src="./demo/controlled-mode.tsx">Controlled Mode</code>
<code src="./demo/group.tsx">Group</code>
<code src="./demo/group-sort.tsx">Group Sort</code>
<code src="./demo/infinite-load.tsx">Scrolling loaded</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ConversationsProps

| Property           | Description                  | Type                                                                                          | Default | Version |
|--------------------|------------------------------|-----------------------------------------------------------------------------------------------|---------|---------|
| data               | Data source for conversation list | `ConversationProps[]`                                                                         | -       | -       |
| activeKey          | Currently selected value     | string                                                                    | -       | -       |
| defaultActiveKey   | Default selected value       | string                                                                    | -       | -       |
| onActiveChange     | Callback for selection change | (value: string, preValue: string) => void              | -       | -       |
| menu               | Operation menu for conversations | MenuProps \| ((value: `ConversationProps`) => MenuProps)                               | -       | -       |
| groupable          | If grouping is supported, it defaults to the `ConversationProps.group` field | boolean \| GroupableProps | -       | -       |
| styles             | Semantic structure styles    | Record<'list' \| 'item' \| 'icon' \| 'label' \| 'menuIcon', React.CSSProperties>                                                 | -       | -       |
| classNames         | Semantic structure class names | Record<'list' \| 'item' \| 'icon' \| 'label' \| 'menuIcon', string>                                                              | -       | -       |

### ConversationProps

| Property  | Description                | Type              | Default | Version |
|-----------|----------------------------|-------------------|---------|---------|
| key       | Unique identifier          | string            | -       | -       |
| label     | Conversation name          | React.ReactNode   | -       | -       |
| timestamp | Conversation timestamp     | number            | -       | -       |
| group     | Conversation type, linked to `ConversationsProps.groupable` |  string | -       | -       |
| icon      | Conversation icon          | React.ReactNode   | -       | -       |
| disabled  | Whether to disable         | boolean           | -       | -       |

### GroupableProps
| Property    | Description             | Type                               | Default | Version |
|-------------|-------------------------|------------------------------------|---------|---------|
| `sort`       | Group sorter         | `(a: string, b: string) => number` | -  | -    |
| `title` | Semantic custom rendering       | `React.ComponentType<{ group: string }>` | -   | -    |

## Design Token

<ComponentTokenTable component="Conversations"></ComponentTokenTable>
