---
category: Components
group:
  title: Runtime
  order: 1
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
<code src="./demo/preset.tsx" debug>Preset Request</code>
<code src="./demo/custom.tsx">Custom Request</code>

## API

```tsx | pure
type useXAgent<AgentMessage> = (
  config: XAgentConfigPreset | XAgentConfigCustom<AgentMessage>,
) => [Agent];
```

### XAgentConfigPreset

Use preset protocol for request, protocol is not implemented yet.

| Property | Description                | Type   | Default | Version |
| -------- | -------------------------- | ------ | ------- | ------- |
| baseURL  | Request for server address | string | -       |         |
| key      | Request key                | string | -       |         |
| model    | Preset protocol model      | `TODO` | -       |         |

### XAgentConfigCustom

Custom request protocol.

| Property | Description                                     | Type      | Default | Version |
| -------- | ----------------------------------------------- | --------- | ------- | ------- |
| request  | Config custom request, support streaming update | RequestFn |         |         |

#### RequestFn

```tsx | pure
type RequestFn<AgentMessage> = (
  info: { message: AgentMessage; messages: AgentMessage[] },
  callbacks: {
    onUpdate: (message: AgentMessage) => void;
    onSuccess: (message: AgentMessage) => void;
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
type AgentRequestFn<AgentMessage> = (
  info: { message: AgentMessage; messages?: AgentMessage[] },
  callbacks: {
    onUpdate: (message: AgentMessage) => void;
    onSuccess: (message: AgentMessage) => void;
    onError: (error: Error) => void;
  },
) => void;
```
