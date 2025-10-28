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
---

## 何时使用

- 用于在对话或输入时展示文件。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/size.tsx">卡片大小</code>
<code src="./demo/image.tsx">图片文件</code>
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
| classNames | 样式类名 | [Record<SemanticDOM, string>](#semantic-dom) | - | - |
| styles | 样式 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - | - |
| name | 文件名称 | string | - | - |
| byte | 文件大小 | number \| string | - | - |
| description | 文件描述 | ReactNode | - | - |
| type | 文件类型 | 'file' \| 'image' \| 'audio' \| 'video' | - | - |
| src | 图片或文件地址 | string | - | - |
| mask | 遮罩 | ReactNode | - | - |
| icon | 自定义图标 | React.ReactNode \| PresetIcons | - | - |
| onClick | 点击事件 | () => void | - | - |
| size | 展示卡片大小 | 'small' \| 'default' | default | - |

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

| 属性       | 说明       | 类型                                                  | 默认值  | 版本 |
| ---------- | ---------- | ----------------------------------------------------- | ------- | ---- |
| classNames | 样式类名   | [Record<SemanticDOM, string>](#semantic-dom)          | -       | -    |
| styles     | 样式 style | [Record<SemanticDOM, CSSProperties>](#semantic-dom)   | -       | -    |
| items      | 文件列表   | FileCardProps[]                                       | -       | -    |
| size       | 卡片大小   | 'small' \| 'default'                                  | default | -    |
| removable  | 是否可删除 | boolean \| ((item: FileCardProps) => boolean)         | false   | -    |
| onRemove   | 删除事件   | (item: FileCardProps, list?: FileCardProps[]) => void | -       | -    |
| extension  | 扩展       | React.ReactNode                                       | -       | -    |
| overflow   | 超出展示   | 'scrollX' \| 'scrollY' \| 'wrap'                      | wrap    | -    |

## Semantic DOM

### FileCard

<code src="./demo/_semantic.tsx" simplify="true"></code>

### FileCard.List

<code src="./demo/_semantic-list.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="FileCard"></ComponentTokenTable>
