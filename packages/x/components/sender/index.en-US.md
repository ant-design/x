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
| components | Custom components, The default input is[Input.TextArea](https://ant.design/components/input#api),Ensure that when customizing the input component, all necessary props are implemented as per `Input.TextArea` to avoid any incomplete functionality. | Record<'input', ComponentType> | - | - |
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
| onSubmit | Callback when click send button | (message: string) => void | - | - |
| onChange | Callback when input value changes | (value: string, event?: React.FormEvent<`HTMLTextAreaElement`> \| React.ChangeEvent<`HTMLTextAreaElement`> ) => void | - | - |
| onCancel | Callback when click cancel button | () => void | - | - |
| onPasteFile | Callback when paste files | (firstFile: File, files: FileList) => void | - | - |
| autoSize | Height auto size feature, can be set to true \| false or an object { minRows: 2, maxRows: 6 } | boolean \| { minRows?: number; maxRows?: number } | { maxRows: 8 } | - |

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

### Sender.Header

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| children | Panel content | ReactNode | - | - |
| closable | Whether to close | boolean | true | - |
| forceRender | Force render, use when need ref internal elements on init | boolean | false | - |
| open | Whether to expand | boolean | - | - |
| title | Title content | ReactNode | - | - |
| onOpenChange | Callback when the expansion state changes | (open: boolean) => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Sender"></ComponentTokenTable>
