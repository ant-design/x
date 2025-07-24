---
group:
  title: 工具
  order: 3
title: XRequest
order: 1
subtitle: 请求
description:
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## 何时使用

- 向后端服务接口发起请求，获取响应数据。如果是OpenAI Compatible的LLM服务，建议使用XModelAPI。

## 代码演示

<code src="./demos/x-request/basic.tsx">基础使用</code> <code src="./demos/x-request/custom-params.tsx">自定义入参</code> <code src="./demos/x-request/custom-transformer.tsx">自定义转换器</code> <code src="./demos/x-request/model.tsx">模型接入</code> <code src="./demos/x-request/timeout.tsx">超时配置</code>

## API

### XRequestFunction

```ts
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;
```

### XRequestOptions

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| callbacks | 请求处理回调 | XRequestCallbacks\<Output\> | - | - |
| fetch | 自定义 fetch 函数，用于发起请求 | XFetchOptions['fetch'] | - | - |
| headers | 自定义请求头 | Record<string, string> | - | - |
| middlewares | 请求处理中间件，可在请求发起前、请求响应后进行拦截处理 | XFetchMiddlewares | - | - |

#### XRequestParams

| 属性     | 描述                                   | 类型                       | 默认值 | 版本 |
| -------- | -------------------------------------- | -------------------------- | ------ | ---- |
| model    | 生成响应时使用的模型。                 | string                     | -      | -    |
| messages | 消息对象数组，每个对象包含角色和内容。 | Record<PropertyKey, any>[] | -      | -    |
| stream   | 指示是否使用流式响应。                 | boolean                    | false  | -    |

#### XRequestCallbacks

| 属性      | 描述           | 类型                         | 默认值 | 版本 |
| --------- | -------------- | ---------------------------- | ------ | ---- |
| onSuccess | 成功时的回调   | `(chunks: Output[]) => void` | -      | -    |
| onError   | 错误处理的回调 | `(error: Error) => void`     | -      | -    |
| onUpdate  | 消息更新的回调 | `(chunk: Output) => void`    | -      | -    |
