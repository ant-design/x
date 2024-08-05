---
category: Components
group: 数据展示
title: Prompts
subtitle: 提示集
description: 用于显示一组与当前上下文相关的预定义的问题或建议。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用

Prompts 组件用于显示一组与当前上下文相关的预定义的问题或建议。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/disabled.tsx">不可用状态</code>
<code src="./demo/onclick.tsx">点击事件</code>
<code src="./demo/flex-vertical.tsx">纵向展示</code>
<code src="./demo/flex-wrap.tsx">可换行</code>
<code src="./demo/with-scroll.tsx">横向滚动</code>
## API

通用属性参考：[通用属性](/docs/react/common-props)

### PromptsProps
| 属性            | 说明                           | 类型                                                      | 默认值 | 版本 |
|-----------------|------------------------------|----------------------------------------------------------|-------|------|
| `data`          | 包含多个提示项的列表。                 | `PromptProps[]`                                          | -     | -    |
| `title`         | 显示在提示列表顶部的标题。               | `React.ReactNode`                                        | -     | -    |
| `onClick`       | 提示项被点击时的回调函数。              | `(params: { item: PromptProps; domEvent: React.MouseEvent<HTMLElement, MouseEvent>; }) => void` | -     | -    |
| `flex`          | 配置提示列表的弹性布局，类似于 antd 的 Flex 组件。 | `Omit<FlexProps, 'children'>`                            | -     | -    |
| `styles`        | 自定义样式，用于各个提示项的不同部分。      | `Record<'item' \| 'icon' \| 'label' \| 'desc' \| 'title', React.CSSProperties>` | -     | -    |
| `classNames`    | 自定义样式类名，用于各个提示项的不同部分。  | `Record<'item' \| 'icon' \| 'label' \| 'desc' \| 'title', string>`            | -     | -    |
| `prefixCls`     | 样式类名的前缀。                       | `string`                                                 | -     | -    |
| `rootClassName` | 根节点的样式类名。                     | `string`                                                 | -     | -    |

### PromptsProps
| 属性            | 说明                           | 类型                                                      | 默认值 | 版本 |
|-----------------|------------------------------|----------------------------------------------------------|-------|------|
| `key`           | 唯一标识用于区分每个提示项。         | `string`                                                 | -     | -    |
| `icon`          | 提示图标显示在提示项的左侧。           | `React.ReactNode`                                        | -     | -    |
| `label`         | 提示标签显示提示的主要内容。           | `React.ReactNode`                                        | -     | -    |
| `description`   | 提示描述提供额外的信息。               | `React.ReactNode`                                        | -     | -    |
| `disabled`      | 设置为 `true` 时禁用点击事件。          | `boolean`                                                | `false` | -    |

## Semantic DOM

## 主题变量（Design Token）

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
