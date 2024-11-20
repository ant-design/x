---
category: Components
group:
  title: Express
  order: 2
title: Sender
description: A input component for chat.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*SMzgSJZE_AwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8yArQ43EGccAAAAAAAAAAAAADrJ8AQ/original
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
<code src="./demo/send-style.tsx">Adjust style</code>
<code src="./demo/paste-image.tsx">Paste image</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Custom actions | ReactNode \| (oriNode, info: { components }) => ReactNode | - | - |
| allowSpeech | Whether to allow speech input | boolean \| SpeechConfig | false | - |
| classNames | Class name | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of input | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether it is loading | boolean | false | - |
| header | Header panel | ReactNode | - | - |
| prefix | Prefix content | ReactNode | - | - |
| readOnly | Whether to make the input box read-only | boolean | false | - |
| rootClassName | Root element class name | string | - | - |
| styles | Semantic DOM style | [See below](#semantic-dom) | - | - |
| submitType | Submit type | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input value | string | - | - |
| onSubmit | Callback when click send button | (message: string) => void | - | - |
| onChange | Callback when input value changes | (value: string) => void | - | - |
| onCancel | Callback when click cancel button | () => void | - | - |

```typescript | pure
type SpeechConfig = {
  // When setting `recording`, the built-in speech input function will be disabled.
  // It is up to the developer to implement the third-party speech input function.
  recording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
};
```

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
