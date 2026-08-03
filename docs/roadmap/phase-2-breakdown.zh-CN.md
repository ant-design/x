# Ant Design X 第二阶段详细系分

> 对应路线图：2026-10 至 2026-12「Agent Interaction Kit」基线：第一阶段当前实现执行方式：单执行者、串行交付更新日期：2026-08-03

## 1. 一句话说明

第一阶段已经让 `x-sdk` 能把 Agent Runtime 的事件变成前端状态；第二阶段不重做这条链路，而是在它上面补齐：

1. 用户点击“批准、拒绝、重试、取消”后，命令如何返回 Agent Runtime。
2. `@ant-design/x` 如何把工具调用、审批和执行过程展示成正式组件。
3. 断线或刷新后，现有 Agent 状态如何恢复并继续接收事件。

最终只交付一条完整闭环：

```text
Agent 发起工具调用
  -> 页面展示工具名称和参数
  -> Agent 请求人工审批
  -> 用户允许、拒绝或修改后执行
  -> 命令发送回 Runtime
  -> Runtime 返回工具执行事件
  -> 页面展示结果或错误
  -> 全过程进入 Timeline
  -> 中途断线后可以续传
```

## 2. 第一阶段已经完成什么

以下内容直接复用，不在第二阶段重新实现。

| 已完成能力 | 当前文件 | 第二阶段怎么用 |
| --- | --- | --- |
| Agent Event 类型和运行时校验 | `packages/x-sdk/src/agent/protocol/` | 继续作为 Runtime 到前端的唯一事实协议 |
| 事件工厂和 sequence 生成 | `packages/x-sdk/src/agent/protocol/factory.ts` | 参考 Provider 继续使用同一事件工厂 |
| 消息、推理、工具、审批、任务和 Artifact 状态 | `packages/x-sdk/src/agent/reducer/state.ts` | ToolCall、Approval 和 Timeline 直接消费这些状态 |
| 纯函数 Reducer 和事件重放 | `packages/x-sdk/src/agent/reducer/` | 继续保证幂等、Run 隔离和可重放 |
| Headless AgentStore | `packages/x-sdk/src/agent/store/` | 复用 `dispatch`、`batch`、`reset` 和 `subscribe` |
| AgentProvider / AgentTransport 契约 | `packages/x-sdk/src/chat-providers/AgentProvider.ts` | 在现有接口上增加可选命令和恢复能力 |
| Provider runner 和边界校验 | `packages/x-sdk/src/chat-providers/runAgentProvider.ts` | 继续负责启动请求和接收标准事件 |
| Provider 契约测试工具 | `packages/x-sdk/src/chat-providers/testing/` | 扩展命令和恢复契约测试 |
| `useXChat({ provider })` Agent 分支 | `packages/x-sdk/src/x-chat/` | 在现有返回值上增加 `agentActions` 和连接状态 |
| `messages` 兼容投影 | `packages/x-sdk/src/x-chat/agentRuntime.ts` | Bubble 等现有消息 UI 继续工作 |

当前测试基线：

- `@ant-design/x-sdk` 15 个测试套件、153 个测试全部通过。
- 当前整体语句覆盖率 94.42%，分支覆盖率 81.12%。
- Agent Reducer、Store、Provider runner 和 `useXChat` Agent 分支均已有测试。

## 3. 第一阶段还不能做什么

第一阶段是单向数据流：

```text
Runtime -> AgentProvider -> AgentEvent -> AgentStore -> useXChat -> 页面
```

当前缺口：

- `Approval` 状态能进入 Store，但用户无法通过标准 API 回传批准或拒绝。
- `ToolCall` 状态能表示 running/completed/failed，但还没有正式 UI 和标准重试命令。
- `abort()` 只中止本地请求，没有统一的 Runtime 取消确认。
- `useXChat` 没有 `agentActions`、Command 提交状态和连接状态。
- `@ant-design/x` 没有 ToolCall、Approval、AgentTimeline 正式组件。
- AgentTransport 没有游标和 resume 契约。
- Store 状态可序列化，但没有 Checkpoint 格式和恢复流程。
- 当前 `OpenAIChatProvider` 是普通消息 Provider，不是结构化 AgentProvider。

