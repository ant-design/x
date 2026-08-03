# Ant Design X 第一阶段详细系分

> 对应路线图：2026-08 至 2026-09「基础收敛」更新日期：2026-08-03 状态：实验性实现，按单执行者串行推进

## 1. 阶段结论

第一阶段只解决一条主链路：不同模型或 Agent Runtime 通过通用 Provider 输出统一事件，由 Headless Store 归一化为前端状态，并通过现有 `useXChat` 渐进接入 React。

```text
Runtime / Model / Fixture
  -> Provider（唯一接入入口，内部绑定 Transport）
  -> AgentEvent
  -> AgentStore
  -> useXChat
  -> messages + agentState
```

本阶段不新建 `useAgent`，也不在 `useXChat` 中增加 `agent`、`mode`、`transport`、`protocolVersion`、`capabilities` 或 `store` 配置。前端仍然只传 `provider`；协议、能力和传输属于 Provider 契约。

## 2. 目标与验收

到 2026-09-30，`@ant-design/x-sdk` 应具备：

1. 模型、Runtime、Transport 和 React 无关的 Agent Event Protocol。
2. 可重放、可序列化、严格校验的 Reducer 与 Headless Store。
3. Provider 单入口：Provider 负责绑定 Transport、解析 Chunk 和声明协议能力。
4. `useXChat({ provider })` 同时支持存量 ChatProvider 和实验性 AgentProvider。
5. AgentProvider 模式继续返回 `messages`，并额外返回完整 `agentState`。
6. 至少两个结构不同的参考 Provider 通过相同契约测试后，才评估稳定 API。

完成标准：

- 存量 `useXChat`、ChatProvider 和 XRequest 行为无破坏性变化。
- 前端切换 Provider 时不需要切换 Hook 或 Reducer。
- 文本、结构化消息、推理、工具、审批、任务、Artifact 和 Run 状态不丢失。
- 跨 Run 使用相同实体 ID 时不会串改状态。
- strict batch 要么全部提交，要么全部不提交。
- 非法事件 payload 在进入 Reducer 前被识别。
- 协议版本不兼容时明确失败，不通过 Provider 名称或模型名称猜测能力。

## 3. 公开调用设计

### 3.1 前端调用

存量调用保持不变：

```ts
const chat = useXChat({
  provider,
  conversationKey,
  defaultMessages,
  parser,
  requestPlaceholder,
  requestFallback,
});
```

AgentProvider 使用相同入口：

```ts
const { messages, parsedMessages, agentState, onRequest, abort, isRequesting } = useXChat({
  provider,
});
```

`messages` 是供现有 Bubble 等组件消费的兼容投影；`agentState` 保存 reasoning、toolCalls、approvals、tasks、artifacts 和 runs 等完整结构化状态。

### 3.2 配置归属

| 配置或能力 | 所属位置 | 原因 |
| --- | --- | --- |
| `provider` | `useXChat` 顶层配置 | 唯一执行入口 |
| `conversationKey` | `useXChat` | React 会话状态选择 |
| `defaultMessages` | `useXChat` | 存量消息初始化兼容 |
| `parser` | `useXChat` | 消息到展示模型的转换 |
| `requestPlaceholder` / `requestFallback` | `useXChat` | 存量 ChatProvider 兼容行为 |
| Transport | Provider 构造参数 | 网络或 Runtime 通信是 Provider 的实现细节 |
| Protocol / version | Provider 只读声明 | 用于显式识别和版本协商 |
| Event capabilities | Provider 只读声明 | 由输出方保证，不由 UI 开关控制 |
| AgentStore | `useXChat` 内部 | 避免前端重复装配 Reducer |

### 3.3 明确不新增的配置

以下形态不进入 API：

```ts
useXChat({
  agent: { provider, transport },
  mode: 'agent',
  transport,
  protocolVersion: '0.1',
  store,
});
```

原因是它们会产生第二套接入路径、泄漏底层编排细节，并使 Provider 与 Hook 同时承担能力判断。

### 3.4 目录与职责归属

第一阶段按职责落在现有 `x-sdk` 模块中，不创建单独的 `agent/providers` 或 `agent/testing` 目录：

