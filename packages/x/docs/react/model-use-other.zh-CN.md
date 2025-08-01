---
group:
  title: 模型接入
  order: 1
title: 其他
order: 2
---

直到目前，没有标准的协议定义「模型接口规范」，所以会存在协议不兼容的问题。

为此 X 也提供了对应的工具帮助开发者**解决协议兼容**的问题。

## 流解析工具

`XStream` 默认将 ReadableStream 以 SSE 数据协议进行解析。

```tsx
import { XStream } from '@ant-design/x';

async function request() {
  const response = await fetch();
  // ...
  // .....

  for await (const chunk of XStream({
    readableStream: response.body,
  })) {
    // 你的协议
    console.log(chunk);
  }
}
```

## 请求工具

`XRequest` 支持传入一个 `fetch` 函数，做请求定制。

```tsx
import { XRequest } from '@ant-design/x';

const request = XRequest({
  fetch: yourFetchFn,
});

request.create();
```
