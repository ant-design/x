---
category: FileCard
group:
  title: Feedback
  order: 0
title: Think
description: Display files in the form of cards.
demo:
  cols: 1
---

## When To Use

Used to display files during conversations or input.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/image.tsx">Image</code>
<code src="./demo/audio.tsx">Audio/Video</code>
<code src="./demo/mask.tsx">Mask</code>
<code src="./demo/icon.tsx">Icon</code>
<code src="./demo/list.tsx">List</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### ThinkProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | DOM class | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | DOM style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| name | File name | string | - | - |
| size | File size | number \| string | - | - |
| description | File description | ReactNode | - | - |
| type | File type | 'file' \| 'image' \| 'audio' \| 'video' | - | - |
| src | link of image or file | string | - | - |
| mask | Custom mask | ReactNode | - | - |
| icon | Custom icon | React.ReactNode \| PresetIcons | - | - |
| onClick | Callback when click | () => void | - | - |

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
  | 'audio';
```

### FileCardListProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | File lists | FileCardProps[] | - | - |
| size | Card size | 'small' \| 'default' | - | - |
| removable | Can be removed | boolean \| ((item: FileCardProps) => boolean) | false | - |
| onRemove | Callback when remove | (item: FileCardProps, list?: FileCardProps[]) => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="FileCard"></ComponentTokenTable>
