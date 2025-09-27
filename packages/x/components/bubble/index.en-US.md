---
category: Components
group:
  title: Common
  order: 0
title: Bubble
description: A bubble component for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Often used in chat scenarios.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/variant-and-shape.tsx">Variants and Shapes</code>
<code src="./demo/sider-and-placement.tsx">Sidebar and Placement</code>
<code src="./demo/header.tsx">Bubble Header</code>
<code src="./demo/footer.tsx">Bubble Footer</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/animation.tsx">Animation</code>
<code src="./demo/stream.tsx">Streaming</code>
<code src="./demo/custom-content.tsx">Custom Rendered Content</code>
<code src="./demo/markdown.tsx">Render Markdown Content</code>
<code src="./demo/editable.tsx">Editable Bubble</code>
<code src="./demo/gpt-vis.tsx">Render Charts Using GPT-Vis</code>

## Bubble.List Examples

<code src="./demo/list.tsx">Bubble List</code> <code src="./demo/list-ref.tsx">Bubble List Ref</code> <code src="./demo/semantic-list-custom.tsx">Semantic Customization</code> <code src="./demo/list-extra.tsx">List extra</code>

## API

Common Props Reference: [Common Props](/docs/react/common-props)

### Bubble

<!-- prettier-ignore -->
| Attribute | Description | Type | Default | Version |
|------|------|------|--------|------|
| placement | Bubble position | `start` \| `end` | `start` | - |
| loading | Loading state | boolean | - | - |
| loadingRender | Custom loading content renderer | () => React.ReactNode | - | - |
| content | Bubble content | [ContentType](#contenttype) | - | - |
| contentRender | Custom content renderer | (content: ContentType, info: InfoType ) => React.ReactNode | - | - |
| editable | Editable | boolean \| [EditableBubbleOption](#editablebubbleoption) | `false` | - |
| typing | Typing animation effect | boolean \| [BubbleAnimationOption](#bubbleanimationoption) \| ((content: ContentType, info: InfoType) => boolean \| [BubbleAnimationOption](#bubbleanimationoption)) | `false` | - |
| streaming | Streaming mode | boolean | `false` | - |
| variant | Bubble style variant | `filled` \| `outlined` \| `shadow` \| `borderless` | `filled` | - |
| shape | Bubble shape | `default` \| `round` \| `corner` | `default` | - |
| footerPlacement | Footer slot position | `outer-start` \| `outer-end` \| `inner-start` \| `inner-end` | `outer-start` | - |
| components | Slot configuration | { header?: [BubbleSlot](#bubbleslot); footer?: BubbleSlot; avatar?: BubbleSlot; extra?: BubbleSlot; } | - | - |
| onTyping | Typing animation callback | (rendererContent: string, currentContent: string) => void | - | - |
| onTypingComplete | Typing animation complete callback | (content: string) => void | - | - |
| onEditing | Callback when content changes in editing mode | (content: string) => void | - | - |

#### streaming

`streaming` notifies Bubble whether the current `content` is streaming input. In streaming mode, regardless of whether Bubble input animation is enabled, Bubble will not trigger the `onTypingComplete` callback until `streaming` becomes `false`, even if the current `content` is fully output. Only when `streaming` becomes `false` and the content is fully output will Bubble trigger `onTypingComplete`. This avoids multiple triggers due to unstable streaming and ensures only one trigger per streaming process.

In [this example](#bubble-demo-stream), you can try to force the streaming flag off:

- If you enable input animation and perform **slow loading**, multiple triggers of `onTypingComplete` may occur because streaming speed cannot keep up with animation speed.
- If you disable input animation, each streaming input will trigger `onTypingComplete`.

### Bubble.List Component API

| Attribute | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | Bubble data list, `key` and `role` required. When used with X SDK [`useXChat`](/sdks/use-x-chat), you can pass `status` to help Bubble manage configuration | (BubbleProps & { key: string \| number, role: string , status: MessageStatus, extra?: AnyObject })[] | - | - |
| autoScroll | Auto-scroll | boolean | `true` | - |
| role | Role default configuration | [RoleType](#roletype) | - | - |

#### ContentType

Default type

```typescript
type ContentType = React.ReactNode | AnyObject | string | number;
```

Custom type usage

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

#### MessageStatus

```typescript
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

#### InfoType

When used in conjunction with [`useXChat`](/sdks/use-x-chat), `key` can be used as `MessageId`,and `extra` can be used as a custom parameter.

```typescript
type InfoType = {
  status?: MessageStatus;
  key?: string | number;
  extra?: AnyObject;
};
```

#### EditableBubbleOption

```typescript
interface EditableBubbleOption {
  /**
   * @description Whether editable
   */
  editing?: boolean;
  /**
   * @description OK button
   */
  okText?: React.ReactNode;
  /**
   * @description Cancel button
   */
  cancelText?: React.ReactNode;
}
```

#### BubbleAnimationOption

```typescript
interface BubbleAnimationOption {
  /**
   * @description Animation effect type, typewriter, fade-in
   * @default 'fade-in'
   */
  effect: 'typing' | 'fade-in';
  /**
   * @description Content step unit, array format for random interval
   * @default 6
   */
  step?: number | [number, number];
  /**
   * @description Animation trigger interval
   * @default 100
   */
  interval?: number;
  /**
   * @description Whether to keep the common prefix when restarting animation
   * @default true
   */
  keepPrefix?: boolean;
  /**
   * @description Suffix UI for typewriter effect
   * @default undefined
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
  | 'styles'
  | 'style'
  | 'loading'
  | 'loadingRender'
  | 'contentRender'
  | 'footerPlacement'
  | 'components'
> & { key: string | number; role: string };

export type FuncRoleProps = (data: BubbleItemType) => RoleProps;

export type RoleType = Partial<Record<'ai' | 'system' | 'user', RoleProps | FuncRoleProps>> &
  Record<string, RoleProps | FuncRoleProps>;
```

#### Bubble.List autoScroll Top Alignment

**Bubble.List** auto-scroll is a simple reverse sorting scheme. In a fixed-height **Bubble.List**, if the message content is insufficient to fill the height, the content is bottom-aligned. It is recommended not to set a fixed height for **Bubble.List**, but to set a fixed height for its parent container and use flex layout (`display: flex` and `flex-direction: column`). This way, **Bubble.List** adapts its height and aligns content to the top when content is sparse, as shown in the [Bubble List demo](#bubble-demo-list).

```tsx
<div style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
  <Bubble.List items={items} autoScroll />
</div>
```

If you do not want to use flex layout, you can set `max-height` for **Bubble.List**. When content is sparse, the height adapts and aligns to the top.

```tsx
<Bubble.List items={items} autoScroll style={{ maxHeight: 600 }} />
```

## Semantic DOM

### Bubble

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Bubble.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Bubble"></ComponentTokenTable>
