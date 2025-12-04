---
group:
  title: Utilities
  order: 3
title: XStream
subtitle: Stream
order: 2
description: 转换可读数据流
demo:
  cols: 1
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
