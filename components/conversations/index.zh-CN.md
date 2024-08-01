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
<code src="./demo/sorter-by-time.tsx">分组排序</code>


## API

通用属性参考：[通用属性](/docs/react/common-props)

### Conversations
| 属性       | 说明             | 类型                               | 默认值 | 版本 |
|------------|------------------|------------------------------------|--------|------|
| `data`     | 会话列表数据源   | `ConversationProps[]`              | -      | -    |
| `activeKey`| 当前选中的值     | `ConversationProps['key']`         | -      | -    |
| `onChange` | 选中变更回调     | `(value: ConversationProps) => void` | -      | -    |
| `menu`     | 会话操作菜单     | `MenuProps['items']`               | -      | -    |
| `sorter`   | 排序方式         | `'SORT_BY_TIME'`                   | -      | -    |
| `styles`   | 语义化结构 style | `Record<'list' \| 'item', React.CSSProperties>` | - | -    |
| `classNames` | 语义化结构 className | `Record<'list' \| 'item', string>` | - | -    |
### Conversation
| 属性      | 说明           | 类型               | 默认值 | 版本 |
|-----------|----------------|--------------------|--------|------|
| `key`     | 唯一标识       | `string`           | -      | -    |
| `label`   | 会话名称       | `string`           | -      | -    |
| `timestamp` | 会话时间戳   | `number`           | -      | -    |
| `pinned`   | 是否固定于顶部 | `boolean`          | -      | -    |

## Semantic DOM


## 主题变量（Design Token）

<ComponentTokenTable component="Conversations"></ComponentTokenTable>

