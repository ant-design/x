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
<code src="./demo/agent.tsx">Agent Sender</code>
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/switch.tsx">Feature Switch</code>
<code src="./demo/slot-filling.tsx">Slot Mode</code>
<code src="./demo/ref-action.tsx">Instance Methods</code>
<code src="./demo/submitType.tsx">Submit Type</code>
<code src="./demo/speech.tsx">Speech Input</code>
<code src="./demo/speech-custom.tsx">Custom Speech Input</code>
<code src="./demo/suffix.tsx">Custom Suffix</code>
<code src="./demo/header.tsx">Expandable Panel</code>
<code src="./demo/slot-with-suggestion.tsx">Quick Commands</code>
<code src="./demo/header-fixed.tsx">Reference</code>
<code src="./demo/footer.tsx">Custom Footer</code>
<code src="./demo/send-style.tsx">Adjust Style</code>
<code src="./demo/paste-image.tsx">Paste Files</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowSpeech | Whether to allow speech input | boolean \| SpeechConfig | false | - |
| classNames | Class name | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of input | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether it is loading | boolean | false | - |
| suffix | Suffix content, shows action buttons by default. Set `suffix={false}` to hide default actions. | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | oriNode | - |
| header | Header panel | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| prefix | Prefix content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| footer | Footer content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| readOnly | Whether to make the input box read-only | boolean | false | - |
| rootClassName | Root element class name | string | - | - |
| styles | Semantic DOM style | [See below](#semantic-dom) | - | - |
| submitType | Submit type | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input value | string | - | - |
| onSubmit | Callback when click send button | (message: string, slotConfig?: SlotConfigType[]) => void | - | - |
| onChange | Callback when input value changes | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig?: SlotConfigType[]) => void | - | - |
| onCancel | Callback when click cancel button | () => void | - | - |
| onPasteFile | Callback when paste files | (files: FileList) => void | - | - |
| autoSize | Height auto size feature, can be set to true \| false or an object: { minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | Slot configuration, after configuration, the input box will become slot mode, supporting structured input. In this mode, `value` and `defaultValue` configuration will be invalid. | SlotConfigType[] | - | - |

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
| focus | Set focus, when `cursor = 'slot'` the focus will be in the first input slot, if no corresponding `input` exists it will behave like `end` | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' \| 'slot' }) | - | - |
| blur | Remove focus | () => void | - | - |
| insert | Insert text or slot(s). When using slot(s), make sure slotConfig is set. | (value: string) => void \| (slotConfig: SlotConfigType[], position?: insertPosition, replaceCharacters?: string) => void; | - | - |
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
| customRender | Custom render function | (value: any, onChange: (value: any) => void, props: { disabled?: boolean, readOnly?: boolean }, item: SlotConfigType) => React.ReactNode | - | - |

### Sender.Header

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | ReactNode | - | - |
| classNames | Class name | [See below](#semantic-dom) | - | - |
| closable | Whether the panel can be closed | boolean | true | - |
| forceRender | Force render, use when need ref internal elements on init | boolean | false | - |
| open | Whether to expand | boolean | - | - |
| styles | Semantic DOM style | [See below](#semantic-dom) | - | - |
| title | Title content | ReactNode | - | - |
| onOpenChange | Callback when the expansion state changes | (open: boolean) => void | - | - |

### Sender.Switch

| Property          | Description             | Type                       | Default | Version |
| ----------------- | ----------------------- | -------------------------- | ------- | ------- |
| children          | General content         | ReactNode                  | -       | -       |
| checkedChildren   | Content when checked    | ReactNode                  | -       | -       |
| unCheckedChildren | Content when unchecked  | ReactNode                  | -       | -       |
| icon              | Set icon component      | ReactNode                  | -       | -       |
| disabled          | Whether disabled        | boolean                    | false   | -       |
| loading           | Loading state           | boolean                    | -       | -       |
| value             | Switch value            | boolean                    | false   | -       |
| onChange          | Callback when changed   | function(checked: boolean) | -       | -       |
| rootClassName     | Root element class name | string                     | -       | -       |

### ⚠️ Notes for Slot Mode

- **In slot mode, `value` and `defaultValue` are invalid.** Please use `ref` and callback events to get the value and slot configuration.
- **In slot mode, the third parameter `config` of the `onChange`/`onSubmit` callback** is only for getting the current structured content.

**Example:**

```jsx
// ❌ Wrong usage (slotConfig is for initialization only)
const [config, setConfig] = useState([]);
<Sender
  slotConfig={config}
  onChange={(value, e, config) => {
    setConfig(config);
  }}
/>

// ✅ Correct usage
<Sender
  key={key}
  slotConfig={config}
  onChange={(value, _e, config) => {
    // Only used to get structured content, use key to force re-render component
    setKey('new_key')
    console.log(value, config);
  }}
/>
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Sender"></ComponentTokenTable>
