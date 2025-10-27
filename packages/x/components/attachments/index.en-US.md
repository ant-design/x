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

The Attachments component is used in scenarios where a collection of attachment information needs to be displayed.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/placeholder.tsx">Placeholder</code>
<code src="./demo/overflow.tsx">Overflow</code>
<code src="./demo/with-sender.tsx">Combination</code>
<code src="./demo/select-files.tsx">Select Files by Type</code>

## API

Common props ref: [Common props](/docs/react/common-props).

### AttachmentsProps

Inherits antd [Upload](https://ant.design/components/upload) properties.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classNames | Custom class names, [see below](#semantic-dom) | Record<string, string> | - | - |
| disabled | Whether to disable | boolean | false | - |
| getDropContainer | Config the area where files can be dropped | () => HTMLElement | - | - |
| items | Attachment list, same as Upload `fileList` | Attachment[] | - | - |
| overflow | Behavior when the file list overflows | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | Placeholder information when there is no file | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | Root node className | string | - | - |
| styles | Custom style object, [see below](#semantic-dom) | Record<string, React.CSSProperties> | - | - |
| imageProps | Image config, same as antd [Image](https://ant.design/components/image) | ImageProps | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}



### AttachmentsRef

| Property      | Description            | Type                 | Version |
| ------------- | ---------------------- | -------------------- | ------- |
| nativeElement | Get the native node    | HTMLElement          | -       |
| fileNativeElement | Get the file upload native node    | HTMLElement          | -    |
| upload        | Manually upload a file | (file: File) => void | -       |
| select        | Manually select files | (options: { accept?: string; multiple?: boolean; }) => void | -    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Attachments"></ComponentTokenTable>
```
