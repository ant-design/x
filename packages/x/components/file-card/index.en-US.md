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
tag: 2.0.0
demo:
  cols: 2
---

## When To Use

- Used to display files during conversations or input.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/image.tsx">Image</code>
<code src="./demo/image-loading.tsx">Image Load</code>
<code src="./demo/audio.tsx">Audio/Video</code>
<code src="./demo/mask.tsx">Mask</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/list.tsx">List</code>
<code src="./demo/overflow.tsx">Overflow</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### FileCardProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| name | File name | string | - | - |
| byte | File size (bytes) | number | - | - |
| size | Card size | 'small' \| 'default' | 'default' | - |
| description | File description | React.ReactNode | - | - |
| loading | Loading state | boolean | false | - |
| type | File type | 'file' \| 'image' \| 'audio' \| 'video' \| string | - | - |
| src | Image or file URL | string | - | - |
| mask | Mask content, image preview. This configuration is not effective. Please refer to the imageProps property | React.ReactNode | - | - |
| icon | Custom icon | React.ReactNode \| PresetIcons | - | - |
| imageProps | Image props configuration | [Image](https://ant.design/components/image-cn#api) | - | - |
| videoProps | Video props configuration | Partial<React.JSX.IntrinsicElements['video']> | - | - |
| audioProps | Audio props configuration | Partial<React.JSX.IntrinsicElements['audio']> | - | - |
| spinProps | Loading animation props configuration | [SpinProps](https://ant.design/components/spin-cn#api) & { showText?: boolean; icon?: React.ReactNode } | - | - |
| onClick | Click event callback | () => void | - | - |

### PresetIcons

Preset icon types, supports the following values:

```typescript
type PresetIcons =
  | 'default' // Default file icon
  | 'excel' // Excel file icon
  | 'image' // Image file icon
  | 'markdown' // Markdown file icon
  | 'pdf' // PDF file icon
  | 'ppt' // PowerPoint file icon
  | 'word' // Word file icon
  | 'zip' // Archive file icon
  | 'video' // Video file icon
  | 'audio' // Audio file icon
  | 'java' // Java file icon
  | 'javascript' // JavaScript file icon
  | 'python'; // Python file icon
```

### FileCard.List

File list component for displaying multiple file cards.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | File list data | FileCardProps[] | - | - |
| size | Card size | 'small' \| 'default' | 'default' | - |
| removable | Whether removable | boolean \| ((item: FileCardProps) => boolean) | false | - |
| onRemove | Remove event callback | (item: FileCardProps) => void | - | - |
| extension | Extension content | React.ReactNode | - | - |
| overflow | Overflow display style | 'scrollX' \| 'scrollY' \| 'wrap' | 'wrap' | - |

## Semantic DOM

### FileCard

<code src="./demo/_semantic.tsx" simplify="true"></code>

### FileCard.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="FileCard"></ComponentTokenTable>