第二阶段只解决这些已经暴露出来的缺口。

## 4. 第二阶段具体交付

### 4.1 [`@ant-design/x-sdk`](../rfcs/x-sdk-agent-interaction.zh-CN.md)

新增四项能力：

1. `AgentCommand`：定义用户意图。
2. `runAgentCommand`：将命令交给 Provider，并把返回事件写入原 Store。
3. `agentActions`：让 React 页面调用批准、拒绝、重试和取消。
4. Checkpoint + Resume：保存状态和游标，恢复后续传遗漏事件。

### 4.2 `@ant-design/x`

新增三个正式组件：

1. [`ToolCall`](../rfcs/tool-call.zh-CN.md)：展示工具名称、参数、执行状态、结果、错误和重试。
2. [`Approval`](../rfcs/approval.zh-CN.md)：展示风险与参数，支持允许、拒绝、修改后执行。
3. [`AgentTimeline`](../rfcs/agent-timeline.zh-CN.md)：按执行顺序展示消息、推理、工具和审批。

### 4.3 文档与 Demo

只做一个客服 Agent Demo，覆盖全部 P0 能力：

```text
查询订单 -> 申请退款 -> 人工审批 -> 执行退款 -> 查看结果
```

Demo 默认使用确定性本地 Runtime，不需要密钥；同时提供切换真实参考 Runtime 的接口。

## 5. 第二阶段明确不做什么

单执行者不能在一个阶段内同时做好所有路线图条目，因此以下内容顺延：

- 不开发 Task / Plan 正式组件。
- 不开发 Artifact 正式组件和多种内容编辑器。
- 不开发 Anthropic 正式 AgentProvider。
- 不开发数据分析和研发 Agent 模板。
- 不实现多 Agent 协作。
- 不实现 IndexedDB 默认持久化，只提供内存实现和显式启用的 Web Storage 参考适配器。
- 不在浏览器自动执行任意工具；工具始终由 Runtime 执行。
- 不将实验性 Agent API 升级为稳定 API。

Task 和 Artifact 的第一阶段事件状态继续保留，但第二阶段不为它们增加 UI 和命令。

## 6. SDK：增加用户命令链路

### 6.1 为什么需要 Command

`AgentEvent` 是已经发生的事实，例如 `approval.resolved`。用户点击“允许”只是一个请求，不能由前端直接伪造成事实。

正确流程：

```text
用户点击允许
  -> 前端创建 approval.resolve Command
  -> Provider 发送给 Runtime
  -> Runtime 完成处理
  -> Runtime 返回 approval.resolved Event
  -> Reducer 更新 Approval 状态
```

### 6.2 P0 命令

```ts
type AgentCommandPayloadMap = {
  'approval.resolve': {
    decision: 'approved' | 'rejected' | 'modified';
    data?: unknown;
  };
  'tool.retry': {
    toolCallId: string;
  };
  'run.cancel': {
    reason?: string;
  };
};
```

每个命令都包含：

```ts
interface AgentCommandEnvelope<Type extends AgentCommandType> {
  commandProtocolVersion: '0.1';
  type: Type;
  commandId: string;
  idempotencyKey: string;
  sessionId: string;
  runId: string;
  targetId?: string;
  timestamp: number;
  payload: AgentCommandPayloadMap[Type];
}
```

关键规则：

- 相同 `idempotencyKey` 重发不能重复执行退款等副作用。
- Command 提交成功不代表工具执行成功，必须等待 Event。
- Command 网络失败只更新 Command 自身状态，不能把 ToolCall 标成 failed。
- Tool 重试产生新的 ToolCall Attempt，不能覆盖原失败记录。
- Provider 不支持某个命令时，在发送前返回 `unsupported_capability`。

### 6.3 修改的 SDK 文件

