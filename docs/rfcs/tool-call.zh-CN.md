# RFC：ToolCall 组件

> 状态：提议目标包：`@ant-design/x` 依赖：[x-sdk Agent Interaction Runtime](./x-sdk-agent-interaction.zh-CN.md) 关联规划：[第二阶段详细系分](../roadmap/phase-2-breakdown.zh-CN.md) 更新日期：2026-08-03

## 1. 摘要

新增 `ToolCall` 受控组件，用统一方式展示 Agent 工具调用的名称、参数、执行状态、结果和错误，并在调用方允许时提供重试入口。

组件不执行工具、不调用 Provider、不写 AgentStore。它只接收展示模型，并通过 `onRetry` 把用户意图交给应用层；应用层再调用 `useXChat().agentActions.retryTool`。

```text
AgentToolCallState
  -> x-sdk selector
  -> ToolCallViewModel
  -> <ToolCall />
  -> onRetry
  -> agentActions.retryTool
  -> tool.retry Command
  -> Runtime
  -> 新 ToolCall Event
```

## 2. 问题

第一阶段已经能把以下事件归约成 `AgentToolCallState`：

```text
tool.requested
tool.arguments_delta
tool.running
tool.completed
tool.failed
tool.cancelled
```

但目前没有正式 UI，业务方需要重复解决：

- 如何展示流式 JSON 参数。
- running、failed、cancelled 等状态如何表达。
- 长参数和长结果如何折叠。
- 什么错误允许重试。
- 重试中如何阻止重复点击。
- 如何保留失败 Attempt，而不是原地覆盖。
- 键盘、Screen Reader 和 RTL 如何适配。

## 3. 目标

- 覆盖 pending、streaming、running、completed、failed、cancelled 状态。
- 参数、结果和错误都有安全默认渲染与自定义入口。
- 支持受控/非受控折叠。
- 仅在调用方提供能力时展示重试操作。
- 与 `AgentToolCallState` 结构兼容，但不直接依赖 `@ant-design/x-sdk`。
- 支持语义 DOM、Design Token、RTL、键盘和 Screen Reader。
- 单个组件可独立使用，也可嵌入 `AgentTimeline`。

## 4. 非目标

- 不在浏览器执行工具。
- 不解析或校验业务工具 Schema。
- 不修改工具参数后重新执行；修改参数属于新的业务输入或 Approval。
- 不显示服务端日志、Trace 和完整审计信息。
- 不替代代码编辑器、JSON 编辑器或 Artifact 容器。
- 不自动决定错误是否可重试。

## 5. 用户体验

### 5.1 默认结构

```text
[状态图标] queryOrder                         [重试] [展开]
           查询订单 · 已完成 · 1.2s

参数
{
  "orderId": "20260803001"
}

结果
{
  "status": "paid"
}
```

默认折叠规则：

- pending、streaming、running 默认展开参数区域。
- completed 默认折叠详情，只展示结果摘要。
- failed 默认展开错误，并保留参数入口。
- cancelled 默认折叠。
- 调用方传入 `expanded` 时完全受控。

### 5.2 状态文案

| 状态      | 默认文案     | 动作                |
| --------- | ------------ | ------------------- |
| pending   | 等待执行     | 展开/折叠           |
| streaming | 正在接收参数 | 展开/折叠           |
| running   | 正在执行     | 展开/折叠           |
| completed | 已完成       | 复制、展开/折叠     |
| failed    | 执行失败     | 可选重试、展开/折叠 |
| cancelled | 已取消       | 展开/折叠           |

## 6. 公开 API

### 6.1 ViewModel

```ts
export type ToolCallStatus =
  'pending' | 'streaming' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ToolCallError {
  code?: string;
  message: string;
  retryable?: boolean;
  details?: unknown;
}

export interface ToolCallItem {
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
```

`id` 是展示键，不承担 Run 隔离；应用层从 `AgentState` 映射时必须使用 `runId + toolCallId` 生成稳定键。

### 6.2 Props

```ts
export type ToolCallSemanticType =
  | 'root'
  | 'header'
  | 'status'
  | 'name'
  | 'description'
  | 'actions'
  | 'details'
  | 'arguments'
  | 'result'
  | 'error';

export interface ToolCallProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  item: ToolCallItem;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  retrying?: boolean;
  onRetry?: (item: ToolCallItem) => void;
  argumentsRender?: (item: ToolCallItem) => React.ReactNode;
  resultRender?: (value: ToolCallItem['result'], item: ToolCallItem) => React.ReactNode;
  errorRender?: (error: ToolCallError, item: ToolCallItem) => React.ReactNode;
  actions?: React.ReactNode | ((item: ToolCallItem) => React.ReactNode);
  classNames?: Partial<Record<ToolCallSemanticType, string>>;
  styles?: Partial<Record<ToolCallSemanticType, React.CSSProperties>>;
  prefixCls?: string;
  rootClassName?: string;
}
```

### 6.3 重试显示条件

默认重试按钮仅在以下条件同时满足时出现：

```text
item.status === 'failed'
item.error?.retryable === true
typeof onRetry === 'function'
```

