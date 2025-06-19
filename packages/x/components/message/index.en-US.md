---
category: Components
group:
  title: Common
  order: 0
title: Message
description: Show various types of messages for chat.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rHIYQIL1X-QAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uaGhTY1-LL0AAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Used to show messages during conversations.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/sup.tsx">Sup</code>
<code src="./demo/think.tsx">Think</code>
<code src="./demo/source.tsx">Source</code>
<code src="./demo/system.tsx">System</code>

## API

Common props ref：[Common props](/docs/react/common-props)

### MessageProps

| Property   | Description        | Type                     | Default | Version |
| ---------- | ------------------ | ------------------------ | ------- | ------- |
| classNames | DOM class          | string                   | -       | -       |
| style      | DOM style          | CSSProperties            | -       | -       |
| type       | Type of message    | markdown \| sup \| think | -       | -       |
| content    | Content of message | React.ReactNode          | -       | -       |

### MessageProps[type=sup]

More api：[PopoverProps](https://ant-design.antgroup.com/components/popover#api)

| Property       | Description        | Type            | Default | Version |
| -------------- | ------------------ | --------------- | ------- | ------- |
| popoverTitle   | Title of popover   | React.ReactNode | -       | -       |
| popoverContent | Content of popover | React.ReactNode | -       | -       |

### MessageProps[type=think]

| Property | Description   | Type            | Default | Version |
| -------- | ------------- | --------------- | ------- | ------- |
| title    | Title content | React.ReactNode | -       | -       |
| logo     | Logo content  | React.ReactNode | -       | -       |

### MessageProps[type=source]

| Property | Description  | Type                                               | Default | Version |
| -------- | ------------ | -------------------------------------------------- | ------- | ------- |
| items    | Source links | Array<{label: string; src: string; key?: string;}> | -       | -       |

### MessageProps[type=system]

| Property | Description           | Type              | Default | Version |
| -------- | --------------------- | ----------------- | ------- | ------- |
| divider  | Type of dividing line | boolean \| string | true    | -       |

## Semantic DOM

## Design Token
