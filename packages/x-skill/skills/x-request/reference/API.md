### XRequestFunction

```ts | pure
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  baseURL: string,
  options: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
```

### XRequestFunction

| Property | Description           | Type                           | Default | Version |
| -------- | --------------------- | ------------------------------ | ------- | ------- |
| baseURL  | Request interface URL | string                         | -       | -       |
| options  |                       | XRequestOptions<Input, Output> | -       | -       |

### XRequestOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| callbacks | Request callback handlers | XRequestCallbacks<Output> | - | - |
| params | Request parameters | Input | - | - |
| headers | Additional request header configuration | Record<string, string> | - | - |
| timeout | Request timeout configuration (time from sending request to connecting to service), unit: ms | number | - | - |
| streamTimeout | Stream mode data timeout configuration (time interval for each chunk return), unit: ms | number | - | - |
| fetch | Custom fetch object | `typeof fetch` | - | - |
| middlewares | Middleware, supports pre-request and post-request processing | XFetchMiddlewares | - | - |
| transformStream | Stream processor | XStreamOptions<Output>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions<Output>['transformStream']) | - | - |
| streamSeparator | Stream separator, used to separate different data streams, ineffective when transformStream has value | string | \n\n | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data, ineffective when transformStream has value | string | \n | 2.2.0 |
| kvSeparator | Key-value separator, used to separate keys and values, ineffective when transformStream has value | string | : | 2.2.0 |
| manual | Whether to manually control sending requests, when `true`, need to manually call `run` method | boolean | false | - |
| retryInterval | Retry interval time when request is interrupted or fails, unit ms, no automatic retry if not set | number | - | - |
| retryTimes | Retry count limit, no retry after exceeding the limit | number | - | - |

### XRequestCallbacks

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Callback on success, when used with Chat Provider will additionally get the assembled message | (chunks: Output[], responseHeaders: Headers, message: ChatMessage) => void | - | - |
| onError | Error handling callback, `onError` can return a number indicating the retry interval when request is abnormal (unit ms), when `options.retryInterval` exists simultaneously, `onError` return value has higher priority, when used with Chat Provider will additionally get the assembled fail back message | (error: Error, errorInfo: any,responseHeaders?: Headers, message: ChatMessage) => number \| void | - | - |
| onUpdate | Message update callback, when used with Chat Provider will additionally get the assembled message | (chunk: Output,responseHeaders: Headers, message: ChatMessage) => void | - | - |

### XRequestClass

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| run | Manually execute request, effective when `manual=true` | (params?: Input) => void | - | - |
| isRequesting | Whether currently requesting | boolean | - | - |

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

### When using transformStream in XRequest, it causes the stream to be locked on the second input request. How to solve this?

```ts | pure
onError TypeError: Failed to execute 'getReader' on 'ReadableStream': ReadableStreamDefaultReader constructor can only accept readable streams that are not yet locked to a reader
```

The Web Streams API stipulates that a stream can only be locked by one reader at the same time. Reuse will report an error, so when using TransformStream, you need to pay attention to the following points:

1. Ensure that the transformStream function returns a new ReadableStream object, not the same object.
2. Ensure that the transformStream function does not perform multiple read operations on response.body.

**Recommended Writing**

```tsx | pure
const [provider] = React.useState(
  new CustomProvider({
    request: XRequest(url, {
      manual: true,
      // Recommended: transformStream returns new instance with function
      transformStream: () =>
        new TransformStream({
          transform(chunk, controller) {
            // Your custom processing logic
            controller.enqueue({ data: chunk });
          },
        }),
      // Other configurations...
    }),
  }),
);
```

```tsx | pure
const request = XRequest(url, {
  manual: true,
  transformStream: new TransformStream({ ... }), // Do not persist in Provider/useState
});
```