`retrying` 为 true 时按钮进入 loading 并禁用。组件不在点击后自行把 ToolCall 改成 running；新状态必须来自 Runtime Event。

## 7. 与 x-sdk 的连接

`@ant-design/x-sdk` 增加纯 selector，返回与 `ToolCallItem` 结构兼容的数据，但不能导入 `@ant-design/x` 类型：

```ts
const item = experimentalAgent.selectToolCall(state, {
  runId,
  toolCallId,
});

<ToolCall
  item={item}
  retrying={commandStates[retryCommandId]?.status === 'submitting'}
  onRetry={() => agentActions.retryTool({ runId, toolCallId })}
/>
```

阶段一状态增量：

```ts
interface AgentToolCallState {
  // 已有字段保持不变
  attempt?: number;
  retryOf?: string;
}
```

`tool.retry` 成功后 Runtime 必须发出新的 `tool.requested`，使用新 `toolCallId`，并通过 `retryOf` 关联原调用。

## 8. 默认渲染

### 8.1 参数

- 字符串按原文展示。
- `argumentsText` 可解析为 JSON 时，格式化后使用 `CodeHighlighter` 展示。
- 对象使用安全 JSON 序列化；序列化失败显示类型摘要。
- 参数流未结束时保留原文，不因 JSON 不完整显示错误。
- 默认最大可见高度受 Token 控制，超出后滚动。

### 8.2 结果

- string、number、boolean 直接显示。
- 普通对象格式化为 JSON。
- ReactNode 只能通过 `resultRender` 返回，不把未知对象当 HTML 注入。
- 二进制、图片、文件和大对象显示摘要，完整展示交给 Artifact。

### 8.3 错误

- 默认展示 `error.message`。
- `code` 和 `details` 放在折叠详情，不默认占据主视觉。
- 不展示原始堆栈，除非调用方通过 `errorRender` 明确提供。

## 9. 交互与无障碍

- 根节点使用 `role="group"`，通过工具名称建立可访问名称。
- 展开按钮使用原生 button，并维护 `aria-expanded`、`aria-controls`。
- 状态变化使用 `aria-live="polite"`，只播报最新状态，不重复播报参数增量。
- 重试按钮必须有“重试 {toolName}”的可访问名称。
- running 状态不可让旋转图标成为唯一信息来源。
- failed 状态不能只依赖红色表达。
- 内容更新不得移动当前键盘焦点。
- RTL 下图标、操作区和展开方向使用现有方向上下文。

## 10. Design Token

首版 Token：

```ts
interface ToolCallToken {
  headerBg: string;
  detailBg: string;
  statusSize: number;
  actionGap: number;
  contentMaxHeight: number;
  errorColor: string;
  successColor: string;
  runningColor: string;
}
```

圆角、字体、间距、边框和动效优先复用全局 Token，不重复声明。

## 11. 文件改动

```text
packages/x/components/tool-call/
├── ToolCall.tsx
├── interface.ts
├── index.tsx
├── style/index.ts
├── demo/
│   ├── basic.tsx
│   ├── status.tsx
│   ├── controlled.tsx
│   └── custom-render.tsx
├── __tests__/
│   ├── index.test.tsx
│   └── a11y.test.tsx
├── index.zh-CN.md
└── index.en-US.md
```

同时修改组件总出口、主题 Token 类型、XProvider 组件配置和包导出测试。

## 12. 测试计划

### 12.1 单元与组件测试

- 六种状态正确渲染。
- JSON 完整、不完整、循环引用和超大内容回退。
- 受控和非受控折叠。
- retryable、非 retryable、缺少 `onRetry`、retrying 四种分支。
- 点击重试只触发一次回调，不改变 item 状态。
- 自定义 arguments/result/error renderer。
- classNames、styles、prefixCls、rootClassName 和 ref。
- RTL、键盘操作和焦点稳定。
- `jest-axe` 无严重违规。

### 12.2 集成测试

- `AgentToolCallState` 可通过 selector 映射为 ToolCallItem。
- `tool.arguments_delta` 流式更新时组件不丢内容。
- `tool.retry` 返回新 Attempt，旧失败项仍保留。
- Command 提交失败时只解除 retrying，不改 Runtime 状态。

## 13. 备选方案

### 13.1 直接扩展 ThoughtChain.Item

不采用。ThoughtChain 只提供通用过程展示，缺少工具参数、结果、错误和重试语义；直接扩展会污染其 API。

### 13.2 ToolCall 直接接收 AgentToolCallState

不采用。这样会让 `@ant-design/x` 硬依赖 `@ant-design/x-sdk`，破坏组件独立使用和渐进采用。

### 13.3 组件内部执行重试

不采用。组件不知道 Provider、权限和 Runtime，且会把用户意图与已发生事实混在一起。

## 14. 验收标准

- 六种状态、参数、结果、错误和重试均有正式 API 与文档。
- 重试不覆盖原 Attempt，也不由组件伪造 Runtime 状态。
- 仅使用键盘可完成展开、复制和重试。
- 状态更新不会抢焦点或造成明显布局跳动。
- 独立导入可 tree shaking，不引入新的重量级依赖。
- 单测、a11y、类型、SSR、快照、API diff 和包体积门禁通过。
