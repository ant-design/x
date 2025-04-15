---
category: Components
group:
  title: Tools
  order: 5
title: useXAgent
description: Used for model scheduling with Agent hooks.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*IjD1QqSI99MAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*riUFS51m3IUAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When To Use

Connect with the backend model to provide an abstract data flow.

## Examples

<!-- prettier-ignore -->
<code src="./demo/preset.tsx">Preset Request</code>
<code src="./demo/custom.tsx">Custom Request</code>
<code src="./demo/request-options.tsx">Control XRequestOptions</code>

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
| dangerouslyApiKey | **🔥 `dangerouslyApiKey` presents security risks. Detailed documentation on this can be found in [Explanation](/docs/react/dangerously-api-key)** | string | - | - |

### XAgentConfigCustom

Custom request protocol.

| Property | Description                                     | Type      | Default | Version |
| -------- | ----------------------------------------------- | --------- | ------- | ------- |
| request  | Config custom request, support streaming update | RequestFn |         |         |

#### RequestFn

```tsx | pure
interface RequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
  message?: Message;
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

| Property     | Description                                | Type          | Version |
| ------------ | ------------------------------------------ | ------------- | ------- |
| request      | Call the configured request of `useXAgent` | RequestFn     |         |
| isRequesting | Check if it is requesting                  | () => boolean |         |
