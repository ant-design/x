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
<code src="./demo/files.tsx">File Card</code>
<code src="./demo/files-custom.tsx">Custom File Card</code>

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

### Attachments.FileCard Props

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | The prefix of the style class name | string | - | - |
| className | Style class name | string | - | - |
| style | Style Object | React.CSSProperties | - | - |
| item | Attachment, same as Upload `UploadFile` | Attachment | - | - |
| onRemove | A callback function, will be executed when removing file button is clicked, remove event will be prevented when the return value is false or a Promise which resolve(false) or reject | (item: Attachment) => boolean \| Promise | - | - |
| imageProps | Image config, same as [Image](https://ant.design/components/image) | ImageProps | - | - |
| fileIcons | Custom icons, colors, and file extensions for file cards. | { ext: string[]; color: string; icon: React.ReactElement; }[] | `PRESET_FILE_ICONS` | - |

Default value of `fileIcons` is `PRESET_FILE_ICONS`:

```ts
import {
  CloseCircleFilled,
  FileExcelFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled,
} from '@ant-design/icons';

const PRESET_FILE_ICONS: AttachmentFilesIcons = [
  {
    icon: <FileExcelFilled />,
    color: '#22b35e',
    ext: ['xlsx', 'xls'],
  },
  {
    icon: <FileImageFilled />,
    color: '#8c8c8c',
    ext: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'],
  },
  {
    icon: <FileMarkdownFilled />,
    color: '#8c8c8c',
    ext: ['md', 'mdx'],
  },
  {
    icon: <FilePdfFilled />,
    color: '#ff4d4f',
    ext: ['pdf'],
  },
  {
    icon: <FilePptFilled />,
    color: '#ff6e31',
    ext: ['ppt', 'pptx'],
  },
  {
    icon: <FileWordFilled />,
    color: '#1677ff',
    ext: ['doc', 'docx'],
  },
  {
    icon: <FileZipFilled />,
    color: '#fab714',
    ext: ['zip', 'rar', '7z', 'tar', 'gz'],
  },
  {
    icon: <VideoIcon />,
    color: '#ff4d4f',
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    icon: <AudioIcon />,
    color: '#8c8c8c',
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
];
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Attachments"></ComponentTokenTable>
