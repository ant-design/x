---
category: Components
group:
  title: Common
  order: 0
title: Conversations
description: Used to switch between multiple agents, update conversation turns, and manage conversation history
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Oj-bTbVXtpQAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*qwdtSKWXeikAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

- Switch between multiple agents, update conversation turns
- Need to manage multiple conversations
- View a list of historical conversations

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">Basic</code>
<code src="./demo/controlled-mode.tsx" background="grey">Controlled Mode</code>
<code src="./demo/with-menu.tsx" background="grey">Operations</code>
<code src="./demo/menu-trigger.tsx" background="grey">Custom Operations</code>
<code src="./demo/group.tsx" background="grey">Group</code>
<code src="./demo/group-collapsible.tsx" background="grey">Group collapsible</code>
<code src="./demo/controlled-collapsible.tsx" background="grey"> controlled collapsible mode</code>
<code src="./demo/new-chat.tsx" background="grey">New Chat</code>
<code src="./demo/custom-new-chat.tsx" background="grey">Custom New Chat</code>
<code src="./demo/shortcutKeys.tsx" background="grey">Shortcut key Operation</code>

<code src="./demo/infinite-load.tsx" background="grey">Scrolling loaded</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ConversationsProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| activeKey | Currently selected value | string | - | - |
| defaultActiveKey | Default selected value | string | - | - |
| items | Data source for conversation list | `ItemType`[] | - | - |
| onActiveChange | Callback for selection change | (value: string) => void | - | - |
| menu | Operation menu for conversations | ItemMenuProps\| ((value: ConversationItemType) => ItemMenuProps) | - | - |
| groupable | If grouping is supported, it defaults to the `Conversation.group` field | boolean \| GroupableProps | - | - |
| shortcutKeys | Shortcut key operations | { creation?: ShortcutKeys<number>; items?:ShortcutKeys<'number'> \| ShortcutKeys<number>[];} | - | - |
| creation | New conversation configuration | CreationProps | - | - |
| styles | Semantic structure styles | styles?: {creation?: React.CSSProperties;item?: React.CSSProperties;} | - | - |
| classNames | Semantic structure class names | classNames?: { creation?: string; item?:string;} | - | - |
| rootClassName | Root node className | string | - | - |

### ItemType

```tsx
type ItemType = ConversationItemType | DividerItemType;
```

#### ConversationItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier | string | - | - |
| label | Conversation name | React.ReactNode | - | - |
| group | Conversation type, linked to `ConversationsProps.groupable` | string | - | - |
| icon | Conversation icon | React.ReactNode | - | - |
| disabled | Whether to disable | boolean | - | - |

#### DividerItemType

| Property | Description    | Type      | Default   | Version |
| -------- | -------------- | --------- | --------- | ------- |
| type     | Divider type   | 'divider' | 'divider' | -       |
| dashed   | Whether dashed | boolean   | false     | -       |

### GroupableProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | Group title | React.ReactNode\| ((group: string, info: { groupInfo: GroupInfoType}) => React.ReactNode) | - | - |
| collapsible | Collapsible configuration | boolean \| ((group: string) => boolean) | - | - |
| defaultExpandedKeys | Default expanded or collapsed groups | string[] | - | - |
| onExpand | Expand or collapse callback | (expandedKeys: string[]) => void | - | - |
| expandedKeys | Expanded group keys | string[] | - | - |

### ItemMenuProps

Inherits antd [MenuProps](https://ant.design/components/menu-cn#api) properties.

```tsx
MenuProps & {
    trigger?:
      | React.ReactNode
      | ((
          conversation: ConversationItemType,
          info: { originNode: React.ReactNode },
        ) => React.ReactNode);
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  };
```

## Design Token

<ComponentTokenTable component="Conversations"></ComponentTokenTable>

```

```
