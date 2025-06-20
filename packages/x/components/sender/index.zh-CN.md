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
<code src="./demo/slot-filling.tsx">词槽输入</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### SenderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 自定义按钮，当不需要默认操作按钮时，可以设为 `actions={false}` | ReactNode \| (oriNode, info: { components: ActionsComponents }) => ReactNode | - | - |
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record<'input', ComponentType> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否加载中 | boolean | false | - |
| header | 头部面板 | ReactNode | - | - |
| prefix | 前缀内容 | ReactNode | - | - |
| footer | 底部内容 | ReactNode \| (info: { components: ActionsComponents }) => ReactNode | - | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | SubmitType | `enter` \| `shiftEnter` | - |
| value | 输入框值 | string | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string) => void | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`> ) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |
| onPasteFile | 黏贴文件的回调 | (firstFile: File, files: FileList) => void | - | - |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | 词槽配置，配置后输入框将变为词槽模式，支持结构化输入 | SlotNode[] | - | 2.0.0 |

```typescript | pure
type SpeechConfig = {
  // 当设置 `recording` 时，内置的语音输入功能将会被禁用。
  // 交由开发者实现三方语音输入的功能。
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

```typescript | pure
type ActionsComponents = {
  SendButton: React.ComponentType<ButtonProps>;
  ClearButton: React.ComponentType<ButtonProps>;
  LoadingButton: React.ComponentType<ButtonProps>;
  SpeechButton: React.ComponentType<ButtonProps>;
};
```

```typescript | pure
type SlotNode = {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom';
  key?: string; // 唯一标识，type为text时可省略
  text?: string; // type为text时的内容
  props?: { [key: string]: any }; // 词槽节点的属性，如 placeholder、options 等
  customRender?: (value: any, onChange: (value: any) => void) => React.ReactNode; // type为custom时自定义渲染
  formatResult?: (value: any) => string; // 格式化最终结果
};
```

##### SlotNode 通用属性

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 节点类型，决定渲染组件类型，必填 | 'text' \| 'input' \| 'select' \| 'tag' \| 'custom' | - | 2.0.0 |
| key | 唯一标识，type 为 text 时可省略 | string | - | 2.0.0 |
| defaultValue | 默认值，部分类型支持 | string | - | 2.0.0 |
| props | 组件属性，具体见下方各类型说明 | object | - | 2.0.0 |
| customRender | 自定义渲染函数，type 为 custom 时必填 | (value: any, onChange: (value: any) => void) => ReactNode | - | 2.0.0 |
| formatResult | 格式化最终结果 | (value: any) => string | - | 2.0.0 |

##### text 节点属性

| 属性 | 说明           | 类型   | 默认值 | 版本  |
| ---- | -------------- | ------ | ------ | ----- |
| text | 文本内容，必填 | string | -      | 2.0.0 |

##### input 节点属性

| 属性         | 说明   | 类型   | 默认值 | 版本  |
| ------------ | ------ | ------ | ------ | ----- |
| placeholder  | 占位符 | string | -      | 2.0.0 |
| defaultValue | 默认值 | string | -      | 2.0.0 |

##### select 节点属性

| 属性         | 说明           | 类型     | 默认值 | 版本  |
| ------------ | -------------- | -------- | ------ | ----- |
| options      | 选项数组，必填 | string[] | -      | 2.0.0 |
| placeholder  | 占位符         | string   | -      | 2.0.0 |
| defaultValue | 默认值         | string   | -      | 2.0.0 |

##### tag 节点属性

| 属性  | 说明           | 类型   | 默认值 | 版本  |
| ----- | -------------- | ------ | ------ | ----- |
| label | 标签文本，必填 | string | -      | 2.0.0 |
| value | 标签值         | string | -      | 2.0.0 |

##### custom 节点属性

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| customRender | 自定义渲染函数，注意需要绑定好 onChange 函数及 value 实现受控 | (value: any, onChange: (value: any) => void) => ReactNode | - | 2.0.0 |

#### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| focus | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | - | - |
| blur | 取消焦点 | () => void | - | - |
| insert | 插入文本内容到末尾 | (value: string) => void | - | 2.0.0 |
| clear | 清空内容 | () => void | - | 2.0.0 |
| getValue | 获取当前内容和结构化配置 | () => { value: string; config: SlotNode[] } | - | 2.0.0 |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | ReactNode | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| title | 标题 | ReactNode | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

#### ⚠️ 词槽模式注意事项

- **词槽模式下，不要绑定 `value` 属性**，否则会导致输入内容无法正常受控，slot 内部状态会被频繁重置。
- **词槽模式下，`onChange`/`onSubmit` 回调的第三个参数 `config`**，仅用于获取当前结构化内容，不建议直接将其赋值回 `slotConfig`，否则会导致输入框内容被重置。只有在需要整体切换/重置 slot 结构时，才应更新 `slotConfig`。
- 一般情况下，slotConfig 只在初始化或结构变化时设置一次即可。

**示例：**

```tsx
// 错误用法（会导致输入内容丢失）
<Sender
  slotConfig={config} // 不要直接用回调里的 config
  onChange={(value, e, config) => {
    setConfig(config); // ❌ 不建议
  }}
/>

// 正确用法
<Sender
  slotConfig={initConfig} // 只在初始化或结构变化时设置
  onChange={(value, e, config) => {
    // 仅用于获取结构化内容
    console.log(value, config);
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Sender"></ComponentTokenTable>
