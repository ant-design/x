---
category: Components
group:
  title: Tools
  order: 5
title: useXAgent
description: Used for model scheduling with Agent hooks.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## When To Use

Connect with the backend model to provide an abstract data flow.

## Examples

<!-- prettier-ignore -->
<code src="./demo/preset.tsx">Preset Request</code>
<code src="./demo/custom.tsx">Custom Request</code>

## API

```tsx | pure
type useXAgent<AgentMessage> = (
  config: XAgentConfigPreset | XAgentConfigCustom<AgentMessage>,
) => [Agent];
```

### XAgentConfigPreset

Use preset protocol for request, protocol is not implemented yet.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| baseURL | Request for server address | string | - |  |
| key | Request key | string | - |  |
| model | Preset protocol model | string | - |  |
| dangerouslyApiKey | Enabling this option can be dangerous, exposing secret API credentials | string | - | - |

### XAgentConfigCustom

Custom request protocol.

| Property | Description                                     | Type      | Default | Version |
| -------- | ----------------------------------------------- | --------- | ------- | ------- |
| request  | Config custom request, support streaming update | RequestFn |         |         |

#### RequestFn

```tsx | pure
interface RequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
}

type RequestFn<Message> = (
  info: RequestFnInfo<Message>,
  callbacks: {
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
    onError: (error: Error) => void;
  },
) => void;
```

### Agent

| Property     | Description                                | Type           | Version |
| ------------ | ------------------------------------------ | -------------- | ------- |
| request      | Call the configured request of `useXAgent` | AgentRequestFn |         |
| isRequesting | Check if it is requesting                  | () => boolean  |         |

```tsx | pure
interface AgentRequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
}

type AgentRequestFn<AgentMessage> = (
  info: AgentRequestFnInfo<Message>,
  callbacks: {
    onUpdate: (message: AgentMessage) => void;
    onSuccess: (message: AgentMessage) => void;
    onError: (error: Error) => void;
  },
) => void;
```
