---
category: Components
group:
  title: Utilities
  order: 3
title: XRequest
order: 1
subtitle: Request
description: Universal streaming request utility.
packageName: x-sdk
tag: 2.0.0
---

## When To Use

- Make requests to backend service APIs to get response data. For OpenAI Compatible LLM services, it's recommended to use XModelAPI.

## Code Demo

<!-- prettier-ignore -->
<code src="./demos/x-request/basic.tsx">Basic Usage</code>
<code src="./demos/x-request/custom-params-headers.tsx">Custom Parameters</code>
<code src="./demos/x-request/custom-transformer.tsx">Custom Transformer</code>
<code src="./demos/x-request/stream-separator.tsx">Stream Parsing Configuration</code>
<code src="./demos/x-request/manual.tsx">Manual Trigger</code>
<code src="./demos/x-request/timeout.tsx">Timeout Configuration</code>
<code src="./demos/x-request/stream-timeout.tsx">Chunk Timeout Configuration</code>

## API

### XRequestFunction

```ts | pure
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  baseURL: string,
  options: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
```

### XRequestFunction

| Property | Description      | Type                             | Default | Version |
| -------- | ---------------- | -------------------------------- | ------- | ------- |
| baseURL  | API endpoint URL | string                           | -       | -       |
| options  | Request options  | XRequestOptions\<Input, Output\> | -       | -       |

### XRequestOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| callbacks | Request callback handlers | XRequestCallbacks\<Output\> | - | - |
| params | Request parameters | Input | - | - |
| headers | Additional request headers | Record\<string, string\> | - | - |
| timeout | Request timeout configuration (time from sending request to connecting to service), unit: ms | number | - | - |
| streamTimeout | Stream mode data timeout configuration (time interval for each chunk return), unit: ms | number | - | - |
| fetch | Custom fetch object | `typeof fetch` | - | - |
| middlewares | Middlewares for pre- and post-request processing | XFetchMiddlewares | - | - |
| transformStream | Stream processor | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| streamSeparator | Stream separator, used to separate different data streams. Does not take effect when transformStream has a value | string | \n\n | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data. Does not take effect when transformStream has a value | string | \n | 2.2.0 |
| kvSeparator | Key-value separator, used to separate keys and values. Does not take effect when transformStream has a value | string | : | 2.2.0 |
| manual | Whether to manually control request sending. When `true`, need to manually call `run` method | boolean | false | - |
| retryInterval | Retry interval when request is interrupted or fails, in milliseconds. If not set, automatic retry will not occur | number | - | - |
| retryTimes | Maximum number of retry attempts. No further retries will be attempted after exceeding this limit | number | - | - |

### XRequestCallbacks

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Success callback. When used with Chat Provider, additionally gets the assembled message | (chunks: Output[], responseHeaders: Headers, message: ChatMessage) => void | - | - |
| onError | Error handling callback. `onError` can return a number indicating the retry interval (in milliseconds) when a request exception occurs. When both `onError` return value and `options.retryInterval` exist, the `onError` return value takes precedence. When used with Chat Provider, additionally gets the assembled fail back message | (error: Error, errorInfo: any, responseHeaders?: Headers, message: ChatMessage) => number \| void | - | - |
| onUpdate | Message update callback. When used with Chat Provider, additionally gets the assembled message | (chunk: Output, responseHeaders: Headers, message: ChatMessage) => void | - | - |

### XRequestClass

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| run | Manually execute request (effective when `manual=true`) | (params?: Input) => void | - | - |
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

### When using transformStream in XRequest, it causes stream locking issues on the second input request. How to solve this?

```ts | pure
onError TypeError: Failed to execute 'getReader' on 'ReadableStream': ReadableStreamDefaultReader constructor can only accept readable streams that are not yet locked to a reader
```

The Web Streams API stipulates that a stream can only be locked by one reader at the same time. Reuse will cause an error. Therefore, when using TransformStream, you need to pay attention to the following points:

1. Ensure that the transformStream function returns a new ReadableStream object, not the same object.
2. Ensure that the transformStream function does not perform multiple read operations on response.body.

**Recommended Writing**

```tsx | pure
const [provider] = React.useState(
  new CustomProvider({
    request: XRequest(url, {
      manual: true,
      // Recommended: transformStream returns a new instance with a function
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
