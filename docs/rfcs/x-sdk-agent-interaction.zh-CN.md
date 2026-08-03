# RFC：x-sdk Agent Interaction Runtime

> 状态：提议目标包：`@ant-design/x-sdk` 基线：第一阶段 Agent Event / Reducer / Store / Provider / useXChat 消费方：[ToolCall](./tool-call.zh-CN.md)、[Approval](./approval.zh-CN.md)、[AgentTimeline](./agent-timeline.zh-CN.md) 关联规划：[第二阶段详细系分](../roadmap/phase-2-breakdown.zh-CN.md) 更新日期：2026-08-04

## 1. 摘要

第一阶段已完成 Runtime 到 UI 的单向事件链路：

```text
Runtime
  -> AgentTransport
  -> AgentProvider
  -> AgentEvent
  -> AgentStore
  -> useXChat
  -> messages + agentState
```

本 RFC 在原链路上增加三项能力：

1. `AgentCommand`：将批准、拒绝、工具重试和 Run 取消等用户意图发送回 Runtime。
2. `Agent Interaction Runtime`：在 `useXChat` 中管理 agentActions、Command State 和连接状态。
3. `Checkpoint / Resume`：复用现有 AgentState 和 Store，恢复会话状态并从游标续传事件。

完成后的双向链路：

```text
Runtime -> AgentEvent -> AgentStore -> agentState -> UI
   ^                                                |
   |                                                v
   +------- AgentProvider <- AgentCommand <- agentActions
```

本 RFC 不新增 `useAgent`，不增加 `mode`，不让 UI 直接 dispatch Runtime Event，也不改变普通 ChatProvider 行为。

## 2. 第一阶段基线

以下能力已存在并直接复用：

| 能力 | 当前实现 | 第二阶段处理 |
| --- | --- | --- |
| Event 信封、类型和 payload 校验 | `agent/protocol` | 保留，仍是 Runtime 事实协议 |
| Event sequence 和 eventId 工厂 | `agent/protocol/factory.ts` | Command 返回事件继续使用 |
| AgentState 和实体生命周期 | `agent/reducer` | 增加少量可选字段，不重写 Reducer |
| Run 级幂等和实体隔离 | `processedEventIds`、`getAgentEntityKey` | 重连和命令返回事件复用 |
| Headless Store | `dispatch`、`batch`、`reset`、`subscribe` | Checkpoint 用 `reset` 恢复，不建新 Store |
| AgentProvider / AgentTransport | `chat-providers/AgentProvider.ts` | 增加可选命令与 resume 能力 |
| Provider runner | `runAgentProvider.ts` | 增加 cursor 回调和 resume 分支 |
| Provider 契约验证 | `validateAgentProviderEvents` | 扩展命令和续传验证 |
| React 接入 | `useAgentChatRuntime` | 增加 actions、commandStates、connectionState |
| 唯一 Hook 入口 | `useXChat({ provider })` | 保持不变，只扩展 AgentProvider 重载返回值 |

兼容基线：

- 普通 `AbstractChatProvider` 继续通过 XRequest 处理网络请求。
- 第一阶段 `AgentProvider` 不继承 `AbstractChatProvider`，继续绑定独立 AgentTransport。
- `isAgentProvider` 仍只通过 `provider.protocol.name === 'agent-event'` 判别。
- `messages` 继续是兼容投影，结构化实体仍在 `agentState`。
- 现有 15 个 x-sdk 测试套件、153 个测试必须继续通过。

## 3. 问题

### 3.1 没有用户意图协议

当前只有 Event。业务方如果在点击批准后直接 dispatch `approval.resolved`，会把“用户请求批准”错误地当成“Runtime 已完成批准”。Runtime 可能拒绝、超时、已处理或执行失败，因此必须增加独立 Command。

### 3.2 Provider 只支持启动 Run

当前 AgentProvider 可以：

```text
start -> prepareRequest -> transport.open -> transformChunk -> flush
```

但无法在一个活动 Run 中接收审批和重试命令，也没有声明命令能力。

### 3.3 useXChat 只有请求和 abort

当前 Agent 模式返回 `agentState`、`onRequest`、`abort` 和 `isRequesting`，没有：

- resolveApproval。
- retryTool。
- cancelRun。
- Command 提交状态。
- 连接状态。
- Checkpoint 恢复状态。

### 3.4 Transport 无法续传

当前 `AgentTransport.open(request, signal)` 不暴露 cursor，也没有 resume 方法。发生断线后只能重新开始请求，无法判断遗漏或重复事件。

## 4. 目标

