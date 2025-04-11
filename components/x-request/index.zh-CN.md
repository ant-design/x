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
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 向符合 OpenAI 标准的 LLM 发起请求。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础</code>
<code src="./demo/custom-transformer.tsx">自定义转换器</code>
<code src="./demo/request-options.tsx">变更配置</code>

## API

### XRequestOptions

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| baseURL | API 请求的基础 URL | string | - | - |
| model | 模型名称，例如 'gpt-3.5-turbo' | string | - | - |
| dangerouslyApiKey | **注意: 🔥 `dangerouslyApiKey` 存在安全风险，对此有详细的[说明](/docs/react/dangerously-api-key-cn)。** | string | - | - |
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
