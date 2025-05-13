---
category: Components
group:
  title: Express
  order: 2
title: Suggestion
description: A suggestion component for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4vEeSJ2e9xgAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cahuSJ4VxvoAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- Need to build an input box for a dialogue scenario

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/block.tsx">Block</code>
<code src="./demo/trigger.tsx">Customize</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### suggestionProps

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Take up the full width | boolean | false | - |
| children | Custom input box | ({ onTrigger, onKeyDown }) => ReactElement | - | - |
| items | Suggestion list | SuggestionItem[] \| ((info: T) => SuggestionItem[]) | - | - |
| open | Controlled open panel | boolean | - | - |
| rootClassName | Root element class name | string | - | - |
| onSelect | Callback when the suggestion item is selected | (value: string) => void | - | - |
| onOpenChange | Callback when the panel open state changes | (open: boolean) => void | - | - |

#### onTrigger

```typescript | pure
type onTrigger<T> = (info: T | false) => void;
```

Suggestion accepts generics to customize the parameter type passed to `items` renderProps. When `false` is passed, the suggestion panel is closed.

### SuggestionItem

| Property | Description                           | Type             | Default | Version |
| -------- | ------------------------------------- | ---------------- | ------- | ------- |
| children | Child item for the suggestion item    | SuggestionItem[] | -       | -       |
| extra    | Extra content for the suggestion item | ReactNode        | -       | -       |
| icon     | Icon for the suggestion               | ReactNode        | -       | -       |
| label    | Content to display for the suggestion | ReactNode        | -       | -       |
| value    | Value of the suggestion item          | string           | -       | -       |

## Theme Variables (Design Token)

<ComponentTokenTable component="suggestion"></ComponentTokenTable>
