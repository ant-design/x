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
<code src="./demo/agent.tsx">智能体输入</code>
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/switch.tsx">功能开关</code>
<code src="./demo/slot-filling.tsx">词槽模式</code>
<code src="./demo/submitType.tsx">提交方式</code>
<code src="./demo/speech.tsx">语音输入</code>
<code src="./demo/speech-custom.tsx">自定义语音输入</code>
<code src="./demo/suffix.tsx">自定义按钮</code>
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
| allowSpeech | 是否允许语音输入 | boolean \| SpeechConfig | false | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| components | 自定义组件 | Record<'input', ComponentType> | - | - |
| defaultValue | 输入框默认值 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| loading | 是否加载中 | boolean | false | - |
| suffix | 后缀内容，默认展示操作按钮，当不需要默认操作按钮时，可以设为 `suffix={false}` | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | oriNode | - |
| header | 头部面板 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| prefix | 前缀内容 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| footer | 底部内容 | React.ReactNode \| false \|(oriNode: React.ReactNode,info: { components: ActionsComponents;}) => React.ReactNode \| false; | false | - |
| readOnly | 是否让输入框只读 | boolean | false | - |
| rootClassName | 根元素样式类 | string | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| submitType | 提交模式 | SubmitType | `enter` \| `shiftEnter` | - |
| value | 输入框值 | string | - | - |
| onSubmit | 点击发送按钮的回调 | (message: string, slotConfig?: SlotConfigType[]) => void | - | - |
| onChange | 输入框值改变的回调 | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig?: SlotConfigType[]) => void | - | - |
| onCancel | 点击取消按钮的回调 | () => void | - | - |
| onPasteFile | 黏贴文件的回调 | (firstFile: File, files: FileList) => void | - | - |
| autoSize | 自适应内容高度，可设置为 true \| false 或对象：{ minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | 词槽配置，配置后输入框将变为词槽模式，支持结构化输入 | SlotConfigType[] | - | - |

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

### Sender Ref

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| nativeElement | 外层容器 | `HTMLDivElement` | - | - |
| focus | 获取焦点 | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | - | - |
| blur | 取消焦点 | () => void | - | - |
| insert | 插入文本内容到末尾 | (value: string) => void | - | - |
| clear | 清空内容 | () => void | - | - |
| getValue | 获取当前内容和结构化配置 | () => { value: string; config: SlotConfigType[] } | - | - |

#### SlotConfigType

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| type | 节点类型，决定渲染组件类型，必填 | 'text' \| 'input' \| 'select' \| 'tag' \| 'custom' | - | - |
| key | 唯一标识，type 为 text 时可省略 | string | - | - |
| formatResult | 格式化最终结果 | (value: any) => string | - | - |

##### text 节点属性

| 属性 | 说明     | 类型   | 默认值 | 版本 |
| ---- | -------- | ------ | ------ | ---- |
| text | 文本内容 | string | -      | -    |

##### input 节点属性

| 属性               | 说明   | 类型                                  | 默认值 | 版本 |
| ------------------ | ------ | ------------------------------------- | ------ | ---- |
| props.placeholder  | 占位符 | string                                | -      | -    |
| props.defaultValue | 默认值 | string \| number \| readonly string[] | -      | -    |

##### select 节点属性

| 属性               | 说明           | 类型     | 默认值 | 版本 |
| ------------------ | -------------- | -------- | ------ | ---- |
| props.options      | 选项数组，必填 | string[] | -      | -    |
| props.placeholder  | 占位符         | string   | -      | -    |
| props.defaultValue | 默认值         | string   | -      | -    |

##### tag 节点属性

| 属性        | 说明           | 类型      | 默认值 | 版本 |
| ----------- | -------------- | --------- | ------ | ---- |
| props.label | 标签内容，必填 | ReactNode | -      | -    |
| props.value | 标签值         | string    | -      | -    |

##### custom 节点属性

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| props.defaultValue | 默认值 | any | - | - |
| customRender | 自定义渲染函数 | (value: any, onChange: (value: any) => void, item: SlotConfigType) => React.ReactNode | - | - |

### Sender.Header

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 面板内容 | ReactNode | - | - |
| classNames | 样式类名 | [见下](#semantic-dom) | - | - |
| closable | 是否可关闭 | boolean | true | - |
| forceRender | 强制渲染，在初始化便需要 ref 内部元素时使用 | boolean | false | - |
| open | 是否展开 | boolean | - | - |
| styles | 语义化定义样式 | [见下](#semantic-dom) | - | - |
| title | 标题 | ReactNode | - | - |
| onOpenChange | 展开状态改变的回调 | (open: boolean) => void | - | - |

### Sender.Switch

| 属性              | 说明             | 类型                       | 默认值 | 版本 |
| ----------------- | ---------------- | -------------------------- | ------ | ---- |
| children          | 通用内容         | ReactNode                  | -      | -    |
| checkedChildren   | 选中时的内容     | ReactNode                  | -      |
| unCheckedChildren | 非选中时的内容   | ReactNode                  | -      |
| icon              | 设置图标组件     | ReactNode                  | -      |
| disabled          | 是否禁用         | boolean                    | false  | -    |
| loading           | 加载中的开关     | boolean                    | -      | -    |
| value             | 开关的值         | boolean                    | false  | -    |
| onChange          | 变化时的回调函数 | function(checked: boolean) | -      | -    |
| rootClassName     | 根元素样式类     | string                     | -      | -    |

### ⚠️ 词槽模式注意事项

- **词槽模式下，`value` 属性无效**，请使用 `ref` 及回调事件获取输入框的值和词槽配置。
- **词槽模式下，`onChange`/`onSubmit` 回调的第三个参数 `config`**，仅用于获取当前结构化内容，不建议直接将其赋值回 `slotConfig`，否则会导致输入框内容被重置。
- `slotConfig` 只在初始化或结构变化时设置一次即可.

**示例：**

```jsx
// ❌ 错误用法（会导致光标位置丢失及重复渲染 */
<Sender
  slotConfig={config}
  onChange={(value, e, config) => {
    setConfig(config);
  }}
/>

// ✅ 正确用法
<Sender
  slotConfig={config}
  onChange={(value, _e, config) => {
    // 仅用于获取结构化内容
    console.log(value, config);
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Sender"></ComponentTokenTable>
