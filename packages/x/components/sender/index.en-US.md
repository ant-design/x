---
category: Components
group:
  title: Express
  order: 2
title: Sender
description: An input box component used for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OwTOS6wqFIsAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cOfrS4fVkOMAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- When you need to build an input box for chat scenarios

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/agent.tsx">Agent Input</code>
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/switch.tsx">Feature Toggle</code>
<code src="./demo/slot-filling.tsx">Slot Mode</code>
<code src="./demo/ref-action.tsx">Instance Methods</code>
<code src="./demo/submitType.tsx">Submit Methods</code>
<code src="./demo/speech.tsx">Voice Input</code>
<code src="./demo/speech-custom.tsx">Custom Voice Input</code>
<code src="./demo/suffix.tsx">Custom Suffix</code>
<code src="./demo/header.tsx">Expand Panel</code>
<code src="./demo/slot-with-suggestion.tsx">Quick Commands</code>
<code src="./demo/header-fixed.tsx">References</code>
<code src="./demo/footer.tsx">Custom Footer Content</code>
<code src="./demo/send-style.tsx">Style Adjustment</code>
<code src="./demo/paste-image.tsx">Paste Files</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowSpeech | Whether to allow voice input | boolean \| SpeechConfig | false | - |
| classNames | Style class names | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of the input box | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether in loading state | boolean | false | - |
| suffix | Suffix content, displays action buttons by default. When you don't need the default action buttons, you can set `suffix={false}` | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | oriNode | 2.0.0 |
| header | Header panel | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| prefix | Prefix content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| footer | Footer content | React.ReactNode \| false \| (oriNode: React.ReactNode, info: { components: ActionsComponents; }) => React.ReactNode \| false | false | - |
| readOnly | Whether to make the input box read-only | boolean | false | - |
| rootClassName | Root element style class | string | - | - |
| styles | Semantic style definition | [See below](#semantic-dom) | - | - |
| submitType | Submission mode | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input box value | string | - | - |
| onSubmit | Callback for clicking the send button | (message: string, slotConfig?: SlotConfigType[], skill: SkillType) => void | - | - |
| onChange | Callback for input box value change | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`>, slotConfig: SlotConfigType[], skill: SkillType) => void | - | - |
| onCancel | Callback for clicking the cancel button | () => void | - | - |
| onPasteFile | Callback for pasting files | (files: FileList) => void | - | - |
| autoSize | Auto-adjust content height, can be set to true \| false or object: { minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |
| slotConfig | Slot configuration, after configuration the input box will switch to slot mode, supporting structured input. In this mode, `value` and `defaultValue` configurations will be invalid. | SlotConfigType[] | - | 2.0.0 |
| skill | Skill configuration, the input box will switch to slot mode, supporting structured input. In this mode, `value` and `defaultValue` configurations will be invalid. | SkillType | - | 2.0.0 |

```typescript | pure
interface SkillType {
  title?: React.ReactNode;
  value: string;
  toolTip?: TooltipProps;
  closable?:
    | boolean
    | {
        closeIcon?: React.ReactNode;
        onClose?: React.MouseEventHandler<HTMLDivElement>;
        disabled?: boolean;
      };
}
```

```typescript | pure
type SpeechConfig = {
  // When `recording` is set, the built-in voice input feature will be disabled.
  // Developers need to implement third-party voice input functionality.
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
| focus | Get focus, when `cursor = 'slot'` the focus will be in the first slot of type `input`, if no corresponding `input` exists it will behave the same as `end` | (option?: { preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' \| 'slot' }) | - | - |
| blur | Remove focus | () => void | - | - |
| insert | Insert text or slots, when using slots ensure slotConfig is configured | (value: string) => void \| (slotConfig: SlotConfigType[], position?: insertPosition, replaceCharacters?: string) => void; | - | - |
| clear | Clear content | () => void | - | - |
| getValue | Get current content and structured configuration | () => { value: string; slotConfig: SlotConfigType[], skill: SkillType } | - | - |

#### SlotConfigType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| type | Node type, determines the rendering component type, required | 'text' \| 'input' \| 'select' \| 'tag' \| 'custom' | - | 2.0.0 |
| key | Unique identifier, can be omitted when type is text | string | - | - |
| formatResult | Format the final result | (value: any) => string | - | 2.0.0 |

##### text node properties

| Property | Description  | Type   | Default | Version |
| -------- | ------------ | ------ | ------- | ------- |
| text     | Text content | string | -       | 2.0.0   |

##### input node properties

| Property           | Description   | Type                                  | Default | Version |
| ------------------ | ------------- | ------------------------------------- | ------- | ------- |
| props.placeholder  | Placeholder   | string                                | -       | 2.0.0   |
| props.defaultValue | Default value | string \| number \| readonly string[] | -       | 2.0.0   |

##### select node properties

| Property           | Description             | Type     | Default | Version |
| ------------------ | ----------------------- | -------- | ------- | ------- |
| props.options      | Options array, required | string[] | -       | 2.0.0   |
| props.placeholder  | Placeholder             | string   | -       | 2.0.0   |
| props.defaultValue | Default value           | string   | -       | 2.0.0   |

##### tag node properties

| Property    | Description           | Type      | Default | Version |
| ----------- | --------------------- | --------- | ------- | ------- |
| props.label | Tag content, required | ReactNode | -       | 2.0.0   |
| props.value | Tag value             | string    | -       | 2.0.0   |

##### custom node properties

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| props.defaultValue | Default value | any | - | 2.0.0 |
| customRender | Custom rendering function | (value: any, onChange: (value: any) => void, props: { disabled?: boolean, readOnly?: boolean }, item: SlotConfigType) => React.ReactNode | - | 2.0.0 |

### Sender.Header

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | ReactNode | - | - |
| classNames | Style class names | [See below](#semantic-dom) | - | - |
| closable | Whether it can be closed | boolean | true | - |
| forceRender | Force rendering, use when you need to reference internal elements during initialization | boolean | false | - |
| open | Whether to expand | boolean | - | - |
| styles | Semantic style definition | [See below](#semantic-dom) | - | - |
| title | Title | ReactNode | - | - |
| onOpenChange | Callback for expansion state change | (open: boolean) => void | - | - |

### Sender.Switch

| Property          | Description              | Type                       | Default | Version |
| ----------------- | ------------------------ | -------------------------- | ------- | ------- |
| children          | General content          | ReactNode                  | -       | 2.0.0   |
| checkedChildren   | Content when checked     | ReactNode                  | -       | 2.0.0   |
| unCheckedChildren | Content when unchecked   | ReactNode                  | -       | 2.0.0   |
| icon              | Set icon component       | ReactNode                  | -       | 2.0.0   |
| disabled          | Whether disabled         | boolean                    | false   | 2.0.0   |
| loading           | Loading switch           | boolean                    | -       | 2.0.0   |
| value             | Switch value             | boolean                    | false   | 2.0.0   |
| onChange          | Callback when changed    | function(checked: boolean) | -       | 2.0.0   |
| rootClassName     | Root element style class | string                     | -       | 2.0.0   |

### ⚠️ Slot Mode Notes

- **In slot mode, `value` and `defaultValue` properties are invalid**, please use `ref` and callback events to get the input box value and slot configuration.
- **In slot mode, the third parameter `config` of `onChange`/`onSubmit` callbacks** is only used to get the current structured content.

**Example:**

```jsx
// ❌ Incorrect usage, slotConfig and skill are for uncontrolled usage
const [config, setConfig] = useState([]);
const [skill, setSkill] = useState([]);
<Sender
  slotConfig={config}
  skill={skill}
  onChange={(value, e, config, skill) => {
    setConfig(config);
    setSkill(skill)
  }}
/>

// ✅ Correct usage
<Sender
  key={key}
  slotConfig={config}
  skill={skill}
  onChange={(value, _e, config, skill) => {
    // Only used to get structured content
    setKey('new_key')
  }}
/>
```

## Semantic DOM

### Sender

<code src="./demo/_semantic.tsx" simplify="true"></code>

### Sender.Switch

<code src="./demo/_semantic-switch.tsx" simplify="true"></code>

## Theme Variables (Design Token)

<ComponentTokenTable component="Sender"></ComponentTokenTable>
