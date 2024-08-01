---
category: Components
group: Data Display
title: Conversations
description: Used to manage and view the conversation list
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

- Multiple sessions need to be managed
- View a list of historical sessions

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/with-menu.tsx">Operations</code>
<code src="./demo/controlled-mode.tsx">Controlled Mode</code>
<code src="./demo/sorter-by-time.tsx">Sorter</code>

## API

Common props ref：[Common props](/docs/react/common-props)

#### Conversations

| Property    | Description             | Type                               | Default | Version |
|-------------|-------------------------|------------------------------------|---------|---------|
| `data`      | Conversations data source   | `ConversationProps[]`              | -       | -       |
| `activeKey` | Currently selected key  | `ConversationProps['key']`         | -       | -       |
| `onChange`  | Change callback         | `(value: ConversationProps) => void` | -     | -       |
| `menu`      | Chat operation menu     | `MenuProps['items']`               | -       | -       |
| `sorter`    | Sorting method          | `'SORT_BY_TIME'`                   | -       | -       |
| `styles`    | Semantic structure styles | `Record<'list' \| 'item', React.CSSProperties>` | - | -    |
| `classNames`| Semantic structure classNames | `Record<'list' \| 'item', string>` | - | -    |

#### Conversation

| Property   | Description       | Type               | Default | Version |
|------------|-------------------|--------------------|---------|---------|
| `key`      | Unique identifier | `string`           | -       | -       |
| `label`    | Chat name         | `string`           | -       | -       |
| `timestamp`| Chat timestamp    | `number`           | -       | -       |
| `pinned`    | Pinned to top     | `boolean`          | -       | -       |

## Semantic DOM


## Design Token

<ComponentTokenTable component="Conversations"></ComponentTokenTable>