```text
packages/x-sdk/src/
├── agent/                              # 纯事件与状态核心
│   ├── protocol/                       # 事件类型、校验和事件工厂
│   ├── reducer/                        # 状态归约与事件重放
│   ├── store/                          # Headless Store
│   └── index.ts                        # experimentalAgent 命名空间出口
├── chat-providers/                     # 所有 Provider 接入能力
│   ├── AgentProvider.ts                # Provider、Transport 和运行参数契约
│   ├── runAgentProvider.ts             # 执行 Provider 并校验事件边界
│   ├── testing/
│   │   └── validateAgentProviderEvents.ts
│   └── index.ts                        # Provider 相关公开出口
└── x-chat/
    ├── agentRuntime.ts                 # useXChat 内部 Agent 桥接
    └── index.ts                        # 唯一 React Hook：useXChat
```

边界约束：

- `agent` 不引用 Provider、Transport 或 React，只负责标准事件如何变成状态。
- `chat-providers` 可以依赖 `agent/protocol` 和 `agent/reducer`，负责外部 Runtime 到标准事件的适配、执行与契约测试。
- `x-chat/agentRuntime.ts` 同时依赖 Provider 和 Store，承担 React 生命周期桥接；它不是新的公共 Hook，也不从包入口单独导出。
- Agent 协议、Reducer 和 Store 通过 `experimentalAgent` 暴露；`AgentProvider`、`AgentTransport`、`runAgentProvider` 和契约校验器从 `chat-providers` 的顶层出口暴露。

## 4. Provider 契约

Provider 是唯一 Runtime 适配点。它不绑定某个模型名称，也不要求使用 HTTP、SSE 或特定模型 SDK。

```ts
interface AgentProvider<Input, Request, Chunk, Context> {
  readonly id: string;
  readonly protocol: {
    name: 'agent-event';
    version: '0.1';
  };
  readonly capabilities: {
    eventTypes: readonly AgentEventType[];
    transports: readonly AgentTransportKind[];
    extensions?: Readonly<Record<`${string}.${string}`, unknown>>;
  };
  readonly transport: AgentTransport<Request, Chunk>;

  createContext(options: AgentProviderContextOptions): Context;
  start(input: Input, context: Context): readonly AgentEvent[];
  prepareRequest(input: Input, context: Context): Request;
  transformChunk(chunk: Chunk, context: Context): readonly AgentEvent[];
  flush(context: Context): readonly AgentEvent[];
  transformError(error: unknown, context: Context): readonly AgentEvent[];
}
```

Provider 的职责：

- 将调用输入转换为 Runtime 请求。
- 绑定并调用一种 Transport。
- 将任意 Chunk 无损转换成零到多个标准事件。
- 维护跨 Chunk 的解析上下文。
- 将 Runtime 错误转换为标准失败或取消事件。

Provider 不负责：

- React 状态和组件渲染。
- 在核心层执行工具或自动批准操作。
- 根据模型名称决定事件语义。
- 维护另一套消息 Reducer。

## 5. 事件协议

### 5.1 信封

每个事件包含：

| 字段              | 约束                                         |
| ----------------- | -------------------------------------------- |
| `protocolVersion` | 当前为 `0.1`，runner 和 validator 必须校验   |
| `type`            | payload 的判别字段                           |
| `eventId`         | 与 `runId` 组合为幂等键                      |
| `sessionId`       | 会话归属                                     |
| `runId`           | 单次运行归属                                 |
| `sequence`        | 同一 Run 内严格递增                          |
| `timestamp`       | 事件时间                                     |
| `parentId`        | 可选实体关联                                 |
| `payload`         | 按事件类型进行运行时校验                     |
| `meta`            | Provider、模型、trace 和原始字段等非核心信息 |

### 5.2 消息内容

消息内容支持字符串和结构化 Part 列表。文本增量保持高效拼接；图片、文件及命名空间扩展 Part 原样保留，核心层不得强制转成字符串。

### 5.3 实体作用域

Run 是实体隔离边界。Reducer 内部以 `runId + entityId` 作为实体键；事件只能查找和修改自身 Run 下的消息、推理、工具、审批、任务和 Artifact。

## 6. useXChat 内部流程

`useXChat` 通过 Provider 的显式协议声明分流，不使用类名、模型名或方法形状猜测：

```text
provider.protocol.name === 'agent-event'
  -> 创建或复用 conversationKey 对应的 AgentStore
  -> 生成 runId 和 AbortController
  -> runAgentProvider({ provider, input, run, onEvent: store.dispatch })
  -> AgentState 投影为 MessageInfo[]
  -> React 订阅得到 messages、agentState、isRequesting

其他 Provider
  -> 保持现有 AbstractChatProvider + XRequest 流程
```

兼容约束：

