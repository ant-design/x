---
category: Components
group:
  title: Express
  order: 2
title: Attachments
description: Display the collection of attachment information.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5l2oSKBXatAAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*N8QHQJhgfbEAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

The Attachments component is used in scenarios where a set of attachment information needs to be displayed.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/placeholder.tsx">Placeholder</code>
<code src="./demo/overflow.tsx">Overflow</code>
<code src="./demo/with-sender.tsx">Combination</code>

## API

### AttachmentsProps

For more properties, see [Upload](https://ant.design/components/upload).

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom class names, [see below](#semantic-dom) | Record<string, string> | - | - |
| disabled | Whether to disable | boolean | false | - |
| getDropContainer | Config the area where files can be dropped | () => HTMLElement | - | - |
| items | Attachment list, same as Upload `fileList` | Attachment[] | - | - |
| overflow | Behavior when the file list overflows | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | Placeholder information when there is no file | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | Root node className | React.CSSProperties | - | - |
| rootStyle | Root node style object | React.CSSProperties | - | - |
| styles | Custom style object, [see below](#semantic-dom) | Record<string, React.CSSProperties> | - | - |
| imageProps | Image config, same as [Image](https://ant.design/components/image) | ImageProps | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}
```

### Attachment

```ts
interface Attachment extends UploadFile {
  type?: 'image' | 'file' | 'other';
  previewText?: React.ReactNode;
}
```

### AttachmentsRef

| Property      | Description            | Type                 | Version |
| ------------- | ---------------------- | -------------------- | ------- |
| nativeElement | Get the native node    | HTMLElement          | -       |
| upload        | Manually upload a file | (file: File) => void | -       |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Attachments"></ComponentTokenTable>
