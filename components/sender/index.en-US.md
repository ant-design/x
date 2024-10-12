---
category: Components
group: Data Display
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
<code src="./demo/actions.tsx">Custom actions</code>
<code src="./demo/send-style.tsx">Adjust style</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### SenderProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Custom actions | ReactNode \| (oriNode, info: { components }) => ReactNode | - | - |
| allowSpeech | Whether to allow speech input | boolean | false | - |
| classNames | Class name | [See below](#semantic-dom) | - | - |
| components | Custom components | Record<'input', ComponentType> | - | - |
| defaultValue | Default value of input | string | - | - |
| disabled | Whether to disable | boolean | false | - |
| loading | Whether it is loading | boolean | false | - |
| rootClassName | Root element class name | string | - | - |
| styles | Semantic DOM style | [See below](#semantic-dom) | - | - |
| submitType | Submit type | SubmitType | `enter` \| `shiftEnter` | - |
| value | Input value | string | - | - |
| onSubmit | Callback when click send button | (message: string) => void | - | - |
| onChange | Callback when input value changes | (value: string) => void | - | - |
| onCancel | Callback when click cancel button | () => void | - | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Sender"></ComponentTokenTable>
