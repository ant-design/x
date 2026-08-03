# RFC：AgentTimeline 组件

> 状态：提议目标包：`@ant-design/x`，配套 selector 位于 `@ant-design/x-sdk` 依赖：[x-sdk Agent Interaction Runtime](./x-sdk-agent-interaction.zh-CN.md)、ToolCall / Approval ViewModel关联规划：[第二阶段详细系分](../roadmap/phase-2-breakdown.zh-CN.md) 更新日期：2026-08-03

## 1. 摘要

新增 `AgentTimeline` 受控组件，用一个稳定、可扫描的时间线展示单个 Agent Run 中的消息、推理、工具调用和人工审批。

Timeline 不是新的状态容器，也不直接消费原始 Event 流。`@ant-design/x-sdk` 从第一阶段 `AgentState.order` 和各实体状态派生 TimelineItem，`@ant-design/x` 只负责渲染、折叠和定位。

```text
AgentEvent[]
  -> AgentStore / AgentState
  -> selectAgentTimeline(state, runId)
  -> AgentTimelineItem[]
  -> <AgentTimeline />
```

## 2. 问题

第一阶段已经保存：

- `AgentState.order`：实体首次出现的稳定顺序。
- messages、reasoning、toolCalls、approvals 等实体状态。
- 每个实体的 runId、parentId、status、createdAt 和 updatedAt。

但如果业务方直接显示原始 Event，会产生：

- 每个文本或参数 delta 都占一行，信息噪声过大。
- ToolCall 的请求、运行、结果被拆散。
- Approval 与对应 ToolCall 关系不明确。
- timestamp 乱序时 UI 顺序不稳定。
- 重放和实时接收得到不同展示。
- 推理 redacted 信息可能被错误暴露。
- 流式追加时焦点和滚动位置跳动。

## 3. 目标

- 展示单个 Run 的消息、推理、工具和审批实体。
- 一个实体对应一个稳定 TimelineItem，delta 不单独成项。
- ToolCall 的参数、状态、结果在同一条目内更新。
- Approval 可与 ToolCall 建立父子或相邻关联。
- 实时处理和完整事件重放得到相同 items。
- 支持受控折叠、自定义 item renderer 和实体定位。
- 不暴露 redacted reasoning。
- 支持 500 个可见实体的稳定增量更新。
- 支持键盘、Screen Reader、RTL 和语义 DOM。

## 4. 非目标

- P0 不展示 Task、Plan 和 Artifact。
- 不展示每个原始 Event、sequence 或调试 payload。
- 不提供日志搜索、筛选、导出和虚拟列表。
- 不跨多个 Agent 聚合。
- 不重新计算 Runtime 的业务状态。
- 不替代可观测平台和审计日志。
- 不默认自动滚动或抢占焦点。

## 5. 信息模型

### 5.1 Item

```ts
export type AgentTimelineItemKind = 'message' | 'reasoning' | 'tool' | 'approval';

export type AgentTimelineItemStatus =
  'pending' | 'streaming' | 'running' | 'waiting' | 'completed' | 'failed' | 'cancelled';

export interface AgentTimelineItem {
  key: React.Key;
  entityId: string;
  runId: string;
  parentId?: string;
  kind: AgentTimelineItemKind;
  status: AgentTimelineItemStatus;
  title: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  createdAt: number;
  updatedAt: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  meta?: Readonly<Record<string, unknown>>;
}
```

`content` 是应用层或组合组件产生的 ReactNode。x-sdk selector 不能返回 ReactNode，只返回无 UI 依赖的领域 ViewModel；应用层适配器再组合 ToolCall、Approval 或文本内容。

### 5.2 领域投影

`@ant-design/x-sdk` 输出：

```ts
type AgentTimelineEntry =
  | { kind: 'message'; entity: AgentMessageState }
  | { kind: 'reasoning'; entity: AgentReasoningState }
  | { kind: 'tool'; entity: AgentToolCallState }
  | { kind: 'approval'; entity: AgentApprovalState };

selectAgentTimeline(
  state: AgentState,
  options: { runId: string; includeReasoning?: boolean },
): readonly AgentTimelineEntry[];
```

这样保持两个包无硬依赖：

```text
x-sdk selector -> serializable entries
应用层 adapter -> React TimelineItem
x component -> render
```

## 6. 排序和合并规则

