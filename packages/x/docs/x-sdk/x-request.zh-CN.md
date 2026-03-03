---
category: Components
group:
  title: 工具
  order: 3
title: XRequest
order: 1
subtitle: 请求
description: 通用流式请求工具。
tag: 2.0.0
packageName: x-sdk
---

## 何时使用

- 向后端服务接口发起请求，获取响应数据。如果是OpenAI Compatible的LLM服务，建议使用XModelAPI。

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-request/basic.tsx">基础使用</code>
<code src="./demos/x-request/custom-params-headers.tsx">请求定制</code>
<code src="./demos/x-request/custom-transformer.tsx">自定义转换器</code>
<code src="./demos/x-request/stream-separator.tsx">流解析配置</code>
 <code src="./demos/x-request/manual.tsx">手动触发</code>
 <code src="./demos/x-request/timeout.tsx">超时配置</code>
 <code src="./demos/x-request/stream-timeout.tsx">chunk 超时配置</code>

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
| timeout | 请求超时配置 (从发送请求到连接上服务的时间)，单位:ms | number | - | - |
| streamTimeout | stream 模式的数据超时配置 （每次 chunk 返回的时间间隔），单位:ms | number | - | - |
| fetch | 自定义fetch对象 | `typeof fetch` | - | - |
| middlewares | 中间件，支持请求前和请求后处理 | XFetchMiddlewares | - | - |
| transformStream | stream处理器 | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| streamSeparator | 流分隔符，用于分隔不同的数据流，transformStream 有值时不生效 | string | \\n\\n | 2.2.0 |
| partSeparator | 部分分隔符，用于分隔数据的不同部分，transformStream 有值时不生效 | string | \\n | 2.2.0 |
| kvSeparator | 键值分隔符，用于分隔键和值，transformStream 有值时不生效 | string | : | 2.2.0 |
| manual | 是否手动控制发出请求，为`true`时，需要手动调用`run`方法 | boolean | false | - |
| retryInterval | 请求中断或者失败时，重试的间隔时间，单位ms，不设置将不会自动重试 | number | - | - |
| retryTimes | 重试的次数限制，超过次数后不在进行重试 | number | - | - |

### XRequestCallbacks

| 属性 | 描述 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onSuccess | 成功时的回调，当与 Chat Provider 一起使用时会额外获取到组装好的 message | (chunks: Output[], responseHeaders: Headers, message: ChatMessage) => void | - | - |
| onError | 错误处理的回调，`onError` 可以返回一个数字，表示请求异常时进行自动重试的间隔(单位ms)，`options.retryInterval` 同时存在时，`onError`返回值优先级更高, 当与 Chat Provider 一起使用时会额外获取到组装好的 fail back message | (error: Error, errorInfo: any,responseHeaders?: Headers, message: ChatMessage) => number \| void | - | - |
| onUpdate | 消息更新的回调，当与 Chat Provider 一起使用时会额外获取到组装好的 message | (chunk: Output,responseHeaders: Headers, message: ChatMessage) => void | - | - |

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

## FAQ

### XRequest 中使用 transformStream 的时候会造成第二次输入请求的时候流被锁定的问题，怎么解决？

```ts | pure
onError TypeError: Failed to execute 'getReader' on 'ReadableStream': ReadableStreamDefaultReader constructor can only accept readable streams that are not yet locked to a reader
```

Web Streams API 规定，一个流在同一时间只能被一个 reader 锁定。复用会报错, 所以在使用 TransformStream 的时候，需要注意以下几点：

1. 确保 transformStream 函数返回的是一个新的 ReadableStream 对象，而不是同一个对象。
2. 确保 transformStream 函数中没有对 response.body 进行多次读取操作。

**推荐写法**

```tsx | pure
const [provider] = React.useState(
  new CustomProvider({
    request: XRequest(url, {
      manual: true,
      // 推荐写法：transformStream 用函数返回新实例
      transformStream: () =>
        new TransformStream({
          transform(chunk, controller) {
            // 你的自定义处理逻辑
            controller.enqueue({ data: chunk });
          },
        }),
      // 其他配置...
    }),
  }),
);
```

```tsx | pure
const request = XRequest(url, {
  manual: true,
  transformStream: new TransformStream({ ... }), // 不要持久化在 Provider/useState
});
```
