---
category: Components
group:
  title: 表达
  order: 2
title: Sender
subtitle: 输入框
description: 用于聊天的输入框组件。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 需要构建一个对话场景下的输入框

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/submitType.tsx">提交模式</code>
<code src="./demo/speech.tsx">语音输入</code>
<code src="./demo/speech-custom.tsx">自定义语音输入</code>
<code src="./demo/actions.tsx">自定义按钮</code>
<code src="./demo/header.tsx">展开面板</code>
<code src="./demo/header-fixed.tsx">引用</code>
<code src="./demo/footer.tsx">自定义底部内容</code>
<code src="./demo/send-style.tsx">调整样式</code>
<code src="./demo/paste-image.tsx">黏贴文件</code>
<code src="./demo/focus.tsx">聚焦</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### SenderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 自定义按钮 | ReactNode \| (oriNode, info: { components }) => ReactNode | - | - |
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record<'input', ComponentType> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否加载中 | boolean | false | - |
| header | 头部面板 | ReactNode | - | - |
| prefix | 前缀内容 | ReactNode | - | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | SubmitType | `enter` \| `shiftEnter` | - |
| value | 输入框值 | string | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string) => void | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`> ) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |
| onPasteFile | 黏贴文件的回调 | (firstFile: File, files: FileList) => void | - | - |

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

#### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| focus | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | - | - |
| blur | 取消焦点 | () => void | - | - |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | ReactNode | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| title | 标题 | ReactNode | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Sender"></ComponentTokenTable>
