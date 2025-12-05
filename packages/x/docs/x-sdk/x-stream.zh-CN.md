---
group:
  title: 工具
  order: 3
title: XStream
subtitle: 流
order: 2
description: 转换可读数据流
demo:
  cols: 1
---

## 何时使用

- 将 SSE 协议的 `ReadableStream` 转换为 `Record`
- 将任何协议的 `ReadableStream` 解码并读取

## 使用说明

常见的 `ReadableStream` 实例，如 `await fetch(...).body` 使用示例:

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

## 代码演示

<!-- prettier-ignore -->
<code src="./demos/x-stream/default-protocol.tsx">默认协议 - SSE</code> 
<code src="./demos/x-stream/custom-protocol.tsx">自定义协议</code>

## API

### XStreamOptions

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| readableStream | ReadableStream 实例 | ReadableStream<'Uint8Array'> | - | - |
| transformStream | 自定义的 transformStream 用于转换流的处理 | TransformStream<string, T> | sseTransformStream | - |