- 定义版本化、可校验、幂等的 AgentCommand。
- 支持 `approval.resolve`、`tool.retry`、`run.cancel` 三种 P0 命令。
- Provider 显式声明支持的命令和 resume 能力。
- Command 返回的 Event 经过与主 Run 相同的协议边界校验。
- `useXChat` 在 AgentProvider 模式返回稳定的 agentActions。
- Command State 与 AgentState 分离。
- 支持 cursor、Checkpoint、刷新恢复和同 Run 续传。
- 提供 UI 无关的 ToolCall、Approval、Timeline selectors。
- 旧 AgentProvider 无需修改即可继续运行第一阶段能力。
- 普通 ChatProvider、XRequest、消息操作和现有重载零行为变化。

## 5. 非目标

- 不在 x-sdk 中执行工具。
- 不实现权限、审批策略和长期授权。
- 不实现 Task / Plan、Artifact 命令。
- 不实现多 Agent 协作。
- 不默认持久化敏感状态。
- 不自动重发中断前的 Command。
- 不保证 Provider 不支持 resume 时继续原 Run。
- 不新增服务端 SDK、Runtime 编排器或消息队列。
- 不把 AgentProvider 合并回 AbstractChatProvider。
- 不要求 AgentProvider 使用 XRequest；它继续使用第一阶段 AgentTransport 契约。

## 6. 总体设计

```text
useXChat({ provider, checkpointStorage, reconnect })
  |
  +-- onRequest(input)
  |     -> runAgentProvider
  |     -> AgentProvider + AgentTransport
  |     -> AgentEvent -> AgentStore
  |
  +-- agentActions.resolveApproval(...)
  +-- agentActions.retryTool(...)
  +-- agentActions.cancelRun(...)
  |     -> AgentCommandFactory
  |     -> runAgentCommand
  |     -> AgentProvider.executeCommand
  |     -> AgentEvent -> AgentStore
  |
  +-- CheckpointCoordinator
        -> save AgentState + input + cursor + pending commands
        -> restore AgentStore.reset(state)
        -> resume AgentTransport from cursor
```

状态所有权：

| 状态             | 所有者              | 说明                                        |
| ---------------- | ------------------- | ------------------------------------------- |
| AgentState       | AgentStore          | Runtime 已发生事实                          |
| Command State    | Interaction Runtime | 用户命令本地提交状态                        |
| Connection State | Interaction Runtime | 当前网络/恢复状态                           |
| Checkpoint       | CheckpointStorage   | AgentState、原始 input、cursor 和未确认命令 |
| UI 折叠/焦点     | UI 组件             | 不进入 x-sdk                                |

## 7. AgentCommand Protocol

### 7.1 版本

Command 使用独立版本：

```ts
export const AGENT_COMMAND_PROTOCOL = 'agent-command' as const;
export const AGENT_COMMAND_PROTOCOL_VERSION = '0.1' as const;
```

Command 与 AgentEvent 独立协商版本。新增 Command 不能静默改变第一阶段 `AgentEvent 0.1` 的解释。

### 7.2 Payload

```ts
export interface AgentCommandPayloadMap {
  'approval.resolve': {
    approvalId: string;
    decision: 'approved' | 'rejected' | 'modified';
    data?: unknown;
    expectedVersion?: string | number;
  };
  'tool.retry': {
    toolCallId: string;
  };
  'run.cancel': {
    reason?: string;
  };
}

export type AgentCommandType = keyof AgentCommandPayloadMap;
```

### 7.3 信封

```ts
export interface AgentCommandEnvelope<Type extends AgentCommandType> {
  commandProtocol: typeof AGENT_COMMAND_PROTOCOL;
  commandProtocolVersion: typeof AGENT_COMMAND_PROTOCOL_VERSION;
  type: Type;
  commandId: string;
  idempotencyKey: string;
  sessionId: string;
  runId: string;
  timestamp: number;
  payload: AgentCommandPayloadMap[Type];
  meta?: Readonly<Record<string, unknown>>;
}

export type AgentCommand = {
  [Type in AgentCommandType]: AgentCommandEnvelope<Type>;
}[AgentCommandType];
```

`approvalId` 和 `toolCallId` 放在判别 payload 中，不再增加含义模糊的顶层 `targetId`。

### 7.4 工厂

```ts
const commands = createAgentCommandFactory({
  sessionId,
  runId,
  now,
  createCommandId,
  createIdempotencyKey,
});

commands.create('approval.resolve', {
  approvalId,
  decision: 'approved',
  expectedVersion,
});
```

工厂要求：

