---
category: Components
group:
  title: Confirm
  order: 1
title: ToolCall
description: Display an Agent tool call's arguments, execution status, result, and error.
tag: 2.1.0
---

## When To Use

- Display a tool invocation in an Agent conversation or execution timeline.
- Provide a consistent surface for streaming arguments, results, errors, and retry intent.
- The component only renders state and emits retry intent. The application owns tool execution, authorization, and runtime state.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/status.tsx">All statuses</code>
<code src="./demo/controlled.tsx">Controlled expansion</code>
<code src="./demo/custom-render.tsx">Custom rendering</code>

## API

Common props ref: [Common props](/docs/react/common-props)

### ToolCallProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| item | Tool call view model | [ToolCallItem](#toolcallitem) | - |
| expanded | Whether details are expanded in controlled mode | boolean | - |
| defaultExpanded | Initial expansion; derived from status when omitted | boolean | See below |
| onExpandedChange | Called when expansion changes | (expanded: boolean) => void | - |
| retrying | Disables retry and displays its loading state | boolean | false |
| onRetry | Emits retry intent | (item: ToolCallItem) => void | - |
| argumentsRender | Custom arguments renderer | (item: ToolCallItem) => ReactNode | - |
| resultRender | Custom result renderer | (value: unknown, item: ToolCallItem) => ReactNode | - |
| errorRender | Custom error renderer | (error: ToolCallError, item: ToolCallItem) => ReactNode | - |
| actions | Custom actions | ReactNode \| (item: ToolCallItem) => ReactNode | - |
| classNames | Semantic class names | [Record<SemanticDOM, string>](#semantic-dom) | - |
| styles | Semantic styles | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |
| prefixCls | Style class prefix | string | - |
| rootClassName | Root class name | string | - |

### ToolCallItem

```typescript
type ToolCallStatus =
  | 'pending'
  | 'streaming'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

interface ToolCallItem {
  id: React.Key;
  name: string;
  description?: React.ReactNode;
  argumentsText?: string;
  arguments?: unknown;
  result?: unknown;
  status: ToolCallStatus;
  error?: ToolCallError;
  attempt?: number;
  startedAt?: number;
  completedAt?: number;
}

interface ToolCallError {
  code?: string;
  message: string;
  retryable?: boolean;
  details?: unknown;
}
```

`pending`, `streaming`, `running`, and `failed` expand by default. `completed` and `cancelled` collapse by default. Supplying `expanded` makes the component fully controlled.

The default retry action is only visible when `status` is `failed`, `error.retryable` is `true`, and `onRetry` is supplied. The component neither executes tools nor changes status after retry is clicked.

Completed calls display a safely serialized result summary and copy action by default. Expand the call to inspect the complete displayable result.

Complete JSON in `argumentsText` is formatted while incomplete streaming JSON is preserved. Object results use safe serialization; circular, binary, and oversized values receive concise type summaries. Default rendering never injects HTML or exposes raw stack traces.

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="ToolCall"></ComponentTokenTable>
