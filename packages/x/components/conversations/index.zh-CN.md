---
category: Components
group:
  title: 通用
  order: 0
title: Conversations
subtitle: 管理对话
description: 用于切换多个智能体，更新对话轮次，对话历史切换
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Oj-bTbVXtpQAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*qwdtSKWXeikAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

- 切换多个智能体，更新对话轮次
- 需要对多个会话进行管理
- 查看历史会话列表

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" background="grey">基本</code>
<code src="./demo/controlled-mode.tsx" background="grey">受控模式</code>
<code src="./demo/with-menu.tsx" background="grey">会话操作</code>
<code src="./demo/menu-trigger.tsx" background="grey">自定义操作</code>
<code src="./demo/group.tsx" background="grey">分组展示</code>
<code src="./demo/group-collapsible.tsx" background="grey">分组折叠展示</code>
<code src="./demo/controlled-collapsible.tsx" background="grey">折叠受控模式</code>
<code src="./demo/new-chat.tsx" background="grey">新会话</code>
<code src="./demo/custom-new-chat.tsx" background="grey">自定义新会话</code>
<code src="./demo/shortcutKeys.tsx" background="grey">快捷键操作</code>

<code src="./demo/infinite-load.tsx" background="grey">滚动加载</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ConversationsProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 会话列表数据源 | `ItemType`[] | - | - |
| activeKey | 当前选中的值 | string | - | - |
| defaultActiveKey | 初始化选中的值 | string | - | - |
| onActiveChange | 选中变更回调 | (value: string) => void | - | - |
| menu | 会话操作菜单 | ItemMenuProps\| ((value: ConversationItemType) => ItemMenuProps) | - | - |
| groupable | 是否支持分组, 开启后默认按 `Conversation.group` 字段分组 | boolean \| GroupableProps | - | - |
| shortcutKeys | 快捷键操作 | { creation?: ShortcutKeys\<number\>; items?:ShortcutKeys\<'number'\> \| ShortcutKeys\<number\>[];} | - | - |
| creation | 新会话操作配置 | CreationProps | - | - |
| styles | 语义化结构 style | styles?: {creation?: React.CSSProperties;item?: React.CSSProperties;} | - | - |
| classNames | 语义化结构 className | classNames?: { creation?: string; item?:string;} | - | - |
| rootClassName | 根节点类名 | string | - | - |

### ItemType

```tsx
type ItemType = ConversationItemType | DividerItemType;
```

#### ConversationItemType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | 唯一标识 | string | - | - |
| label | 会话名称 | React.ReactNode | - | - |
| group | 会话分组类型，与 `ConversationsProps.groupable` 联动 | string | - | - |
| icon | 会话图标 | React.ReactNode | - | - |
| disabled | 是否禁用 | boolean | false | - |

#### DividerItemType

| 属性   | 说明           | 类型      | 默认值    | 版本 |
| ------ | -------------- | --------- | --------- | ---- |
| type   | 会话列表分割线 | 'divider' | 'divider' | -    |
| dashed | 是否虚线       | boolean   | false     | -    |

### ItemMenuProps

继承 antd [MenuProps](https://ant.design/components/menu-cn#api) 属性。

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

### GroupableProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 分组标题 | React.ReactNode\| ((group: string, info: { groupInfo: GroupInfoType}) => React.ReactNode) | - | - |
| collapsible | 可折叠配置 | boolean \| ((group: string) => boolean) | - | - |
| defaultExpandedKeys | 默认展开或收起 | string[] | - | - |
| onExpand | 展开或收起 | (expandedKeys: string[]) => void | - | - |
| expandedKeys | 展开分组的 keys | string[] | - | - |

## 主题变量（Design Token）

<ComponentTokenTable component="Conversations"></ComponentTokenTable>