### 6.1 排序

- P0 只展示一个 runId。
- 主顺序严格使用 `AgentState.order`，不按 timestamp 重新排序。
- timestamp 只用于显示时间和耗时。
- 缺失实体的 reference 被 selector 忽略，并保留 protocol issue 供诊断。
- key 使用 `runId + kind + entityId`，实时更新不能改变 key。

### 6.2 合并

- message.started/delta/completed 合并为一个 message item。
- reasoning.started/delta/completed 合并为一个 reasoning item。
- tool.requested/arguments_delta/running/completed/failed 合并为一个 tool item。
- approval.requested/resolved 合并为一个 approval item。
- Tool 重试产生新 toolCallId，因此显示新 item，并通过 `retryOf` 提供关联说明。
- Command State 不新增 TimelineItem；它只影响对应条目的 submitting 视觉。

### 6.3 关联

- `parentId` 存在时优先使用显式关联。
- Approval 的 `toolCallId` 指向 ToolCall 时，在 UI 中缩进为工具子项。
- 没有显式关联时保持 `AgentState.order` 平级展示，不按相邻位置猜测。

## 7. 公开 API

```ts
export type AgentTimelineSemanticType =
  | 'root'
  | 'list'
  | 'item'
  | 'itemHeader'
  | 'itemIcon'
  | 'itemTitle'
  | 'itemDescription'
  | 'itemContent'
  | 'itemActions';

export interface AgentTimelineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: readonly AgentTimelineItem[];
  expandedKeys?: readonly React.Key[];
  defaultExpandedKeys?: readonly React.Key[];
  onExpandedKeysChange?: (keys: readonly React.Key[]) => void;
  activeKey?: React.Key;
  onActiveChange?: (key: React.Key, item: AgentTimelineItem) => void;
  itemRender?: (item: AgentTimelineItem, defaultNode: React.ReactNode) => React.ReactNode;
  iconRender?: (item: AgentTimelineItem) => React.ReactNode;
  actionsRender?: (item: AgentTimelineItem) => React.ReactNode;
  classNames?: Partial<Record<AgentTimelineSemanticType, string>>;
  styles?: Partial<Record<AgentTimelineSemanticType, React.CSSProperties>>;
  prefixCls?: string;
  rootClassName?: string;
}
```

P0 不提供 `followOutput`。自动滚动由外层对话容器决定，Timeline 只保证增量更新不改变已有节点尺寸和焦点。

## 8. 默认渲染规则

### 8.1 Message

- title 显示角色名称。
- streaming 显示进行中状态。
- 内容由应用层选择 Bubble、Markdown 或纯文本。
- 不在 Timeline 内重复实现完整 Bubble。

### 8.2 Reasoning

- redacted 为 true 时只显示“推理内容不可用”。
- 默认折叠完整内容，优先显示 summary。
- streaming 状态可显示进行中，但不逐 delta 动画。

### 8.3 Tool

- content 默认组合 `ToolCall`。
- Timeline header 只展示工具名称、状态和耗时。
- ToolCall 自己管理参数/结果详情折叠，Timeline 不再嵌套第二个详情卡片。

### 8.4 Approval

- waiting 状态默认展开。
- resolved 后默认折叠，但保留决策摘要。
- content 默认组合 `Approval`。
- 与 ToolCall 显式关联时缩进，但不把 Approval 放入 ToolCall 内部 DOM。

## 9. 折叠与活动项

- Timeline 统一管理条目级折叠键。
- ToolCall 内部参数/结果折叠属于 ToolCall 自身，不复用同一个 key 集合。
- `activeKey` 只表示当前定位项，不表示业务执行状态。
- 用户点击 header 或通过键盘激活时触发 `onActiveChange`。
- 新 item 到达时不自动改变 activeKey。
- 条目完成后不自动折叠用户已展开的内容。

## 10. 性能

- selector 只在相关实体引用变化时重建对应 entry。
- items 使用稳定 key，已有 item 更新不能导致整列表重新挂载。
- 参数和消息 delta 更新只影响对应条目。
- 500 个可见实体下，增量更新相对阶段二基线回退不超过 20%。
- P0 不引入虚拟列表；超过 500 项由业务分页或按 Run 分段。
- 不对每个 delta 执行 layout measurement。

## 11. 交互与无障碍

