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
<code src="./demo/variant-and-shape.tsx">变体与形状</code>
<code src="./demo/sider-and-placement.tsx">边栏与位置</code>
<code src="./demo/header.tsx">气泡头</code>
<code src="./demo/footer.tsx">气泡尾</code>
<code src="./demo/loading.tsx">加载中</code>
<code src="./demo/animation.tsx">动画</code>
<code src="./demo/stream.tsx">流式传输</code>
<code src="./demo/custom-content.tsx">自定义渲染内容</code>
<code src="./demo/markdown.tsx">渲染markdown内容</code>
<code src="./demo/editable.tsx">可编辑气泡</code>
<code src="./demo/list.tsx">气泡列表</code>
<code src="./demo/list-ref.tsx">气泡列表 Ref</code>
<code src="./demo/semantic-list-custom.tsx">语义化自定义</code>
<code src="./demo/gpt-vis.tsx">使用 GPT-Vis 渲染图表</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 | 
|------|------|------|--------|------| 
| prefixCls | 自定义类名前缀 | string | - | - | 
| rootStyle | 根节点样式 | React.CSSProperties | - | - | 
| styles | 语义化结构 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| rootClassName | 根节点类名 | string | - | - | 
| classNames | 语义化结构 class | [Record<SemanticDOM, string>](#semantic-dom) | - |  |
| placement | 气泡位置 | `start` \| `end` | `start` | - | 
| loading | 加载状态 | boolean | - | - | 
| loadingRender | 自定义加载内容渲染 | () => React.ReactNode | - | - | 
| content | 气泡内容 | [ContentType](#contenttype) | - | - | 
| contentRender | 自定义内容渲染 | (content: ContentType) => React.ReactNode | - | - | 
| editable | 是否可编辑 | boolean | `false` | - | 
| typing | 打字动画效果 | boolean \| [BubbleAnimationOption](#bubbleanimationoption) | `false` | - | 
| streaming | 是否为流式传输 | boolean | `false` | - | 
| variant | 气泡样式变体 | `filled` \| `outlined` \| `shadow` \| `borderless` | `filled` | - | 
| shape | 气泡形状 | `default` \| `round` \| `corner` | `default` | - | 
| footerPlacement | 底部插槽位置 | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | - | 
| components | 扩展槽位配置 | { header?: [BubbleSlot](#bubbleslot); footer?: BubbleSlot; avatar?: BubbleSlot; extra?: BubbleSlot; } | - | - | 
| onTyping | 动画执行回调 | (rendererContent: string, currentContent: string) => void | - | - | 
| onTypingComplete | 动画结束回调 | (content: string) => void | - | - |
| onEditing | 编辑态下内容变化时回调 | (content: string) => void | - | - |

#### streaming

`streaming` 用于通知 Bubble 当前的 `content` 是否属于流式输入的当处于流式传输模。当处于流式传输模式，无论是否启用 Bubble 输入动画，在 `streaming` 变为 `false` 之前，Bubble 不会因为把当前 `content` 全部输出完毕就触发 `onTypingComplete` 回调，只有当 `streaming` 变为 `false`，且 `content` 全部输出完毕后，Bubble 才会触发 `onTypingComplete` 回调。这样可以避免由于流式传输不稳定而导致多次触发 `onTypingComplete` 回调的问题，保证一次流式传输过程仅触发一次 `onTypingComplete`。

在[这个例子](#bubble-demo-stream)中，你可以尝试强制关闭流式标志，同时

- 若你启用了输入动画，进行 **慢速加载** 时，会因为流式传输的速度跟不上动画速度而导致多次触发 `onTypingComplete`。
- 若你关闭了输入动画，每一次的流式输入都会触发 `onTypingComplete`。

### Bubble.List 组件 API

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefixCls | 自定义类名前缀 | string | - | - |
| rootClassName | 根节点类名 | string | - | - |
| rootStyle | 根节点样式 | React.CSSProperties | - | - |
| items | 气泡数据列表，`key`，`role` 必填 | (BubbleProps & { key: string \| number, role: string })[] | - | - |
| autoScroll | 是否自动滚动 | boolean | `true` | - |
| role | 角色默认配置 | [RoleType](#roletype) | - | - |

#### ContentType

默认类型

```typescript
type ContentType = React.ReactNode | AnyObject | string | number;
```

自定义类型使用

```tsx
type CustomContentType {
  ...
}

<Bubble<CustomContentType> {...props} />
```

#### BubbleSlot

```typescript
type BubbleSlot<ContentType> = React.ReactNode | ((content: ContentType) => React.ReactNode);
```

#### BubbleAnimationOption

```typescript
interface BubbleAnimationOption {
  /**
   * @description 动画效果类型，打字机，渐入
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description 内容步进单位，数组格式为随机区间
   */
  step?: number | [number, number];
  /**
   * @description 动画触发间隔
   */
  interval?: number;
  /**
   * @description 重新开始一段动画时是否保留文本的公共前缀
   */
  keepPrefix?: boolean;
  /**
   * @description 打字机效果下步进UI
   */
  suffix?: React.ReactNode;
}
```

#### RoleType

```typescript
type RoleProps = Pick<
  BubbleProps,
  | 'typing'
  | 'variant'
  | 'shape'
  | 'placement'
  | 'rootClassName'
  | 'classNames'
  | 'className'
  | 'rootStyle'
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'components'
> & { key: string | number; role: string };

export type FuncRoleProps = (data: BubbleData) => RoleProps;

export type RoleType = Partial<Record<'ai' | 'system' | 'user', RoleProps | FuncRoleProps>> &
  Record<string, RoleProps | FuncRoleProps>;
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
