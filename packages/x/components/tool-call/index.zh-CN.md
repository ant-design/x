---
category: Components
group:
  title: 确认
  order: 1
title: ToolCall
subtitle: 工具调用
description: 展示 Agent 工具调用的参数、执行状态、结果与错误。
tag: 2.9.0
---

## 何时使用

- 在 Agent 对话或执行时间线中展示一次工具调用。
- 需要统一呈现流式参数、人工审批、实时耗时、执行结果、失败原因和重试入口时。
- 组件负责展示状态并传递审批、取消和重试意图；真实工具执行、权限校验和持久化由应用层负责。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/approval.tsx">审批与执行</code>
<code src="./demo/status.tsx">完整状态</code>
<code src="./demo/controlled.tsx">受控展开</code>
<code src="./demo/custom-render.tsx">自定义渲染</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ToolCallProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| item | 工具调用展示模型 | [ToolCallItem](#toolcallitem) | - |
| statusIcons | 按执行状态覆盖图标，`approval` 表示等待审批；设为 `null` 时隐藏图标 | ToolCallStatusIcons | - |
| expanded | 是否展开详情，受控模式 | boolean | - |
| defaultExpanded | 默认是否展开；未设置时根据状态决定 | boolean | 见下文 |
| onExpandedChange | 展开状态变化回调 | (expanded: boolean) => void | - |
| retrying | 重试提交中，禁用重试按钮并显示加载态 | boolean | false |
| onRetry | 重试意图回调 | (item: ToolCallItem) => void | - |
| approval | 审批配置，支持受控与非受控状态 | [ToolCallApprovalConfig](#toolcallapprovalconfig) | - |
| approvalRender | 自定义完整审批区域 | (approval, item, actions) => ReactNode | - |
| duration | 耗时展示配置；设为 false 时隐藏 | boolean \| [ToolCallDurationConfig](#toolcalldurationconfig) | true |
| cancelling | 取消请求加载态 | boolean | - |
| onCancel | 执行中取消意图回调 | (item: ToolCallItem) => void \| Promise&lt;void&gt; | - |
| cancelButtonProps | 取消按钮属性 | ButtonProps | - |
| argumentsRender | 自定义参数渲染 | (item: ToolCallItem) => ReactNode | - |
| resultRender | 自定义结果渲染 | (value: unknown, item: ToolCallItem) => ReactNode | - |
| errorRender | 自定义错误渲染 | (error: ToolCallError, item: ToolCallItem) => ReactNode | - |
| actions | 自定义操作区 | ReactNode \| (item: ToolCallItem) => ReactNode | - |
| classNames | 语义化结构类名 | [Record<SemanticDOM, string>](#semantic-dom) | - |
| styles | 语义化结构样式 | [Record<SemanticDOM, CSSProperties>](#semantic-dom) | - |
| prefixCls | 样式类名前缀 | string | - |
| rootClassName | 根节点类名 | string | - |

### ToolCallItem

```typescript
type ToolCallStatus =
  | 'pending'
  | 'streaming'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

type ToolCallStatusIconType = ToolCallStatus | 'approval';
type ToolCallStatusIcons = Partial<
  Record<ToolCallStatusIconType, React.ReactNode | ((item: ToolCallItem) => React.ReactNode)>
>;

interface ToolCallItem {
  id: React.Key;
  name: string;
  icon?: React.ReactNode;
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

传入 `item.icon` 后，完成态优先展示工具自身图标，支持图片或任意 ReactNode；等待、参数接收、运行、失败、取消和审批状态仍使用状态图标。`statusIcons` 的优先级高于工具图标和内置图标，可按状态覆盖，或传入 `null` 隐藏对应图标。

### ToolCallApprovalConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| status | 审批状态，受控模式 | pending \| approved \| rejected | - |
| defaultStatus | 默认审批状态，非受控模式 | pending \| approved \| rejected | pending |
| title | 审批标题 | ReactNode | 需要审批 |
| description | 风险或影响说明 | ReactNode | - |
| risk | 风险级别 | low \| medium \| high | - |
| approveText | 批准按钮文案 | ReactNode | 批准并执行 |
| rejectText | 拒绝按钮文案 | ReactNode | 拒绝 |
| approveButtonProps | 批准按钮属性 | ButtonProps | - |
| rejectButtonProps | 拒绝按钮属性 | ButtonProps | - |
| loading | 外部控制动作加载态 | boolean \| approve \| reject | - |
| onStatusChange | 审批状态变化回调 | (status, item) => void | - |
| onApprove | 批准回调；Promise 完成后提交状态变化 | (item) => void \| Promise&lt;void&gt; | - |
| onReject | 拒绝回调；Promise 完成后提交状态变化 | (item) => void \| Promise&lt;void&gt; | - |

未传入 `status` 时，组件会在审批回调成功后更新内部审批状态；传入 `status` 时，应用需要在 `onStatusChange` 中更新它。回调 Promise 被拒绝时保持待审批状态，允许再次操作。真实权限校验仍应在服务端完成。

`approvalRender` 会收到审批配置、当前工具项以及 `{ status, loading, approve, reject }`，可用于实现修改参数后执行、审批原因、始终允许或多人审批等自定义流程。

### ToolCallDurationConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控耗时，单位毫秒 | number | - |
| refreshInterval | 运行中刷新间隔，最小 250ms | number | 1000 |
| formatter | 自定义耗时渲染 | (milliseconds, item) => ReactNode | - |

默认根据 `startedAt` 实时刷新运行耗时，并在存在 `completedAt` 时冻结。传入 `value` 后完全由应用控制显示值。

`pending`、`streaming`、`running` 和 `failed` 默认展开；`completed` 和 `cancelled` 默认折叠。传入 `expanded` 后由调用方完全控制。

默认重试按钮仅在 `status` 为 `failed`、`error.retryable` 为 `true` 且提供 `onRetry` 时显示。运行态在提供 `onCancel` 时显示取消入口。组件不会直接执行工具，应用应根据事件更新 `item`。

完成态默认显示安全序列化后的结果摘要和复制按钮；展开后可查看完整的可展示结果。

`argumentsText` 会在 JSON 完整时格式化，在流式 JSON 未闭合时保留原文。对象结果使用安全序列化；循环引用、二进制和过大内容显示类型摘要。默认渲染不会注入 HTML 或显示原始堆栈。

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="ToolCall"></ComponentTokenTable>
