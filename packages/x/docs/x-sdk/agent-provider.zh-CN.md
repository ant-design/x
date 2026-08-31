---
category: Components
group:
  title: 数据提供
  order: 2
title: Agent Provider
subtitle: Agent 事件接入
description: 将任意模型或 Agent Runtime 适配为统一事件流。
order: 2
packageName: x-sdk
tag: 2.10.0
---

AgentProvider 是模型与 Runtime 无关的 Agent 接入契约。它将 SSE、WebSocket、本地 Runtime、录制数据等任意输入转换为统一的 Agent Event，由 `useXChat` 内部的 AgentStore 归约为消息和结构化状态。

```text
Model / Agent Runtime / Fixture
  -> AgentProvider（绑定 Transport）
  -> AgentEvent
  -> AgentStore
  -> useXChat
  -> messages + agentState
```

前端入口始终是 `useXChat({ provider })`。不需要增加 `useAgent`，也不需要传入 `mode`、`agent`、`transport` 或 `store`。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-chat/agent-provider.tsx">通用 AgentProvider</code>
<code src="./demos/x-chat/agent-interaction.tsx">Agent 命令交互</code>

## 快速使用

```tsx | pure
import { useXChat } from '@ant-design/x-sdk';

const { messages, agentState, onRequest, abort, isRequesting } = useXChat({
  provider,
  conversationKey: 'conversation-1',
});

onRequest({ prompt: '分析这份报告' });
```

- `messages` 是 `AgentMessageState` 到 `MessageInfo[]` 的兼容投影，可直接交给 Bubble 等消息组件。
- `agentState` 保留 runs、reasoning、toolCalls、approvals、tasks 和 artifacts 等完整状态。
- `abort()` 取消当前 Run；Provider 应将中断转换为实体取消事件和 `run.cancelled`。

## Provider 契约

```ts
interface AgentProvider<Input, Request, Chunk, Context = unknown> {
  readonly id: string;
  readonly protocol: {
    readonly name: 'agent-event';
    readonly version: '0.1';
  };
  readonly capabilities: AgentProviderCapabilities;
  readonly transport: AgentTransport<Request, Chunk>;

  createContext(options: AgentProviderContextOptions): Context;
  start(input: Input, context: Context): readonly AgentEvent[];
  prepareRequest(input: Input, context: Context): Request;
  transformChunk(chunk: Chunk, context: Context): readonly AgentEvent[];
  flush(context: Context): readonly AgentEvent[];
  transformError(error: unknown, context: Context): readonly AgentEvent[];
  executeCommand?(command: AgentCommand, options: AgentCommandOptions): AsyncIterable<AgentEvent>;
}
```

| 成员             | 职责                                                          |
| ---------------- | ------------------------------------------------------------- |
| `id`             | Provider 唯一标识，只作为元信息，不参与能力判断               |
| `protocol`       | 显式声明事件协议和版本，`useXChat` 通过它识别 AgentProvider   |
| `capabilities`   | 声明可能输出的事件类型和 Transport 类型                       |
| `transport`      | 绑定请求执行方式，前端不单独配置                              |
| `createContext`  | 创建单次 Run 的跨 Chunk 解析上下文                            |
| `start`          | 产生 Run、用户消息或初始实体事件                              |
| `prepareRequest` | 将 `onRequest` 输入转换为 Runtime 请求                        |
| `transformChunk` | 将一个 Chunk 转换为零到多个标准事件                           |
| `flush`          | 流结束时关闭剩余实体并产生 Run 终态                           |
| `transformError` | 将异常或中断转换为失败/取消事件                               |
| `executeCommand` | 执行 UI 发起的审批、工具重试或 Run 取消命令，并返回标准事件流 |

Provider 不负责 React 渲染、维护另一套消息状态、执行工具或根据模型名称猜测能力。

## 命令交互

Provider 通过 `capabilities.commands` 声明支持的命令，并通过 `executeCommand` 将命令交给 Runtime：

```tsx | pure
const capabilities = {
  eventTypes: [
    'approval.resolved',
    'tool.requested',
    'tool.running',
    'tool.completed',
    'run.cancelled',
  ],
  transports: ['company.sse'],
  commands: ['approval.resolve', 'tool.retry', 'run.cancel'],
};

async function* executeCommand(command, { signal, initialSequence }) {
  const events = createAgentEventFactory({
    sessionId: command.sessionId,
    runId: command.runId,
    initialSequence,
  });

  const result = await runtime.execute(command, { signal });
  yield events.create('approval.resolved', result);
}
```

每个命令都包含 `commandId` 和 `idempotencyKey`。Provider 应将幂等键透传给服务端，并确保返回事件属于命令指定的 `sessionId` 和 `runId`，且 `sequence` 大于 `initialSequence`。命令成功表示 Provider 的命令事件流正常结束；实体是否完成仍由返回的 AgentEvent 决定。

## Transport

