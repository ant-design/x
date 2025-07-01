---
category: Components
group:
  title: Express
  order: 2
title: Sender
description: A input component for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- Need to build an input box for a dialogue scenario

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/slot-filling.tsx">Slot Mode</code>
<code src="./demo/submitType.tsx">Submit type</code>
<code src="./demo/speech.tsx">Speech input</code>
<code src="./demo/speech-custom.tsx">Custom speech input</code>
<code src="./demo/actions.tsx">Custom actions</code>
<code src="./demo/header.tsx">Header panel</code>
<code src="./demo/header-fixed.tsx">Reference</code>
<code src="./demo/footer.tsx">Custom footer</code>
<code src="./demo/send-style.tsx">Adjust style</code>
<code src="./demo/paste-image.tsx">Paste files</code>
<code src="./demo/focus.tsx">Focus</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Custom actions,set as `actions: false` when you don't need default actions | ReactNode \| (oriNode, info: { components:ActionsComponents }) => ReactNode | - | - |
| allowSpeech | Whether to allow speech input | boolean \| SpeechConfig | false | - |
| classNames | Class name | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of input | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether it is loading | boolean | false | - |
| header | Header panel | ReactNode | - | - |
| prefix | Prefix content | ReactNode | - | - |
| footer | Footer content | ReactNode \| (info: { components: ActionsComponents }) => ReactNode | - | - |
| readOnly | Whether to make the input box read-only | boolean | false | - |
| rootClassName | Root element class name | string | - | - |
| styles | Semantic DOM style | [See below](#semantic-dom) | - | - |
| submitType | Submit type | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input value | string | - | - |
| onSubmit | Callback when click send button | (message: string, slotConfig?: SlotConfigType[]) => void | - | - |
| onChange | Callback when input value changes | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig?: SlotConfigType[]) => void | - | - |
| onCancel | Callback when click cancel button | () => void | - | - |
| onPasteFile | Callback when paste files | (firstFile: File, files: FileList) => void | - | - |
| autoSize | Height auto size feature, can be set to true \| false or an object { minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | Slot configuration, after configuration, the input box will become slot mode, supporting structured input | SlotConfigType[] | - | - |

```typescript | pure
type SpeechConfig = {
  // When setting `recording`, the built-in speech input function will be disabled.
  // It is up to the developer to implement the third-party speech input function.
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

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| nativeElement | Outer container | `HTMLDivElement` | - | - |
| focus | Set focus | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' }) | - | - |
| blur | Remove focus | () => void | - | - |
| insert | Insert text content to the end | (value: string) => void | - | - |
| clear | Clear content | () => void | - | - |
| getValue | Get current content and structured configuration | () => { value: string; config: SlotConfigType[] } | - | - |

#### SlotConfigType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Node type, determines the rendering component type, required | 'text' \| 'input' \| 'select' \| 'tag' \| 'custom' | - | - |
| key | Unique identifier, can be omitted when type is text | string | - | - |
| formatResult | Format final result | (value: any) => string | - | - |

##### text node properties

| Property | Description  | Type   | Default | Version |
| -------- | ------------ | ------ | ------- | ------- |
| text     | Text content | string | -       | -       |

##### input node properties

| Property           | Description   | Type                                  | Default | Version |
| ------------------ | ------------- | ------------------------------------- | ------- | ------- |
| props.placeholder  | Placeholder   | string                                | -       | -       |
| props.defaultValue | Default value | string \| number \| readonly string[] | -       | -       |

##### select node properties

| Property           | Description             | Type     | Default | Version |
| ------------------ | ----------------------- | -------- | ------- | ------- |
| props.options      | Options array, required | string[] | -       | -       |
| props.placeholder  | Placeholder             | string   | -       | -       |
| props.defaultValue | Default value           | string   | -       | -       |

##### tag node properties

| Property    | Description           | Type      | Default | Version |
| ----------- | --------------------- | --------- | ------- | ------- |
| props.label | Tag content, required | ReactNode | -       | -       |
| props.value | Tag value             | string    | -       | -       |

##### custom node properties

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| props.defaultValue | Default value | any | - | - |
| customRender | Custom render function | (value: any, onChange: (value: any) => void, item: SlotConfigType) => React.ReactNode | - | - |

### Sender.Header

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | ReactNode | - | - |
| closable | Whether to close | boolean | true | - |
| forceRender | Force render, use when need ref internal elements on init | boolean | false | - |
| open | Whether to expand | boolean | - | - |
| title | Title content | ReactNode | - | - |
| onOpenChange | Callback when the expansion state changes | (open: boolean) => void | - | - |

### ⚠️ Notes for Slot Mode

- **In slot mode, the `value` property is invalid**, please use `ref` and callback events to get the value and slotConfig.
- **In slot mode, the third parameter `config` of `onChange`/`onSubmit` callback** is only used to get the current structured content, it is not recommended to assign it back to `slotConfig` directly, otherwise it will cause the input box content to be reset. Only when you need to switch/reset the slot structure as a whole should you update `slotConfig`.
- Generally, slotConfig should only be set once during initialization or when the structure changes.

**Example:**

```jsx
// ❌ Wrong usage (will cause cursor position loss and repeated rendering)
<Sender
  slotConfig={config}
  onChange={(value, e, config) => {
    setConfig(config);
  }}
/>

// ✅ Correct usage
<Sender
  slotConfig={config}
  onChange={(value, e, config) => {
    // Only used to get structured content
    console.log(value, config);
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Sender"></ComponentTokenTable>
