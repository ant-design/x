---
category: Components
group:
  title: 运行时
  order: 1
title: useXAgent
subtitle: 模型调度
description: 用于模型调度的 Agent 钩子。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用

与后端模型进行交互，提供抽象数据流。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/preset.tsx">预设请求</code>
<code src="./demo/custom.tsx">自定义请求</code>

## API

```tsx | pure
type useXAgent<AgentMessage> = (
  config: XAgentConfigPreset | XAgentConfigCustom<AgentMessage>,
) => [Agent];
```

### XAgentConfigPreset

使用预设协议进行请求，尚未实现协议。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| baseURL | 请求服务端地址 | string | - |  |
| key | 请求秘钥 | string | - |  |
| model | 协议模型 | string | - |  |
| dangerouslyApiKey | **启用此选项可能存在风险，会暴露您的秘密 API 凭证!** | string | - | - |

### XAgentConfigCustom

自定义请求协议。

| 属性    | 说明                         | 类型      | 默认值 | 版本 |
| ------- | ---------------------------- | --------- | ------ | ---- |
| request | 配置自定义请求，支持流式更新 | RequestFn |        |      |

#### RequestFn

```tsx | pure
interface RequestFnInfo<Message> extends Partial<XAgentConfigPreset>, AnyObject {
  messages?: Message[];
}

export type RequestFn<Message> = (
  info: RequestFnInfo<Message>,
  callbacks: {
    onUpdate: (message: Message) => void;
    onSuccess: (message: Message) => void;
    onError: (error: Error) => void;
  },
) => void;
```

### Agent

| 属性         | 说明                        | 类型           | 版本 |
| ------------ | --------------------------- | -------------- | ---- |
| request      | 调用 `useXAgent` 配置的请求 | AgentRequestFn |      |
| isRequesting | 是否正在请求                | () => boolean  |      |

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