- 根结构使用 `role="region"`，内部使用语义 list/listitem。
- 每个 header 是可聚焦按钮或包含独立展开按钮，不用 clickable div。
- 上下方向键移动活动项，Home/End 到首尾，Enter/Space 展开。
- 新条目到达不抢焦点。
- 状态变化只对当前活动实体使用 `aria-live="polite"`，避免整条 Timeline 重复播报。
- 线条和颜色不是状态唯一表达，必须有图标或文本。
- redacted reasoning 不进入可访问名称或隐藏文本。
- 嵌入 Approval 时保持正常 Tab 顺序，不建立嵌套交互按钮。
- RTL 下时间线、缩进和状态图标方向正确。

## 12. Design Token

优先复用 ThoughtChain 的尺寸与状态语义，但单独定义 Timeline Token，避免两个组件耦合：

```ts
interface AgentTimelineToken {
  lineColor: string;
  lineWidth: number;
  itemGap: number;
  nestedIndent: number;
  iconSize: number;
  activeBg: string;
  streamingColor: string;
  waitingColor: string;
  failedColor: string;
}
```

## 13. 文件改动

```text
packages/x-sdk/src/agent/selectors/
├── selectAgentTimeline.ts
├── index.ts
└── __test__/selectAgentTimeline.test.ts

packages/x/components/agent-timeline/
├── AgentTimeline.tsx
├── interface.ts
├── index.tsx
├── style/index.ts
├── demo/
│   ├── basic.tsx
│   ├── streaming.tsx
│   ├── controlled.tsx
│   └── custom-render.tsx
├── __tests__/
│   ├── index.test.tsx
│   └── a11y.test.tsx
├── index.zh-CN.md
└── index.en-US.md
```

同时修改组件总出口、主题 Token 类型、XProvider 组件配置、experimentalAgent selector 出口和包导出测试。

## 14. 测试计划

### 14.1 Selector

- 只返回指定 runId 的实体。
- 顺序与 AgentState.order 一致，不受 timestamp 乱序影响。
- delta 合并后仍是一个 entry。
- 缺失实体、跨 Run 引用和非法 reference 被安全处理。
- includeReasoning false 时完全移除 reasoning。
- redacted reasoning 不包含原 content。
- Tool retry 新 Attempt 保留独立 entry 和 retryOf。
- 同一事件日志实时归约与 replay 结果一致。

### 14.2 组件

- 四种 kind 和全部状态渲染。
- 受控/非受控 expandedKeys。
- activeKey、键盘导航和 onActiveChange。
- item/icon/actions 自定义渲染。
- 新增、更新、失败、完成时 key 和焦点稳定。
- ToolCall、Approval 组合时不存在嵌套交互冲突。
- 500 项增量更新性能基线。
- RTL、SSR 和 `jest-axe`。

### 14.3 集成

- 客服 Demo 完整流程顺序正确。
- Approval waiting 时展开，resolved 后决策摘要一致。
- 断线恢复前后 items 和 expandedKeys 不重复。
- Command 提交状态不会制造额外 TimelineItem。

## 15. 备选方案

### 15.1 直接渲染 AgentEvent[]

不采用。delta 噪声大，并会让组件承担协议重放和生命周期合并职责。

### 15.2 直接复用 ThoughtChain

不直接复用公开 API。可复用内部样式或折叠 Hook，但 Timeline 有实体关联、活动项、稳定投影和组合 ToolCall/Approval 的独立语义。

### 15.3 Timeline 内维护自己的 Store

不采用。它会产生第二状态源，导致恢复、重放和单组件视图不一致。

### 15.4 按 timestamp 排序

不采用。Provider 时钟和并发事件可能乱序；第一阶段 sequence/order 才是确定性来源。

## 16. 验收标准

- 同一事件日志实时处理和重放得到完全相同的 Timeline 顺序。
- message、reasoning、tool、approval 各实体只对应一个稳定条目。
- ToolCall 与 Approval 使用正式组件组合，不复制其业务逻辑。
- redacted reasoning 在视觉和可访问树中均不泄露。
- 断线恢复不会产生重复条目或重置用户焦点。
- 500 项增量更新、键盘、RTL、SSR、a11y 和包体积门禁通过。
- `@ant-design/x` 与 `@ant-design/x-sdk` 保持无硬依赖。