- commandId 在会话内唯一。
- 默认 idempotencyKey 与 commandId 不相同，但一一绑定。
- 重发同一命令复用原 idempotencyKey。
- 用户修改 decision 或 data 后创建新命令和新幂等键。
- 测试可以注入 now、commandId 和 idempotencyKey 工厂。

### 7.5 运行时校验

提供：

```ts
isAgentCommandEnvelope(value: unknown): value is UnknownAgentCommandEnvelope;
isAgentCommand(value: unknown): value is AgentCommand;
```

校验范围：

- 协议名和版本。
- type 与 payload 判别一致。
- commandId、idempotencyKey、sessionId、runId 非空。
- timestamp 有限。
- decision 合法。
- approvalId/toolCallId 非空。
- expectedVersion 类型合法。
- meta 是普通对象。

## 8. Command State

Command State 不进入 AgentState。它表示客户端提交过程，不表示 Runtime 实体结果。

```ts
export type AgentCommandStatus = 'submitting' | 'succeeded' | 'failed';

export interface AgentCommandState {
  command: AgentCommand;
  key: string;
  status: AgentCommandStatus;
  error?: AgentCommandError;
  createdAt: number;
  updatedAt: number;
}

export interface AgentCommandError {
  code:
    | 'unsupported_capability'
    | 'invalid_command'
    | 'provider_error'
    | 'protocol_error'
    | 'interrupted';
  message: string;
  retryable: boolean;
  cause?: unknown;
}
```

Command key：

```ts
getAgentCommandKey(command): string;
getAgentActionKey({ runId, type, entityId? }): string;
```

Interaction Runtime 同时维护：

```ts
commandStates: Readonly<Record<string, AgentCommandState>>;
latestCommandByAction: Readonly<Record<string, string>>;
```

UI 通过 action key 找到实体最近一次 Command：

```ts
const actionKey = getAgentActionKey({
  runId,
  type: 'approval.resolve',
  entityId: approvalId,
});

const commandId = latestCommandByAction[actionKey];
const state = commandStates[commandId];
```

状态转换：

```text
create -> submitting
  -> Provider 完成命令流 -> succeeded
  -> Provider/协议失败 -> failed
```

约束：

- succeeded 只表示 Provider 命令流完成，不等于 ToolCall completed。
- AgentState 只能由 Event 更新。
- 相同 action 的新 Command 不删除旧状态，只更新 latestCommandByAction。
- P0 在 Run 终态后清理内存中的历史 Command State，但 Checkpoint 可保留未确认命令。

## 9. Provider 扩展

### 9.1 能力声明

```ts
export interface AgentProviderCapabilities {
  eventTypes: readonly AgentEventType[];
  transports: readonly AgentTransportKind[];
  commands?: readonly AgentCommandType[];
  resumable?: boolean;
  extensions?: Readonly<Record<`${string}.${string}`, unknown>>;
}
```

兼容规则：

- `commands` 缺失等价于空数组。
- `resumable` 缺失等价于 false。
- 第一阶段 Provider 无需修改。
- agentActions 在发送前检查 capability，失败时不调用 Provider。

### 9.2 错误分类与命令入口

```ts
export interface AgentCommandOptions {
  signal: AbortSignal;
  initialSequence: number;
  now?: () => number;
}

export interface AgentProvider<...> {
  // 第一阶段属性和方法保持不变
  classifyError?(
    error: unknown,
    context: unknown,
  ): { retryable: boolean };
  executeCommand?(
    command: AgentCommand,
    options: AgentCommandOptions,
  ): AsyncIterable<AgentEvent>;
}
```

设计理由：

- Command 可能使用与主 Run 不同的 HTTP endpoint 或双向通道。
- Provider 已经是 Runtime 适配边界，x-chat runtime 不应知道 URL、认证或 wire format。
- executeCommand 只返回标准 AgentEvent，网络和 chunk 转换仍由 Provider 内部适配。
- classifyError 缺失时错误一律按不可重试处理，保持第一阶段 Provider 的行为。
- 不在 `AbstractChatProvider` 增加 executeCommand。
- 不允许 `useXChat` 直接 fetch。

参考 AgentProvider 应优先复用自身 AgentTransport 或已有请求基础设施，不在 Hook 内实现网络请求。

### 9.3 runAgentCommand

```ts
export interface RunAgentCommandOptions {
  provider: AgentProvider<any, any, any, any>;
  command: AgentCommand;
  signal?: AbortSignal;
  initialSequence: number;
  onEvent: (event: AgentEvent) => void;
}

runAgentCommand(options): Promise<void>;
```

执行步骤：

