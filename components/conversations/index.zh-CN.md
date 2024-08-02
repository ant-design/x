---
category: Components
group: 数据展示
title: Conversations
subtitle: 会话列表
description: 用于管理、查看会话列表
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## 何时使用

 - 需要对多个会话进行管理
 - 查看历史会话列表

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/with-menu.tsx">会话操作</code>
<code src="./demo/controlled-mode.tsx">受控模式</code>
<code src="./demo/group.tsx">分组展示</code>


## API

通用属性参考：[通用属性](/docs/react/common-props)

### ConversationsProps

| 属性              | 说明                          | 类型                                                                                          | 默认值 | 版本 |
|-------------------|-------------------------------|-----------------------------------------------------------------------------------------------|--------|------|
| data              | 会话列表数据源                | `ConversationProps[]`                                                                         | -      | -    |
| activeKey         | 当前选中的值                  | `ConversationProps['key']`                                                                    | -      | -    |
| defaultActiveKey  | 默认选中值                    | `ConversationProps['key']`                                                                    | -      | -    |
| onActiveChange    | 选中变更回调                  | (value: `ConversationProps['key']`, preValue: `ConversationProps['key']`) => void              | -      | -    |
| menu              | 会话操作菜单                  | MenuProps \| ((value: `ConversationProps`) => MenuProps)                               | -      | -    |
| groupable         | 是否支持分组, 开启后默认按 `ConversationProps.group` 字段分组 | boolean \| { components?: Record<'title', React.ComponentType<{ group: GroupType }>> } | -      | -    |
| styles            | 语义化结构 style              | Record<'list' \| 'item', React.CSSProperties>                                                 | -      | -    |
| classNames        | 语义化结构 className          | Record<'list' \| 'item', string>                                                              | -      | -    |

### ConversationProps

| 属性       | 说明           | 类型              | 默认值 | 版本 |
|------------|----------------|-------------------|--------|------|
| key        | 唯一标识       | string            | -      | -    |
| label      | 会话名称       | React.ReactNode   | -      | -    |
| timestamp  | 会话时间戳     | number            | -      | -    |
| group      | 会话分组类型，与 `ConversationsProps.groupable` 联动 | string | -      | -    |
| icon       | 会话图标       | React.ReactNode   | -      | -    |
| disabled   | 是否禁用       | boolean           | -      | -    |

## 主题变量（Design Token）

<ComponentTokenTable component="Conversations"></ComponentTokenTable>
