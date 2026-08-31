---
category: Components
group:
  title: Chat Provider
  order: 2
title: Agent Provider
subtitle: Agent Event Integration
description: Adapt any model or Agent Runtime to a unified event stream.
order: 2
packageName: x-sdk
tag: 2.10.0
---

AgentProvider is a model- and Runtime-independent Agent integration contract. It converts SSE, WebSocket, local Runtimes, recorded fixtures, and other sources into unified Agent Events. The AgentStore inside `useXChat` reduces those events into messages and structured state.

```text
Model / Agent Runtime / Fixture
  -> AgentProvider (with a bound Transport)
  -> AgentEvent
  -> AgentStore
  -> useXChat
  -> messages + agentState
```

The frontend entry remains `useXChat({ provider })`. There is no additional `useAgent` Hook and no `mode`, `agent`, `transport`, or `store` configuration.

## Examples

<!-- prettier-ignore -->
<code src="./demos/x-chat/agent-provider.tsx">Generic AgentProvider</code>
<code src="./demos/x-chat/agent-interaction.tsx">Agent Command Interaction</code>

## Quick Start

```tsx | pure
import { useXChat } from '@ant-design/x-sdk';

const { messages, agentState, onRequest, abort, isRequesting } = useXChat({
  provider,
  conversationKey: 'conversation-1',
});

onRequest({ prompt: 'Analyze this report' });
```

- `messages` is a compatible `MessageInfo[]` projection of `AgentMessageState` for message components such as Bubble.
- `agentState` preserves complete runs, reasoning, tool calls, approvals, tasks, and artifacts.
- `abort()` cancels the active Run. The Provider should convert the interruption into entity cancellation events followed by `run.cancelled`.

## Provider Contract

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

| Member | Responsibility |
| --- | --- |
| `id` | Unique Provider metadata; it is never used for capability detection |
| `protocol` | Explicit protocol declaration used by `useXChat` to identify AgentProvider |
| `capabilities` | Declares event and Transport types the Provider may use |
| `transport` | Binds request execution; the frontend does not configure it separately |
| `createContext` | Creates per-Run parsing state shared across chunks |
| `start` | Emits the Run, user message, and initial entity events |
| `prepareRequest` | Converts `onRequest` input into a Runtime request |
| `transformChunk` | Converts one chunk into zero or more standard events |
| `flush` | Closes remaining entities and emits the terminal Run event |
| `transformError` | Converts errors and interruptions into failure or cancellation events |
| `executeCommand` | Executes UI approval, tool retry, or Run cancellation commands and returns standard events |

A Provider does not render React UI, maintain another message reducer, execute tools, or infer capabilities from a model name.

## Command Interaction

A Provider declares supported commands through `capabilities.commands` and sends each command to the Runtime through `executeCommand`:

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

Every command contains a `commandId` and `idempotencyKey`. Providers should forward the idempotency key to the server and ensure returned events belong to the command's `sessionId` and `runId`, with `sequence` greater than `initialSequence`. Command success means the Provider command event stream ended normally; entity completion is still determined by the returned AgentEvents.

## Transport

```ts
interface AgentTransport<Request, Chunk> {
  readonly kind: AgentTransportKind;
  open(request: Request, signal: AbortSignal): AsyncIterable<Chunk>;
}
```

A Transport only converts a Provider request into `AsyncIterable<Chunk>`. HTTP SSE, WebSocket, and local Runtimes can implement the same interface. The Transport belongs to the Provider and is not a second `useXChat` option.

Custom Transport types use a namespaced value such as `company.websocket`. Generic built-in types include `sse`, `websocket`, and `async-iterable`.

## Event Lifecycle

Every Run needs exactly one `run.started` and one terminal event: `run.completed`, `run.failed`, or `run.cancelled`.