1. 校验 Command 信封和 payload。
2. 校验 sessionId/runId 对应现有 running Run。
3. 校验 Provider commands capability。
4. 校验 executeCommand 存在。
5. 使用独立 AbortController 执行命令。
6. 遍历 Provider 返回的标准 Event。
7. 对每个 Event 校验版本、Run、capability 和 sequence。
8. 通过 onEvent 写入原 AgentStore。
9. 区分 Provider 错误、协议错误和 Consumer 错误。

与 runAgentProvider 一致，onEvent 抛出的 Consumer 错误原样传播，不能被 transform 成 Provider 错误。

### 9.4 Sequence

- Command 创建时读取 `AgentState.lastSequenceByRun[runId]`。
- executeCommand 的首个 Event sequence 必须大于 initialSequence。
- 多个并发 Command 可能竞争 sequence，因此 Provider/Runtime 是最终 sequence 分配者。
- SDK 不为远端 Event 改写 sequence。
- 收到乱序 Event 时 Store 按现有 protocolMode 处理。
- P0 对同一个 Run 串行执行交互 Command，避免客户端主动制造并发竞争。

## 10. agentActions

### 10.1 API

```ts
export interface AgentActionResult {
  commandId: string;
  idempotencyKey: string;
}

export interface AgentActions {
  resolveApproval(input: {
    runId: string;
    approvalId: string;
    decision: 'approved' | 'rejected' | 'modified';
    data?: unknown;
    expectedVersion?: string | number;
  }): Promise<AgentActionResult>;

  retryTool(input: { runId: string; toolCallId: string }): Promise<AgentActionResult>;

  cancelRun(input: { runId: string; reason?: string }): Promise<AgentActionResult>;
}
```

agentActions 方法使用 `useEvent` 保持引用稳定。调用时读取最新 Provider、session、AgentState 和 command store。

### 10.2 前置校验

resolveApproval：

- Run 存在且 status 为 running。
- Approval 存在于同一 Run。
- Approval status 为 waiting。
- decision 合法。
- modified 时 data 已提供或业务允许 undefined。
- expectedVersion 与本地状态版本一致。

retryTool：

- ToolCall 存在于同一 Run。
- ToolCall status 为 failed。
- error.retryable 为 true。
- Provider 支持 tool.retry。

cancelRun：

- Run 存在且为 running。
- Provider 支持 run.cancel。

前置校验失败不创建 Command，也不调用 Provider。

### 10.3 取消语义

`cancelRun` 与现有 `abort()` 不合并：

| API                        | 语义                                                |
| -------------------------- | --------------------------------------------------- |
| `abort()`                  | 立即中止当前本地 Transport；不保证远端停止          |
| `agentActions.cancelRun()` | 向 Runtime 请求业务取消；等待 `run.cancelled` Event |

cancelRun 执行时：

1. 先通过独立命令通道发送 run.cancel。
2. 收到 `run.cancelled` 后关闭主 Run Transport。
3. 超过超时仍未确认时 Command failed，Run 保持当前事实状态。
4. 用户仍可调用 abort 强制断开本地连接。

## 11. useXChat API

### 11.1 Agent 配置

```ts
export interface AgentReconnectOptions {
  maxAttempts?: number;      // 默认 3
  initialDelay?: number;     // 默认 500ms
  maxDelay?: number;         // 默认 5000ms
}

export interface AgentXChatConfig<...> {
  provider: AgentProvider<...>;
  conversationKey?: ConversationData['key'];
  defaultMessages?: ...;
  parser?: ...;
  checkpointStorage?: AgentCheckpointStorage;
  reconnect?: false | AgentReconnectOptions;
}
```

不增加：

```ts
useXChat({
  mode: 'agent',
  agent: { provider },
  store,
  transport,
});
```

Provider 仍是唯一执行入口，Store 和 Transport 不暴露到 Hook 顶层。

### 11.2 Agent 返回值

```ts
export type AgentConnectionState =
  'idle' | 'restoring' | 'connecting' | 'connected' | 'reconnecting' | 'unrecoverable' | 'failed';

const {
  messages,
  parsedMessages,
  agentState,
  agentActions,
  commandStates,
  latestCommandByAction,
  connectionState,
  onRequest,
  abort,
  isRequesting,
} = useXChat({
  provider,
  conversationKey,
  checkpointStorage,
  reconnect,
});
```

返回约束：

- 只有 AgentProvider 重载返回确定类型的 agentState、agentActions 和连接状态。
- 普通 ChatProvider 重载保持 agentState 为 undefined，不暴露可调用 agentActions。
- isRequesting 继续表示存在 running Run，不等价于 command submitting。
- commandStates 的更新不改 messages。
- connectionState 的更新不伪造 Run Event。

