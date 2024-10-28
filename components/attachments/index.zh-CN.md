---
category: Components
group:
  title: 用户界面
  order: 0
title: Attachment
subtitle: 附件
description: 用于展示一组附件信息集合。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*1ysXSqEnAckAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*EkYUTotf-eYAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

Attachment 组件用于需要展示一组附件信息集合的场景。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/placeholder.tsx">占位信息</code>
<code src="./demo/overflow.tsx">超出样式</code>
<code src="./demo/with-sender.tsx">组合示例</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)。

### AttachmentProps

继承 antd [Upload](https://ant.design/components/upload) 属性。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classNames | 自定义样式类名，[见下](#semantic-dom) | Record<string, string> | - | - |
| disabled | 是否禁用 | boolean | false | - |
| getDropContainer | 设置拖拽时，可以释放文件的区域 | () => HTMLElement | - | - |
| items | 附件列表，同 Upload `fileList` | Attachment[] | - | - |
| overflow | 文件列表超出时样式 | 'wrap' \| 'scrollX' \| 'scrollY' | - | - |
| placeholder | 没有文件时的占位信息 | PlaceholderType \| ((type: 'inline' \| 'drop') => PlaceholderType) | - | - |
| rootClassName | 根节点的样式类名 | string | - | - |
| rootStyle | 根节点的样式对象 | React.CSSProperties | - | - |
| styles | 自定义样式对象，[见下](#semantic-dom) | Record<string, React.CSSProperties> | - | - |

```tsx | pure
interface PlaceholderType {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
