---
category: Components
group: 运行时
title: useXAgent
subtitle: 数据管理
description: 使用 Agent hook 进行数据管理。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用

配合 Bubble.List 与 Sender 使用快速搭建对话式 LUI。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/suggestions.tsx">多项建议</code>

## API

```tsx | pure
type useXAgent<Message> = (config: XAgentConfig<Message>) => XAgentConfigReturnType;

type MessageStatus = 'local' | 'loading' | 'success' | 'error';

type MessageInfo<Message> = {
  id: number | string;
  message: Message;
  status: MessageStatus;
};

type RequestResultObject<Message> = {
  message: Message | Message[];
  status: MessageStatus;
};

type RequestResult<Message> =
  | Message
  | Message[]
  | RequestResultObject<Message>
  | RequestResultObject<Message>[];
```

### XAgentConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultMessages | 默认展示信息 | MessageInfo[] | - |  |
| request | 用户发起对话时请求方法，支持返回多个不同状态的 Message | (msg: Message, info: { messages: MessageInfo[] }) => Promise\<RequestResult> | - |  |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | RequestResult \| (msg: Message, info: { error: Error, messages: MessageInfo[] }) => Message | - |  |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | Message \| (msg: Message, info: { messages: MessageInfo[] }) => Message | - |  |

### XAgentConfigReturnType

| 属性        | 说明                            | 类型                              | 版本 |
| ----------- | ------------------------------- | --------------------------------- | ---- |
| messages    | 当前管理的内容                  | Message[]                         |      |
| requesting  | 是否正在请求                    | boolean                           |      |
| onRequest   | 添加一条 Message，并且触发请求  | (message: Message) => void        |      |
| setMessages | 直接修改 messages，不会触发请求 | (messages: MessageInfo[]) => void |      |
