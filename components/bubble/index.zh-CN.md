---
category: Components
group:
  title: 通用
  order: 0
title: Bubble
subtitle: 对话气泡
description: 用于聊天的气泡组件。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

常用于聊天的时候。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/avatar-and-placement.tsx">支持位置和头像</code>
<code src="./demo/header-and-footer.tsx">头和尾</code>
<code src="./demo/loading.tsx">加载中</code>
<code src="./demo/typing.tsx">打字效果</code>
<code src="./demo/custom-content.tsx">自定义渲染内容</code>
<code src="./demo/markdown.tsx">渲染markdown内容</code>
<code src="./demo/variant.tsx">变体</code>
<code src="./demo/shape.tsx">形状</code>
<code src="./demo/list.tsx">气泡列表</code>
<code src="./demo/semantic-list-custom.tsx">语义化自定义</code>
<code src="./demo/list-custom.tsx">自定义列表内容</code>
<code src="./demo/gpt-vis.tsx">使用 GPT-Vis 渲染图表</code>
<code src="./demo/reference.tsx">参考</code>
<code src="./demo/debug.tsx" debug>debug</code>
<code src="./demo/debug-list.tsx" debug>debug list</code>
<code src="./demo/onScroll.tsx">监听滚动</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| avatar | 展示头像 | React.ReactNode | - |  |
| classNames | 语义化结构 class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| content | 聊天内容 | ContentType | - |  |
| footer | 底部内容 | React.ReactNode \| (content: ContentType ,info: { key?: string \| number }) => React.ReactNode | - |  |
| header | 头部内容 | React.ReactNode \| (content: ContentType, info: { key?: string \| number }) => React.ReactNode | - |  |
| loading | 聊天内容加载状态 | boolean | - |  |
| placement | 信息位置 | `start` \| `end` | `start` |  |
| shape | 气泡形状 | `round` \| `corner` | - |  |
| styles | 语义化结构 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| typing | 设置聊天内容打字动画 | boolean \| { step?: number, interval?: number } | false |  |
| variant | 气泡样式变体 | `filled` \| `borderless` \| `outlined` \| `shadow` | `filled` |  |
| loadingRender | 自定义渲染加载态内容 | () => ReactNode | - |  |
| messageRender | 自定义渲染内容 | <ContentType extends [BubbleContentType](https://github.com/ant-design/x/blob/fc7a000f5ee0c3c75def63d2e47a328486b66465/components/bubble/interface.ts#L21) = string>(content?: ContentType) => ReactNode | - |  |
| onTypingComplete | 打字效果完成时的回调，如果没有设置 typing 将在渲染时立刻触发 | () => void | - |  |
| references | 引用源链接数组（包含标题、URL 和可选描述）；渲染信息图标以触发悬浮提示，并通过模态框列表展示。 | [聊天引用](#聊天引用)[] | - | |

#### ContentType

默认类型

```typescript
type ContentType = React.ReactNode | AnyObject | string | number;
```

自定义类型使用

```tsx
type CustomContentType = {
  ...
}

<Bubble<CustomContentType> {...props} />
```

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoScroll | 当内容更新时，自动滚动到最新位置。如果用户滚动，则会暂停自动滚动。 | boolean | true |  |
| items | 气泡数据列表 | (BubbleProps & { key?: string \| number, role?: string })[] | - |  |
| roles | 设置气泡默认属性，`items` 中的 `role` 会进行自动对应 | Record<string, BubbleProps> \| (bubble, index) => BubbleProps | - |  |
| onScroll | 监听 `Bubble.List` 滚动 | (e: React.UIEvent<HTMLDivElement, UIEvent>) => void | - | 1.5.0 |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 聊天引用

`Bubble` 的引用链接数据。通过 `references` 属性传入该接口数组，可启用信息图标触发 Popover，并通过 Modal 列表展示引用。

```typescript
export interface ChatReference {
  description?: string;
  title: string;
  url: string;
}
```

## 主题变量（Design Token）

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
