---
category: Components
group:
  title: Utilities
  order: 3
title: XStream
subtitle: Stream
order: 2
description: Transform readable data streams.
packageName: x-sdk
tag: 2.0.0
---

## When To Use

- Transform SSE protocol `ReadableStream` to `Record`
- Decode and read any protocol `ReadableStream`

## Use

Common `ReadableStream` instances, such as `await fetch(...).body`, usage example:

```js
import { XStream } from '@ant-design/x';

async function request() {
  const response = await fetch();
  // .....

  for await (const chunk of XStream({
    readableStream: response.body,
  })) {
    console.log(chunk);
  }
}
```

## Examples

<!-- prettier-ignore -->
<code src="./demos/x-stream/default-protocol.tsx">Default Protocol - SSE</code>
<code src="./demos/x-stream/custom-protocol.tsx">Custom Protocol</code>

## API

### XStreamOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| readableStream | Readable stream of binary data | ReadableStream<'Uint8Array'> | - | - |
| transformStream | Support customizable transformStream to transform streams | TransformStream<string, T> | sseTransformStream | - |
| streamSeparator | Stream separator, used to separate different data streams | string | \n\n | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data | string | \n | 2.2.0 |
| kvSeparator | Key-value separator, used to separate keys and values | string | : | 2.2.0 |