```text
packages/x-sdk/src/
├── agent/
│   ├── command/
│   │   ├── commands.ts                 # Command 类型和运行时校验
│   │   ├── factory.ts                  # commandId / idempotencyKey 工厂
│   │   ├── index.ts
│   │   └── __test__/
│   ├── protocol/events.ts              # Tool Attempt、Approval 可编辑信息
│   ├── reducer/state.ts                # 对应只读状态字段
│   └── selectors/                      # Tool、Approval、Timeline 只读投影
├── chat-providers/
│   ├── AgentProvider.ts                # commands capability + executeCommand
│   ├── runAgentCommand.ts              # 命令执行和返回事件校验
│   ├── testing/                         # Command 契约测试
│   └── __test__/
└── x-chat/
    ├── agentRuntime.ts                 # agentActions 和 Command State
    ├── agentCheckpoint.ts              # Checkpoint 保存与恢复
    └── index.ts                        # Agent 模式公开返回类型
```

### 6.4 Provider 增量

现有 Provider 方法全部保留，只增加可选能力：

```ts
interface AgentProviderCapabilities {
  eventTypes: readonly AgentEventType[];
  transports: readonly AgentTransportKind[];
  commands?: readonly AgentCommandType[];
  resumable?: boolean;
}

interface AgentProvider<...> {
  // 第一阶段已有方法保持不变
  executeCommand?(
    command: AgentCommand,
    options: AgentCommandOptions,
  ): AsyncIterable<AgentEvent>;
}
```

`runAgentCommand` 复用第一阶段的事件校验规则：

- 返回事件必须属于原 sessionId 和 runId。
- sequence 必须继续递增。
- 事件类型必须在 Provider capability 中声明。
- 非法事件不能进入 AgentStore。

### 6.5 `useXChat` 最终用法

```tsx
const { messages, agentState, agentActions, commandStates, connectionState, onRequest } = useXChat({
  provider,
  checkpointStorage,
});

await agentActions.resolveApproval({
  runId,
  approvalId,
  decision: 'approved',
});

await agentActions.retryTool({ runId, toolCallId });
await agentActions.cancelRun({ runId });
```

`commandStates[commandId]` 只表示命令是否正在提交；ToolCall 和 Approval 的业务状态仍以 `agentState` 为准。

`connectionState` 的 P0 状态固定为 `idle | restoring | connecting | connected | reconnecting | unrecoverable | failed`。`cancelRun` 先向 Runtime 发送取消命令，收到 `run.cancelled` 后再进入业务终态；现有 `abort()` 保留为只中止本地连接的紧急操作。

## 7. UI：新增三个组件

组件只负责显示和抛出用户操作，不直接引用 Provider，也不修改 AgentStore。

`@ant-design/x` 不增加对 `@ant-design/x-sdk` 的硬依赖。组件定义纯展示 ViewModel；`x-sdk` selectors 返回结构兼容的数据，应用层负责把两者组合。

### 7.1 ToolCall

用户看到：

- 工具名称。
- 流式参数或格式化 JSON 参数。
- pending、running、completed、failed、cancelled 状态。
- 执行结果或错误原因。
- 可重试错误的重试按钮。
- 可折叠的参数和结果详情。

公开接口草案：

```tsx
<ToolCall
  item={toolCallViewModel}
  submitting={retryCommandState === 'submitting'}
  onRetry={() => agentActions.retryTool({ runId, toolCallId })}
/>
```

新增目录：

```text
packages/x/components/tool-call/
├── index.tsx
├── interface.ts
├── style/index.ts
├── demo/
├── __tests__/
├── index.zh-CN.md
└── index.en-US.md
```

### 7.2 Approval

用户看到：

- Agent 准备执行的操作。
- low、medium、high 风险提示。
- 待执行参数。
- 允许、拒绝、修改后执行三个操作。
- 命令提交中、已处理、已过期和提交失败状态。

公开接口草案：

```tsx
<Approval
  item={approvalViewModel}
  submitting={resolveCommandState === 'submitting'}
  onResolve={(decision, data) =>
    agentActions.resolveApproval({ runId, approvalId, decision, data })
  }
/>
```

P0 的“修改后执行”使用调用方传入的编辑区域和校验函数，不开发通用 JSON Schema 表单引擎。

新增目录：

```text
packages/x/components/approval/
├── index.tsx
├── interface.ts
├── style/index.ts
├── demo/
├── __tests__/
├── index.zh-CN.md
└── index.en-US.md
```

