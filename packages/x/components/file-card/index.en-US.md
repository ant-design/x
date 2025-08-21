---
category: FileCard
group:
  title: Feedback
  order: 4
title: FileCard
description: Display files in the form of cards.
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pJrtTaf-bWAAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*6ySvTqb7XhkAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

Used to display files during conversations or input.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/image.tsx">Image</code>
<code src="./demo/audio.tsx">Audio/Video</code>
<code src="./demo/mask.tsx">Mask</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/list.tsx">List</code>
<code src="./demo/overflow.tsx">Overflow</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ThinkProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| name | File name | string | - | - |
| byte | File size | number \| string | - | - |
| description | File description | ReactNode | - | - |
| type | File type | 'file' \| 'image' \| 'audio' \| 'video' | - | - |
| src | link of image or file | string | - | - |
| mask | Custom mask | ReactNode | - | - |
| icon | Custom icon | React.ReactNode \| PresetIcons | - | - |
| onClick | Callback when click | () => void | - | - |
| size | Show card size | 'small' \| 'default' | default | - |

```typescript
type PresetIcons =
  | 'default'
  | 'excel'
  | 'image'
  | 'markdown'
  | 'pdf'
  | 'ppt'
  | 'word'
  | 'zip'
  | 'video'
  | 'audio'
  | 'java'
  | 'javascript'
  | 'python';
```

### FileCard.List

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | File lists | FileCardProps[] | - | - |
| size | Card size | 'small' \| 'default' | default | - |
| removable | Can be removed | boolean \| ((item: FileCardProps) => boolean) | false | - |
| onRemove | Callback when remove | (item: FileCardProps, list?: FileCardProps[]) => void | - | - |
| extension | Show extension | React.ReactNode | - | - |
| overflow | Style when overflow | 'scrollX' \| 'scrollY' \| 'wrap' | wrap | - |

## Semantic DOM

### FileCard

<code src="./demo/_semantic.tsx" simplify="true"></code>

### FileCard.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="FileCard"></ComponentTokenTable>
