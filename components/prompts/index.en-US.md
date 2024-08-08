---
category: Components
group: Data Display
title: Prompts
description: Display a predefined set of questions or suggestions.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

The Prompts component is used to display a predefined set of questions or suggestions that are relevant to the current context.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/onclick.tsx">Click</code>
<code src="./demo/flex-vertical.tsx">Vertical</code>
<code src="./demo/with-scroll.tsx">With Scroll</code>
<code src="./demo/flex-wrap.tsx">Wrap</code>

## API

### PromptsProps
| Property        | Description                                              | Type                                                      | Default | Version |
|-----------------|----------------------------------------------------------|-----------------------------------------------------------|---------|---------|
| `data`          | List containing multiple prompt items.                   | PromptProps[]                                           | -       | -       |
| `title`         | Title displayed at the top of the prompt list.           | React.ReactNode                                         | -       | -       |
| `vertical`      | When set to `true`, the Prompts will be arranged vertically.         | boolean                                                | `false` | -    |
| `wrap`      | When set to `true`, the Prompts will automatically wrap.          | boolean                                                | `false` | -    |
| `onClick`       | Callback function when a prompt item is clicked.         | (event: React.MouseEvent<HTMLElement, MouseEvent>, info: { data: PromptProps }) => void | -       | -       |
| `styles`        | Custom styles for different parts of each prompt item.   | Record<'list' \| 'item' \| 'content' \| 'title', React.CSSProperties> | -       | -       |
| `classNames`    | Custom style class names for different parts of each prompt item. | Record<'list' \| 'item' \| 'content' \| 'title', string>            | -       | -       |
| `prefixCls`     | Prefix for style class names.                            | string                                                  | -       | -       |
| `rootClassName` | Style class name for the root node.                      | string                                                  | -       | -       |

### PromptProps
| Property        | Description                                              | Type                                                      | Default | Version |
|-----------------|----------------------------------------------------------|-----------------------------------------------------------|---------|---------|
| `key`           | Unique identifier used to distinguish each prompt item.  | `string`                                                  | -       | -       |
| `icon`          | Prompt icon displayed on the left side of the prompt item. | `React.ReactNode`                                        | -       | -       |
| `label`         | Prompt label displaying the main content of the prompt.  | `React.ReactNode`                                         | -       | -       |
| `description`   | Prompt description providing additional information.     | `React.ReactNode`                                         | -       | -       |
| `disabled`      | When set to `true`, click events are disabled.            | `boolean`                                                 | `false` | -       |

## Semantic DOM

## Design Token

<ComponentTokenTable component="Prompts"></ComponentTokenTable>
