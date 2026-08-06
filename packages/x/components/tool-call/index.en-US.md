---
category: Components
group:
  title: Confirm
  order: 1
title: ToolCall
description: Display an Agent tool call's arguments, execution status, result, and error.
tag: 2.9.0
---

## When To Use

- Display a tool invocation in an Agent conversation or execution timeline.
- Provide a consistent surface for streaming arguments, approval, live duration, results, errors, and retry intent.
- The component renders state and emits approval, cancellation, and retry intent. The application owns real tool execution, authorization checks, and persistence.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/approval.tsx">Approval and execution</code>
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
| approval | Approval configuration with controlled and uncontrolled modes | [ToolCallApprovalConfig](#toolcallapprovalconfig) | - |
| approvalRender | Custom renderer for the complete approval region | (approval, item, actions) => ReactNode | - |
| duration | Duration display configuration; false hides it | boolean \| [ToolCallDurationConfig](#toolcalldurationconfig) | true |
| cancelling | Controlled cancellation loading state | boolean | - |
| onCancel | Emits cancellation intent while running | (item: ToolCallItem) => void \| Promise&lt;void&gt; | - |
| cancelButtonProps | Cancel button props | ButtonProps | - |
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

### ToolCallApprovalConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| status | Controlled approval state | pending \| approved \| rejected | - |
| defaultStatus | Initial uncontrolled approval state | pending \| approved \| rejected | pending |
| title | Approval title | ReactNode | Approval required |
| description | Risk or impact description | ReactNode | - |
| risk | Risk level | low \| medium \| high | - |
| approveText | Approve action label | ReactNode | Approve and run |
| rejectText | Reject action label | ReactNode | Reject |
| approveButtonProps | Approve button props | ButtonProps | - |
| rejectButtonProps | Reject button props | ButtonProps | - |
| loading | Externally controlled action loading state | boolean \| approve \| reject | - |
| onStatusChange | Called after a successful approval action | (status, item) => void | - |
| onApprove | Approve callback; status is committed after its Promise resolves | (item) => void \| Promise&lt;void&gt; | - |
| onReject | Reject callback; status is committed after its Promise resolves | (item) => void \| Promise&lt;void&gt; | - |

Without `status`, the component updates its internal approval state after the action succeeds. With `status`, update it from `onStatusChange`. A rejected callback Promise leaves the approval pending so the user can retry. Real authorization must still be enforced on the server.

`approvalRender` receives the approval config, current item, and `{ status, loading, approve, reject }`. Use it for edit-before-run, approval reasons, always-allow, or multi-party workflows.

### ToolCallDurationConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Controlled elapsed time in milliseconds | number | - |
| refreshInterval | Running refresh interval, at least 250ms | number | 1000 |
| formatter | Custom duration renderer | (milliseconds, item) => ReactNode | - |

By default, elapsed time updates from `startedAt` while running and freezes when `completedAt` is present. Providing `value` fully controls the displayed duration.

`pending`, `streaming`, `running`, and `failed` expand by default. `completed` and `cancelled` collapse by default. Supplying `expanded` makes the component fully controlled.

The default retry action is only visible when `status` is `failed`, `error.retryable` is `true`, and `onRetry` is supplied. Running calls show cancellation when `onCancel` is supplied. The component does not execute tools directly; update `item` in response to emitted events.

Completed calls display a safely serialized result summary and copy action by default. Expand the call to inspect the complete displayable result.

Complete JSON in `argumentsText` is formatted while incomplete streaming JSON is preserved. Object results use safe serialization; circular, binary, and oversized values receive concise type summaries. Default rendering never injects HTML or exposes raw stack traces.

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="ToolCall"></ComponentTokenTable>
