---
group:
  title: Utilities
  order: 3
title: XRequest
order: 1
subtitle: Request
description:
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- Make requests to backend service APIs to get response data. For OpenAI Compatible LLM services, it's recommended to use XModelAPI.

## Code Demo

<code src="./demos/x-request/basic.tsx">Basic Usage</code> <code src="./demos/x-request/custom-params.tsx">Custom Parameters</code> <code src="./demos/x-request/custom-transformer.tsx">Custom Transformer</code> <code src="./demos/x-request/model.tsx">Model Integration</code> <code src="./demos/x-request/timeout.tsx">Timeout Configuration</code>

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
| timeout | Request timeout in milliseconds | number | - | - |
| streamTimeout | Stream mode data timeout in milliseconds | number | - | - |
| fetch | Custom fetch object | `typeof fetch` | - | - |
| middlewares | Middlewares for pre- and post-request processing | XFetchMiddlewares | - | - |
| transformStream | Stream processor | XStreamOptions\<Output\>['transformStream'] \| ((baseURL: string, responseHeaders: Headers) => XStreamOptions\<Output\>['transformStream']) | - | - |
| manual | Whether to manually control request sending. When `true`, need to manually call `run` method | boolean | false | - |

### XRequestCallbacks

| Property  | Description             | Type                       | Default | Version |
| --------- | ----------------------- | -------------------------- | ------- | ------- |
| onSuccess | Success callback        | (chunks: Output[]) => void | -       | -       |
| onError   | Error handling callback | (error: Error) => void     | -       | -       |
| onUpdate  | Message update callback | (chunk: Output) => void    | -       | -       |

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
