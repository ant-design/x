---
category: Components
group: Data Display
title: Suggestion
description: A suggestion component for chat.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*SMzgSJZE_AwAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*8yArQ43EGccAAAAAAAAAAAAADrJ8AQ/original
---

## When To Use

- Need to build an input box for a dialogue scenario

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/withSender.tsx">with Sender</code>
<code src="./demo/trigger.tsx">trigger character</code>


## API

Common props ref：[Common props](/docs/react/common-props)

### suggestionProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefixCls | Custom prefix for the component class name | string | - | - |
| items | List of suggestion | Suggestion[] | - | - |
| triggerCharacter | Character to trigger the suggestion display | string | '/' | - |
| children | Custom input box | ReactNode | - | - |
| title | Title of the popover | ReactNode | - | - |
| extra | Extra content | ReactNode | - | - |
| onChange | Callback when the input value changes | (value: string) => void | - | - |
| value | Input box value | string | - | - |
| className | Component class name | string | - | - |
| rootClassName | Root element class name | string | - | - |
| style | Component style | React.CSSProperties | - | - |
| placeholder | Input box placeholder | string | - | - |
| placement | Popover placement | TooltipProps['placement'] | 'topLeft' | - |

### Suggestion

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| id | Unique identifier for the suggestion | string | - | - |
| label | Content to display for the suggestion | ReactNode | - | - |
| icon | Icon for the suggestion | ReactNode | - | - |
| className | Class name for the suggestion item | string | - | - |
| onClick | Callback when the suggestion item is clicked | () => void | - | - |
| value | Value of the suggestion item | string | - | - |
| extra | Extra content for the suggestion item | ReactNode | - | - |

## Theme Variables (Design Token)

<ComponentTokenTable component="suggestion"></ComponentTokenTable>