| Event family | Lifecycle |
| --- | --- |
| Message | `message.started` -> `message.delta` -> `message.completed/failed/cancelled` |
| Reasoning | `reasoning.started` -> `reasoning.delta` -> `reasoning.completed/failed/cancelled` |
| Tool | `tool.requested` -> `tool.arguments_delta` -> `tool.running` -> `tool.completed/failed/cancelled` |
| Approval | `approval.requested` -> `approval.resolved` |
| Task | `task.created` -> `task.updated` -> `task.completed/failed/cancelled` |
| Artifact | `artifact.created` -> `artifact.updated` -> `artifact.completed/failed` |

Events must follow these rules:

- `sequence` increases strictly within one Run.
- `eventId` is unique within one Run.
- `sessionId` and `runId` match the active execution.
- Entity delta and terminal events follow their corresponding start event.
- Active entities are closed before the Run terminates.
- The Provider only emits event types declared in `capabilities.eventTypes`.

## useXChat Configuration

AgentProvider mode uses `AgentXChatConfig`:

| Property | Description | Type |
| --- | --- | --- |
| `provider` | The only execution entry | `AgentProvider<Input, Request, Chunk, Context>` |
| `conversationKey` | State isolation key | `string` |
| `defaultMessages` | Initial messages in the compatibility layer | `DefaultMessageInfo<AgentMessageState>[]` or an async loader |
| `parser` | Projects Agent messages into a component-facing type | `(message: AgentMessageState) => ParsedMessage \| ParsedMessage[]` |

`requestPlaceholder` and `requestFallback` belong to the legacy ChatProvider path. AgentProvider expresses loading, failure, and cancellation through standard events.

### Return Value

In addition to the existing `useXChat` result, AgentProvider mode always returns `agentState: AgentState`.

`setMessages`, `setMessage`, and `removeMessage` only mutate the compatibility message layer. They do not synthesize Agent Events or directly change `agentState`. `onReload` starts a new Run instead of rewriting an old Run.

## AgentState

| Field       | Contents                                     |
| ----------- | -------------------------------------------- |
| `sessions`  | Session metadata                             |
| `runs`      | Run input, output, status, errors, and usage |
| `messages`  | User, assistant, system, and tool messages   |
| `reasoning` | Reasoning content, summary, and status       |
| `toolCalls` | Tool name, arguments, result, and status     |
| `approvals` | Approval description, risk, and decision     |
| `tasks`     | Task description, progress, and result       |
| `artifacts` | Artifact content, version, and media type    |
| `issues`    | Protocol issues recorded by the Reducer      |

Store entities are scoped by `runId + entityId`, so different Runs may safely reuse Runtime entity IDs.

## Errors and Cancellation

Transport errors are passed to `transformError`. The Provider closes any started messages, reasoning, tools, or tasks before emitting the terminal Run event. User `abort()` calls and component unmounts use the same `AbortSignal`.

If the event consumer or Store throws, `runAgentProvider` propagates the original exception instead of passing it back through Provider error transformation.

## Contract Validation

Provider fixtures can use `validateAgentProviderEvents` for model-independent contract tests:

```ts
import { validateAgentProviderEvents } from '@ant-design/x-sdk';

const issues = validateAgentProviderEvents(provider.capabilities, events);
expect(issues).toEqual([]);
```

Validation covers event shape, declared capabilities, IDs, sequence, Run ownership, lifecycle, and terminal entities.

## Export Boundaries

```ts
import type { AgentProvider, AgentTransport } from '@ant-design/x-sdk';
import { runAgentProvider, validateAgentProviderEvents } from '@ant-design/x-sdk';
import { experimentalAgent } from '@ant-design/x-sdk';
```

- Provider, Transport, runner, and contract validation are top-level `chat-providers` exports.
- Event protocol, Reducer, and Store are exposed through `experimentalAgent`.
- The React bridge is internal to `useXChat`; there is no second Hook.

This API remains experimental. The protocol may evolve until at least two structurally different reference Providers and an official Agent UI have validated it.
