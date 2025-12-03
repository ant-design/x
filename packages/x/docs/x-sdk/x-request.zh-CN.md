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
---

## 何时使用

- 向后端服务接口发起请求，获取响应数据。如果是OpenAI Compatible的LLM服务，建议使用XModelAPI。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-request/basic.tsx">基础使用</code> 
<code src="./demos/x-request/custom-params-headers.tsx">请求定制</code> 
<code src="./demos/x-request/custom-transformer.tsx">自定义转换器</code>
 <code src="./demos/x-request/manual.tsx">手动触发</code> 
 <code src="./demos/x-request/timeout.tsx">超时配置</code>

## API

### XRequestFunction

```ts | pure
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  baseURL: string,
  options: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
```

### XRequestFunction

| 属性    | 描述         | 类型                             | 默认值 | 版本 |
| ------- | ------------ | -------------------------------- | ------ | ---- |
| baseURL | 请求接口地址 | string                           | -      | -    |
| options |              | XRequestOptions\<Input, Output\> | -      | -    |

### XRequestOptions

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| callbacks | 请求回调处理集 | XRequestCallbacks\<Output\> | - | - |
| params | 请求的参数 | Input | - | - |
| headers | 额外的请求头配置 | Record\<string, string\> | - | - |
| timeout | 请求超时配置，单位:ms | number | - | - |
| streamTimeout | stream模式的数据超时配置，单位:ms | number | - | - |
| fetch | 自定义fetch对象 | `typeof fetch` | - | - |
| middlewares | 中间件，支持请求前和请求后处理 | XFetchMiddlewares | - | - |
| transformStream | stream处理器 | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| manual | 是否手动控制发出请求，为`true`时，需要手动调用`run`方法 | boolean | false | - |

### XRequestCallbacks

| 属性      | 描述           | 类型                       | 默认值 | 版本 |
| --------- | -------------- | -------------------------- | ------ | ---- |
| onSuccess | 成功时的回调   | (chunks: Output[]) => void | -      | -    |
| onError   | 错误处理的回调 | (error: Error) => void     | -      | -    |
| onUpdate  | 消息更新的回调 | (chunk: Output) => void    | -      | -    |

### XRequestClass

| 属性         | 描述                                | 类型                     | 默认值 | 版本 |
| ------------ | ----------------------------------- | ------------------------ | ------ | ---- |
| abort        | 取消请求                            | () => void               | -      | -    |
| run          | 手动执行请求，当`manual=true`时有效 | (params?: Input) => void | -      | -    |
| isRequesting | 当前是否在请求中                    | boolean                  | -      | -    |

### setXRequestGlobalOptions

```ts | pure
type setXRequestGlobalOptions<Input, Output> = (
  options: XRequestGlobalOptions<Input, Output>,
) => void;
```

### XRequestGlobalOptions

```ts | pure
type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>;
```

### XFetchMiddlewares

```ts | pure
interface XFetchMiddlewares {
  onRequest?: (...ags: Parameters<typeof fetch>) => Promise<Parameters<typeof fetch>>;
  onResponse?: (response: Response) => Promise<Response>;
}
```
