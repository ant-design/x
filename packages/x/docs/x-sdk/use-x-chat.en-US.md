---
category: Components
group:
  title: Data Flow
  order: 1
title: useXChat
order: 1
subtitle: Conversation Data
description: Data management for single conversations.
tag: 2.0.0
packageName: x-sdk
---

## When to Use

Manage conversation data through Agent and produce data for page rendering.

## Code Examples

<!-- prettier-ignore -->
<code src="./demos/x-chat/openai.tsx">OpenAI Model Integration</code>
<code src="./demos/x-chat/deepSeek.tsx">Thinking Model Integration</code>
<code src="./demos/x-chat/agent-provider.tsx">Generic AgentProvider Integration</code>
<code src="./demos/x-chat/agent-interaction.tsx">Agent Command Interaction</code>
<code src="./demos/x-chat/defaultMessages.tsx">Historical Messages Setup</code>
<code src="./demos/x-chat/async-defaultMessages.tsx">Request Remote Historical Messages</code>
<code src="./demos/x-chat/developer.tsx">System Prompt Setup</code>
<code src="./demos/x-chat/openai-callback.tsx">Model Request Callback</code>
<code src="./demos/x-chat/custom-request-fetch.tsx">Custom XRequest.fetch</code>
<code src="./demos/x-chat/request-openai-node.tsx">Custom request</code>
<code src="./demos/x-conversations/session-key.tsx">SessionId - ConversationKey</code>

## API

### useXChat

```tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
```

AgentProvider uses the same Hook. The overload infers input, Chunk, and structured state types:

```tsx | pure
const {
  messages,
  agentState,
  agentActions,
  commandStates,
  latestCommandByAction,
  onRequest,
  abort,
  isRequesting,
} = useXChat({ provider });
```

See [Agent Provider](/x-sdks/agent-provider) for the complete contract and implementation guide.

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ChatMessage | Message data type, defines the structure of chat messages | object | object | - |
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines the structure of request parameters | RequestParams\<ChatMessage\> | RequestParams\<ChatMessage\> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | The only data entry. Use `AbstractChatProvider` for regular chat and `AgentProvider` for structured Agent streams. See [Chat Provider](/x-sdks/chat-provider) and [Agent Provider](/x-sdks/agent-provider) | AbstractChatProvider\<ChatMessage, Input, Output\> \| AgentProvider\<Input, Request, Chunk, Context\> | - | - |
| conversationKey | Session unique identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => MessageInfo\<ChatMessage\>[] \| (info: { conversationKey?: string }) => Promise\<MessageInfo\<ChatMessage\>[]\> | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage \| BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>,info: { error: Error; errorInfo: any; messages: ChatMessage[], messageInfo: MessageInfo\<ChatMessage\> }) => ChatMessage\|Promise\<ChatMessage\> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage \| (requestParams: Partial\<Input\>, info: { messages: Message[] }) => ChatMessage \| Promise\<Message\> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether a request is in progress | boolean | - | - |
| isDefaultMessagesRequesting | Whether the default message list is requesting | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo\<ChatMessage\>[] | - | - |
| parsedMessages | Content translated through `parser` | MessageInfo\<ParsedMessages\>[] | - | - |
| onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string \| number, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| setMessages | Directly modify messages without triggering requests | (messages: Partial\<MessageInfo\<ChatMessage\>\>[]) => void | - | - |
| setMessage | Directly modify a single message without triggering requests | (id: string \| number, info: Partial\<MessageInfo\<ChatMessage\>\>) => void | - | - |
| removeMessage | Deleting a single message will not trigger a request | (id: string \| number) => boolean | - | - |
| queueRequest | Will add the request to a queue, waiting for the conversationKey to be initialized before sending | (conversationKey: string \| symbol, requestParams: Partial\<Input\>, opts?: { extraInfo: AnyObject }) => void | - | - |
| agentState | Complete structured state in AgentProvider mode; `undefined` in regular ChatProvider mode | AgentState \| undefined | undefined | - |
| agentActions | Approval, tool retry, and Run cancellation operations in AgentProvider mode; `undefined` in regular ChatProvider mode | AgentActions \| undefined | undefined | - |
| commandStates | Command submission state for the active Runs, keyed by `commandId` | Record\<string, AgentCommandState\> \| undefined | undefined | - |
| latestCommandByAction | Maps an action key to its latest `commandId` for duplicate prevention and control state lookup | Record\<string, string\> \| undefined | undefined | - |

### AgentProvider Mode

AgentProvider mode accepts only `provider`, `conversationKey`, `defaultMessages`, and `parser`. `requestPlaceholder` and `requestFallback` belong to regular ChatProvider. Requesting, failure, and cancellation state in an Agent run are driven by standard events.

`messages` remains compatible with existing message components and contains `AgentMessageState`. Non-message data such as reasoning, tools, approvals, tasks, and artifacts is available from `agentState`.

`setMessages`, `setMessage`, and `removeMessage` only affect the compatibility message layer and do not directly mutate `agentState`. In AgentProvider mode, `onReload` starts a new Run.

#### Agent Actions

After an AgentProvider declares command capabilities and implements `executeCommand`, the UI invokes operations through `agentActions`:

```tsx | pure
await agentActions.resolveApproval({
  runId,
  approvalId,
  decision: 'approved',
  expectedVersion: approval.version,
});

await agentActions.retryTool({ runId, toolCallId });
await agentActions.cancelRun({ runId, reason: 'User cancelled' });
```

- `resolveApproval` only accepts a non-expired Approval in the `waiting` state.
- `retryTool` only accepts a failed ToolCall with `error.retryable === true`.
- `cancelRun` is a business command sent to the Runtime and waits for `run.cancelled`; `abort()` only interrupts the local Transport.
- Commands for one Run execute serially. The SDK rejects duplicate in-flight actions and further actions after cancellation is submitted.
- `commandStates` exposes `submitting`, `succeeded`, and `failed`, and is cleared after the Run reaches a terminal state.

#### MessageInfo

```ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extraInfo?: AnyObject;
}
```

#### MessageStatus

```ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```