```ts
interface AgentTransport<Request, Chunk> {
  readonly kind: AgentTransportKind;
  open(request: Request, signal: AbortSignal): AsyncIterable<Chunk>;
}
```

Transport 只负责把 Provider 生成的请求转换为 `AsyncIterable<Chunk>`。HTTP SSE、WebSocket 和本地 Runtime 都可以实现同一接口。Transport 是 Provider 的成员，不是 `useXChat` 的第二个配置项。

自定义 Transport 类型必须使用带命名空间的值，例如 `company.websocket`；内置通用类型包括 `sse`、`websocket` 和 `async-iterable`。

## 事件生命周期

每个 Run 必须恰好包含一个 `run.started` 和一个终态事件：`run.completed`、`run.failed` 或 `run.cancelled`。

| 事件族 | 生命周期 |
| --- | --- |
| 消息 | `message.started` -> `message.delta` -> `message.completed/failed/cancelled` |
| 推理 | `reasoning.started` -> `reasoning.delta` -> `reasoning.completed/failed/cancelled` |
| 工具 | `tool.requested` -> `tool.arguments_delta` -> `tool.running` -> `tool.completed/failed/cancelled` |
| 审批 | `approval.requested` -> `approval.resolved` |
| 任务 | `task.created` -> `task.updated` -> `task.completed/failed/cancelled` |
| Artifact | `artifact.created` -> `artifact.updated` -> `artifact.completed/failed` |

事件必须满足：

- 同一 Run 的 `sequence` 严格递增。
- `eventId` 在 Run 内唯一。
- `sessionId` 和 `runId` 与当前执行一致。
- 实体增量和终态事件必须位于对应开始事件之后。
- Run 结束前关闭仍处于活动状态的实体。
- Provider 只输出 `capabilities.eventTypes` 中声明的事件。

## useXChat 配置

AgentProvider 模式使用 `AgentXChatConfig`：

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `provider` | 唯一执行入口 | `AgentProvider<Input, Request, Chunk, Context>` |
| `conversationKey` | 会话状态隔离键 | `string` |
| `defaultMessages` | 兼容消息层的初始消息 | `DefaultMessageInfo<AgentMessageState>[]` 或异步加载函数 |
| `parser` | 将 Agent 消息投影成组件消费类型 | `(message: AgentMessageState) => ParsedMessage \| ParsedMessage[]` |

`requestPlaceholder` 和 `requestFallback` 属于存量 ChatProvider 流程。AgentProvider 应通过标准事件表达 loading、失败和取消状态。

### 返回值差异

除现有 `useXChat` 返回值外，AgentProvider 模式保证返回 `agentState: AgentState`。

`setMessages`、`setMessage` 和 `removeMessage` 只修改兼容消息层，不会伪造 Agent Event，也不会直接改写 `agentState`。`onReload` 会开始一个新的 Run，而不是回写旧 Run。

## AgentState

| 字段        | 内容                               |
| ----------- | ---------------------------------- |
| `sessions`  | 会话元信息                         |
| `runs`      | Run 输入、输出、状态、错误和 usage |
| `messages`  | 用户、助手、系统及工具消息         |
| `reasoning` | 推理内容、摘要和状态               |
| `toolCalls` | 工具名称、参数、结果和状态         |
| `approvals` | 审批描述、风险和决策               |
| `tasks`     | 任务描述、进度和结果               |
| `artifacts` | Artifact 内容、版本和媒体类型      |
| `issues`    | Reducer 记录的协议问题             |

实体在 Store 中按 `runId + entityId` 隔离，因此不同 Run 可以安全复用 Runtime 自己的实体 ID。

## 错误和取消

Transport 抛出的错误会传给 `transformError`。Provider 必须先结束已经开始的消息、推理、工具或任务，再输出 Run 终态。用户调用 `abort()` 和组件卸载都会触发同一个 `AbortSignal`。

如果事件消费者或 Store 抛出异常，`runAgentProvider` 会将原异常传回调用方，不会再次交给 Provider 转换。

## 契约校验

Provider fixture 可以使用 `validateAgentProviderEvents` 做模型无关的契约测试：

```ts
import { validateAgentProviderEvents } from '@ant-design/x-sdk';

const issues = validateAgentProviderEvents(provider.capabilities, events);
expect(issues).toEqual([]);
```

校验覆盖事件结构、能力声明、ID、sequence、Run 归属、生命周期和终态实体。

## 导出边界

```ts
import type { AgentProvider, AgentTransport } from '@ant-design/x-sdk';
import { runAgentProvider, validateAgentProviderEvents } from '@ant-design/x-sdk';
import { experimentalAgent } from '@ant-design/x-sdk';
```

- Provider、Transport、runner 和契约校验属于 `chat-providers` 顶层导出。
- 事件协议、Reducer 和 Store 位于 `experimentalAgent`。
- React 内部桥接属于 `useXChat`，不提供第二个 Hook。

当前 API 仍为实验性能力。在至少两个结构不同的参考 Provider 和官方 Agent UI 验证完成前，协议可能继续调整。