- Agent 模式由事件产生 loading、success、error 和 abort 状态，不使用占位消息推断生命周期。
- `requestPlaceholder` 和 `requestFallback` 只作用于存量 ChatProvider。
- `defaultMessages` 继续表示已存在的消息投影；完整 Agent 会话恢复放到后续持久化设计，不在本阶段增加另一项配置。
- `setMessages`、`setMessage` 和 `removeMessage` 只操作兼容消息层，不直接伪造 Agent 事件。

## 7. 状态与错误策略

### 7.1 Reducer

- Reducer 是纯函数，不执行网络、工具和审批副作用。
- 同一个 `runId + eventId` 重放必须幂等。
- 非递增 sequence、孤儿增量、跨 Run 引用和终态后更新记录协议问题。
- Run 终止后拒绝普通实体事件。
- 所有状态保持 JSON 可序列化。

### 7.2 Store

- `record` 模式记录问题并继续处理后续事件。
- `strict` 模式在第一个非法事件处抛出。
- strict `batch` 使用临时快照归约；任一事件非法时，原状态不变且不通知订阅者。
- 一个成功 batch 只通知一次订阅者。

### 7.3 Provider 错误

- Transport 错误交给 Provider 转为标准事件。
- UI 消费事件时抛出的异常原样向调用方传播，不能被误报为 Provider 错误。
- AbortSignal 同时覆盖用户取消和组件卸载。

## 8. 串行工作分解

| 顺序 | 工作项 | 交付物 | 完成标准 |
| --: | --- | --- | --- |
| 1 | 协议加固 | 版本字段、完整 payload validator、结构化消息内容 | 畸形 fixture 被拒绝；合法结构化内容可重放 |
| 2 | Reducer 加固 | Run 作用域实体键和 selectors | 两个 Run 可复用相同实体 ID 且互不影响 |
| 3 | Store 原子性 | strict batch 临时归约 | 失败 batch 不提交、不通知 |
| 4 | Provider 收口 | Provider 内绑定 Transport，显式协议声明 | runner 只接收 Provider，不再暴露顶层 Transport |
| 5 | Hook 桥接 | `useXChat` 内部 AgentStore 和消息投影 | 前端只传 Provider 即可运行 Agent 流 |
| 6 | 参考 Provider | OpenAI Compatible、Anthropic 风格、Custom SSE | 同语义 fixture 产生等价状态 |
| 7 | Demo | Provider 切换、消息、推理、工具、失败、取消 | 切换 Provider 不切换 Hook 和 UI 状态逻辑 |
| 8 | 工程门禁 | 类型、测试、构建、API diff、size limit、文档 lint | 所有现有门禁通过 |

## 9. 本阶段不做

- 不新增正式 ToolCall、Approval、Task 或 Artifact 视觉组件。
- 不在浏览器自动执行工具或审批。
- 不实现断线恢复、网络重试和持久化协议。
- 不封装完整模型 SDK，也不把模型参数放进 Core。
- 不拆分新的稳定 npm 包。
- 不让 `x-card` 或 `x-skill` 治理工作阻塞 Agent 主链路。

## 10. 风险与决策门

| 风险 | 控制方式 |
| --- | --- |
| `useXChat` 同时支持两类 Provider 后类型复杂 | 使用显式协议判别和函数重载，不增加 mode 配置 |
| 实验协议过早稳定 | 保持 `experimentalAgent` 导出，两个参考 Provider 和一个 Demo 后再冻结 |
| 消息投影掩盖结构化状态 | `messages` 仅兼容展示，同时公开只读 `agentState` |
| Provider 承担过多网络细节 | Transport 保持独立接口，但在 Provider 实例构造时绑定 |
| 恢复需求诱发重复配置 | 第一阶段只保留 `defaultMessages`，完整恢复另立 RFC |

API 稳定决策必须同时满足：两个结构不同的 Provider 通过契约测试、一个官方 Demo 只使用 `useXChat`、现有 ChatProvider 测试无回归、包体积与导出差异通过检查。

## 11. 文档与 Demo 交付

- 双语 AgentProvider 文档：`packages/x/docs/x-sdk/agent-provider.zh-CN.md` 与 `agent-provider.en-US.md`。
- 通用离线 Demo：`packages/x/docs/x-sdk/demos/x-chat/agent-provider.tsx`，使用本地 AsyncIterable 模拟 Runtime，不依赖模型或网络服务。
- `useXChat` 双语文档补充 AgentProvider 重载、配置差异、`agentState` 和消息兼容层语义。
- Chat Provider 文档明确普通 ChatProvider 与结构化 AgentProvider 的选择边界。

Demo 验收覆盖：同一个 `useXChat({ provider })` 调用入口、用户与助手消息、推理状态、工具调用、流式增量、取消、Run 终态和协议问题计数。
