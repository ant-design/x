---
category: Components
group:
  title: 工具
  order: 5
title: useXAgent
subtitle: 模型调度
description: 用于模型调度的 Agent 钩子。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*IjD1QqSI99MAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*riUFS51m3IUAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

与后端模型进行交互，提供抽象数据流。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/preset.tsx">预设请求</code>
<code src="./demo/requestParams.tsx">自定义入参</code>
<code src="./demo/custom.tsx">自定义请求</code>
<code src="./demo/model.tsx">模型接入</code>

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
| dangerouslyApiKey | **注意: 🔥 `dangerouslyApiKey` 存在安全风险，对此有详细的[说明](/docs/react/dangerously-api-key-cn)。** | string | - | - |

### XAgentConfigCustom

自定义请求协议。

| 属性    | 说明                         | 类型      | 默认值 | 版本 |
| ------- | ---------------------------- | --------- | ------ | ---- |
| request | 配置自定义请求，支持流式更新 | RequestFn |        |      |

#### RequestFn

更多请查看 [XStreamOptions](/components/x-stream-cn#xstreamoptions)。

```tsx | pure
type RequestFnInfo<Message, Input> = AnyObject & {
  [props in keyof Input]: Input[props];
} & {
  messages?: Message[];
  message?: Message;
};

type RequestFn<Message, Input, Output> = (
  info: RequestFnInfo<Message, Input>,
  callbacks: {
    onUpdate: (chunk: Output) => void;
    onSuccess: (chunks: Output[]) => void;
    onError: (error: Error) => void;
    onStream?: (abortController: AbortController) => void;
  },
  transformStream?: XStreamOptions<Message>['transformStream'],
) => void;
```

### Agent

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| request | 调用 `useXAgent` 配置的请求，[详情](https://x.ant.design/components/x-request) | RequestFn |  |
| isRequesting | 是否正在请求 | () => boolean |  |
