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
<!-- <code src="./demo/_test.tsx">测试</code> -->

<code src="./demo/basic.tsx">基本</code> <code src="./demo/variant-and-shape.tsx">变体与形状</code> <code src="./demo/sider-and-placement.tsx">边栏与位置</code> <code src="./demo/system.tsx">系统信息气泡</code> <code src="./demo/divider.tsx">分割线气泡</code> <code src="./demo/header.tsx">气泡头</code> <code src="./demo/footer.tsx">气泡尾</code> <code src="./demo/loading.tsx">加载中</code> <code src="./demo/animation.tsx">动画</code> <code src="./demo/stream.tsx">流式传输</code> <code src="./demo/custom-content.tsx">自定义渲染内容</code> <code src="./demo/markdown.tsx">渲染markdown内容</code> <code src="./demo/gpt-vis.tsx">使用 GPT-Vis 渲染图表</code> <code src="./demo/editable.tsx">可编辑气泡</code>

## 列表演示

<!-- prettier-ignore -->
<code src="./demo/list.tsx">气泡列表</code> 
<code src="./demo/list-scroll.tsx">滚动条控制</code>
<code src="./demo/semantic-list-custom.tsx">语义化自定义</code>
<code src="./demo/list-extra.tsx">列表扩展参数</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 | 
|------|------|------|--------|------| 
| placement | 气泡位置 | `start` \| `end` | `start` | - | 
| loading | 加载状态 | boolean | - | - | 
| loadingRender | 自定义加载内容渲染 | () => React.ReactNode | - | - | 
| content | 气泡内容 | [ContentType](#contenttype) | - | - | 
| contentRender | 自定义内容渲染 | (content: ContentType, info: InfoType ) => React.ReactNode | - | - | 
| editable | 是否可编辑 | boolean \| [EditableBubbleOption](#editablebubbleoption) | `false` | - | 
| typing | 打字动画效果 |  boolean \| [BubbleAnimationOption](#bubbleanimationoption) \| ((content: ContentType, info: InfoType) => boolean \| [BubbleAnimationOption](#bubbleanimationoption)) | `false` | - | 
| streaming | 是否为流式传输 | boolean | `false` | - | 
| variant | 气泡样式变体 | `filled` \| `outlined` \| `shadow` \| `borderless` | `filled` | - | 
| shape | 气泡形状 | `default` \| `round` \| `corner` | `default` | - | 
| footerPlacement | 底部插槽位置 | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | - | 
| header | 头部插槽 | [BubbleSlot](#bubbleslot) | - | - |
| footer | 底部插槽 | [BubbleSlot](#bubbleslot) | - | - |
| avatar | 头像插槽 | [BubbleSlot](#bubbleslot) | - | - |
| extra | 额外插槽 | [BubbleSlot](#bubbleslot) | - | - |
| onTyping | 动画执行回调 | (rendererContent: string, currentContent: string) => void | - | - | 
| onTypingComplete | 动画结束回调 | (content: string) => void | - | - |
| onEditing | 编辑态下内容变化时回调 | (content: string) => void | - | - |

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
type BubbleSlot<ContentType> =
  | React.ReactNode
  | ((content: ContentType, info: InfoType) => React.ReactNode);
```

#### EditableBubbleOption

```typescript
interface EditableBubbleOption {
  /**
   * @description 是否可编辑
   */
  editing?: boolean;
  /**
   * @description 确认按钮
   */
  okText?: React.ReactNode;
  /**
   * @description 取消按钮
   */
  cancelText?: React.ReactNode;
}
```

#### BubbleAnimationOption

```typescript
interface BubbleAnimationOption {
  /**
   * @description 动画效果类型，打字机，渐入
   * @default 'fade-in'
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description 内容步进单位，数组格式为随机区间
   * @default 6
   */
  step?: number | [number, number];
  /**
   * @description 动画触发间隔
   * @default 100
   */
  interval?: number;
  /**
   * @description 重新开始一段动画时是否保留文本的公共前缀
   * @default true
   */
  keepPrefix?: boolean;
}
```

#### streaming

`streaming` 用于通知 Bubble 当前的 `content` 是否属于流式输入的当处于流式传输模。当处于流式传输模式，无论是否启用 Bubble 输入动画，在 `streaming` 变为 `false` 之前，Bubble 不会因为把当前 `content` 全部输出完毕就触发 `onTypingComplete` 回调，只有当 `streaming` 变为 `false`，且 `content` 全部输出完毕后，Bubble 才会触发 `onTypingComplete` 回调。这样可以避免由于流式传输不稳定而导致多次触发 `onTypingComplete` 回调的问题，保证一次流式传输过程仅触发一次 `onTypingComplete`。

在[这个例子](#bubble-demo-stream)中，你可以尝试强制关闭流式标志，同时

- 若你启用了输入动画，进行 **慢速加载** 时，会因为流式传输的速度跟不上动画速度而导致多次触发 `onTypingComplete`。
- 若你关闭了输入动画，每一次的流式输入都会触发 `onTypingComplete`。

### Bubble.List

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 气泡数据列表，`key`，`role` 必填 ，当结合X SDK [`useXChat`](/x-sdks/use-x-chat-cn) 使用时可传入`status` 帮助 Bubble 对配置进行管理 | (([BubbleProps](#bubble) & [DividerBubbleProps](#bubbledivider)) & { key: string \| number, role: string , status: MessageStatus, extraInfo?: AnyObject})[] | - | - |
| autoScroll | 是否自动滚动 | boolean | `true` | - |
| role | 气泡角色默认配置 | [RoleType](#roletype) | - | - |

#### MessageStatus

```typescript
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

#### InfoType

配合 [`useXChat`](/x-sdks/use-x-chat-cn) 使用 ，`key` 可做为 `MessageId`，`extraInfo` 可作为自定义参数。

```typescript
type InfoType = {
  status?: MessageStatus;
  key?: string | number;
  extraInfo?: AnyObject;
};
```

#### RoleType

```typescript
export type RoleProps = Pick<
  BubbleProps<any>,
  | 'typing'
  | 'variant'
  | 'shape'
  | 'placement'
  | 'rootClassName'
  | 'classNames'
  | 'className'
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'header'
  | 'footer'
  | 'avatar'
  | 'extra'
  | 'editable'
  | 'onTyping'
  | 'onTypingComplete'
  | 'onEditConfirm'
  | 'onEditCancel'
>;
export type FuncRoleProps = (data: BubbleItemType) => RoleProps;

export type DividerRoleProps = Partial<DividerBubbleProps>;
export type FuncDividerRoleProps = (data: BubbleItemType) => DividerRoleProps;

export type RoleType = Partial<
  'ai' | 'system' | 'user', RoleProps | FuncRoleProps>
> & { divider: DividerRoleProps | FuncDividerRoleProps } & Record<
    string,
    RoleProps | FuncRoleProps
  >;
```

#### Bubble.List autoScroll

**Bubble.List** 滚动托管需要设置 `height`，否则无法滚动。

```tsx
<Bubble.List items={items} style={{ height: 500 }} autoScroll />
```

#### Bubble.List role 与自定义 Bubble

**Bubble.List** 的 `role` 和 `items` 两个属性都可以配置气泡，其中 `role` 的配置作为默认配置使用，可缺省。`item.role` 用于指明该条数据的气泡角色，会与 `Bubble.List.role` 进行匹配。`items` 本身也可配置气泡属性，优先级高于 `role` 的配置，最终的气泡配置为：`{ ...role[item.role], ...item }`。

特别说明，我们为 `role` 提供了四个默认字段，`ai`、`user`、`system`、`divider`。其中，`system`、`divider` 是保留字段，如果 `item.role` 赋值为它们俩之一，**Bubble.List** 会把这条气泡数据渲染为 **Bubble.System (role = 'system')** 或 **Bubble.Divider (role = 'divider')**。

因此，若你想自定义渲染系统消息或分割线时，应该使用其他的命名。

自定义渲染消息，可以参考[这个例子](#bubble-demo-list)中 reference 的渲染方式。

### Bubble.System

通用属性参考：[通用属性](/docs/react/common-props)

| 属性    | 说明         | 类型                                               | 默认值    | 版本 |
| ------- | ------------ | -------------------------------------------------- | --------- | ---- |
| content | 气泡内容     | [ContentType](#contenttype)                        | -         | -    |
| variant | 气泡样式变体 | `filled` \| `outlined` \| `shadow` \| `borderless` | `shadow`  | -    |
| shape   | 气泡形状     | `default` \| `round` \| `corner`                   | `default` | -    |

### Bubble.Divider

通用属性参考：[通用属性](/docs/react/common-props)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| content | 气泡内容，等效 Divider.children | [ContentType](#contenttype) | - | - |
| dividerProps | Divider 组件属性 | [Divider](https://ant.design/components/divider-cn) | - | - |

## Semantic DOM

### Bubble

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Bubble.System

<code src="./demo/_semantic-system.tsx" simplify="true"></code>

### Bubble.Divider

<code src="./demo/_semantic-divider.tsx" simplify="true"></code>

### Bubble.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
