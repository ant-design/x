---
category: Components
group:
  title: 确认
  order: 1
title: ToolCall
subtitle: 工具调用
description: 展示 Agent 工具调用的参数、执行状态、结果与错误。
tag: 2.1.0
---

## 何时使用

- 在 Agent 对话或执行时间线中展示一次工具调用。
- 需要统一呈现流式参数、执行结果、失败原因和重试入口时。
- 组件只负责展示和传递重试意图；工具执行、权限控制与运行时状态由应用层负责。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/status.tsx">完整状态</code>
<code src="./demo/controlled.tsx">受控展开</code>
<code src="./demo/custom-render.tsx">自定义渲染</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### ToolCallProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| item | 工具调用展示模型 | [ToolCallItem](#toolcallitem) | - |
| expanded | 是否展开详情，受控模式 | boolean | - |
| defaultExpanded | 默认是否展开；未设置时根据状态决定 | boolean | 见下文 |
| onExpandedChange | 展开状态变化回调 | (expanded: boolean) => void | - |
| retrying | 重试提交中，禁用重试按钮并显示加载态 | boolean | false |
| onRetry | 重试意图回调 | (item: ToolCallItem) => void | - |
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

`pending`、`streaming`、`running` 和 `failed` 默认展开；`completed` 和 `cancelled` 默认折叠。传入 `expanded` 后由调用方完全控制。

默认重试按钮仅在 `status` 为 `failed`、`error.retryable` 为 `true` 且提供 `onRetry` 时显示。组件不会执行工具，也不会在点击重试后自行修改状态。

完成态默认显示安全序列化后的结果摘要和复制按钮；展开后可查看完整的可展示结果。

`argumentsText` 会在 JSON 完整时格式化，在流式 JSON 未闭合时保留原文。对象结果使用安全序列化；循环引用、二进制和过大内容显示类型摘要。默认渲染不会注入 HTML 或显示原始堆栈。

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="ToolCall"></ComponentTokenTable>
