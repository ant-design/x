---
category: Components
group:
  title: 工具
  order: 5
title: XRequest
order: 2
subtitle: 请求
description:
demo:
  cols: 1
---

## When To Use

- 向符合 OpenAI 标准的 LLM 发起请求。

## Examples

<code src="./demo/basic.tsx">Basic</code>

## API

### XRequestOptions

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| baseURL | API 请求的基础 URL | string | - | - |
| model | 模型名称，例如 'gpt-3.5-turbo' | string | - | - |
| dangerouslyApiKey | **启用此选项可能存在风险，会暴露您的秘密 API 凭证!** | string | - | - |
| fetch | 可选的自定义 fetch 函数，用于发起请求 | fetch | - | - |

### XRequestFunction

```ts
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;
```

#### XRequestParams

| 属性     | 描述                                   | 类型                       | 默认值 | 版本 |
| -------- | -------------------------------------- | -------------------------- | ------ | ---- |
| model    | 生成响应时使用的模型。                 | string                     | -      | -    |
| messages | 消息对象数组，每个对象包含角色和内容。 | Record<PropertyKey, any>[] | -      | -    |
| stream   | 指示是否使用流式响应。                 | boolean                    | false  | -    |

#### XRequestCallbacks

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onSuccess | 成功时的回调。 | `(messages: Output[]) => void` | - | - |
| onError | 错误处理的回调。 | `(error: Error) => void` | - | - |
| onUpdate | 消息更新的回调。 | `(message: Output) => void` | - | - |
| transformStream | 可选的转换函数，用于处理流数据 | `XStreamOptions<Output>['transformStream']` | - | - |
