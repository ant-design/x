---
category: FileCard
group:
  title: 反馈
  order: 4
title: FileCard
subtitle: 文件卡片
description: 用卡片的形式展示文件。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pJrtTaf-bWAAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*6ySvTqb7XhkAAAAAAAAAAAAADgCCAQ/original
tag: 2.0.0
demo:
  cols: 2
---

## 何时使用

- 用于在对话或输入时展示文件。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/size.tsx">卡片大小</code>
<code src="./demo/image.tsx">图片文件</code>
<code src="./demo/image-loading.tsx">图片加载</code>
<code src="./demo/audio.tsx">音视频类型</code>
<code src="./demo/mask.tsx">使用遮罩</code>
<code src="./demo/icon.tsx">自定义图标</code>
<code src="./demo/list.tsx">文件列表</code>
<code src="./demo/overflow.tsx">超出样式</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### FileCardProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 文件名称 | string | - | - |
| byte | 文件大小（字节） | number | - | - |
| size | 卡片大小 | 'small' \| 'default' | 'default' | - |
| description | 文件描述 | React.ReactNode | - | - |
| loading | 是否处于加载状态 | boolean | false | - |
| type | 文件类型 | 'file' \| 'image' \| 'audio' \| 'video' \| string | - | - |
| src | 图片或文件地址 | string | - | - |
| mask | 遮罩内容。对于 `type="image"`，可通过 `imageProps.preview.mask` 配置，此属性仅适用于非图像文件类型。 | React.ReactNode | - | - |
| icon | 自定义图标 | React.ReactNode \| PresetIcons | - | - |
| imageProps | 图片属性，同 antd [Image](https://ant.design/components/image-cn#api) 属性 | ImageProps | - | - |
| videoProps | 视频属性配置 | Partial<React.JSX.IntrinsicElements['video']> | - | - |
| audioProps | 音频属性配置 | Partial<React.JSX.IntrinsicElements['audio']> | - | - |
| spinProps | 加载中属性 | [SpinProps](https://ant.design/components/spin-cn#api) & { showText?: boolean; icon?: React.ReactNode } | - | - |
| onClick | 点击事件回调 | () => void | - | - |

### PresetIcons

预设图标类型，支持以下值：

```typescript
type PresetIcons =
  | 'default' // 默认文件图标
  | 'excel' // Excel 文件图标
  | 'image' // 图片文件图标
  | 'markdown' // Markdown 文件图标
  | 'pdf' // PDF 文件图标
  | 'ppt' // PowerPoint 文件图标
  | 'word' // Word 文件图标
  | 'zip' // 压缩文件图标
  | 'video' // 视频文件图标
  | 'audio' // 音频文件图标
  | 'java' // Java 文件图标
  | 'javascript' // JavaScript 文件图标
  | 'python'; // Python 文件图标
```

### FileCard.List

文件列表组件，用于展示多个文件卡片。

| 属性      | 说明         | 类型                                          | 默认值    | 版本 |
| --------- | ------------ | --------------------------------------------- | --------- | ---- |
| items     | 文件列表数据 | FileCardProps[]                               | -         | -    |
| size      | 卡片大小     | 'small' \| 'default'                          | 'default' | -    |
| removable | 是否可删除   | boolean \| ((item: FileCardProps) => boolean) | false     | -    |
| onRemove  | 删除事件回调 | (item: FileCardProps) => void                 | -         | -    |
| extension | 扩展内容     | React.ReactNode                               | -         | -    |
| overflow  | 超出展示方式 | 'scrollX' \| 'scrollY' \| 'wrap'              | 'wrap'    | -    |

## 语义化 DOM

### FileCard

<code src="./demo/_semantic.tsx" simplify="true"></code>

### FileCard.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="FileCard"></ComponentTokenTable>
