#### XRequestFunction

The core function of XRequest, used to create request instances.

```ts | pure
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  baseURL: string,
  options: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
```

#### XRequestFunction

| Property | Description               | Type                             | Default | Version |
| -------- | ------------------------- | -------------------------------- | ------- | ------- |
| baseURL  | Request interface address | string                           | -       | -       |
| options  |                           | XRequestOptions\<Input, Output\> | -       | -       |

#### XRequestOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| callbacks | Request callback processing set | XRequestCallbacks\<Output\> | - | - |
| params | Request parameters | Input | - | - |
| headers | Additional request header configuration | Record\<string, string\> | - | - |
| timeout | Request timeout configuration (time from sending request to connecting to service), unit: ms | number | - | - |
| streamTimeout | Stream mode data timeout configuration (time interval for each chunk return), unit: ms | number | - | - |
| fetch | Custom fetch object | `typeof fetch` | - | - |
| middlewares | Middleware, supports pre-request and post-request processing | XFetchMiddlewares | - | - |
| transformStream | Stream processor | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| streamSeparator | Stream separator, used to separate different data streams, does not take effect when transformStream has value | string | \n\n | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data, does not take effect when transformStream has value | string | \n | 2.2.0 |
| kvSeparator | Key-value separator, used to separate keys and values, does not take effect when transformStream has value | string | : | 2.2.0 |
| manual | Whether to manually control sending requests, when `true`, need to manually call `run` method | boolean | false | - |
| retryInterval | Retry interval when request is interrupted or fails, unit ms, will not auto-retry if not set | number | - | - |
| retryTimes | Retry count limit, will not retry after exceeding count | number | - | - |

#### XRequestCallbacks

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Success callback, when used with Chat Provider will additionally get assembled message | (chunks: Output[], responseHeaders: Headers, message: ChatMessage) => void | - | - |
| onError | Error handling callback, `onError` can return a number indicating automatic retry interval when request is abnormal (unit ms), when `options.retryInterval` exists simultaneously, `onError` return value has higher priority, when used with Chat Provider will additionally get assembled fail back message | (error: Error, errorInfo: any,responseHeaders?: Headers, message: ChatMessage) => number \| void | - | - |
| onUpdate | Message update callback, when used with Chat Provider will additionally get assembled message | (chunk: Output,responseHeaders: Headers, message: ChatMessage) => void | - | - |

#### XRequestClass

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| run | Manually execute request, valid when `manual=true` | (params?: Input) => void | - | - |
| isRequesting | Whether currently requesting | boolean | - | - |

#### setXRequestGlobalOptions

```ts | pure
type setXRequestGlobalOptions<Input, Output> = (
  options: XRequestGlobalOptions<Input, Output>,
) => void;
```

#### XRequestGlobalOptions

```ts | pure
type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>;
```

#### XFetchMiddlewares

```ts | pure
interface XFetchMiddlewares {
  onRequest?: (...ags: Parameters<typeof fetch>) => Promise<Parameters<typeof fetch>>;
  onResponse?: (response: Response) => Promise<Response>;
}
```