### 11.3 Connection State

```text
idle
  -> restoring -> idle/connecting/unrecoverable
  -> connecting -> connected/failed
  -> connected -> reconnecting/idle
  -> reconnecting -> connected/unrecoverable/failed
```

含义：

| 状态          | 含义                                                       |
| ------------- | ---------------------------------------------------------- |
| idle          | 没有活动连接                                               |
| restoring     | 正在读取和校验 Checkpoint                                  |
| connecting    | 正在首次连接                                               |
| connected     | 活动 Run 连接正常                                          |
| reconnecting  | 使用 cursor 尝试续传                                       |
| unrecoverable | 有活动 Run，但 Provider/Transport 不支持续传或 cursor 无效 |
| failed        | 建连或恢复重试预算已耗尽                                   |

## 12. Checkpoint

### 12.1 格式

```ts
export interface AgentCheckpoint {
  schemaVersion: 1;
  eventProtocolVersion: AgentEventProtocolVersion;
  commandProtocolVersion: AgentCommandProtocolVersion;
  sessionId: string;
  state: AgentState;
  inputByRun: Readonly<Record<string, unknown>>;
  cursorByRun: Readonly<Record<string, string>>;
  pendingCommands: readonly AgentCommand[];
  savedAt: number;
}
```

为什么包含 pendingCommands：

- 页面可能在命令提交后、确认 Event 到达前刷新。
- 恢复后先续传 Event；如果 Runtime 已处理，事件会关闭对应实体。
- 如果实体仍可操作，用户重试时复用原 idempotencyKey。
- SDK 不自动重发 pending Command，避免意外重复副作用。

为什么包含 inputByRun，而不保存 Request：

- cursor 只能标识服务端事件位置，不能在刷新后重建原请求。
- 每个活动 Run 保存调用 `onRequest` 时的原始 input；恢复时重新调用 `provider.createContext` 和 `provider.prepareRequest`。
- 不保存生成后的 Request，避免把临时认证头、连接对象或其他不可序列化内容写入 Storage。
- input 不可序列化时跳过该次 Checkpoint 持久化并记录 checkpoint error，内存中的 Run 继续执行。

### 12.2 Storage

```ts
export interface AgentCheckpointStorage {
  load(sessionId: string): Promise<AgentCheckpoint | undefined>;
  save(checkpoint: AgentCheckpoint): Promise<void>;
  remove(sessionId: string): Promise<void>;
}
```

P0 提供：

```ts
createMemoryAgentCheckpointStorage();
createWebStorageAgentCheckpointStorage(storage: Storage, options?: {
  keyPrefix?: string;
});
```

安全默认：

- useXChat 不配置 storage 时不持久化。
- Web Storage adapter 必须由业务显式传入 localStorage 或 sessionStorage。
- 文档提示业务处理用户隔离、加密、脱敏、TTL 和退出登录清理。
- Storage 错误不使当前 Run 失败，只记录 checkpoint error 并继续内存运行。

### 12.3 保存时机

- Event batch 成功提交后节流保存。
- cursor 更新后节流保存。
- Command 创建、成功或失败后保存。
- Run 终态后立即保存。
- 页面 visibilitychange 到 hidden 时尝试 flush。
- 相同会话同时只允许一个 save Promise 写入，后续更新合并。

### 12.4 恢复顺序

```text
conversationKey 确定
  -> connectionState = restoring
  -> storage.load(sessionId)
  -> 校验 schema 和协议版本
  -> store.reset(checkpoint.state)
  -> 恢复 input、cursor 和 pendingCommands
  -> 查找 running Run
      -> 无 running Run：idle
      -> 有 cursor + 支持 resume：reconnecting
      -> 否则：unrecoverable
  -> resume 成功：connected
```

在 restoring 完成前：

- messages 可先显示 defaultMessages。
- onRequest 排队，不能覆盖未恢复会话。
- agentActions 拒绝执行并返回 restoring error。

### 12.5 Checkpoint 校验失败

- 不把非法 Checkpoint 传给 store.reset。
- connectionState 进入 failed。
- 暴露可诊断错误，但不把原始敏感内容写入错误消息。
- 调用方可以 remove 后从空状态重新开始。
- P0 不做 schema migration，只识别 schemaVersion 1。

## 13. Transport Resume

### 13.1 接口

