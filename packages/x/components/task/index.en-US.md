---
category: Components
group:
  title: Confirm
  order: 1
title: Task
description: Display the status, progress, result, and failure details of a long-running Agent task.
tag: 2.9.0
---

## When To Use

- Display a long-running task created and updated by an Agent.
- Present task progress, results, errors, or cancellation reasons in a conversation or execution timeline.
- `Task` renders one task entity. Use `ThoughtChain` for task planning and compose multiple tasks at the timeline layer.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/status.tsx">Statuses</code>
<code src="./demo/controlled.tsx">Controlled expansion</code>
<code src="./demo/custom-render.tsx">Custom rendering</code>

## API

Common props ref: [Common props](/docs/react/common-props)

### TaskProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| item | Task view model | [TaskItem](#taskitem) | - |
| expanded | Whether details are expanded in controlled mode | boolean | - |
| defaultExpanded | Initial expansion; derived from status when omitted | boolean | - |
| onExpandedChange | Called when expansion changes | (expanded: boolean) => void | - |
| statusRender | Custom status icon | (status: TaskStatus, item: TaskItem) => ReactNode | - |
| progressRender | Custom progress region | (progress: number, item: TaskItem) => ReactNode | - |
| resultRender | Custom result renderer | (result: unknown, item: TaskItem) => ReactNode | - |
| errorRender | Custom error renderer | (error: TaskError, item: TaskItem) => ReactNode | - |
| actions | Custom actions | ReactNode \| (item: TaskItem) => ReactNode | - |
| classNames | Semantic class names | Record&lt;SemanticDOM, string&gt; | - |
| styles | Semantic styles | Record&lt;SemanticDOM, CSSProperties&gt; | - |
| prefixCls | Style class prefix | string | - |
| rootClassName | Root class name | string | - |

### TaskItem

```typescript
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface TaskItem {
  id: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: TaskStatus;
  progress?: number;
  result?: unknown;
  error?: TaskError;
  reason?: React.ReactNode;
}
```

`progress` is a ratio from `0` to `1`, matching `AgentTaskState.progress`. Completed tasks always display 100%.

`running` and `failed` expand by default; other states collapse. When status changes, an uncontrolled component adopts the new status default. The expand control only appears when custom content, a result, an error, or a cancellation reason exists.

Object results use safe serialization, with type summaries for circular values. The application or Agent Command owns task execution, cancellation, and retry; inject those controls through `actions`.

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Task"></ComponentTokenTable>
