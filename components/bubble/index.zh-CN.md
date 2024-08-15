---
category: Components
group: 数据展示
title: Bubble
subtitle: 聊天气泡
description: 用于聊天的气泡组件。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用

常用于聊天的时候。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/avatar-and-placement.tsx">支持位置和头像</code>
<code src="./demo/loading.tsx">加载中</code>
<code src="./demo/typing.tsx">打字效果</code>
<code src="./demo/markdown.tsx">自定义渲染</code>
<code src="./demo/list.tsx">气泡列表</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Bubble

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 展示头像 | React.ReactNode | - |  |
| classNames | 语义化结构 class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| styles | 语义化结构 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| placement | 信息位置 | `start` \| `end` | `start` |  |
| loading | 聊天内容加载状态 | boolean | - |  |
| typing | 设置聊天内容打字动画 | boolean \| { step?: number, interval?: number } | false |  |
| content | 聊天内容 | string | - |  |
| messageRender | 自定义渲染内容 | (content?: string) => ReactNode | - |  |

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoScroll | 当内容更新时，自动滚动到最新位置。如果用户滚动，则会暂停自动滚动。 | boolean | true |  |
| items | 气泡数据列表 | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | 设置气泡默认属性，`items` 中的 `role` 会进行自动对应 | Record<string, BubbleProps> \| (bubble) => BubbleProps | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
