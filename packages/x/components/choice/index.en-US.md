---
category: Components
group:
  title: Wake
  order: 1
title: Choice
order: 10
description: Present a set of structured options for users to select in AI conversation scenarios.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

The Choice component is used to present a set of structured options for users to select in AI conversation scenarios. Unlike antd's `Select`, `Radio`, and `Checkbox`, Choice is designed specifically for AI conversation contexts, supporting AI-specific features such as recommendation markers, disable reasons, multiple layout modes, and loading states.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/multiple.tsx">Multiple</code>
<code src="./demo/card-layout.tsx">Card Layout</code>
<code src="./demo/grid-layout.tsx">Grid Layout</code>
<code src="./demo/recommended.tsx">Recommended</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/indicator.tsx">Indicator</code>
<code src="./demo/confirmable.tsx">Confirmable</code>
<code src="./demo/loading.tsx">Loading</code>
<code src="./demo/in-bubble.tsx">In Bubble</code>
<code src="./demo/controlled.tsx">Controlled</code>

## API

### ChoiceProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| items | List of options | ChoiceItemType[] | - | - |
| mode | Selection mode | 'single' \| 'multiple' | 'single' | - |
| layout | Layout mode | 'list' \| 'grid' \| 'card' | 'list' | - |
| value | Current selected value (controlled) | ChoiceValueType \| ChoiceValueType[] | - | - |
| defaultValue | Default selected value | ChoiceValueType \| ChoiceValueType[] | - | - |
| onChange | Callback when selection changes | (value, info: ChangeInfo) => void | - | - |
| onItemClick | Callback when an option is clicked | (info: { data: ChoiceItemType, index: number }) => void | - | - |
| onConfirm | Confirm callback | (value, info: ChangeInfo) => void | - | - |
| title | Title | React.ReactNode | - | - |
| description | Description text | React.ReactNode | - | - |
| footer | Footer action area | React.ReactNode | - | - |
| disabled | Whether to disable all options | boolean | false | - |
| loading | Whether to show loading state | boolean | false | - |
| maxCount | Maximum selectable count in multiple mode | number | - | - |
| indicator | Indicator type | 'check' \| 'radio' \| 'number' \| 'none' | 'radio'(single) / 'check'(multiple) | - |
| confirmable | Whether to show confirm button | boolean | false | - |
| confirmText | Confirm button text | React.ReactNode | - | - |
| fadeIn | Fade-in effect | boolean | - | - |
| fadeInLeft | Fade-in from left effect | boolean | - | - |
| classNames | Semantic structure class names | Record<SemanticType, string> | - | - |
| styles | Semantic structure styles | Record<SemanticType, React.CSSProperties> | - | - |
| prefixCls | Prefix for style class names | string | - | - |
| rootClassName | Root node style class name | string | - | - |

### ChoiceItemType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| key | Unique identifier, also used as selected value | string \| number | - | - |
| label | Option label | React.ReactNode | - | - |
| description | Option description | React.ReactNode | - | - |
| icon | Option icon | React.ReactNode | - | - |
| disabled | Whether the option is disabled | boolean | false | - |
| disabledReason | Reason for disabling | React.ReactNode | - | - |
| recommended | AI recommended marker | boolean \| 'primary' \| 'secondary' | - | - |
| recommendedReason | Reason for recommendation | React.ReactNode | - | - |
| extra | Extra information | React.ReactNode | - | - |
| meta | Additional metadata | Record<string, any> | - | - |
| children | Nested child options | ChoiceItemType[] | - | - |

### ChangeInfo

| Property     | Description                   | Type                                 | Version |
| ------------ | ----------------------------- | ------------------------------------ | ------- |
| value        | Value after change            | ChoiceValueType \| ChoiceValueType[] | -       |
| items        | All current items             | ChoiceItemType[]                     | -       |
| changedItems | Items involved in this change | ChoiceItemType[]                     | -       |
| type         | Change type                   | 'select' \| 'deselect'               | -       |

### ChoiceRef

| Property | Description | Type | Version |
| --- | --- | --- | --- |
| nativeElement | Native DOM element | HTMLDivElement | - |
| scrollTo | Scroll to a specific option | (key: ChoiceValueType) => void | - |
| getValue | Get current selected value | () => ChoiceValueType \| ChoiceValueType[] \| undefined | - |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Choice"></ComponentTokenTable>