```ts
export interface AgentTransport<Request, Chunk> {
  readonly kind: AgentTransportKind;
  open(request: Request, signal: AbortSignal): AsyncIterable<Chunk>;
  getCursor?(chunk: Chunk): string | undefined;
  resume?(request: Request, cursor: string, signal: AbortSignal): AsyncIterable<Chunk>;
}
```

保持兼容：原 Transport 只实现 open 仍合法。

### 13.2 runner 增量

`RunAgentProviderOptions` 增加：

```ts
interface AgentResumeOptions {
  cursor: string;
}

interface RunAgentProviderOptions<...> {
  // 第一阶段字段保持不变
  resume?: AgentResumeOptions;
  onCursor?: (cursor: string) => void;
}
```

规则：

- 无 resume 时调用 transport.open。
- 有 resume 时必须同时满足 capabilities.resumable 和 transport.resume 存在。
- resume 分支从 inputByRun 重新创建 Context 和 Request，跳过 provider.start，避免重复产生 run.started。
- open 和 resume 分支共用 transformChunk、Event 校验/分发和 flush 流程。
- 每个 chunk 的 Event 全部成功 dispatch 后调用 getCursor；返回值非空才触发 onCursor。
- cursor 必须在对应 Event 成功 dispatch 后保存，不能先保存再处理事件。
- resume 返回重复 Event 时由 processedEventIds 幂等吸收。
- resume 返回 sequence 缺口或非法 Event 时按协议错误失败。

### 13.3 重试策略

- 只对 Provider 标记为 retryable 的 Transport 错误自动重连。
- Provider 未实现 classifyError 时，错误不可重试，直接沿用第一阶段的 transformError 流程。
- 指数退避受 reconnect 配置限制。
- AbortError、协议错误、Consumer 错误不自动重连。
- cursor 无效时进入 unrecoverable，不从头重放活动 Run。
- 每次重连复用同一 runId，并从原 input 重新创建 Context 和 Request。
- retryable Transport 中断在重连预算耗尽前不得调用 transformError，也不得产生 run.failed。
- 重连预算耗尽后调用 transformError，由 Provider 产生最终失败 Event。

## 14. Selectors

selectors 位于 `agent/selectors`，保持纯函数和 UI 无关：

```ts
selectRun(state, runId);
selectToolCall(state, { runId, toolCallId });
selectApproval(state, { runId, approvalId });
selectAgentTimeline(state, { runId, includeReasoning });
selectRunningRuns(state, sessionId);
```

约束：

- 使用 getAgentEntityKey，不能手拼实体键。
- 找不到实体返回 undefined 或空数组，不抛 UI 错误。
- Timeline 顺序使用 AgentState.order，不按 timestamp 重排。
- redacted reasoning 不返回 content。
- selector 返回 serializable domain data，不返回 ReactNode，不导入 `@ant-design/x`。
- 相同 state 引用和参数尽可能返回稳定引用，减少流式渲染。

## 15. 状态模型增量

### 15.1 ToolCall Attempt

```ts
interface AgentEventPayloadMap {
  'tool.requested': {
    // 第一阶段字段保持不变
    attempt?: number;
    retryOf?: string;
  };
}

interface AgentToolCallState {
  // 第一阶段字段保持不变
  attempt?: number;
  retryOf?: string;
}
```

规则：

- 首次调用 attempt 默认 1。
- retry 必须使用新 toolCallId。
- retryOf 指向前一个 ToolCall 的 id。
- Reducer 不将终态 ToolCall 改回 running。

### 15.2 Approval 编辑与版本

```ts
interface AgentEventPayloadMap {
  'approval.requested': {
    // 第一阶段字段保持不变
    editable?: boolean;
    expiresAt?: number;
    version?: string | number;
  };
}

interface AgentApprovalState {
  // 第一阶段字段保持不变
  editable?: boolean;
  expiresAt?: number;
  version?: string | number;
}
```

字段均为可选，第一阶段 Provider 继续兼容。Runtime 是版本冲突和过期的最终判断者。

## 16. 错误模型

| 错误                   | 归属                   | AgentState 是否变化    | 是否可重试           |
| ---------------------- | ---------------------- | ---------------------- | -------------------- |
| Command payload 非法   | SDK                    | 否                     | 否                   |
| Provider 不支持命令    | SDK capability         | 否                     | 否                   |
| Command Transport 失败 | Command State          | 否                     | 由错误决定           |
| Command 返回非法 Event | 协议错误               | 否或 strict batch 回滚 | 否                   |
| Runtime 拒绝审批       | AgentEvent             | 是                     | 由 Runtime 决定      |
| Tool 执行失败          | AgentEvent             | 是                     | error.retryable 决定 |
| Checkpoint 保存失败    | Checkpoint coordinator | 否                     | 后续保存重试         |
| Resume cursor 失效     | Connection State       | 否                     | 新 Run               |

