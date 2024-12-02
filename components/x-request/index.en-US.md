---
category: Components
group:
  title: Tools
  order: 5
title: XRequest
order: 2
description:
demo:
  cols: 1
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*22A2Qqn7OrEAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lQydTrtLz9YAAAAAAAAAAAAADgCCAQ/original
---

## When To Use

- Initiate a fetch request to LLMs that comply with OpenAI standards.

## Examples

<code src="./demo/basic.tsx">Basic</code> <code src="./demo/custom-transformer.tsx">Custom Transformer</code>

## API

### XRequestOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| baseURL | Base URL for the API request | string | - | - |
| model | Model name, e.g., 'gpt-3.5-turbo' | string | - | - |
| dangerouslyApiKey | **🔥 `dangerouslyApiKey` presents security risks. Detailed documentation on this can be found in [Explanation](/docs/react/dangerously-api-key)** | string | - | - |
| fetch | Optional custom fetch function for making requests | fetch | - | - |

### XRequestFunction

```ts
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  params: XRequestParams & Input,
  callbacks: XRequestCallbacks<Output>,
  transformStream?: XStreamOptions<Output>['transformStream'],
) => Promise<void>;
```

#### XRequestParams

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| model | The model to be used for generating responses. | string | - | - |
| messages | An array of message objects, each containing a role and content. | Record<PropertyKey, any>[] | - | - |
| stream | Indicates whether to use streaming for the response. | boolean | false | - |

#### XRequestCallbacks

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Callback for successful. | `(messages: Output[]) => void` | - | - |
| onError | Callback for error handling. | `(error: Error) => void` | - | - |
| onUpdate | Callback for message updates. | `(message: Output) => void` | - | - |
| transformStream | Optional transform function for processing stream data | `XStreamOptions<Output>['transformStream']` | - | - |