### 7.3 AgentTimeline

Timeline 不保存新状态，而是从第一阶段 `AgentState.order` 派生：

```text
message -> reasoning -> tool -> approval -> tool result -> message
```

P0 只支持消息、推理、工具和审批。相同 ToolCall 的参数增量、运行和结果合并成一个条目，避免把每个 Event 都显示成一行。

公开接口草案：

```tsx
<AgentTimeline
  items={selectAgentTimeline(agentState, runId)}
  onItemFocus={(item) => scrollToEntity(item.entityId)}
/>
```

新增目录：

```text
packages/x/components/agent-timeline/
├── index.tsx
├── interface.ts
├── style/index.ts
├── demo/
├── __tests__/
├── index.zh-CN.md
└── index.en-US.md
```

### 7.4 组件公共改动

还会修改：

```text
packages/x/components/index.ts                 # 导出三个组件
packages/x/components/theme/interface/         # 增加组件 Token 类型
packages/x/components/x-provider/context.ts    # 增加组件级全局配置
```

复用现有能力：

- ToolCall 的复制和重试动作复用 `Actions`。
- 参数和代码结果复用 `CodeHighlighter`。
- Timeline 的折叠和状态视觉参考 `ThoughtChain`，但不复用其业务类型。

## 8. 最小恢复能力

### 8.1 复用第一阶段能力

- `AgentState` 已经可以 JSON 序列化。
- `AgentStore.reset(state)` 已经可以恢复一份状态。
- 重复 eventId 已经幂等。
- `lastSequenceByRun` 已经记录每个 Run 的最后 sequence。

因此第二阶段不再新写另一套 Store，只补 Checkpoint 格式和 Transport 游标。

### 8.2 Checkpoint

```ts
interface AgentCheckpoint {
  schemaVersion: 1;
  sessionId: string;
  state: AgentState;
  inputByRun: Readonly<Record<string, unknown>>;
  cursorByRun: Readonly<Record<string, string>>;
  savedAt: number;
}

interface AgentCheckpointStorage {
  load(sessionId: string): Promise<AgentCheckpoint | undefined>;
  save(checkpoint: AgentCheckpoint): Promise<void>;
  remove(sessionId: string): Promise<void>;
}
```

P0 提供内存 Storage、自定义接口和显式启用的 `createWebStorageCheckpointStorage` 参考适配器。默认不把敏感 Agent 数据写入浏览器；客服 Demo 明确选择 `sessionStorage` 来验证刷新恢复。

### 8.3 Transport Resume

在现有 `AgentTransport` 上增加可选方法：

```ts
interface AgentTransport<Request, Chunk> {
  open(request: Request, signal: AbortSignal): AsyncIterable<Chunk>;
  getCursor?(chunk: Chunk): string | undefined;
  resume?(request: Request, cursor: string, signal: AbortSignal): AsyncIterable<Chunk>;
}
```

恢复顺序：

```text
读取 Checkpoint
  -> store.reset(checkpoint.state)
  -> 用 inputByRun 重新创建 Context 和 Request
  -> 获取活动 Run 的 cursor
  -> transport.resume(request, cursor)
  -> Provider 转换补传 chunk
  -> Store 忽略重复事件并归约新事件
```

Provider 不支持 `resume` 时，`connectionState` 明确进入 `unrecoverable`，页面只能创建新 Run，不能假装已续传。

## 9. 参考 Provider 和 Demo

### 9.1 Provider

新增一个结构化 AgentProvider，而不是修改现有普通 `OpenAIChatProvider`：

```text
packages/x-sdk/src/chat-providers/OpenAICompatibleAgentProvider.ts
packages/x-sdk/src/chat-providers/__test__/OpenAICompatibleAgentProvider.test.ts
```

P0 覆盖：

- 文本增量。
- reasoning 增量存在时的映射。
- ToolCall 参数增量和完成状态。
- AbortSignal。
- Runtime 支持时的 cursor resume。

Approval 不是所有模型 API 的原生能力。客服 Demo 的 Approval 由参考 Runtime 发出，Provider 只按统一协议传递，不伪造模型能力。