错误隔离原则：

- Command 错误不伪造 Tool/Approval Error。
- Connection 错误不伪造 run.failed。
- retryable Transport 错误只有在重连预算耗尽后才交给 transformError。
- 只有 Runtime Event 可以改变 AgentState 事实。
- 错误 cause 不进入序列化 Checkpoint。

## 17. 并发与竞态

P0 规则：

- 同一个 Run 的交互 Command 串行执行。
- 不同 Run 可以并行。
- 同一 Approval submitting 时拒绝第二次 resolve。
- 同一 ToolCall submitting retry 时拒绝第二次 retry。
- Run 进入终态后拒绝新 Command。
- Event 先于 executeCommand Promise 完成时，以 Event 为事实，Command 最终标记 succeeded。
- cancelRun 与其他 Command 竞争时，cancelRun 优先阻止后续命令创建。
- conversationKey 切换时取消旧会话的本地 Command controller，但不清空其 AgentStore。

## 18. 文件改动

```text
packages/x-sdk/src/
├── agent/
│   ├── command/
│   │   ├── commands.ts
│   │   ├── factory.ts
│   │   ├── validate.ts
│   │   ├── index.ts
│   │   └── __test__/
│   ├── protocol/events.ts
│   ├── reducer/
│   │   ├── state.ts
│   │   └── reduceAgentState.ts
│   ├── selectors/
│   │   ├── entities.ts
│   │   ├── selectAgentTimeline.ts
│   │   ├── index.ts
│   │   └── __test__/
│   └── index.ts
├── chat-providers/
│   ├── AgentProvider.ts
│   ├── runAgentCommand.ts
│   ├── runAgentProvider.ts
│   ├── testing/
│   │   ├── validateAgentProviderEvents.ts
│   │   └── validateAgentProviderCommands.ts
│   ├── __test__/
│   └── index.ts
├── x-chat/
│   ├── agentRuntime.ts
│   ├── agentCommandStore.ts
│   ├── agentCheckpoint.ts
│   ├── agentConnection.ts
│   ├── __test__/
│   └── index.ts
└── index.ts
```

参考 Provider：

```text
packages/x-sdk/src/chat-providers/OpenAICompatibleAgentProvider.ts
packages/x-sdk/src/chat-providers/__test__/OpenAICompatibleAgentProvider.test.ts
```

文档：

```text
packages/x-sdk/README.md
packages/x-sdk/README-zh_CN.md
packages/x/docs/x-sdk/agent-provider.en-US.md
packages/x/docs/x-sdk/agent-provider.zh-CN.md
packages/x/docs/x-sdk/use-x-chat.en-US.md
packages/x/docs/x-sdk/use-x-chat.zh-CN.md
```

## 19. 串行实施顺序

| 顺序 | 工作项 | 交付物 | 门禁 |
| --: | --- | --- | --- |
| 1 | Command 协议 | 类型、工厂、validator、测试 | 合法/非法/幂等测试通过 |
| 2 | 状态字段和 selectors | Attempt、Approval 字段、四类 selector | 第一阶段 replay 测试无回归 |
| 3 | Provider command | capability、executeCommand、runner | Run/sequence/capability 契约通过 |
| 4 | Command Store | commandStates、action key、竞态控制 | 同实体防重复提交 |
| 5 | agentActions | resolveApproval、retryTool、cancelRun | Hook 集成测试通过 |
| 6 | Transport resume | cursor、resume、连接状态 | 重复/缺口/cursor 失效测试通过 |
| 7 | Checkpoint | storage、input、save/restore、pending commands | 恢复与 replay 结果一致 |
| 8 | 参考 Provider | OpenAI Compatible 事件映射 | Provider 契约测试通过 |
| 9 | 文档与发布 | 双语文档、Demo、API/size 检查 | 全部现有门禁通过 |

一次只允许一个工作项进入实现；每项完成类型、单测、文档后再进入下一项。

## 20. 测试计划

### 20.1 Command

- 三种 payload 的合法、非法和未知字段策略。
- commandId、idempotencyKey 注入和重发。
- 协议版本不兼容。
- 同实体重复提交。
- Run/Approval/ToolCall 缺失或终态。
- unsupported capability。

### 20.2 Provider runner

- 命令返回合法事件并写入同一 Store。
- 跨 session/run Event 被拒绝。
- sequence 非递增和 capability 未声明。
- Provider、协议、Consumer 错误隔离。
- AbortSignal 传播和监听器清理。

### 20.3 useXChat

- AgentProvider 重载返回完整 API。
- 普通 ChatProvider 返回值和行为不变。
- agentActions 引用稳定并读取最新状态。
- commandStates 更新不影响 messages。
- isRequesting 与 submitting 区分。
- cancelRun 与 abort 语义区分。
- conversationKey 切换和卸载清理。

### 20.4 Checkpoint / Resume

- 空、合法、损坏和版本不兼容 Checkpoint。
- Store reset 后状态与 replay 一致。
- 原始 input 可持久化并能重新生成 Context 和 Request；生成后的 Request 不进入 Storage。
- input 不可序列化时记录错误但不中止内存中的 Run。
- cursor 只在 Event 成功 dispatch 后保存。
- 重复 Event 被吸收。
- resume 跳过 provider.start，不重复产生 run.started，并继续复用 transformChunk 和 flush。
- sequence 缺口、cursor 失效和 Provider 不支持 resume。
- retryable 中断在预算内不调用 transformError，预算耗尽后只调用一次。
- pending Command 不自动重发，用户重试复用幂等键。
- Storage 失败不终止当前 Run。

### 20.5 回归

- 第一阶段 153 个测试全部通过。
- XRequest、普通 ChatProvider、消息操作和 defaultMessages 无回归。
- 包入口导出、Node/SSR、TypeScript、API diff 和 Bundle Size 通过。
- 新增代码覆盖率不低于 85%，Command/Checkpoint 状态转换分支达到 100%。

## 21. 兼容与发布

### 21.1 兼容矩阵

| Provider | 第一阶段运行 | agentActions | Resume |
| --- | --- | --- | --- |
| 旧 AgentProvider | 支持 | 返回 unsupported capability | 不支持，断线后 unrecoverable |
| 新 Provider，仅 commands | 支持 | 支持声明的命令 | 不支持 |
| 新 Provider，仅 resume | 支持 | 返回 unsupported capability | 支持 |
| 完整新 Provider | 支持 | 支持 | 支持 |
| 普通 ChatProvider | 行为不变 | 不暴露 | 使用原 XRequest 语义 |

### 21.2 实验性出口

- Command、selectors、Checkpoint 继续通过 `experimentalAgent` 暴露。
- AgentProvider 扩展和 runAgentCommand 从 chat-providers 出口暴露。
- useXChat Agent 重载公开，但文档标记 experimental。
- 至少一个参考 Provider、三个组件和完整 Demo 通过后再评估稳定化。

## 22. 备选方案

### 22.1 新增 useAgent Hook

不采用。第一阶段已经选择 useXChat 作为唯一 React 入口；新增 Hook 会让消息、会话和 Agent 状态产生两套集成方式。

### 22.2 将 Command 做成 Event

不采用。用户意图与 Runtime 事实语义不同，混用会允许 UI 伪造完成状态。

### 22.3 UI 直接调用 Provider

不采用。会绕过 capability、幂等、Command State、Checkpoint 和错误边界。

### 22.4 AgentProvider 继承 AbstractChatProvider

不采用。普通消息 Provider 和结构化 AgentProvider 的生命周期不同，第一阶段已经建立显式协议判别。

### 22.5 强制所有 AgentProvider 使用 XRequest

不采用。AgentProvider 已支持 SSE、WebSocket 和 AsyncIterable Transport；强制 XRequest 会限制 Runtime 和恢复能力。普通 ChatProvider 仍遵守 AbstractChatProvider + XRequest 约束。

### 22.6 自动重发 pending Command

不采用。即使有幂等键，也不能假设所有 Runtime 正确实现；恢复时先补 Event，再让用户确认重试。

## 23. 验收标准

- 第一阶段 Event -> Store -> useXChat 链路零回归。
- 三种 Command 有版本、校验、幂等和 capability 契约。
- UI 不能直接伪造 approval/tool/run 终态。
- agentActions、Command State、AgentState 和 Connection State 职责清晰且可独立测试。
- Tool retry 创建新 Attempt，不覆盖历史失败实体。
- cancelRun 与 abort 语义明确且行为不同。
- Checkpoint 恢复结果与完整 Event replay 一致。
- Provider 不支持命令或 resume 时，在调用前可发现并明确失败。
- 旧 AgentProvider 和普通 ChatProvider 保持兼容。
- ToolCall、Approval、AgentTimeline 只依赖 selectors 和 actions，不依赖 Provider 内部实现。
- 类型、测试、SSR、API diff、Bundle Size 和双语文档门禁通过。