### 9.2 客服 Demo

新增一个完整 Demo，不拆成多个只能展示外观的小 Demo：

```text
packages/x/docs/x-sdk/demos/x-chat/agent-interaction.tsx
packages/x/docs/x-sdk/demos/x-chat/agent-interaction.md
```

必须演示：

1. 用户输入订单号。
2. `queryOrder` ToolCall 完成。
3. `refundOrder` 触发 high-risk Approval。
4. 用户拒绝后 Run 正常结束。
5. 用户允许后进入 tool.running 并返回结果。
6. 用户修改退款金额后执行修改值。
7. 工具失败后创建新 Attempt 重试。
8. 流式中断后从 cursor 恢复。

## 10. 串行实施顺序

一次只做一个步骤。每一步代码、测试和文档通过后再进入下一步。

| 顺序 | 我要做的事 | 完成后你能看到什么 | 完成标准 |
| --: | --- | --- | --- |
| 1 | 加 AgentCommand 类型、工厂和校验 | SDK 能创建三种合法命令 | 畸形命令被拒绝；幂等键稳定 |
| 2 | 扩展 AgentProvider 和 `runAgentCommand` | 命令能发给 Runtime，返回事件进入原 Store | session/run/sequence/capability 校验通过 |
| 3 | 给 `useXChat` 增加 `agentActions` | React 页面能批准、拒绝、重试和取消 | Command State 与 Entity State 分离 |
| 4 | 开发 ToolCall | 页面能看工具参数、状态、结果并重试 | 单测、键盘、语义 DOM、双语文档通过 |
| 5 | 开发 Approval | 页面能允许、拒绝、修改后执行 | 防重复提交、校验和焦点行为通过 |
| 6 | 开发 AgentTimeline | 页面能按顺序查看完整工具闭环 | 重放同一日志得到相同 Timeline |
| 7 | 增加 Checkpoint 和 resume | 断线后已有内容保留并补传新事件 | 重复事件不重复显示；不支持时明确失败 |
| 8 | 增加参考 Provider 和客服 Demo | 一个页面可演示全部 P0 能力 | 正常、拒绝、修改、失败、恢复 E2E 通过 |
| 9 | 做发布收口 | API、文档、包体积和回归可发布 | 全部门禁通过，不夹带未完成 P1 |

## 11. 验收标准

### 11.1 SDK

- 第一阶段 153 个测试继续全部通过。
- 三种 Command 均有合法、非法、重复和 capability 不支持测试。
- UI 不能直接 dispatch `approval.resolved` 代替 Runtime 响应。
- Tool 重试产生新 Attempt，原失败记录保留。
- AgentProvider 不支持命令或 resume 时，在调用前可发现。
- Checkpoint 恢复结果与完整事件重放结果一致。

### 11.2 组件

- ToolCall、Approval、AgentTimeline 均有独立导出、Token、语义 DOM、Demo 和双语文档。
- 仅使用键盘可以展开详情、重试、允许、拒绝和修改后执行。
- 按钮提交中不可重复点击，完成后焦点位置可预期。
- loading、running、failed、completed 和风险信息可被 Screen Reader 感知。
- `jest-axe` 无严重违规，基础颜色和焦点样式满足 WCAG 2.1 AA。

### 11.3 完整场景

- 客服 Demo 的正常、拒绝、修改、失败重试和断线恢复路径全部通过。
- 从安装到完成首次审批闭环不超过 15 分钟。
- 确定性 Runtime 和真实参考 Runtime 使用同一套组件与 `agentActions`。
- 文档 Demo 在 CI 中编译通过。

## 12. 第二阶段完成后的边界

第二阶段完成后，Ant Design X 将具备第一个真正可操作的 Agent 交互闭环，但还不是完整 Agent 工作台。

下一阶段再基于这套 Event + Command + Component 模型扩展：

1. Task / Plan。
2. Artifact。
3. Anthropic Provider。
4. 数据分析和研发 Agent 模板。
5. IndexedDB 持久化和更完整的后台任务恢复。

这些能力必须复用第二阶段的 Command、Attempt、Checkpoint 和受控组件边界，不能再建立新的执行通道。
